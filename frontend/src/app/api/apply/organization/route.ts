// POST /api/apply/organization
// Accepts multipart/form-data with files + form fields

import { NextRequest } from 'next/server';
import { mkdir } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-response';
import { sendApplicationReceivedEmail } from '@/lib/email';
import { saveUpload, UploadError } from '@/lib/server/upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const get = (key: string) => (formData.get(key) as string) || '';

    const email = get('email').trim().toLowerCase();
    const orgName = get('orgName').trim();
    const contactName = get('contactName').trim();

    if (!email || !orgName) {
      return errorResponse('Missing required fields (orgName, email)');
    }

    // Check duplicate
    const existing = await prisma.organizationApplication.findUnique({ where: { email } });
    if (existing) {
      return errorResponse('An application with this email already exists. Contact support if you need help.');
    }

    // ── Create application record ────────────────────────────────────────────
    const application = await prisma.organizationApplication.create({
      data: {
        orgName,
        orgType: get('orgType'),
        registrationNumber: get('registrationNumber'),
        website: get('website') || null,
        email,
        phone: get('phone'),
        address: get('address'),
        city: get('city'),
        state: get('state'),
        pincode: get('pincode'),
        contactName,
        contactDesignation: get('contactDesignation'),
        contactEmail: get('contactEmail'),
        contactPhone: get('contactPhone'),
        employeeCount: get('employeeCount'),
        departments: get('departments') || '[]',
        wellbeingPrograms: get('wellbeingPrograms') || '[]',
        additionalInfo: get('additionalInfo') || null,
      },
    });

    // ── Save uploaded files ─────────────────────────────────────────────────
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'organization', application.id);
    await mkdir(uploadDir, { recursive: true });

    const saveFile = (field: string) =>
      saveUpload(
        formData.get(field),
        uploadDir,
        `/uploads/organization/${application.id}`,
        field
      );

    const [regCertPath, gstCertPath, authLetterPath, logoPath] = await Promise.all([
      saveFile('registrationCert'),
      saveFile('gstCert'),
      saveFile('authLetter'),
      saveFile('logo'),
    ]);

    // ── Update record with file paths ────────────────────────────────────────
    await prisma.organizationApplication.update({
      where: { id: application.id },
      data: { regCertPath, gstCertPath, authLetterPath, logoPath },
    });

    // ── Send confirmation email ──────────────────────────────────────────────
    try {
      // Always send to the application's own email. Honouring a separate
      // contactEmail turned this unauthenticated route into a mailer that
      // delivered attacker-authored content to any address, SPF-signed by us.
      await sendApplicationReceivedEmail(email, contactName || orgName, 'organization');
    } catch (emailErr) {
      console.error('Confirmation email failed (non-fatal):', emailErr);
    }

    return successResponse(
      { applicationId: application.id },
      'Application submitted successfully! You will receive login credentials by email once approved.',
      201
    );
  } catch (error: any) {
    if (error instanceof UploadError) {
      return errorResponse(error.message, 400);
    }
    console.error('Organization application error:', error);
    return errorResponse('Failed to submit application. Please try again.', 500);
  }
}
