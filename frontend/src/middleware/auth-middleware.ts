// Authentication Middleware Helper
// Use this in API routes that require authentication

import { NextRequest } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { unauthorizedResponse } from '@/lib/api-response';

export async function requireAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: unauthorizedResponse('No token provided'), user: null };
  }

  const token = authHeader.substring(7);
  const user = await getUserFromToken(token);

  if (!user) {
    return { error: unauthorizedResponse('Invalid or expired token'), user: null };
  }

  return { error: null, user };
}

export async function requireRole(request: NextRequest, allowedRoles: string[]) {
  const { error, user } = await requireAuth(request);
  
  if (error) {
    return { error, user: null };
  }

  if (!allowedRoles.includes(user!.role)) {
    return { 
      error: unauthorizedResponse('Insufficient permissions'), 
      user: null 
    };
  }

  return { error: null, user };
}
