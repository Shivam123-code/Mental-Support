import nodemailer from 'nodemailer';

// ── Transporter ───────────────────────────────────────────────────────────────
function getTransporter() {
  // Gmail App Passwords are shown as "xxxx xxxx xxxx xxxx" — spaces stripped automatically
  const pass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass,
    },
  });
}

const FROM = `"KleverKlues" <${process.env.EMAIL_USER || 'noreply@kleverklues.com'}>`;
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ── Helper ────────────────────────────────────────────────────────────────────
async function send(to: string, subject: string, html: string) {
  const transporter = getTransporter();
  await transporter.sendMail({ from: FROM, to, subject, html });
}

// ── Email Templates ───────────────────────────────────────────────────────────

export async function sendApplicationReceivedEmail(to: string, name: string, appType: 'professional' | 'organization') {
  const subject = 'Application Received — KleverKlues';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;background:#f9fafb;border-radius:12px;">
      <div style="background:#4f46e5;padding:24px 32px;border-radius:10px 10px 0 0;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;">KleverKlues™</h1>
        <p style="color:#c7d2fe;margin:4px 0 0;font-size:13px;">Human Wellbeing Ecosystem</p>
      </div>
      <div style="background:#fff;padding:32px;border-radius:0 0 10px 10px;border:1px solid #e5e7eb;border-top:none;">
        <h2 style="color:#111827;font-size:20px;">Thank you, ${name}!</h2>
        <p style="color:#4b5563;font-size:15px;line-height:1.6;">
          We have received your ${appType === 'professional' ? 'professional therapist' : 'enterprise organization'} verification application.
          Our team will review your documents and credentials within <strong>2–3 business days</strong>.
        </p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="color:#166534;font-size:14px;margin:0;font-weight:600;">What happens next?</p>
          <ul style="color:#15803d;font-size:14px;margin:8px 0 0;padding-left:20px;line-height:2;">
            <li>Our admin team reviews your submitted documents</li>
            <li>You receive an email with your login credentials upon approval</li>
            <li>Sign in with the provided link to access your dashboard</li>
          </ul>
        </div>
        <p style="color:#6b7280;font-size:13px;">If you have any questions, contact us at <a href="mailto:support@kleverklues.com" style="color:#4f46e5;">support@kleverklues.com</a></p>
      </div>
    </div>
  `;
  await send(to, subject, html);
}

export async function sendApprovalEmail(
  to: string,
  name: string,
  loginEmail: string,
  tempPassword: string,
  role: 'PROFESSIONAL' | 'ENTERPRISE'
) {
  const loginPath = role === 'PROFESSIONAL' ? '/login/professional' : '/login/enterprise';
  const dashboardName = role === 'PROFESSIONAL' ? 'Professional Therapist' : 'Enterprise Organization';
  const loginUrl = `${BASE_URL}${loginPath}`;

  const subject = '✅ Application Approved — Your KleverKlues Credentials';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;background:#f9fafb;border-radius:12px;">
      <div style="background:#4f46e5;padding:24px 32px;border-radius:10px 10px 0 0;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;">KleverKlues™</h1>
        <p style="color:#c7d2fe;margin:4px 0 0;font-size:13px;">Human Wellbeing Ecosystem</p>
      </div>
      <div style="background:#fff;padding:32px;border-radius:0 0 10px 10px;border:1px solid #e5e7eb;border-top:none;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;background:#dcfce7;border-radius:50%;padding:16px;margin-bottom:12px;">
            <span style="font-size:36px;">✅</span>
          </div>
          <h2 style="color:#166534;font-size:22px;margin:0;">Congratulations, ${name}!</h2>
          <p style="color:#4b5563;margin:8px 0 0;">Your ${dashboardName} application has been <strong style="color:#16a34a;">APPROVED</strong>.</p>
        </div>
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:20px;margin:20px 0;">
          <p style="color:#0c4a6e;font-weight:700;font-size:15px;margin:0 0 12px;">Your Login Credentials</p>
          <table style="width:100%;font-size:14px;">
            <tr>
              <td style="color:#64748b;padding:4px 0;width:120px;">Email:</td>
              <td style="color:#0f172a;font-weight:600;font-family:monospace;">${loginEmail}</td>
            </tr>
            <tr>
              <td style="color:#64748b;padding:4px 0;">Password:</td>
              <td style="color:#0f172a;font-weight:600;font-family:monospace;background:#fef3c7;padding:4px 8px;border-radius:4px;">${tempPassword}</td>
            </tr>
          </table>
        </div>
        <div style="text-align:center;margin:24px 0;">
          <a href="${loginUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:700;">
            Sign In to Your Dashboard →
          </a>
        </div>
        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:14px;margin-top:20px;">
          <p style="color:#c2410c;font-size:13px;margin:0;font-weight:600;">⚠️ Security Notice</p>
          <p style="color:#9a3412;font-size:13px;margin:6px 0 0;">Please change your password immediately after your first login.</p>
        </div>
        <p style="color:#6b7280;font-size:13px;margin-top:20px;">
          Login at: <a href="${loginUrl}" style="color:#4f46e5;">${loginUrl}</a>
        </p>
      </div>
    </div>
  `;
  await send(to, subject, html);
}

export async function sendRejectionEmail(to: string, name: string, reason: string, appType: 'professional' | 'organization') {
  const subject = 'Application Update — KleverKlues';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;background:#f9fafb;border-radius:12px;">
      <div style="background:#dc2626;padding:24px 32px;border-radius:10px 10px 0 0;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;">KleverKlues™</h1>
      </div>
      <div style="background:#fff;padding:32px;border-radius:0 0 10px 10px;border:1px solid #e5e7eb;border-top:none;">
        <h2 style="color:#111827;">Dear ${name},</h2>
        <p style="color:#4b5563;line-height:1.6;">
          After careful review, we are unable to approve your ${appType === 'professional' ? 'professional' : 'organization'} application at this time.
        </p>
        ${reason ? `
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="color:#991b1b;font-weight:600;font-size:14px;margin:0 0 6px;">Reason:</p>
          <p style="color:#b91c1c;font-size:14px;margin:0;">${reason}</p>
        </div>` : ''}
        <p style="color:#4b5563;font-size:14px;">
          You may re-apply after addressing the above issues. Contact <a href="mailto:support@kleverklues.com" style="color:#4f46e5;">support@kleverklues.com</a>
        </p>
      </div>
    </div>
  `;
  await send(to, subject, html);
}
