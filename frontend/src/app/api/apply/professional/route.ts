// POST /api/apply/professional
// Accepts multipart/form-data with files + form fields
// Saves application to DB, uploads files, sends confirmation email

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

    // ── Extract text fields ──────────────────────────────────────────────────
    const get = (key: string) => (formData.get(key) as string) || '';

    const email = get('email').trim().toLowerCase();
    const firstName = get('firstName').trim();
    const lastName = get('lastName').trim();

    if (!email || !firstName) {
      return errorResponse('Missing required fields (firstName, email)');
    }

    // Check duplicate
    const existing = await prisma.professionalApplication.findUnique({ where: { email } });
    if (existing) {
      return errorResponse('An application with this email already exists. Contact support if you need help.');
    }

    // ── Create application record first (to get the ID for folder naming) ───
    const application = await prisma.professionalApplication.create({
      data: {
        firstName,
        lastName,
        email,
        phone: get('phone'),
        dateOfBirth: get('dateOfBirth'),
        gender: get('gender'),
        address: get('address'),
        city: get('city'),
        state: get('state'),
        pincode: get('pincode'),
        highestDegree: get('highestDegree'),
        fieldOfStudy: get('fieldOfStudy'),
        institution: get('institution'),
        graduationYear: get('graduationYear'),
        licenseNumber: get('licenseNumber'),
        licenseAuthority: get('licenseAuthority'),
        licenseExpiry: get('licenseExpiry'),
        specialty: get('specialty'),
        yearsOfExperience: get('yearsOfExperience'),
        bio: get('bio'),
        languages: get('languages') || '[]',
        consultationFee: get('consultationFee'),
        sessionTypes: get('sessionTypes') || '[]',
        availability: get('availability') || '[]',
      },
    });

    // ── Save uploaded files ─────────────────────────────────────────────────
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'professional', application.id);
    await mkdir(uploadDir, { recursive: true });

    const saveFile = (field: string) =>
      saveUpload(
        formData.get(field),
        uploadDir,
        `/uploads/professional/${application.id}`,
        field
      );

    const [licenseDocPath, degreeDocPath, idProofPath, profilePhotoPath] = await Promise.all([
      saveFile('licenseDocument'),
      saveFile('degreeDocument'),
      saveFile('idProof'),
      saveFile('profilePhoto'),
    ]);

    // ── Update record with file paths ────────────────────────────────────────
    await prisma.professionalApplication.update({
      where: { id: application.id },
      data: { licenseDocPath, degreeDocPath, idProofPath, profilePhotoPath },
    });

    // ── Send confirmation email ──────────────────────────────────────────────
    try {
      await sendApplicationReceivedEmail(email, `${firstName} ${lastName}`, 'professional');
    } catch (emailErr) {
      console.error('Confirmation email failed (non-fatal):', emailErr);
    }

    return successResponse(
      { applicationId: application.id },
      'Application submitted successfully! You will receive an email with your login credentials once approved.',
      201
    );
  } catch (error: any) {
    if (error instanceof UploadError) {
      return errorResponse(error.message, 400);
    }
    console.error('Professional application error:', error);
    return errorResponse('Failed to submit application. Please try again.', 500);
  }
}
