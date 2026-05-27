// GET /api/auth/me - Get Current User
import { NextRequest } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse('No token provided');
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);

    if (!user || user.status === 'SUSPENDED') {
      return unauthorizedResponse('Invalid, expired, or suspended account');
    }

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    return successResponse(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    return errorResponse('Failed to get user', 500);
  }
}
