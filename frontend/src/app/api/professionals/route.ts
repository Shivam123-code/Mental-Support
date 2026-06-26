// GET /api/professionals — returns all VERIFIED professionals from DB
// Falls back to curated static list if DB has none (early stage).

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-response';

// Curated static fallback (shown when DB has no verified professionals yet)
export const STATIC_PROFESSIONALS = [
  {
    id: 'static-1',
    displayName: 'Dr. Ananya Sharma',
    type: 'PSYCHOLOGIST',
    specializations: ['Anxiety', 'Depression', 'Trauma'],
    languages: ['English', 'Hindi'],
    yearsOfExperience: 12,
    averageRating: 4.9,
    totalReviews: 234,
    profileImage: '/images/prof-dr-ananya.png',
    isAcceptingClients: true,
    city: 'Delhi',
    state: 'Delhi',
    region: 'North India',
    country: 'India',
    gender: 'Female',
    sessionModes: ['Online', 'In-person'],
    hourlyRate: 1200,
    currency: 'INR',
    bio: 'Specialist in cognitive behavioural therapy with 12 years of experience helping clients overcome anxiety and trauma.',
  },
  {
    id: 'static-2',
    displayName: 'Rahul Mehta',
    type: 'COUNSELOR',
    specializations: ['Relationships', 'Career', 'Burnout'],
    languages: ['English', 'Hindi', 'Marathi'],
    yearsOfExperience: 8,
    averageRating: 4.8,
    totalReviews: 189,
    profileImage: '/images/prof-rahul.png',
    isAcceptingClients: true,
    city: 'Mumbai',
    state: 'Maharashtra',
    region: 'West India',
    country: 'India',
    gender: 'Male',
    sessionModes: ['Online', 'In-person'],
    hourlyRate: 900,
    currency: 'INR',
    bio: 'Helping professionals and couples navigate burnout, career transitions, and relationship challenges.',
  },
  {
    id: 'static-3',
    displayName: 'Dr. Priya Nair',
    type: 'PSYCHOLOGIST',
    specializations: ['Children', 'ADHD', 'Learning Disabilities'],
    languages: ['English', 'Malayalam', 'Tamil'],
    yearsOfExperience: 15,
    averageRating: 4.9,
    totalReviews: 312,
    profileImage: '/images/prof-dr-ananya.png',
    isAcceptingClients: false,
    city: 'Kochi',
    state: 'Kerala',
    region: 'South India',
    country: 'India',
    gender: 'Female',
    sessionModes: ['Online'],
    hourlyRate: 1500,
    currency: 'INR',
    bio: 'Child psychologist specialising in ADHD, learning support, and developmental assessments.',
  },
  {
    id: 'static-4',
    displayName: 'Kavita Desai',
    type: 'COACH',
    specializations: ['Stress', 'Mindfulness', 'Sleep'],
    languages: ['English', 'Hindi', 'Gujarati'],
    yearsOfExperience: 6,
    averageRating: 4.7,
    totalReviews: 156,
    profileImage: '/images/prof-kavita.png',
    isAcceptingClients: true,
    city: 'Ahmedabad',
    state: 'Gujarat',
    region: 'West India',
    country: 'India',
    gender: 'Female',
    sessionModes: ['Online', 'In-person'],
    hourlyRate: 800,
    currency: 'INR',
    bio: 'Wellness coach certified in mindfulness and sleep science, helping busy professionals find balance.',
  },
  {
    id: 'static-5',
    displayName: 'Dr. Arun Patel',
    type: 'THERAPIST',
    specializations: ['Addiction', 'Trauma', 'Crisis Intervention'],
    languages: ['English', 'Hindi', 'Bengali'],
    yearsOfExperience: 18,
    averageRating: 4.9,
    totalReviews: 278,
    profileImage: '/images/prof-rahul.png',
    isAcceptingClients: true,
    city: 'Kolkata',
    state: 'West Bengal',
    region: 'East India',
    country: 'India',
    gender: 'Male',
    sessionModes: ['Online', 'In-person'],
    hourlyRate: 1800,
    currency: 'INR',
    bio: 'Senior therapist with expertise in addiction recovery and trauma-focused therapy.',
  },
  {
    id: 'static-6',
    displayName: 'Sneha Iyer',
    type: 'MENTOR',
    specializations: ['Leadership', 'Emotional Intelligence', 'Communication'],
    languages: ['English', 'Tamil', 'Kannada'],
    yearsOfExperience: 10,
    averageRating: 4.8,
    totalReviews: 201,
    profileImage: '/images/prof-kavita.png',
    isAcceptingClients: true,
    city: 'Bangalore',
    state: 'Karnataka',
    region: 'South India',
    country: 'India',
    gender: 'Female',
    sessionModes: ['Online'],
    hourlyRate: 1100,
    currency: 'INR',
    bio: 'Executive coach and EQ specialist helping leaders in tech and corporate sectors grow with emotional intelligence.',
  },
  {
    id: 'static-7',
    displayName: 'Dr. Vikram Singh',
    type: 'PSYCHIATRIST',
    specializations: ['Mood Disorders', 'Schizophrenia', 'OCD'],
    languages: ['English', 'Hindi', 'Punjabi'],
    yearsOfExperience: 20,
    averageRating: 4.9,
    totalReviews: 340,
    profileImage: '/images/prof-rahul.png',
    isAcceptingClients: true,
    city: 'Chandigarh',
    state: 'Punjab',
    region: 'North India',
    country: 'India',
    gender: 'Male',
    sessionModes: ['Online', 'In-person'],
    hourlyRate: 2000,
    currency: 'INR',
    bio: 'Senior psychiatrist and clinical researcher specialising in complex mood disorders and psychotic conditions.',
  },
  {
    id: 'static-8',
    displayName: 'Meera Krishnan',
    type: 'COUNSELOR',
    specializations: ['Grief', 'Loss', 'Life Transitions'],
    languages: ['English', 'Tamil', 'Telugu'],
    yearsOfExperience: 9,
    averageRating: 4.8,
    totalReviews: 167,
    profileImage: '/images/prof-kavita.png',
    isAcceptingClients: true,
    city: 'Chennai',
    state: 'Tamil Nadu',
    region: 'South India',
    country: 'India',
    gender: 'Female',
    sessionModes: ['Online', 'In-person'],
    hourlyRate: 950,
    currency: 'INR',
    bio: 'Compassionate counsellor helping individuals navigate grief, life transitions, and emotional healing.',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const language = searchParams.get('language');
    const gender = searchParams.get('gender');
    const type = searchParams.get('type');

    // Try DB first
    const whereClause: Record<string, any> = {
      verificationStatus: 'VERIFIED',
      isAcceptingClients: true,
    };
    if (region) whereClause.region = region;
    if (language) whereClause.languages = { has: language };
    if (gender) whereClause.gender = gender;
    if (type) whereClause.type = type;

    const dbProfessionals = await prisma.professional.findMany({
      where: whereClause,
      orderBy: [{ averageRating: 'desc' }, { totalSessions: 'desc' }],
      take: 50,
    });

    if (dbProfessionals.length > 0) {
      const formatted = dbProfessionals.map((p) => ({
        id: p.id,
        displayName: p.displayName || `Professional #${p.id.slice(-4)}`,
        type: p.type,
        specializations: p.specializations,
        languages: p.languages,
        yearsOfExperience: p.yearsOfExperience,
        averageRating: p.averageRating,
        totalReviews: p.totalReviews,
        profileImage: p.profileImage,
        isAcceptingClients: p.isAcceptingClients,
        city: p.city,
        state: p.state,
        region: p.region,
        country: p.country,
        gender: p.gender,
        sessionModes: p.sessionModes,
        hourlyRate: p.hourlyRate,
        currency: p.currency,
        bio: p.bio,
      }));
      return successResponse(formatted, 'Professionals fetched');
    }

    // Fallback to static (filter by query params if provided)
    let filtered = [...STATIC_PROFESSIONALS];
    if (region) filtered = filtered.filter((p) => p.region === region);
    if (language) filtered = filtered.filter((p) => p.languages.includes(language));
    if (gender) filtered = filtered.filter((p) => p.gender === gender);
    if (type) filtered = filtered.filter((p) => p.type === type.toUpperCase());

    return successResponse(filtered, 'Professionals fetched');
  } catch (error) {
    console.error('Professionals fetch error:', error);
    return errorResponse('Failed to fetch professionals', 500);
  }
}
