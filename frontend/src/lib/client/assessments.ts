// Assessment Question Bank + Scoring Engine
// All 4 assessments with clinically-inspired questions, scoring, and insights

export type AssessmentKey = 'ANXIETY_INDEX' | 'BURNOUT_METER' | 'RELATIONSHIP_WELLNESS' | 'LEADERSHIP_EQ';

export interface Question {
  id: string;
  text: string;
  options: { label: string; value: number }[];
}

export interface AssessmentDef {
  key: AssessmentKey;
  title: string;
  subtitle: string;
  description: string;
  time: string;
  color: string;
  iconEmoji: string;
  questions: Question[];
  maxScore: number;
  getLevel: (score: number) => string;
  getInsights: (score: number, level: string) => AssessmentInsights;
}

export interface AssessmentInsights {
  summary: string;
  level: string;
  score: number;
  maxScore: number;
  percentage: number;
  recommendations: string[];
  nextSteps: string[];
  badge: string;
}

// ─── QUESTION BANKS ────────────────────────────────────────────────────────

const FREQ_OPTIONS = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
];

const AGREE_OPTIONS = [
  { label: 'Strongly Disagree', value: 0 },
  { label: 'Disagree', value: 1 },
  { label: 'Neutral', value: 2 },
  { label: 'Agree', value: 3 },
  { label: 'Strongly Agree', value: 4 },
];

const ALWAYS_OPTIONS = [
  { label: 'Never', value: 0 },
  { label: 'Rarely', value: 1 },
  { label: 'Sometimes', value: 2 },
  { label: 'Often', value: 3 },
  { label: 'Always', value: 4 },
];

// ─── ASSESSMENTS ───────────────────────────────────────────────────────────

export const ASSESSMENTS: Record<AssessmentKey, AssessmentDef> = {

  ANXIETY_INDEX: {
    key: 'ANXIETY_INDEX',
    title: 'Anxiety Index (GAD-7)',
    subtitle: 'Generalized Anxiety Disorder Scale',
    description: 'Measure generalized daily anxiety levels using the clinically validated GAD-7 scale.',
    time: '5 mins',
    color: 'from-blue-50 to-indigo-50',
    iconEmoji: '🧠',
    maxScore: 21,
    questions: [
      { id: 'q1', text: 'Feeling nervous, anxious, or on edge', options: FREQ_OPTIONS },
      { id: 'q2', text: 'Not being able to stop or control worrying', options: FREQ_OPTIONS },
      { id: 'q3', text: 'Worrying too much about different things', options: FREQ_OPTIONS },
      { id: 'q4', text: 'Trouble relaxing', options: FREQ_OPTIONS },
      { id: 'q5', text: "Being so restless that it's hard to sit still", options: FREQ_OPTIONS },
      { id: 'q6', text: 'Becoming easily annoyed or irritable', options: FREQ_OPTIONS },
      { id: 'q7', text: 'Feeling afraid as if something awful might happen', options: FREQ_OPTIONS },
    ],
    getLevel: (score) => {
      if (score <= 4) return 'Minimal';
      if (score <= 9) return 'Mild';
      if (score <= 14) return 'Moderate';
      return 'Severe';
    },
    getInsights: (score, level) => ({
      summary: `Your GAD-7 score is ${score}/21 indicating ${level} anxiety.`,
      level, score, maxScore: 21, percentage: Math.round((score / 21) * 100),
      badge: level === 'Minimal' ? '🌿 Well Balanced' : level === 'Mild' ? '🌤 Mild Concern' : level === 'Moderate' ? '⚡ Needs Attention' : '🚨 Seek Support',
      recommendations: level === 'Minimal'
        ? ['Keep up your mindfulness practices', 'Maintain healthy sleep habits', 'Continue daily check-ins']
        : level === 'Mild'
        ? ['Try daily 5-minute breathing exercises', 'Reduce caffeine intake', 'Keep a worry journal before bed']
        : level === 'Moderate'
        ? ['Book a session with a verified therapist', 'Start the Anxiety Reset Program', 'Practice progressive muscle relaxation daily']
        : ['Consult a mental health professional urgently', 'Join crisis support circle', 'Do not isolate — reach out to trusted people'],
      nextSteps: ['Log your mood daily in the Mood Tracker', 'Try the Anxiety Reset guided program', 'Book a professional session if symptoms persist'],
    }),
  },

  BURNOUT_METER: {
    key: 'BURNOUT_METER',
    title: 'Burnout Meter',
    subtitle: 'Workplace Fatigue & Burnout Assessment',
    description: 'Evaluate workplace fatigue and burnout symptoms across emotional, physical, and cognitive dimensions.',
    time: '8 mins',
    color: 'from-orange-50 to-amber-50',
    iconEmoji: '🔥',
    maxScore: 48,
    questions: [
      { id: 'q1', text: 'I feel emotionally drained by my work', options: ALWAYS_OPTIONS },
      { id: 'q2', text: 'I feel used up at the end of a workday', options: ALWAYS_OPTIONS },
      { id: 'q3', text: 'I feel tired when I get up in the morning and face another day on the job', options: ALWAYS_OPTIONS },
      { id: 'q4', text: 'Working with people all day is really a strain for me', options: ALWAYS_OPTIONS },
      { id: 'q5', text: 'I feel burned out from my work', options: ALWAYS_OPTIONS },
      { id: 'q6', text: 'I feel frustrated by my job', options: ALWAYS_OPTIONS },
      { id: 'q7', text: 'I feel I am working too hard on my job', options: ALWAYS_OPTIONS },
      { id: 'q8', text: 'I feel my work is losing its meaning and purpose', options: ALWAYS_OPTIONS },
      { id: 'q9', text: 'I feel helpless in improving my work situation', options: ALWAYS_OPTIONS },
      { id: 'q10', text: 'I struggle to concentrate on tasks at work', options: ALWAYS_OPTIONS },
      { id: 'q11', text: 'I find it hard to disconnect from work during personal time', options: ALWAYS_OPTIONS },
      { id: 'q12', text: 'I feel a lack of enthusiasm or motivation towards my work', options: ALWAYS_OPTIONS },
    ],
    getLevel: (score) => {
      if (score <= 12) return 'Low';
      if (score <= 24) return 'Moderate';
      if (score <= 36) return 'High';
      return 'Critical';
    },
    getInsights: (score, level) => ({
      summary: `Your Burnout score is ${score}/48 — ${level} burnout detected.`,
      level, score, maxScore: 48, percentage: Math.round((score / 48) * 100),
      badge: level === 'Low' ? '💪 Resilient' : level === 'Moderate' ? '⚠️ Early Warning' : level === 'High' ? '🔥 High Burnout' : '🆘 Critical Burnout',
      recommendations: level === 'Low'
        ? ['Sustain your current work-life balance', 'Continue boundary-setting habits', 'Celebrate your resilience!']
        : level === 'Moderate'
        ? ['Set clear digital boundaries after work hours', 'Take micro-breaks every 90 minutes', 'Talk to your manager about workload']
        : level === 'High'
        ? ['Start the Burnout Recovery Program immediately', 'Book a session with a clinical therapist', 'Request a work leave if possible']
        : ['Take immediate action — this is a medical concern', 'Speak with an occupational health professional', 'Emergency: activate crisis support'],
      nextSteps: ['Enroll in the Burnout Recovery Program', 'Track energy levels daily in the Mood Tracker', 'Set a recurring weekly therapist check-in'],
    }),
  },

  RELATIONSHIP_WELLNESS: {
    key: 'RELATIONSHIP_WELLNESS',
    title: 'Relationship Wellness',
    subtitle: 'Connection Quality & Emotional Boundaries',
    description: 'Assess connection quality and emotional boundaries in your personal relationships.',
    time: '6 mins',
    color: 'from-rose-50 to-pink-50',
    iconEmoji: '💛',
    maxScore: 40,
    questions: [
      { id: 'q1', text: 'I feel emotionally safe expressing my true feelings with close people', options: AGREE_OPTIONS },
      { id: 'q2', text: 'I am able to set and maintain healthy boundaries in my relationships', options: AGREE_OPTIONS },
      { id: 'q3', text: 'I feel heard and understood by the people I care about', options: AGREE_OPTIONS },
      { id: 'q4', text: 'I feel a strong sense of belonging and connection in my social life', options: AGREE_OPTIONS },
      { id: 'q5', text: 'I am able to handle conflicts constructively without shutting down', options: AGREE_OPTIONS },
      { id: 'q6', text: 'I do not feel excessively dependent on others for emotional validation', options: AGREE_OPTIONS },
      { id: 'q7', text: 'I feel comfortable asking for help when I need emotional support', options: AGREE_OPTIONS },
      { id: 'q8', text: 'My relationships energize me rather than drain me', options: AGREE_OPTIONS },
      { id: 'q9', text: 'I am able to give empathy to others without losing myself', options: AGREE_OPTIONS },
      { id: 'q10', text: 'I feel my relationships are balanced and mutually respectful', options: AGREE_OPTIONS },
    ],
    getLevel: (score) => {
      // Higher = better for this one
      if (score >= 34) return 'Excellent';
      if (score >= 25) return 'Good';
      if (score >= 15) return 'Needs Work';
      return 'Concerning';
    },
    getInsights: (score, level) => ({
      summary: `Your Relationship Wellness score is ${score}/40 — ${level} relationship health.`,
      level, score, maxScore: 40, percentage: Math.round((score / 40) * 100),
      badge: level === 'Excellent' ? '💚 Thriving Connections' : level === 'Good' ? '💛 Healthy Bonds' : level === 'Needs Work' ? '🧡 Room to Grow' : '🔴 Seek Support',
      recommendations: level === 'Excellent'
        ? ['You have strong relational intelligence — help others in support circles', 'Nurture your key relationships', 'Share your healthy habits']
        : level === 'Good'
        ? ['Work on communicating needs more directly', 'Invest time in deepening key relationships', 'Practice active listening exercises']
        : level === 'Needs Work'
        ? ['Start with boundary-setting exercises', 'Consider relationship-focused therapy', 'Join a community wellness circle for connection']
        : ['Reach out to a counselor specializing in relational trauma', 'Do not isolate — small steps towards connection matter', 'Start journaling your feelings'],
      nextSteps: ['Write a reflection on your key relationships', 'Join the Anxiety Support Circle community', 'Book a session with a professional counselor'],
    }),
  },

  LEADERSHIP_EQ: {
    key: 'LEADERSHIP_EQ',
    title: 'Leadership EQ Test',
    subtitle: 'Emotional Intelligence in Professional Environments',
    description: 'Evaluate emotional intelligence traits that are essential for leadership and professional relationships.',
    time: '10 mins',
    color: 'from-purple-50 to-violet-50',
    iconEmoji: '🎯',
    maxScore: 60,
    questions: [
      { id: 'q1', text: 'I accurately identify my own emotions as they arise', options: AGREE_OPTIONS },
      { id: 'q2', text: 'I remain calm under pressure and manage my stress effectively', options: AGREE_OPTIONS },
      { id: 'q3', text: 'I can empathize with team members even when I disagree with them', options: AGREE_OPTIONS },
      { id: 'q4', text: 'I handle criticism constructively without becoming defensive', options: AGREE_OPTIONS },
      { id: 'q5', text: 'I adapt my communication style to different people and situations', options: AGREE_OPTIONS },
      { id: 'q6', text: 'I can motivate myself and others during challenging periods', options: AGREE_OPTIONS },
      { id: 'q7', text: 'I am aware of how my moods and behaviour affect those around me', options: AGREE_OPTIONS },
      { id: 'q8', text: 'I actively listen to understand, not just to respond', options: AGREE_OPTIONS },
      { id: 'q9', text: 'I resolve conflicts by addressing underlying emotions, not just facts', options: AGREE_OPTIONS },
      { id: 'q10', text: 'I can delay gratification and stay focused on long-term goals', options: AGREE_OPTIONS },
      { id: 'q11', text: 'I celebrate team successes and genuinely acknowledge others\' contributions', options: AGREE_OPTIONS },
      { id: 'q12', text: 'I seek feedback on my emotional impact and use it constructively', options: AGREE_OPTIONS },
      { id: 'q13', text: 'I can read non-verbal cues and social dynamics accurately', options: AGREE_OPTIONS },
      { id: 'q14', text: 'I maintain ethical standards even under pressure to compromise', options: AGREE_OPTIONS },
      { id: 'q15', text: 'I invest in the emotional wellbeing of my team members', options: AGREE_OPTIONS },
    ],
    getLevel: (score) => {
      if (score >= 50) return 'Expert';
      if (score >= 37) return 'Proficient';
      if (score >= 24) return 'Developing';
      return 'Foundational';
    },
    getInsights: (score, level) => ({
      summary: `Your Leadership EQ score is ${score}/60 — ${level} emotional intelligence.`,
      level, score, maxScore: 60, percentage: Math.round((score / 60) * 100),
      badge: level === 'Expert' ? '🏆 EQ Leader' : level === 'Proficient' ? '⭐ EQ Proficient' : level === 'Developing' ? '📈 EQ Growing' : '🌱 EQ Starter',
      recommendations: level === 'Expert'
        ? ['Consider mentoring others in EQ development', 'Lead organizational wellbeing initiatives', 'Your EQ is a competitive leadership advantage']
        : level === 'Proficient'
        ? ['Work on empathy under pressure scenarios', 'Seek 360-degree feedback from peers', 'Take an advanced leadership coaching session']
        : level === 'Developing'
        ? ['Start a daily emotional awareness journal', 'Take the Leadership EQ coaching program', 'Practice active listening in every meeting']
        : ['Build a foundational self-awareness practice', 'Book a leadership coaching session', 'Read about the 5 pillars of emotional intelligence'],
      nextSteps: ['Practice daily emotional check-ins', 'Enroll in the Leadership program when available', 'Book a professional coaching session'],
    }),
  },
};

// ─── SCORING HELPER ────────────────────────────────────────────────────────

export function scoreAssessment(
  key: AssessmentKey,
  answers: Record<string, number>
): AssessmentInsights {
  const def = ASSESSMENTS[key];
  const score = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const level = def.getLevel(score);
  return def.getInsights(score, level);
}
