// POST /api/auth/logout - User Logout
import { NextRequest } from 'next/server';
import { deleteSession } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse('No token provided');
    }

    const token = authHeader.substring(7);

    // Delete session
    await deleteSession(token);

    return successResponse(null, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse('Logout failed', 500);
  }
}
