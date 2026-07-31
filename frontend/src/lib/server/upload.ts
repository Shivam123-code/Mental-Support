/**
 * Safe handling for applicant-uploaded documents.
 *
 * These files land under public/, which Next serves directly, so an attacker who
 * controls the stored extension gets same-origin script execution: uploading
 * "x.html" (or "x.svg") produced stored XSS that ran when an admin opened the
 * application to review it. The client-side `accept=".pdf,.jpg"` attribute is
 * decoration and is trivially bypassed.
 *
 * Two rules make that impossible:
 *   1. The extension is chosen by US from the allowlist below, never taken from
 *      the uploaded filename. A lying client can at worst get a .pdf holding
 *      HTML, which (with the existing X-Content-Type-Options: nosniff header)
 *      the browser will not execute.
 *   2. SVG is deliberately absent — it is an image format that runs script.
 */
import { writeFile } from 'fs/promises';
import path from 'path';

/** Declared MIME type -> the extension we will store it under. */
const ALLOWED_TYPES = new Map<string, string>([
  ['application/pdf', '.pdf'],
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

export const MAX_UPLOAD_BYTES = Number(process.env.UPLOAD_MAX_SIZE) || 5 * 1024 * 1024; // 5 MB

export class UploadError extends Error {}

/**
 * Validate and persist one uploaded field.
 *
 * @returns the public URL path, or null when the field was absent
 * @throws  UploadError when the file is too large or of a disallowed type
 */
export async function saveUpload(
  file: unknown,
  uploadDir: string,
  publicPrefix: string,
  field: string
): Promise<string | null> {
  if (!file || typeof file === 'string' || !(file instanceof File)) return null;

  if (file.size === 0) return null;
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError(
      `${field} is too large (max ${Math.floor(MAX_UPLOAD_BYTES / 1024 / 1024)}MB).`
    );
  }

  const ext = ALLOWED_TYPES.get(file.type);
  if (!ext) {
    throw new UploadError(`${field} must be a PDF, JPG, PNG or WEBP file.`);
  }

  // Filename is built entirely from our own values — the uploaded name never
  // reaches the filesystem, so there is nothing to traverse with.
  const filename = `${field}${ext}`;
  await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
  return `${publicPrefix}/${filename}`;
}
