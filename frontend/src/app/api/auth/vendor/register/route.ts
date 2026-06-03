// POST /api/auth/vendor/register
// Instant vendor signup — creates User (VENDOR role) + VendorProfile in one transaction.
// No admin approval needed for Phase 1.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, businessName, serviceType, phone, description } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !businessName || !serviceType || !phone) {
      return errorResponse('All required fields must be provided', 400);
    }

    if (password.length < 8) {
      return errorResponse('Password must be at least 8 characters', 400);
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
    console.error('Vendor register error:', error);
    return errorResponse('Failed to create vendor account: ' + (error?.message || 'Unknown error'), 500);
  }
}
