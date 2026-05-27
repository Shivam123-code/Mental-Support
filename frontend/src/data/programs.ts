export interface ModuleActivity {
  title: string;
  type: "Video" | "Reflection" | "Exercise" | "Audio" | "Micro Task";
  duration: string;
}

export interface WeekModule {
  week: number;
  title: string;
  activities: ModuleActivity[];
}

export interface ProgramConfig {
  id: string;
  name: string;
  promise: string;
  duration: string;
  sessions: number;
  rating: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  format: string;
  forWho: string[];
  outcomes: string[];
  journey: string[];
  weeks: WeekModule[];
  reflectionPrompt: string;
  support: string[];
  currentEnrolled: string;
  resources: Array<{ title: string; type: "Article" | "Video" | "Meditation"; duration: string }>;
  accentColor: string;
}

const burnoutRecovery: ProgramConfig = {
  id: "burnout-recovery",
  name: "Burnout Recovery",
  promise: "A guided wellbeing journey designed to help you restore emotional energy, improve balance, and rebuild resilience.",
  duration: "4 Weeks",
  sessions: 12,
  rating: 4.9,
  level: "Beginner",
  format: "Self-Paced with AI Insights & Weekly Check-ins",
  forWho: [
    "Emotional and physical exhaustion from work or care duties",
    "Constant fatigue and difficulty waking up refreshed",
    "Feeling detached, cynical, or unmotivated",
    "Mental overload and persistent brain fog",
  ],
  outcomes: [
    "Rebuild sustainable daily energy reserves",
    "Establish clear boundaries at work and at home",
    "Recognize early warning signs of stress fatigue",
    "Develop reliable morning and evening restoration routines",
  ],
  journey: ["Assessment Check", "Energy Restoration", "Boundary Setup", "Sustainable Integration", "Completion & Certificate"],
  accentColor: "rgba(134, 79, 19, 1)", // Peach/Orange
  currentEnrolled: "1,248",
  reflectionPrompt: "What situations or tasks drained your emotional energy the most this week, and how did you respond?",
  support: ["Book a Professional Session", "Join Burnout Support Circle", "Start Sleep Recovery Program", "AI Companion Check-ins"],
  weeks: [
    {
      week: 1,
      title: "Awareness & Recovery",
      activities: [
        { title: "Understanding the Physiology of Burnout", type: "Video", duration: "6 min" },
        { title: "Energy Drain Audit", type: "Reflection", duration: "10 min" },
        { title: "Nervous System Reset Breathing", type: "Exercise", duration: "8 min" },
      ],
    },
    {
      week: 2,
      title: "Emotional Reset",
      activities: [
        { title: "Disconnecting from Digital Noise", type: "Video", duration: "8 min" },
        { title: "Setting Clear Professional Boundaries", type: "Reflection", duration: "15 min" },
        { title: "Guided Mindfulness Decompression", type: "Audio", duration: "12 min" },
      ],
    },
    {
      week: 3,
      title: "Energy Rebuilding",
      activities: [
        { title: "The Power of Micro-Rest Cycles", type: "Video", duration: "5 min" },
        { title: "Reconnecting with Play and Joy", type: "Exercise", duration: "10 min" },
        { title: "Morning Energy Activation Yoga", type: "Exercise", duration: "15 min" },
      ],
    },
    {
      week: 4,
      title: "Sustainable Balance",
      activities: [
        { title: "Designing a Resilient Routine", type: "Video", duration: "7 min" },
        { title: "Commitment to Self-Care Plan", type: "Reflection", duration: "10 min" },
        { title: "Stress De-escalation Micro Task", type: "Micro Task", duration: "3 min" },
      ],
    },
  ],
  resources: [
    { title: "Burnout Recovery Plan Guidebook", type: "Article", duration: "8 min read" },
    { title: "10-Minute Evening Recharge Yoga", type: "Video", duration: "10 min video" },
    { title: "Deep Sleep Release Meditation", type: "Meditation", duration: "15 min listen" },
  ],
};

const anxietyReset: ProgramConfig = {
  id: "anxiety-reset",
  name: "Anxiety Reset",
  promise: "Calm your nervous system, cultivate core grounding habits, and establish emotional regulation skills.",
  duration: "4 Weeks",
  sessions: 16,
  rating: 4.9,
  level: "Beginner",
  format: "Guided Audio Exercises & Emotional Tracker",
  forWho: [
    "Experiencing rapid, uncontrollable racing thoughts",
    "Feeling sudden physical anxiety spikes (panic, tension)",
    "Anxious worry surrounding social or work situations",
    "Struggling with focus due to underlying restlessness",
  ],
  outcomes: [
    "Ground yourself during acute anxiety episodes",
    "Understand thought patterns and trigger events",
    "Adopt healthy breathing techniques to slow heart rate",
    "Cultivate a resilient, self-compassionate inner voice",
  ],
  journey: ["Self-Check Assessment", "Slowing the Heart Rate", "Thought Defusion", "Grounding Habits", "Resilient Mindset Mastery"],
  accentColor: "rgba(8, 157, 140, 1)", // Seafoam Cyan
  currentEnrolled: "2,154",
  reflectionPrompt: "Identify one anxious thought you experienced today. How did you defuse or challenge it?",
  support: ["Anxiety Support Circle", "Consult therapist", "Practice daily breathing exercises", "AI Companion calming check-ins"],
  weeks: [
    {
      week: 1,
      title: "Calming the Body",
      activities: [
        { title: "The Science of Hyperarousal", type: "Video", duration: "5 min" },
        { title: "Introduction to Box Breathing", type: "Exercise", duration: "8 min" },
        { title: "5-4-3-2-1 Grounding Method", type: "Exercise", duration: "10 min" },
      ],
    },
    {
      week: 2,
      title: "Thought Awareness",
      activities: [
        { title: "Identifying Cognitive Distortions", type: "Video", duration: "8 min" },
        { title: "Worry Logging reflection", type: "Reflection", duration: "12 min" },
        { title: "Thought Defusion Guided Session", type: "Audio", duration: "10 min" },
      ],
    },
    {
      week: 3,
      title: "Trigger Integration",
      activities: [
        { title: "Navigating High-Anxiety Scenarios", type: "Video", duration: "6 min" },
        { title: "Exposing to Stressors Gently", type: "Reflection", duration: "15 min" },
        { title: "Soothing Audio Rescue Check-in", type: "Audio", duration: "5 min" },
      ],
    },
    {
      week: 4,
      title: "Resilience Integration",
      activities: [
        { title: "Building Daily Calming Routines", type: "Video", duration: "8 min" },
        { title: "Future-Self Compassion Plan", type: "Reflection", duration: "10 min" },
        { title: "Visual Breathing Practice", type: "Exercise", duration: "6 min" },
      ],
    },
  ],
  resources: [
    { title: "Navigating Panic Attacks Constructively", type: "Article", duration: "6 min read" },
    { title: "Simple 4-7-8 Deep Sleep Breathing", type: "Video", duration: "8 min video" },
    { title: "Self-Compassion Healing Audio Meditation", type: "Meditation", duration: "10 min listen" },
  ],
};

const sleepRecovery: ProgramConfig = {
  id: "sleep-recovery",
  name: "Sleep Recovery",
  promise: "Decompress your nervous system, adopt perfect sleep hygiene, and find deeper, restorative rest.",
  duration: "4 Weeks",
  sessions: 12,
  rating: 4.9,
  level: "Beginner",
  format: "Nightly Relaxation Audios & Sleep Log",
  forWho: [
    "Difficulty falling asleep due to an active mind",
    "Waking up frequently in the middle of the night",
    "Feeling tired and unrefreshed despite sleeping",
    "Depending on sleep aids or external factors",
  ],
  outcomes: [
    "Fall asleep naturally within 15 minutes",
    "Build a perfect pre-sleep wind-down routine",
    "Decompress nervous system tension before bed",
    "Achieve deep, uninterrupted REM rest",
  ],
  journey: ["Sleep Hygiene Check", "Evening Decompression", "Soothing Mind Cycles", "Perfect Rest Patterns", "Energized Waking State"],
  accentColor: "rgba(99, 102, 241, 1)", // Indigo
  currentEnrolled: "1,894",
  reflectionPrompt: "What activities made up your wind-down routine tonight, and how did your mind feel before bed?",
  support: ["Start Sleep Journaling", "Book a Sleep Specialist Session", "Consult therapist", "Use AI Evening Companion"],
  weeks: [
    {
      week: 1,
      title: "Sleep Hygiene Foundation",
      activities: [
        { title: "Understanding the Sleep Drive", type: "Video", duration: "6 min" },
        { title: "Pre-Sleep Environment Setup", type: "Exercise", duration: "15 min" },
        { title: "Nervous System De-excitation breathing", type: "Exercise", duration: "8 min" },
      ],
    },
    {
      week: 2,
      title: "Evening Wind-Down",
      activities: [
        { title: "Clearing the Cognitive Backlog", type: "Video", duration: "7 min" },
        { title: "Brain Dump Journaling reflection", type: "Reflection", duration: "10 min" },
        { title: "Progressive Muscle Relaxation", type: "Exercise", duration: "15 min" },
      ],
    },
    {
      week: 3,
      title: "Mind De-clutter",
      activities: [
        { title: "Taming the Racing Night Mind", type: "Video", duration: "5 min" },
        { title: "Guided Sleep Visualization", type: "Audio", duration: "20 min" },
        { title: "Soothing Natural Soundscapes", type: "Audio", duration: "30 min" },
      ],
    },
    {
      week: 4,
      title: "Restoration Masters",
      activities: [
        { title: "Circadian Rhythm Re-alignment", type: "Video", duration: "8 min" },
        { title: "Consolidating Sleep Schedule", type: "Reflection", duration: "10 min" },
        { title: "Morning Light Exposure task", type: "Micro Task", duration: "5 min" },
      ],
    },
  ],
  resources: [
    { title: "The Complete Sleep Hygiene Checklist", type: "Article", duration: "5 min read" },
    { title: "Yoga Nidra for Deep Sleep Recovery", type: "Video", duration: "20 min video" },
    { title: "Restorative Sleep Guided Hypnosis", type: "Meditation", duration: "25 min listen" },
  ],
};

const emotionalHealing: ProgramConfig = {
  id: "emotional-healing",
  name: "Emotional Healing",
  promise: "Process difficult emotions, heal past wounds, and build a self-compassionate relationship with your inner self.",
  duration: "4 Weeks",
  sessions: 24,
  rating: 4.8,
  level: "Intermediate",
  format: "Guided Exercises & Weekly Sharing Circle",
  forWho: [
    "Carrying unresolved emotional burdens or grief",
    "Struggling with self-criticism and low self-compassion",
    "Feeling emotionally blocked or numb",
    "Difficulty navigating intense emotional states",
  ],
  outcomes: [
    "Develop self-compassion and emotional resilience",
    "Process and release stored emotional tension",
    "Navigate grief and emotional setbacks with grace",
    "Establish a healthy relationship with your inner voice",
  ],
  journey: ["Safety Check-in", "Emotional Awareness", "Processing Grief", "Self-Compassion Integration", "Inner Harmony"],
  accentColor: "rgba(168, 85, 247, 1)", // Purple
  currentEnrolled: "845",
  reflectionPrompt: "What difficult emotion did you feel today, and how can you offer yourself comfort and acceptance for it?",
  support: ["Consult Therapist", "Emotional Healing Support Circle", "Practice Daily Self-Compassion", "AI Companion Calm Chat"],
  weeks: [
    {
      week: 1,
      title: "Emotional Awareness",
      activities: [
        { title: "The Landscape of Human Emotion", type: "Video", duration: "6 min" },
        { title: "Emotion Location Mapping", type: "Exercise", duration: "12 min" },
        { title: "Heart-Centered Breathing", type: "Exercise", duration: "8 min" },
      ],
    },
    {
      week: 2,
      title: "Processing Grief & Loss",
      activities: [
        { title: "Allowing Yourself to Feel", type: "Video", duration: "8 min" },
        { title: "Letter to My Past Self", type: "Reflection", duration: "15 min" },
        { title: "Somatic Release Guided Audio", type: "Audio", duration: "12 min" },
      ],
    },
    {
      week: 3,
      title: "Cultivating Self-Compassion",
      activities: [
        { title: "The Three Elements of Self-Compassion", type: "Video", duration: "5 min" },
        { title: "Developing a Compassionate Inner Voice", type: "Reflection", duration: "10 min" },
        { title: "Loving-Kindness Meditation", type: "Audio", duration: "15 min" },
      ],
    },
    {
      week: 4,
      title: "Emotional Integration",
      activities: [
        { title: "Living with Emotional Authenticity", type: "Video", duration: "7 min" },
        { title: "My Emotional Resiliency Roadmap", type: "Reflection", duration: "10 min" },
        { title: "Quick Self-Soothing Touch", type: "Micro Task", duration: "3 min" },
      ],
    },
  ],
  resources: [
    { title: "The Self-Compassion Workbook", type: "Article", duration: "10 min read" },
    { title: "15-Minute Inner Child Meditation", type: "Meditation", duration: "15 min listen" },
    { title: "Journaling Prompts for Healing", type: "Article", duration: "5 min read" },
  ],
};

const confidenceRebuild: ProgramConfig = {
  id: "confidence-rebuild",
  name: "Confidence Rebuild",
  promise: "Silence your inner critic, overcome imposter syndrome, and step into your personal power.",
  duration: "4 Weeks",
  sessions: 16,
  rating: 4.7,
  level: "Beginner",
  format: "Interactive Goal Setting & Reflections",
  forWho: [
    "Experiencing severe self-doubt or imposter syndrome",
    "Reluctant to take new opportunities due to fear of failure",
    "Constantly comparing yourself to others",
    "Feeling unappreciated or small in social/professional settings",
  ],
  outcomes: [
    "Silence or reprogram your inner critic",
    "Acknowledge and celebrate your unique strengths",
    "Establish clear boundaries and speak up with confidence",
    "Take aligned risks without debilitating fear",
  ],
  journey: ["Belief Assessment", "Inner Critic Awareness", "Strengths Alignment", "Bold Action Practice", "Unshakeable Self-Worth"],
  accentColor: "rgba(245, 158, 11, 1)", // Amber/Gold
  currentEnrolled: "1,120",
  reflectionPrompt: "Write down one victory from today, no matter how small, and acknowledge your role in making it happen.",
  support: ["Join Confidence Circle", "Consult Life Coach", "Daily Victories Journal", "AI Empowerment Chat"],
  weeks: [
    {
      week: 1,
      title: "Unmasking Self-Doubt",
      activities: [
        { title: "The Roots of Imposter Syndrome", type: "Video", duration: "6 min" },
        { title: "Tracking the Critic's Voice", type: "Reflection", duration: "10 min" },
        { title: "Power Posture Grounding", type: "Exercise", duration: "5 min" },
      ],
    },
    {
      week: 2,
      title: "Rewriting the Narrative",
      activities: [
        { title: "Cognitive Reframing for Self-Worth", type: "Video", duration: "8 min" },
        { title: "My Achievements Catalog", type: "Reflection", duration: "12 min" },
        { title: "Guided Boundary Assertiveness Session", type: "Audio", duration: "10 min" },
      ],
    },
    {
      week: 3,
      title: "Stepping into Action",
      activities: [
        { title: "The Confidence-Competence Loop", type: "Video", duration: "5 min" },
        { title: "Taking one 'Micro-Risk' Today", type: "Exercise", duration: "15 min" },
        { title: "Calming Performance Anxiety Audio", type: "Audio", duration: "8 min" },
      ],
    },
    {
      week: 4,
      title: "Unshakable Self-Worth",
      activities: [
        { title: "Maintaining Confidence in Setbacks", type: "Video", duration: "7 min" },
        { title: "My Confidence Creed Plan", type: "Reflection", duration: "10 min" },
        { title: "Daily Positive Anchor setup", type: "Micro Task", duration: "3 min" },
      ],
    },
  ],
  resources: [
    { title: "Overcoming Imposter Syndrome Guide", type: "Article", duration: "6 min read" },
    { title: "Guided Assertiveness Meditation", type: "Meditation", duration: "12 min listen" },
    { title: "5-Minute Pre-Meeting Power Routine", type: "Video", duration: "5 min video" },
  ],
};

const parentingConfidence: ProgramConfig = {
  id: "parenting-confidence",
  name: "Parenting Confidence",
  promise: "Develop emotional regulation as a parent, build deeper connection with your children, and foster family harmony.",
  duration: "4 Weeks",
  sessions: 16,
  rating: 4.8,
  level: "Intermediate",
  format: "Practical Scenarios & Compassionate Guidance",
  forWho: [
    "Feeling overwhelmed, exhausted, or guilty as a parent",
    "Reacting with anger or frustration to child behaviors",
    "Struggling to establish healthy boundaries with kids",
    "Desiring a deeper, calmer connection with children",
  ],
  outcomes: [
    "Manage your own triggers during parenting stress",
    "Respond with calm confidence instead of reacting",
    "Set firm, loving boundaries without guilt",
    "Build a secure emotional attachment with your child",
  ],
  journey: ["Parenting Self-Audit", "Triggers & Regulation", "Firm & Loving Boundaries", "Connection Over Correction", "Thriving Family Dynamics"],
  accentColor: "rgba(16, 185, 129, 1)", // Emerald
  currentEnrolled: "786",
  reflectionPrompt: "What trigger did you encounter with your child today, how did you respond, and what would you do next time?",
  support: ["Parenting Support Circle", "Family Counselor Session", "Daily Pause Practice", "AI Parenting Advisor Check-in"],
  weeks: [
    {
      week: 1,
      title: "Regulating the Parent",
      activities: [
        { title: "Why Parental Regulation Matters First", type: "Video", duration: "7 min" },
        { title: "Parenting Triggers Audit", type: "Reflection", duration: "10 min" },
        { title: "The 3-Second Parent Pause Breathing", type: "Exercise", duration: "5 min" },
      ],
    },
    {
      week: 2,
      title: "Co-Regulation & Empathy",
      activities: [
        { title: "Understanding the Child's Developing Brain", type: "Video", duration: "8 min" },
        { title: "Validating Feelings vs. Behaviors", type: "Reflection", duration: "12 min" },
        { title: "Guided Calm Down Audio for Parents", type: "Audio", duration: "10 min" },
      ],
    },
    {
      week: 3,
      title: "Loving Boundaries",
      activities: [
        { title: "How to Say No with Kindness & Clarity", type: "Video", duration: "6 min" },
        { title: "Boundary Practice Exercises", type: "Exercise", duration: "15 min" },
        { title: "Resolving Conflicts Mindfully", type: "Reflection", duration: "10 min" },
      ],
    },
    {
      week: 4,
      title: "Connection & Joy",
      activities: [
        { title: "Prioritizing Special Connection Time", type: "Video", duration: "5 min" },
        { title: "Family Gratitude Reflection", type: "Reflection", duration: "8 min" },
        { title: "Daily Connection check-in", type: "Micro Task", duration: "3 min" },
      ],
    },
  ],
  resources: [
    { title: "Guide to Positive Discipline", type: "Article", duration: "8 min read" },
    { title: "Self-Compassion for Parents Meditation", type: "Meditation", duration: "12 min listen" },
    { title: "Handling Tantrums with Calmness", type: "Video", duration: "10 min video" },
  ],
};

const focusImprovement: ProgramConfig = {
  id: "focus-improvement",
  name: "Focus Improvement",
  promise: "Train your attention span, conquer digital distractions, and build a flow-state study or work environment.",
  duration: "4 Weeks",
  sessions: 8,
  rating: 4.7,
  level: "Beginner",
  format: "Cognitive Training Tasks & Pomodoro Audio",
  forWho: [
    "Easily distracted by phone notifications or multitasking",
    "Struggling with procrastination and starting tasks",
    "Feeling mentally scattered or unable to read/work for long",
    "Wanting to build healthy study and focus routines",
  ],
  outcomes: [
    "Extend your focused attention span to 45+ minutes",
    "Create a distraction-free physical and digital space",
    "Utilize effective cognitive pacing (Pomodoro, Timeboxing)",
    "Adopt mindfulness habits that calm the scattered mind",
  ],
  journey: ["Focus Baseline Check", "Digital De-clutter", "Entering Flow State", "Focus Endurance training", "Sustained Peak Mind"],
  accentColor: "rgba(59, 130, 246, 1)", // Blue
  currentEnrolled: "1,530",
  reflectionPrompt: "What was the biggest distraction that broke your focus today, and how will you block it tomorrow?",
  support: ["Focus accountability group", "Consult productivity coach", "Daily Pomodoro Tracker", "AI Focus Assistant"],
  weeks: [
    {
      week: 1,
      title: "Understanding Attention",
      activities: [
        { title: "Science of Focus & Distraction", type: "Video", duration: "6 min" },
        { title: "Distraction Diary Audit", type: "Reflection", duration: "10 min" },
        { title: "Mindfulness Breath Anchoring", type: "Exercise", duration: "7 min" },
      ],
    },
    {
      week: 2,
      title: "Digital Environment Reset",
      activities: [
        { title: "Designing Your Digital Focus Sanctum", type: "Video", duration: "8 min" },
        { title: "Setting Boundaries with Apps", type: "Reflection", duration: "10 min" },
        { title: "Deep Work Audio Concentration Track", type: "Audio", duration: "15 min" },
      ],
    },
    {
      week: 3,
      title: "Entering Flow State",
      activities: [
        { title: "The Triggers of Flow", type: "Video", duration: "5 min" },
        { title: "Micro-Pacing (The Pomodoro Technique)", type: "Exercise", duration: "15 min" },
        { title: "Progressive Focus Task", type: "Exercise", duration: "10 min" },
      ],
    },
    {
      week: 4,
      title: "Focus Endurance",
      activities: [
        { title: "Building Mind Muscles for Long Focus", type: "Video", duration: "7 min" },
        { title: "Focus Habit Routine Commitment", type: "Reflection", duration: "10 min" },
        { title: "Single-Tasking Micro Challenge", type: "Micro Task", duration: "3 min" },
      ],
    },
  ],
  resources: [
    { title: "Conquering Procrastination Framework", type: "Article", duration: "6 min read" },
    { title: "Binaural Beats Focus Meditations", type: "Meditation", duration: "20 min listen" },
    { title: "The Power of Deep Work Summary", type: "Article", duration: "8 min read" },
  ],
};

const configsMap: Record<string, ProgramConfig> = {
  "burnout-recovery": burnoutRecovery,
  "burnout-prevention": { ...burnoutRecovery, id: "burnout-prevention", name: "Burnout Prevention" },
  "anxiety-reset": anxietyReset,
  "sleep-recovery": sleepRecovery,
  "emotional-healing": emotionalHealing,
  "confidence-rebuild": confidenceRebuild,
  "parenting-confidence": parentingConfidence,
  "focus-improvement": focusImprovement,
};

// Slugify helper
export const slugify = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// Dynamic program config generator for fallbacks
export const getProgramConfig = (id: string): ProgramConfig => {
  const cleanId = id.toLowerCase().trim();
  if (configsMap[cleanId]) {
    return configsMap[cleanId];
  }

  // Generate fallback based on ID
  const title = id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    id: cleanId,
    name: title,
    promise: `A structured emotional growth path to help you manage triggers, optimize wellness, and build strength in ${title}.`,
    duration: "4 Weeks",
    sessions: 12,
    rating: 4.8,
    level: "Intermediate",
    format: "Self-Paced with AI Reflections & Guidance",
    forWho: [
      `Experiencing emotional fatigue or instability surrounding ${title}`,
      `Struggling with stress and balance related to ${title}`,
      "Lack of structured emotional tools or guidance",
      "Seeking a supportive space to learn and build habits",
    ],
    outcomes: [
      `Develop a deeper emotional self-awareness of ${title}`,
      "Practice self-regulation skills in stressful triggers",
      "Adopt healthier decompression exercises",
      "Connect with supportive circles and routines",
    ],
    journey: ["Assessment Check-in", "Awareness Building", "Skill Integration", "Mastery Practice", "Ecosystem Integration"],
    accentColor: "rgba(0, 104, 92, 1)", // Seafoam Cyan/Teal
    currentEnrolled: "982",
    reflectionPrompt: `What emotional patterns did you observe in yourself this week relating to ${title}?`,
    support: [`Join ${title} Support Circle`, "Schedule a therapy session", "Practice daily guided journaling", "AI Companion Check-ins"],
    weeks: [
      {
        week: 1,
        title: "Awareness & Baseline",
        activities: [
          { title: `Understanding the Framework of ${title}`, type: "Video", duration: "6 min" },
          { title: "Daily Pattern Identification Log", type: "Reflection", duration: "10 min" },
          { title: "Mindfulness De-stress Breathing", type: "Exercise", duration: "8 min" },
        ],
      },
      {
        week: 2,
        title: "Skills Development",
        activities: [
          { title: "Self-Regulation Mechanisms", type: "Video", duration: "8 min" },
          { title: "Overcoming Reaction Habits", type: "Reflection", duration: "15 min" },
          { title: "Somatic Relaxation Audio Guide", type: "Audio", duration: "12 min" },
        ],
      },
      {
        week: 3,
        title: "Integration & Habit",
        activities: [
          { title: "Anchoring Habits in Daily Life", type: "Video", duration: "5 min" },
          { title: "Reflective Mindfulness Exercise", type: "Exercise", duration: "10 min" },
          { title: "Deep Focus Audio Session", type: "Audio", duration: "15 min" },
        ],
      },
      {
        week: 4,
        title: "Resilient Growth",
        activities: [
          { title: "Sustaining Progress & Accountability", type: "Video", duration: "7 min" },
          { title: "Commitment Action Plan", type: "Reflection", duration: "10 min" },
          { title: "Soothing Breathing micro task", type: "Micro Task", duration: "3 min" },
        ],
      },
    ],
    resources: [
      { title: `Mindful Practices for ${title}`, type: "Article", duration: "5 min read" },
      { title: "Somatic Release Routine", type: "Video", duration: "8 min video" },
      { title: "Calming Breath Guided Meditation", type: "Meditation", duration: "12 min listen" },
    ],
  };
};
