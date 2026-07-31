// POST /api/auth/vendor/register
// Instant vendor signup — creates User (VENDOR role) + VendorProfile in one transaction.
// No admin approval needed for Phase 1.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { PASSWORD_POLICY, PASSWORD_POLICY_MESSAGE } from '@/lib/validation';
import { successResponse, errorResponse } from '@/lib/api-response';
import { rateLimit, getClientIp } from '@/lib/server/rate-limit';

export async function POST(request: NextRequest) {
  // VENDOR is a privileged role — it can read victims' names, phones and live
  // locations for dispatched alerts — so self-service signup gets the same
  // throttle as the other registration routes, which this one was missing.
  const { allowed, retryAfterSeconds } = rateLimit(`vendor-register:${getClientIp(request)}`, 3, 60 * 60 * 1000);
  if (!allowed) {
    return errorResponse(
      `Too many signup attempts. Please try again in ${Math.ceil(retryAfterSeconds / 60)} minute(s).`,
      429
    );
  }

  try {
    const body = await request.json();
    const { firstName, lastName, email, password, businessName, serviceType, phone, description } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !businessName || !serviceType || !phone) {
      return errorResponse('All required fields must be provided', 400);
    }

    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse('Please provide a valid email address', 400);
    }

    if (typeof password !== 'string' || !PASSWORD_POLICY.test(password)) {
      return errorResponse(PASSWORD_POLICY_MESSAGE, 400);
    }

    // Check email uniqueness
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return errorResponse('An account with this email already exists', 409);
    }

    const passwordHash = await hashPassword(password);

    // Create User + VendorProfile in one transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          role: 'VENDOR',
          status: 'ACTIVE',
          emailVerified: true,
        },
      });

      await tx.vendorProfile.create({
        data: {
          userId: newUser.id,
          businessName,
          serviceType,
          phone,
          description: description || null,
          isOnline: false,
          isAvailable: true,
        },
      });

      return newUser;
    });

    // Auto-create session so vendor is logged in immediately after signup
    const session = await createSession(user.id, user.email, user.role);

    return successResponse(
      {
        token: session.token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
      'Vendor account created successfully. Welcome to KleverKlues!'
    );
  } catch (error: any) {
    // Log the detail server-side; do not echo raw Prisma errors to the client,
    // which leaks schema and constraint names.
    console.error('Vendor register error:', error);
    return errorResponse('Failed to create vendor account. Please try again.', 500);
  }
}
