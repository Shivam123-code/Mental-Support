import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { hashPassword, getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { sendAdminCreatedAccountEmail } from '@/lib/server/email';
import { rateLimit, getClientIp } from '@/lib/server/rate-limit';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.randomBytes(7);
  let result = 'Kk@';
  for (let i = 0; i < 7; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

interface CsvRow {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  specialization?: string;
  licenseNumber?: string;
  orgName?: string;
  orgType?: string;
  employeeCount?: string;
  city?: string;
  state?: string;
  businessName?: string;
  serviceType?: string;
  phone?: string;
}

function parseCsvRow(line: string, role: string): CsvRow {
  const cols = line.split(',').map((c) => c.trim());
  if (role === 'USER') {
    const [firstName, lastName, email, password] = cols;
    return { firstName, lastName, email, password };
  }
  if (role === 'PROFESSIONAL') {
    const [firstName, lastName, email, password, specialization, licenseNumber] = cols;
    return { firstName, lastName, email, password, specialization, licenseNumber };
  }
  if (role === 'ENTERPRISE') {
    const [orgName, contactName, email, password, orgType, employeeCount, city, state] = cols;
    const [firstName, ...rest] = (contactName || '').split(' ');
    const lastName = rest.join(' ') || 'N/A';
    return { orgName, firstName, lastName, email, password, orgType, employeeCount, city, state };
  }
  if (role === 'VENDOR') {
    const [firstName, lastName, email, password, businessName, serviceType, phone] = cols;
    return { firstName, lastName, email, password, businessName, serviceType, phone };
  }
  return {};
}

export async function POST(request: NextRequest) {
  // Rate limit
  const ip = getClientIp(request);
  const rl = rateLimit(`admin-create-user-csv:${ip}`, 10, 60 * 60 * 1000);
  if (!rl.allowed) {
    return errorResponse(`Rate limit exceeded. Try again in ${rl.retryAfterSeconds}s.`, 429);
  }

  // Admin auth
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return unauthorizedResponse();
  const token = authHeader.slice(7);
  const admin = await getUserFromToken(token);
  if (!admin || admin.role !== 'ADMIN') return unauthorizedResponse('Admin access required');

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse('Invalid form data');
  }

  const role = formData.get('role') as string;
  const file = formData.get('file') as File | null;

  if (!role || !['USER', 'PROFESSIONAL', 'ENTERPRISE', 'VENDOR'].includes(role)) {
    return errorResponse('role must be USER, PROFESSIONAL, ENTERPRISE, or VENDOR');
  }
  if (!file) return errorResponse('file is required');

  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return errorResponse('CSV must have a header row and at least one data row');

  const dataLines = lines.slice(1); // skip header
  if (dataLines.length > 500) return errorResponse('Maximum 500 rows allowed per upload', 400);

  const created: Array<{ email: string; generatedPassword: string | null }> = [];
  const skipped: Array<{ email: string; reason: string }> = [];
  const errors: Array<{ row: number; email: string; error: string }> = [];

  for (let i = 0; i < dataLines.length; i++) {
    const rowNum = i + 2; // 1-indexed, +1 for header
    const line = dataLines[i];
    if (!line.trim()) continue;

    const row = parseCsvRow(line, role);
    const { email, firstName, lastName } = row;

    if (!email || !firstName) {
      errors.push({ row: rowNum, email: email || '', error: 'Missing required fields (email, name)' });
      continue;
    }

    // Check email uniqueness
    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        skipped.push({ email, reason: 'Email already in use' });
        continue;
      }
    } catch (err: any) {
      errors.push({ row: rowNum, email, error: 'DB lookup error: ' + err?.message });
      continue;
    }

    const isAutoPassword = !row.password || row.password === 'auto' || row.password === '';
    const plainPassword = isAutoPassword ? generatePassword() : row.password!;

    try {
      const passwordHash = await hashPassword(plainPassword);
      const status = role === 'PROFESSIONAL' ? 'PENDING_VERIFICATION' : 'ACTIVE';

      const newUser = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email,
            passwordHash,
            role: role as any,
            status: status as any,
            firstName,
            lastName: lastName || '',
            emailVerified: true,
          },
        });

        await tx.userProfile.create({ data: { userId: user.id } });

        if (role === 'PROFESSIONAL') {
          const proType = (row.specialization?.toUpperCase() || 'COUNSELOR') as any;
          await tx.professional.create({
            data: {
              userId: user.id,
              type: proType,
              licenseNumber: row.licenseNumber || null,
              verificationStatus: 'VERIFIED',
              verifiedAt: new Date(),
            },
          });
        }

        if (role === 'ENTERPRISE') {
          await tx.organizationApplication.create({
            data: {
              userId: user.id,
              orgName: row.orgName || `${firstName} ${lastName} Org`,
              orgType: row.orgType || 'CORPORATE',
              registrationNumber: 'ADMIN-CREATED',
              email,
              phone: row.phone || 'N/A',
              address: 'N/A',
              city: row.city || 'N/A',
              state: row.state || 'N/A',
              pincode: 'N/A',
              contactName: `${firstName} ${lastName}`,
              contactDesignation: 'Admin',
              contactEmail: email,
              contactPhone: row.phone || 'N/A',
              employeeCount: String(row.employeeCount || 0),
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
              businessName: row.businessName || `${firstName} ${lastName}`,
              serviceType: row.serviceType || 'General Support',
              phone: row.phone || 'N/A',
            },
          });
        }

        return user;
      });

      // Create password reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await prisma.passwordResetToken.create({
        data: { userId: newUser.id, token: resetToken, expiresAt },
      });

      // Fire-and-forget email
      const resetLink = `${BASE_URL}/reset-password?token=${resetToken}`;
      const name = `${firstName} ${lastName || ''}`.trim();
      sendAdminCreatedAccountEmail(email, name, plainPassword, role, resetLink).catch((err) =>
        console.error('[csv-create-user] Email send error:', err)
      );

      created.push({ email, generatedPassword: isAutoPassword ? plainPassword : null });
    } catch (err: any) {
      errors.push({ row: rowNum, email, error: err?.message || 'Unknown error' });
    }
  }

  return successResponse({
    created,
    skipped,
    errors,
    summary: {
      total: dataLines.filter((l) => l.trim()).length,
      created: created.length,
      skipped: skipped.length,
      errors: errors.length,
    },
  });
}
