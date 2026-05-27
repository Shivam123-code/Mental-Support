// Database Seed Script
// Run with: npm run db:seed

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://postgres:kleverklues2024@localhost:5432/kleverklues?schema=public';
const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo users
  const demoUserPassword = await bcrypt.hash('Demo@123', 12);
  const demoProfessionalPassword = await bcrypt.hash('Prof@123', 12);
  const demoAdminPassword = await bcrypt.hash('Admin@123', 12);

  // Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@kleverklues.com' },
    update: {},
    create: {
      email: 'demo@kleverklues.com',
      passwordHash: demoUserPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: true,
      profile: {
        create: {
          bio: 'Demo user account for testing',
          supportAreas: ['anxiety', 'stress', 'burnout'],
        },
      },
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Demo Professional
  const demoProfessional = await prisma.user.upsert({
    where: { email: 'professional@kleverklues.com' },
    update: {},
    create: {
      email: 'professional@kleverklues.com',
      passwordHash: demoProfessionalPassword,
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      role: 'PROFESSIONAL',
      status: 'ACTIVE',
      emailVerified: true,
      profile: {
        create: {
          bio: 'Licensed therapist specializing in anxiety and stress management',
        },
      },
    },
  });

  // Create professional profile
  await prisma.professional.upsert({
    where: { userId: demoProfessional.id },
    update: {},
    create: {
      userId: demoProfessional.id,
      type: 'THERAPIST',
      licenseNumber: 'PSY-12345',
      licenseState: 'CA',
      licenseCountry: 'USA',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
      qualifications: ['PhD in Clinical Psychology', 'Licensed Therapist'],
      specializations: ['Anxiety', 'Stress Management', 'CBT', 'Mindfulness'],
      languages: ['English', 'Spanish'],
      yearsOfExperience: 10,
      hourlyRate: 150,
      bio: 'I specialize in helping individuals overcome anxiety and stress through evidence-based approaches.',
      approach: 'Cognitive Behavioral Therapy (CBT) and Mindfulness-Based Stress Reduction',
      averageRating: 4.9,
      totalReviews: 127,
      totalSessions: 450,
    },
  });

  console.log('✅ Created demo professional:', demoProfessional.email);

  // Demo Admin
  const demoAdmin = await prisma.user.upsert({
    where: { email: 'admin@kleverklues.com' },
    update: {},
    create: {
      email: 'admin@kleverklues.com',
      passwordHash: demoAdminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      profile: {
        create: {
          bio: 'Platform administrator',
        },
      },
    },
  });

  console.log('✅ Created demo admin:', demoAdmin.email);

  // Create sample assessment results for demo user
  await prisma.assessmentResult.create({
    data: {
      userId: demoUser.id,
      assessmentType: 'ANXIETY_INDEX',
      score: 12,
      maxScore: 16,
      percentage: 75,
      level: 'High',
      insights: {
        level: 'High',
        recommendations: [
          'Consider booking a session with a professional',
          'Join an anxiety support circle',
          'Start the Anxiety Reset program',
        ],
        nextSteps: [
          'Practice daily breathing exercises',
          'Keep a mood journal',
          'Identify your anxiety triggers',
        ],
      },
      answers: {
        q1: { text: 'Frequently', score: 3 },
        q2: { text: 'Moderately intense', score: 3 },
        q3: { text: 'Difficult — I often get stuck in loops', score: 3 },
        q4: { text: '3 to 4 times a week', score: 3 },
      },
    },
  });

  console.log('✅ Created sample assessment result');

  // Create sample program enrollment
  await prisma.programEnrollment.create({
    data: {
      userId: demoUser.id,
      programType: 'ANXIETY_RESET',
      status: 'ACTIVE',
      currentWeek: 2,
      completedWeeks: 1,
      progressPercent: 25,
    },
  });

  console.log('✅ Created sample program enrollment');

  // Create sample mood logs
  const moods = ['anxious', 'calm', 'stressed', 'happy', 'overwhelmed'];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    await prisma.moodLog.create({
      data: {
        userId: demoUser.id,
        mood: moods[i % moods.length],
        intensity: Math.floor(Math.random() * 5) + 4,
        notes: `Feeling ${moods[i % moods.length]} today`,
        triggers: ['work', 'sleep'],
        activities: ['meditation', 'exercise'],
        loggedAt: date,
      },
    });
  }

  console.log('✅ Created sample mood logs');

  // Create sample journal entries
  await prisma.journalEntry.create({
    data: {
      userId: demoUser.id,
      title: 'First Day of My Wellbeing Journey',
      content: 'Today I decided to take control of my mental health. I completed my first assessment and enrolled in the Anxiety Reset program. Feeling hopeful about the future.',
      mood: 'hopeful',
      tags: ['journey', 'anxiety', 'hope'],
      isPrivate: true,
    },
  });

  console.log('✅ Created sample journal entry');

  // Create sample community post
  await prisma.communityPost.create({
    data: {
      userId: demoUser.id,
      type: 'STORY',
      title: 'My Journey with Anxiety',
      content: 'I wanted to share my story of overcoming anxiety. It has been a challenging journey, but with the right support and tools, I am making progress every day.',
      tags: ['anxiety', 'recovery', 'hope'],
      isAnonymous: false,
      likesCount: 24,
      commentsCount: 8,
    },
  });

  console.log('✅ Created sample community post');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📝 Demo Credentials:');
  console.log('User: demo@kleverklues.com / Demo@123');
  console.log('Professional: professional@kleverklues.com / Prof@123');
  console.log('Admin: admin@kleverklues.com / Admin@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
