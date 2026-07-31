// Authentication Utilities
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from './db';

// V-02 FIX: Removed hardcoded fallback secret.
// IIFE ensures TypeScript infers the type as `string` (not `string | undefined`),
// while still throwing at startup if the env var is missing.
const JWT_SECRET: string = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'FATAL: JWT_SECRET environment variable is not set. ' +
      'Add it to .env.local before starting the server.'
    );
  }
  return secret;
})();
const JWT_EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Digest used for anything bearer-like that we persist (session tokens, password
 * reset tokens). Storing the raw value means a DB backup leak or a read-only SQL
 * injection hands over directly replayable credentials; storing only the digest
 * makes those rows useless on their own.
 *
 * SHA-256 without a salt is correct here (unlike for passwords): these tokens are
 * already 256 bits of CSPRNG output, so there is nothing to brute-force, and an
 * unsalted digest is what lets us look the row up by hash.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Create session
export async function createSession(
  userId: string,
  email: string,
  role: string,
  ipAddress?: string,
  userAgent?: string
) {
  const token = generateToken({ userId, email, role });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  const session = await prisma.session.create({
    data: {
      userId,
      // Only the digest is persisted; the raw token goes to the caller and is
      // never stored anywhere on our side.
      token: hashToken(token),
      expiresAt,
      ipAddress,
      userAgent,
    },
  });

  return { session, token };
}

// Validate session
export async function validateSession(token: string) {
  const session = await prisma.session.findUnique({
    where: { token: hashToken(token) },
    // passwordHash is omitted so it never reaches the ~23 routes that call
    // getUserFromToken — one stray successResponse(user) would otherwise leak it.
    include: { user: { include: { profile: true }, omit: { passwordHash: true } } },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session;
}

// Delete session (logout). Scoped to the owning user so that now sessions are
// authoritative, a caller cannot terminate someone else's session by guessing or
// replaying a token string. deleteMany is intentional: it does not throw when the
// row is already gone (double logout).
export async function deleteSession(token: string) {
  const payload = verifyToken(token);
  if (!payload) return;

  await prisma.session.deleteMany({
    where: { token: hashToken(token), userId: payload.userId },
  });
}

// Revoke every session for a user (password change, reset, suspension).
export async function revokeAllSessions(userId: string) {
  await prisma.session.deleteMany({ where: { userId } });
}

/**
 * Resolve the caller and require the ADMIN role.
 *
 * This check was previously copy-pasted into 16 admin routes. They happened to
 * agree, but 16 independent copies of the platform's only authorization decision
 * is one careless edit away from a weak sibling — and there was nowhere to add a
 * cross-cutting rule. Returns null on any failure; callers return 401.
 *
 * Header lookup is case-insensitive, so both 'authorization' and 'Authorization'
 * call sites resolve identically.
 */
export async function requireAdmin(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const user = await getUserFromToken(authHeader.substring(7));
  if (!user || user.role !== 'ADMIN') return null;

  return user;
}

// Get user from request
export async function getUserFromToken(token: string) {
  const payload = verifyToken(token);
  if (!payload) return null;

  // A valid signature is not enough. The session row must still exist, which is
  // what makes logout, password reset, and admin suspension actually revoke a
  // token instead of leaving it live for its full 7-day expiry.
  const session = await validateSession(token);
  if (!session || session.userId !== payload.userId) return null;

  // Status is rechecked on every request, not just at login — otherwise a
  // suspended user keeps full API access until their token expires.
  if (session.user.status !== 'ACTIVE') return null;

  return session.user;
}
