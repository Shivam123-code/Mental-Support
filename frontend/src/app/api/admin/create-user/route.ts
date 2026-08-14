import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { hashPassword, requireAdmin, hashToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { logAdminAction } from '@/lib/server/audit';
import { sendAdminCreatedAccountEmail } from '@/lib/server/email';
import { rateLimit, getClientIp } from '@/lib/server/rate-limit';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/** Mirrors the ProfessionalType enum in schema.prisma. */
const PROFESSIONAL_TYPES = [
  'THERAPIST', 'PSYCHOLOGIST', 'COUNSELOR', 'COACH',
  'PSYCHIATRIST', 'SOCIAL_WORKER', 'MENTOR',
] as const;

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = 'Kk@';
  for (let i = 0; i < 7; i++) {
    // randomInt is rejection-sampled, so it is uniform over the alphabet.
    // `randomBytes[i] % chars.length` biased toward the first 36 characters,
    // since 256 is not a multiple of 55.
    result += chars[crypto.randomInt(chars.length)];
  }
  return result;
}

export async function POST(request: NextRequest) {
  // Rate limit: 50 requests/hour per IP
  const ip = getClientIp(request);
  const rl = rateLimit(`admin-create-user:${ip}`, 50, 60 * 60 * 1000);
  if (!rl.allowed) {
    return errorResponse(`Rate limit exceeded. Try again in ${rl.retryAfterSeconds}s.`, 429);
  }

  // Check admin auth
  const admin = await requireAdmin(request);
  if (!admin) return unauthorizedResponse('Admin access required');

  let body: any;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body');
  }

  const {
    role,
    firstName,
    lastName,
    email,
    password,
    // Professional
    specialization,
    licenseNumber,
    // Enterprise
    orgName,
    orgType,
    employeeCount,
    city,
    state,
    // Vendor
    businessName,
    serviceType,
    phone,
  } = body;

  // Validate required fields
  if (!role || !['USER', 'PROFESSIONAL', 'ENTERPRISE', 'VENDOR'].includes(role)) {
    return errorResponse('role must be USER, PROFESSIONAL, ENTERPRISE, or VENDOR');
  }
  if (!email || typeof email !== 'string') return errorResponse('email is required');
  if (!firstName || typeof firstName !== 'string') return errorResponse('firstName is required');
  if (!lastName || typeof lastName !== 'string') return errorResponse('lastName is required');

  // Check email uniqueness
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return errorResponse('Email already in use', 409);

  // Generate or use provided password
  const isAutoPassword = !password || password === 'auto';
  const plainPassword = isAutoPassword ? generatePassword() : password;
  const passwordHash = await hashPassword(plainPassword);

  // Determine user status
  const status = role === 'PROFESSIONAL' ? 'PENDING_VERIFICATION' : 'ACTIVE';

  // Create user + related records in a transaction
  let newUser: any;
  try {
    newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: role as any,
          status: status as any,
          firstName,
          lastName,
          emailVerified: true,
        },
      });

      // Always create UserProfile
      await tx.userProfile.create({ data: { userId: user.id } });

      // Role-specific records
      if (role === 'PROFESSIONAL') {
        // `specialization` is free text ("Anxiety", "CBT", "Trauma") but was
        // being uppercased straight into `type`, a ProfessionalType enum — so
        // every realistic value threw a raw Prisma error and rolled the whole
        // transaction back. It only ever worked if the admin happened to type
        // an enum member. These are two different things: what kind of
        // professional they are, versus what they specialise in.
        const proType = PROFESSIONAL_TYPES.includes(String(specialization).toUpperCase() as any)
          ? (String(specialization).toUpperCase() as any)
          : 'COUNSELOR';
        await tx.professional.create({
          data: {
            userId: user.id,
            type: proType,
            // Anything that was not a type is kept as what it actually is.
            specializations: specialization && proType !== String(specialization).toUpperCase()
              ? [String(specialization)]
              : [],
            licenseNumber: licenseNumber || null,
            verificationStatus: 'VERIFIED',
            verifiedAt: new Date(),
          },
        });
      }

      if (role === 'ENTERPRISE') {
        await tx.organizationApplication.create({
          data: {
            userId: user.id,
            orgName: orgName || `${firstName} ${lastName} Org`,
            orgType: orgType || 'CORPORATE',
            registrationNumber: 'ADMIN-CREATED',
            email,
            phone: phone || 'N/A',
            address: 'N/A',
            city: city || 'N/A',
            state: state || 'N/A',
            pincode: 'N/A',
            contactName: `${firstName} ${lastName}`,
            contactDesignation: 'Admin',
            contactEmail: email,
            contactPhone: phone || 'N/A',
            employeeCount: String(employeeCount || 0),
            departments: '[]',
            wellbeingPrograms: '[]',
            status: 'APPROVED',
          },
        });
      }

      if (role === 'VENDOR') {
        await tx.vendorProfile.create({
          data: {
            userId: user.id,
            businessName: businessName || `${firstName} ${lastName}`,
            serviceType: serviceType || 'General Support',
            phone: phone || 'N/A',
          },
        });
      }

      return user;
    });
  } catch (err: any) {
    console.error('[create-user] DB error:', err);
    return errorResponse('Failed to create user: ' + (err?.message || 'Unknown error'), 500);
  }

  // Generate password reset token (24 hours)
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  try {
    await prisma.passwordResetToken.create({
      data: { userId: newUser.id, token: hashToken(resetToken), expiresAt },
    });
  } catch (err) {
    console.error('[create-user] Failed to create reset token:', err);
  }

  // Fire-and-forget welcome email
  const resetLink = `${BASE_URL}/reset-password?token=${resetToken}`;
  const name = `${firstName} ${lastName}`;
  sendAdminCreatedAccountEmail(email, name, plainPassword, role, resetLink).catch((err) =>
    console.error('[create-user] Email send error:', err)
  );

  // Never record the password itself, generated or supplied — only that one
  // was auto-generated, which is what an investigation actually needs to know.
  await logAdminAction(request, admin.id, 'user.create', {
    resource: 'User',
    resourceId: newUser.id,
    metadata: { email: newUser.email, role: newUser.role, status: newUser.status, autoPassword: isAutoPassword },
  });

  return successResponse(
    {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        status: newUser.status,
      },
      generatedPassword: isAutoPassword ? plainPassword : null,
    },
    'User created successfully',
    201
  );
}
