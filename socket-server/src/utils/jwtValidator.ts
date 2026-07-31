import jwt from 'jsonwebtoken';

// Read lazily so dotenv has time to load.
// No fallback secret: an unset JWT_SECRET must fail closed. Falling back to a
// literal would silently accept tokens anyone could forge. Mirrors the frontend's
// behaviour in frontend/src/lib/server/auth.ts.
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('FATAL: JWT_SECRET is not set. Add it to socket-server/.env before starting.');
  }
  return secret;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function validateToken(token: string): JWTPayload | null {
  try {
    const secret = getJwtSecret();
    // Never log any part of the signing secret.
    return jwt.verify(token, secret) as JWTPayload;
  } catch {
    return null;
  }
}

export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}
