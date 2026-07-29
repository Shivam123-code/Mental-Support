// GET /api/test-email?to=you@gmail.com
// ADMIN/DEV ONLY — remove or gate this in production
// Tests the SMTP connection and sends a real email so you can verify delivery.

import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const to = request.nextUrl.searchParams.get('to');
  if (!to) {
    return Response.json({ error: 'Pass ?to=your@email.com' }, { status: 400 });
  }

  // Diagnose config first
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return Response.json({
      ok: false,
      error: 'EMAIL_USER or EMAIL_PASS not set in .env.local',
      fix: 'Add EMAIL_USER=kleverklues1@gmail.com and EMAIL_PASS=<app-password> to .env.local',
    }, { status: 500 });
  }

  // Verify connection before sending
  const nodemailer = (await import('nodemailer')).default;
  const passClean = pass.replace(/\s+/g, '');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass: passClean },
    pool: false,
  });

  try {
    await transporter.verify();
  } catch (err: any) {
    return Response.json({
      ok: false,
      stage: 'SMTP_VERIFY',
      code: err.code,
      message: err.message,
      // Most common causes:
      fix: err.code === 'EAUTH'
        ? '🔑 Auth failed. Steps to fix:\n1. Enable 2-Step Verification on kleverklues1@gmail.com\n2. Go to https://myaccount.google.com/apppasswords\n3. Create a new App Password (Mail > Windows Computer)\n4. Paste the 16-char password into EMAIL_PASS in .env.local\n5. Restart Next.js dev server'
        : err.code === 'ECONNECTION' || err.code === 'ETIMEDOUT'
        ? '🌐 Network blocked. Gmail port 465/587 may be blocked by your ISP/VPN. Try a different network.'
        : 'Check the error code above.',
    }, { status: 500 });
  }

  // Send actual test email
  try {
    await transporter.sendMail({
      from: `"KleverKlues Test" <${user}>`,
      to,
      subject: '✅ KleverKlues Email Test',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:32px;background:#f9fafb;border-radius:12px;">
          <div style="background:#4f46e5;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
            <h2 style="color:#fff;margin:0;">KleverKlues™</h2>
          </div>
          <div style="background:#fff;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;border-top:none;">
            <h3 style="color:#166534;">✅ Email is working!</h3>
            <p style="color:#4b5563;">SMTP connection verified. Emails from KleverKlues will be delivered.</p>
            <p style="color:#9ca3af;font-size:12px;">Sent at: ${new Date().toISOString()}</p>
          </div>
        </div>
      `,
    });

    return Response.json({
      ok: true,
      message: `Test email sent to ${to}. Check inbox (and spam folder).`,
      config: { user, passLength: passClean.length },
    });
  } catch (err: any) {
    return Response.json({
      ok: false,
      stage: 'SEND',
      code: err.code,
      responseCode: err.responseCode,
      message: err.message,
    }, { status: 500 });
  }
}
