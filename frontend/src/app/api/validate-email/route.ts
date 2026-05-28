// POST /api/validate-email
// DNS MX-record check to ensure the email domain is real (not fake/disposable)
import { NextRequest } from 'next/server';
import { promises as dns } from 'dns';
import { errorResponse, successResponse } from '@/lib/api-response';

// Common disposable/fake email domains to block
const BLOCKED_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
  'guerrillamail.info', 'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.net',
  'guerrillamail.org', 'spam4.me', 'trashmail.com', 'trashmail.me',
  'trashmail.net', 'dispostable.com', 'spamgourmet.com', 'spamgourmet.net',
  'maildrop.cc', 'fakeinbox.com', 'tempinbox.com', 'emailondeck.com',
  'throam.com', 'mvrht.com', 'spamherelots.com', 'spamhereplease.com',
]);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return errorResponse('Email is required');
    }

    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse('Invalid email format');
    }

    const domain = email.split('@')[1].toLowerCase();

    // Block disposable domains
    if (BLOCKED_DOMAINS.has(domain)) {
      return errorResponse('Disposable email addresses are not allowed. Please use a valid business or personal email.');
    }

    // DNS MX lookup — verifies the domain can receive email
    try {
      const mxRecords = await dns.resolveMx(domain);
      if (!mxRecords || mxRecords.length === 0) {
        return errorResponse(`The domain "${domain}" cannot receive emails. Please use a valid email address.`);
      }
    } catch {
      return errorResponse(`Cannot verify the email domain "${domain}". Please use a valid email address.`);
    }

    return successResponse({ valid: true, domain }, 'Email domain is valid');
  } catch (error) {
    return errorResponse('Email validation failed');
  }
}
