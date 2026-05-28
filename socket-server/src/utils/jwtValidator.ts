import jwt from 'jsonwebtoken';

// Log the JWT secret being used (first 10 chars only for security)
// Read lazily so dotenv has time to load
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
  return secret;
}

console.log(`🔑 JWT_SECRET will be loaded from env at runtime`);

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function validateToken(token: string): JWTPayload | null {
  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as JWTPayload;
    console.log(`✅ Token validated for user: ${decoded.userId} (secret: ${secret.substring(0,10)}...)`);
    return decoded;
  } catch (error) {
    console.error('JWT validation error:', error);
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
