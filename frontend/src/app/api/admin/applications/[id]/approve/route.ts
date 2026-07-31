// POST /api/admin/applications/[id]/approve
// Approves a professional or organization application:
// 1. Generates a random temporary password
// 2. Creates a User account (PROFESSIONAL or ENTERPRISE role, ACTIVE status)
// 3. Links the application to the user
// 4. Sends credential email with login link
//
// IDEMPOTENT: if already approved, resends fresh credentials instead of failing.
// EMAIL NON-FATAL: approval succeeds even if SMTP fails; temp password returned in response.

import { NextRequest } from 'next/server';
import { requireAdmin as checkAdmin, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { sendApprovalEmail } from '@/lib/email';
import crypto from 'crypto';

function generateTempPassword(): string {
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

    // ── Fetch the application ──────────────────────────────────────────────────
    let email = '';
    let firstName = '';
    let lastName = '';
    let name = '';
    let alreadyApproved = false;

    if (appType === 'professional') {
      const app = await prisma.professionalApplication.findUnique({ where: { id } });
      if (!app) return errorResponse('Application not found', 404);
      alreadyApproved = app.status === 'APPROVED';
      email = app.email;
      firstName = app.firstName;
      lastName = app.lastName;
      name = `${firstName} ${lastName}`;
    } else {
      const app = await prisma.organizationApplication.findUnique({ where: { id } });
      if (!app) return errorResponse('Application not found', 404);
      alreadyApproved = app.status === 'APPROVED';
      email = app.email;
      firstName = app.contactName.split(' ')[0] || app.orgName;
      lastName = app.contactName.split(' ').slice(1).join(' ') || '';
      name = app.contactName || app.orgName;
    }

    const role: 'PROFESSIONAL' | 'ENTERPRISE' =
      appType === 'professional' ? 'PROFESSIONAL' : 'ENTERPRISE';

    // ── IDEMPOTENT: already approved → resend fresh credentials ───────────────
    if (alreadyApproved) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        const tempPassword = generateTempPassword();
        const passwordHash = await hashPassword(tempPassword);
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { passwordHash, status: 'ACTIVE' },
        });

        let emailError: string | null = null;
        try {
          await sendApprovalEmail(email, name, email, tempPassword, role);
        } catch (e: any) {
          emailError = e?.message || 'Email delivery failed';
          console.error('Resend approval email error:', e);
        }

        return successResponse(
          { userId: existingUser.id, email, resent: true, emailError, tempPassword: emailError ? tempPassword : undefined },
          emailError
            ? `Already approved. Email failed — share this temp password manually: ${tempPassword}`
            : `Already approved. Fresh credentials re-sent to ${email}.`
        );
      }
      // Edge case: APPROVED status but no user record — fall through to create user
    }

    // ── If an active user account already exists for this email ───────────────
    // This happens when:
    //  a) user deleted their account but DB cascade didn't fully clean up, OR
    //  b) admin is re-approving after a user resubmitted
    // → Just update credentials and continue (don't block)
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.status === 'ACTIVE' && !alreadyApproved) {
      // Reactivate with fresh credentials instead of failing
      const tempPassword = generateTempPassword();
      const passwordHash = await hashPassword(tempPassword);
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { passwordHash, role: role as any, status: 'ACTIVE', firstName, lastName },
      });
      // Mark application as approved too
      if (appType === 'professional') {
        await prisma.professionalApplication.update({
          where: { id },
          data: { status: 'APPROVED', userId: existingUser.id, adminNotes: body.notes || null },
        });
      } else {
        await prisma.organizationApplication.update({
          where: { id },
          data: { status: 'APPROVED', userId: existingUser.id, adminNotes: body.notes || null },
        });
      }
      let emailError: string | null = null;
      try { await sendApprovalEmail(email, name, email, tempPassword, role); }
      catch (e: any) { emailError = e?.message || 'Email delivery failed'; console.error('Approval email error:', e); }
      return successResponse(
        { userId: existingUser.id, email, emailError, tempPassword: emailError ? tempPassword : undefined },
        emailError
          ? `Application approved (re-applicant). Email failed — temp password: ${tempPassword}`
          : `Application approved. Credentials sent to ${email}.`
      );
    }

    // ── Generate temp password ─────────────────────────────────────────────────
    const tempPassword = generateTempPassword();
    const passwordHash = await hashPassword(tempPassword);

    // ── Create or update User account ─────────────────────────────────────────
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

    // ── Update application status ──────────────────────────────────────────────
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

    // ── Send credential email — NON-FATAL ──────────────────────────────────────
    // Approval is already saved to DB. Email failure doesn't roll it back.
    let emailError: string | null = null;
    try {
      await sendApprovalEmail(email, name, email, tempPassword, role);
    } catch (e: any) {
      emailError = e?.message || 'Email delivery failed';
      console.error('Approval email error (non-fatal):', e);
    }

    return successResponse(
      { userId, email, emailError, tempPassword: emailError ? tempPassword : undefined },
      emailError
        ? `Application approved but email failed — share this temp password manually: ${tempPassword}`
        : `Application approved. Credentials sent to ${email}.`
    );

  } catch (error: any) {
    console.error('Approval error:', error);
    return errorResponse('Failed to approve application: ' + (error?.message || 'Unknown error'), 500);
  }
}
