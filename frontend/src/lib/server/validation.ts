// Validation Schemas using Zod
import { z } from 'zod';

// User Registration
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  role: z.enum(['USER', 'PROFESSIONAL', 'ENTERPRISE']).default('USER'),
});

// User Login
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Assessment Submission
export const assessmentSubmissionSchema = z.object({
  assessmentType: z.enum([
    'ANXIETY_INDEX',
    'BURNOUT_METER',
    'RELATIONSHIP_WELLNESS',
    'LEADERSHIP_EQ',
    'EMOTIONAL_WELLNESS',
    'WORKPLACE_WELLNESS',
    'STUDENT_WELLNESS',
  ]),
  answers: z.record(z.any()),
});

// Program Enrollment
export const programEnrollmentSchema = z.object({
  programType: z.enum([
    'BURNOUT_RECOVERY',
    'ANXIETY_RESET',
    'SLEEP_RECOVERY',
    'EMOTIONAL_HEALING',
    'CONFIDENCE_REBUILD',
    'PARENTING_CONFIDENCE',
    'FOCUS_IMPROVEMENT',
    'RELATIONSHIP_HEALING',
  ]),
});

// Journal Entry
export const journalEntrySchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  mood: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isPrivate: z.boolean().default(true),
});

// Mood Log
export const moodLogSchema = z.object({
  mood: z.string().min(1, 'Mood is required'),
  intensity: z.number().min(1).max(10),
  notes: z.string().optional(),
  triggers: z.array(z.string()).default([]),
  activities: z.array(z.string()).default([]),
});

// Booking
export const bookingSchema = z.object({
  professionalId: z.string().cuid(),
  sessionType: z.enum(['video', 'audio', 'chat']),
  scheduledAt: z.string().datetime(),
  duration: z.number().min(15).max(120),
  userNotes: z.string().optional(),
});

// Community Post
export const communityPostSchema = z.object({
  type: z.enum(['DISCUSSION', 'QUESTION', 'STORY', 'GRATITUDE', 'SUPPORT_REQUEST']),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).default([]),
  isAnonymous: z.boolean().default(false),
});

// Comment
export const commentSchema = z.object({
  postId: z.string().cuid(),
  content: z.string().min(1, 'Content is required'),
  isAnonymous: z.boolean().default(false),
});

// Message
export const messageSchema = z.object({
  receiverId: z.string().cuid(),
  content: z.string().min(1, 'Message cannot be empty'),
});

// Professional Profile Update
export const professionalProfileSchema = z.object({
  type: z.enum(['THERAPIST', 'PSYCHOLOGIST', 'COUNSELOR', 'COACH', 'PSYCHIATRIST', 'SOCIAL_WORKER', 'MENTOR']),
  licenseNumber: z.string().optional(),
  licenseState: z.string().optional(),
  licenseCountry: z.string().optional(),
  qualifications: z.array(z.string()).default([]),
  specializations: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  yearsOfExperience: z.number().optional(),
  hourlyRate: z.number().optional(),
  bio: z.string().optional(),
  approach: z.string().optional(),
});

// Helper function to validate data
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { success: false, error: firstError.message };
    }
    return { success: false, error: 'Validation failed' };
  }
}
