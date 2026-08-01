// POST /api/admin/applications/[id]/reject
// Rejects a professional or organization application and sends rejection email

import { NextRequest } from 'next/server';
import { requireAdmin as checkAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { logAdminAction } from '@/lib/server/audit';
import { sendRejectionEmail } from '@/lib/email';

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
    const reason: string = body.reason || '';

    if (appType === 'professional') {
      const app = await prisma.professionalApplication.findUnique({ where: { id } });
      if (!app) return errorResponse('Application not found', 404);
      if (app.status === 'REJECTED') return errorResponse('Application already rejected');

      await prisma.professionalApplication.update({
        where: { id },
        data: { status: 'REJECTED', rejectionReason: reason, adminNotes: body.notes || null },
      });

      try {
        await sendRejectionEmail(app.email, `${app.firstName} ${app.lastName}`, reason, 'professional');
      } catch (e) {
        console.error('Rejection email error (non-fatal):', e);
      }
    } else {
      const app = await prisma.organizationApplication.findUnique({ where: { id } });
      if (!app) return errorResponse('Application not found', 404);
      if (app.status === 'REJECTED') return errorResponse('Application already rejected');

      await prisma.organizationApplication.update({
        where: { id },
        data: { status: 'REJECTED', rejectionReason: reason, adminNotes: body.notes || null },
      });

      try {
        await sendRejectionEmail(app.email, app.contactName || app.orgName, reason, 'organization');
      } catch (e) {
        console.error('Rejection email error (non-fatal):', e);
      }
    }

    await logAdminAction(request, admin.id, 'application.reject', {
      resource: 'Application',
      resourceId: id,
      metadata: { reason },
    });

    return successResponse({ id }, 'Application rejected and applicant notified.');
  } catch (error: any) {
    console.error('Rejection error:', error);
    return errorResponse('Failed to reject application', 500);
  }
}
