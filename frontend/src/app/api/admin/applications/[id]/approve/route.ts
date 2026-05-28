// POST /api/admin/applications/[id]/approve
// Approves a professional or organization application:
// 1. Generates a random temporary password
// 2. Creates a User account (PROFESSIONAL or ENTERPRISE role, ACTIVE status)
// 3. Links the application to the user
// 4. Sends credential email with login link

import { NextRequest } from 'next/server';
import { getUserFromToken, hashPassword, createSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { sendApprovalEmail } from '@/lib/email';
import crypto from 'crypto';

async function checkAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  const user = await getUserFromToken(token);
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}

function generateTempPassword(): string {
  // e.g. KK-Abc9#mX2
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const specials = '!@#$';
  let pass = 'KK-';
  for (let i = 0; i < 6; i++) pass += chars[crypto.randomInt(chars.length)];
  pass += specials[crypto.randomInt(specials.length)];
  pass += crypto.randomInt(10);
  return pass;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const body = await request.json();
    const appType: 'professional' | 'organization' = body.type || 'professional';

    // ── Fetch the application ────────────────────────────────────────────────
    let email = '';
    let firstName = '';
    let lastName = '';
    let name = '';

    if (appType === 'professional') {
      const app = await prisma.professionalApplication.findUnique({ where: { id } });
      if (!app) return errorResponse('Application not found', 404);
      if (app.status === 'APPROVED') return errorResponse('Application already approved');
      email = app.email;
      firstName = app.firstName;
      lastName = app.lastName;
      name = `${firstName} ${lastName}`;
    } else {
      const app = await prisma.organizationApplication.findUnique({ where: { id } });
      if (!app) return errorResponse('Application not found', 404);
      if (app.status === 'APPROVED') return errorResponse('Application already approved');
      email = app.email;
      firstName = app.contactName.split(' ')[0] || app.orgName;
      lastName = app.contactName.split(' ').slice(1).join(' ') || '';
      name = app.contactName || app.orgName;
    }

    // ── Check if user account already exists ─────────────────────────────────
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.status === 'ACTIVE') {
      return errorResponse('A user account for this email already exists and is active.');
    }

    // ── Generate temp password ───────────────────────────────────────────────
    const tempPassword = generateTempPassword();
    const passwordHash = await hashPassword(tempPassword);
    const role = appType === 'professional' ? 'PROFESSIONAL' : 'ENTERPRISE';

    // ── Create or update User account ────────────────────────────────────────
    let userId: string;
    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { passwordHash, role: role as any, status: 'ACTIVE', firstName, lastName },
      });
      userId = existingUser.id;
    } else {
      const newUser = await prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          role: role as any,
          status: 'ACTIVE',
          profile: { create: {} },
        },
      });
      userId = newUser.id;
    }

    // ── Update application status ─────────────────────────────────────────────
    if (appType === 'professional') {
      await prisma.professionalApplication.update({
        where: { id },
        data: { status: 'APPROVED', userId, adminNotes: body.notes || null },
      });
    } else {
      await prisma.organizationApplication.update({
        where: { id },
        data: { status: 'APPROVED', userId, adminNotes: body.notes || null },
      });
    }

    // ── Send credential email ────────────────────────────────────────────────
    await sendApprovalEmail(email, name, email, tempPassword, role as 'PROFESSIONAL' | 'ENTERPRISE');

    return successResponse(
      { userId, email, tempPassword },
      `Application approved. Credentials sent to ${email}.`
    );
  } catch (error: any) {
    console.error('Approval error:', error);
    return errorResponse('Failed to approve application', 500);
  }
}
