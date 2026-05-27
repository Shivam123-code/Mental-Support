export interface Option {
  text: string;
  score: number;
  triggerFollowUp?: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: "scale" | "choice" | "frequency";
  options: Option[];
  followUpQuestion?: {
    id: string;
    text: string;
    type: "choice" | "scale";
    options: Option[];
  };
}

export interface AssessmentConfig {
  id: string;
  name: string;
  category: string;
  duration: string;
  questionCount: number;
  description: string;
  bannerMessage: string;
  helpsWith: string[];
  symptoms: string[];
  accentColor: string;
  questions: Question[];
  journey: string[];
  resources: Array<{ title: string; type: "Article" | "Video" | "Meditation"; duration: string }>;
}

const anxietyIndex: AssessmentConfig = {
  id: "anxiety-index",
  name: "Anxiety Index",
  category: "Emotional Wellness",
  duration: "5 min",
  questionCount: 4,
  description: "Understand your anxiety patterns, triggers, and emotional responses in a safe, judgment-free assessment.",
  bannerMessage: "This assessment is designed to support emotional awareness and wellbeing. It is not a medical diagnosis.",
  helpsWith: [
    "Identify personal anxiety triggers",
    "Understand physical and emotional patterns",
    "Improve mindfulness and self-awareness",
    "Discover tailored calming strategies",
  ],
  symptoms: [
    "Racing thoughts and overthinking",
    "Difficulty sleeping or unwinding",
    "Constant feelings of worry or dread",
    "Physical tension (restlessness, elevated heart rate)",
  ],
  accentColor: "rgba(8, 157, 140, 1)", // Seafoam Cyan
  questions: [
    {
      id: "anx_q1",
      text: "How frequently do you find yourself worrying about future events or situations?",
      type: "frequency",
      options: [
        { text: "Rarely or never", score: 1 },
        { text: "Occasionally", score: 2 },
        { text: "Frequently", score: 3, triggerFollowUp: true },
        { text: "Almost constantly", score: 4, triggerFollowUp: true },
      ],
      followUpQuestion: {
        id: "anx_q1_followup",
        text: "What areas of your life tend to trigger this worry the most?",
        type: "choice",
        options: [
          { text: "Work & Professional demands", score: 1 },
          { text: "Social situations & Relationships", score: 1 },
          { text: "Health or Personal well-being", score: 1 },
          { text: "Financial uncertainty", score: 1 },
        ],
      },
    },
    {
      id: "anx_q2",
      text: "Do you experience physical symptoms of tension, such as a racing heart, tight chest, or restlessness?",
      type: "scale",
      options: [
        { text: "Not at all", score: 1 },
        { text: "Slightly noticeable", score: 2 },
        { text: "Moderately intense", score: 3 },
        { text: "Severely disruptive", score: 4 },
      ],
    },
    {
      id: "anx_q3",
      text: "When you feel anxious, how easy is it for you to calm your thoughts or redirect your focus?",
      type: "choice",
      options: [
        { text: "Very easy — I can reset quickly", score: 1 },
        { text: "Somewhat easy — takes a few minutes of effort", score: 2 },
        { text: "Difficult — I often get stuck in loops", score: 3 },
        { text: "Extremely hard — I feel consumed by the thoughts", score: 4 },
      ],
    },
    {
      id: "anx_q4",
      text: "How often does worry or mental fatigue interfere with your ability to get restful sleep?",
      type: "frequency",
      options: [
        { text: "Almost never", score: 1 },
        { text: "Once or twice a week", score: 2 },
        { text: "3 to 4 times a week", score: 3 },
        { text: "Every night", score: 4 },
      ],
    },
  ],
  journey: ["Assessment", "Mood Journaling", "Anxiety Recovery Program", "Weekly Check-ins", "Community Support Circle"],
  resources: [
    { title: "Grounding Techniques for Racing Thoughts", type: "Article", duration: "4 min read" },
    { title: "10-Minute Calm Down Breathing Session", type: "Video", duration: "10 min video" },
    { title: "Deep Sleep Release Meditation", type: "Meditation", duration: "15 min listen" },
  ],
};

const burnoutMeter: AssessmentConfig = {
  id: "burnout-meter",
  name: "Burnout Meter",
  category: "Emotional Wellness",
  duration: "6 min",
  questionCount: 4,
  description: "Evaluate your exhaustion levels, work stress, and motivation to check if you are heading towards burnout.",
  bannerMessage: "Burnout is a state of physical and mental exhaustion. This assessment helps evaluate stress trends.",
  helpsWith: [
    "Identify early warning signs of exhaustion",
    "Assess workload sustainability",
    "Recognize emotional detachment from work/duties",
    "Discover energy restoration routines",
  ],
  symptoms: [
    "Chronic physical and mental exhaustion",
    "Lack of enthusiasm or cynicism about tasks",
    "Feelings of ineffectiveness or lack of accomplishment",
    "Brain fog and decreased productivity",
  ],
  accentColor: "rgba(134, 79, 19, 1)", // Peach/Orange Tertiary
  questions: [
    {
      id: "bo_q1",
      text: "How often do you feel completely drained physically or emotionally at the end of your day?",
      type: "frequency",
      options: [
        { text: "Rarely or never", score: 1 },
        { text: "A few times a month", score: 2 },
        { text: "Several times a week", score: 3, triggerFollowUp: true },
        { text: "Every single day", score: 4, triggerFollowUp: true },
      ],
      followUpQuestion: {
        id: "bo_q1_followup",
        text: "Do you feel you have a support system (friends, family, or mentor) to talk to about this?",
        type: "choice",
        options: [
          { text: "Yes, I have strong support", score: 0 },
          { text: "Somewhat, but they don't fully understand", score: 1 },
          { text: "No, I feel isolated in this", score: 2 },
        ],
      },
    },
    {
      id: "bo_q2",
      text: "How would you describe your interest or emotional connection to your daily work/tasks?",
      type: "choice",
      options: [
        { text: "Fully engaged and motivated", score: 1 },
        { text: "Occasionally detached or indifferent", score: 2 },
        { text: "Frequently cynical or unmotivated", score: 3 },
        { text: "Completely disconnected or checked out", score: 4 },
      ],
    },
    {
      id: "bo_q3",
      text: "Rate your satisfaction with your current daily workload volume.",
      type: "scale",
      options: [
        { text: "Perfect — fully manageable", score: 1 },
        { text: "Slightly busy but doable", score: 2 },
        { text: "Overwhelming and hard to keep up", score: 3 },
        { text: "Unmanageable — I am falling behind", score: 4 },
      ],
    },
    {
      id: "bo_q4",
      text: "Do you struggle to detach from your responsibilities and relax during your personal time?",
      type: "scale",
      options: [
        { text: "No, I transition easily", score: 1 },
        { text: "Sometimes I think about tasks, but can relax", score: 2 },
        { text: "Often find myself checking work/worrying", score: 3 },
        { text: "Never — my mind is always working", score: 4 },
      ],
    },
  ],
  journey: ["Assessment", "Burnout Reset Program", "Structured Work Habits", "EAP Counseling", "Restoration Routine"],
  resources: [
    { title: "Setting Boundaries in a High-Pressure Workplace", type: "Article", duration: "5 min read" },
    { title: "Detoxifying from Digital Work Fatigue", type: "Video", duration: "8 min video" },
    { title: "Evening Decompression Mindfulness Exercise", type: "Meditation", duration: "12 min listen" },
  ],
};

const relationshipWellness: AssessmentConfig = {
  id: "relationship-wellness",
  name: "Relationship Wellness",
  category: "Relationship & Family",
  duration: "8 min",
  questionCount: 4,
  description: "Evaluate the wellness, communication patterns, and trust in your personal relationships.",
  bannerMessage: "Healthy connections thrive on communication. Evaluate your relationship safety in a supportive space.",
  helpsWith: [
    "Identify communication blocks",
    "Assess emotional closeness and trust",
    "Learn constructive conflict resolution skills",
    "Understand mutual boundaries",
  ],
  symptoms: [
    "Frequent miscommunications or silent treatments",
    "Feeling emotionally distant from your partner",
    "Anxiety surrounding disagreements",
    "Difficulty expressing needs honestly",
  ],
  accentColor: "rgba(224, 49, 100, 1)", // Warm red-pink
  questions: [
    {
      id: "rw_q1",
      text: "How safely and comfortably do you feel you can express your core emotional needs to your partner?",
      type: "scale",
      options: [
        { text: "Completely safe and open", score: 1 },
        { text: "Mostly comfortable, with minor reservations", score: 2 },
        { text: "Difficult — I worry about their reaction", score: 3, triggerFollowUp: true },
        { text: "Extremely difficult — I suppress my needs", score: 4, triggerFollowUp: true },
      ],
      followUpQuestion: {
        id: "rw_q1_followup",
        text: "What describes the main barrier in sharing your needs?",
        type: "choice",
        options: [
          { text: "Fear of causing conflict", score: 1 },
          { text: "Feeling they won't understand or care", score: 2 },
          { text: "Struggling to put my feelings into words", score: 1 },
          { text: "Previous arguments that shut down sharing", score: 2 },
        ],
      },
    },
    {
      id: "rw_q2",
      text: "When disagreements or conflicts arise, how are they typically resolved?",
      type: "choice",
      options: [
        { text: "We discuss calmly and reach a compromise", score: 1 },
        { text: "We argue, but always make up and resolve it", score: 2 },
        { text: "One of us shuts down or gives the silent treatment", score: 3 },
        { text: "Arguments escalate with no resolution, leaving tension", score: 4 },
      ],
    },
    {
      id: "rw_q3",
      text: "How often do you feel appreciated and valued in your relationship?",
      type: "frequency",
      options: [
        { text: "Almost always", score: 1 },
        { text: "Frequently", score: 2 },
        { text: "Rarely", score: 3 },
        { text: "Almost never", score: 4 },
      ],
    },
    {
      id: "rw_q4",
      text: "How connected do you feel to your partner's emotional world?",
      type: "scale",
      options: [
        { text: "Deeply connected", score: 1 },
        { text: "Connected, but could be stronger", score: 2 },
        { text: "Somewhat detached", score: 3 },
        { text: "Completely distant", score: 4 },
      ],
    },
  ],
  journey: ["Assessment", "Communication Skills Course", "Vulnerability Circles", "Couple/Family Counselling", "Monthly Connection Check-in"],
  resources: [
    { title: "The Art of Active Listening in Relationships", type: "Article", duration: "6 min read" },
    { title: "De-escalating Arguments constructly", type: "Video", duration: "12 min video" },
    { title: "Shared Heart Centered Breathing Meditation", type: "Meditation", duration: "8 min listen" },
  ],
};

const leadershipEQ: AssessmentConfig = {
  id: "leadership-eq",
  name: "Leadership EQ",
  category: "Workplace Wellness",
  duration: "10 min",
  questionCount: 4,
  description: "Assess your empathetic leadership capacity, decision stability, and team emotional intelligence.",
  bannerMessage: "Empathetic leadership creates high-trust teams. Evaluate your emotional leadership styles safely.",
  helpsWith: [
    "Evaluate empathy under high-pressure decisions",
    "Identify self-regulation patterns in front of team",
    "Understand team dynamics under stress",
    "Build a supportive culture of emotional trust",
  ],
  symptoms: [
    "Frustration or irritability when targets are missed",
    "Feeling overwhelmed by team emotional needs",
    "Difficulty delivering tough feedback constructively",
    "Detachment from team social dynamics",
  ],
  accentColor: "rgba(59, 130, 246, 1)", // Blue Accent
  questions: [
    {
      id: "le_q1",
      text: "When a team member is struggling or makes an error under tight deadlines, what is your first response?",
      type: "choice",
      options: [
        { text: "Ask how I can support them to fix it", score: 1 },
        { text: "Step in and resolve it myself to save time", score: 2 },
        { text: "Show visible frustration or urgency", score: 3, triggerFollowUp: true },
        { text: "Assign the target to someone else with minimal feedback", score: 4, triggerFollowUp: true },
      ],
      followUpQuestion: {
        id: "le_q1_followup",
        text: "What emotion do you feel most in high-pressure moments?",
        type: "choice",
        options: [
          { text: "Intense frustration/anger", score: 2 },
          { text: "Anxious urgency to finish", score: 1 },
          { text: "Detachment/apathy", score: 2 },
          { text: "Calm accountability", score: 0 },
        ],
      },
    },
    {
      id: "le_q2",
      text: "How easily can you regulate your emotional expressions (anger, stress) during difficult team meetings?",
      type: "scale",
      options: [
        { text: "Very easily — I remain composed", score: 1 },
        { text: "Somewhat easily — I hold back visible displays", score: 2 },
        { text: "Difficult — my stress is often visible to the team", score: 3 },
        { text: "Extremely difficult — I frequently vent or show anger", score: 4 },
      ],
    },
    {
      id: "le_q3",
      text: "Do you actively gather team feedback and incorporate their emotional inputs in decisions?",
      type: "frequency",
      options: [
        { text: "Always", score: 1 },
        { text: "Occasionally", score: 2 },
        { text: "Rarely", score: 3 },
        { text: "Never", score: 4 },
      ],
    },
    {
      id: "le_q4",
      text: "How connected do you feel to the general psychological safety level of your team?",
      type: "scale",
      options: [
        { text: "Very connected and aware", score: 1 },
        { text: "Somewhat connected", score: 2 },
        { text: "Distant — I focus purely on metrics", score: 3 },
        { text: "Completely out of touch", score: 4 },
      ],
    },
  ],
  journey: ["Assessment", "Empathetic Leadership Academy", "EQ Coaching Session", "Feedback Circles", "Team Trust Assessments"],
  resources: [
    { title: "Leading with Empathy in Remote Teams", type: "Article", duration: "7 min read" },
    { title: "Building Psychological Safety in Workplace", type: "Video", duration: "15 min video" },
    { title: "Self-Regulation Pause for Leaders", type: "Meditation", duration: "10 min listen" },
  ],
};

const configsMap: Record<string, AssessmentConfig> = {
  "anxiety-index": anxietyIndex,
  "burnout-meter": burnoutMeter,
  "burnout-risk": { ...burnoutMeter, id: "burnout-risk", name: "Burnout Risk" },
  "relationship-wellness": relationshipWellness,
  "leadership-eq": leadershipEQ,
};

// Slugify helper
export const slugify = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// Dynamic assessment config generator for fallbacks
export const getAssessmentConfig = (id: string): AssessmentConfig => {
  const cleanId = id.toLowerCase().trim();
  if (configsMap[cleanId]) {
    return configsMap[cleanId];
  }

  // Generate fallback configuration based on ID
  const title = id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    id: cleanId,
    name: title,
    category: "General Wellbeing",
    duration: "6 min",
    questionCount: 4,
    description: `Evaluate your emotional balance, understanding patterns, and responses for ${title} in a safe wellbeing assessment.`,
    bannerMessage: "This assessment is designed to support general emotional intelligence. It is not a clinical evaluation.",
    helpsWith: [
      `Understand personal responses related to ${title}`,
      "Track patterns of emotional habits",
      "Gain self-awareness and regulation tips",
      "Adopt healthier mindfulness strategies",
    ],
    symptoms: [
      "Subtle feelings of unease or stress",
      "Mental processing patterns that feel fatiguing",
      "Difficulty focusing or shifting state",
      "Unbalanced emotional reactions to stress",
    ],
    accentColor: "rgba(0, 104, 92, 1)", // Primary seafoam teal
    questions: [
      {
        id: "fb_q1",
        text: `How frequently do you feel emotionally challenged or off-balance in situations related to ${title}?`,
        type: "frequency",
        options: [
          { text: "Rarely or never", score: 1 },
          { text: "Occasionally", score: 2 },
          { text: "Frequently", score: 3, triggerFollowUp: true },
          { text: "Almost constantly", score: 4, triggerFollowUp: true },
        ],
        followUpQuestion: {
          id: "fb_q1_followup",
          text: "What makes this feeling arise the most?",
          type: "choice",
          options: [
            { text: "Lack of control over situations", score: 1 },
            { text: "Expectations from others", score: 1 },
            { text: "Internal pressure or high standards", score: 1 },
            { text: "General life fatigue", score: 1 },
          ],
        },
      },
      {
        id: "fb_q2",
        text: "How quickly do you feel you recover emotional stability after a difficult stress event?",
        type: "choice",
        options: [
          { text: "Almost immediately", score: 1 },
          { text: "Takes about an hour of relaxation", score: 2 },
          { text: "Takes several hours or sleep to recover", score: 3 },
          { text: "I carry the tension for multiple days", score: 4 },
        ],
      },
      {
        id: "fb_q3",
        text: "Rate the support you feel you have to navigate these situations.",
        type: "scale",
        options: [
          { text: "Strong support system", score: 1 },
          { text: "Moderate support", score: 2 },
          { text: "Minimal support", score: 3 },
          { text: "No support at all", score: 4 },
        ],
      },
      {
        id: "fb_q4",
        text: "How often do you set aside dedicated time for self-reflection and decompression?",
        type: "frequency",
        options: [
          { text: "Daily", score: 1 },
          { text: "Weekly", score: 2 },
          { text: "Monthly", score: 3 },
          { text: "Almost never", score: 4 },
        ],
      },
    ],
    journey: ["Assessment", "Self-Reflection Practice", "Personalized Growth Program", "Weekly Check-ins", "Community Circles"],
    resources: [
      { title: `Self-Awareness Habits for ${title}`, type: "Article", duration: "5 min read" },
      { title: "Mindful Reset Exercise", type: "Video", duration: "6 min video" },
      { title: "Soothing Guided Calm Meditation", type: "Meditation", duration: "10 min listen" },
    ],
  };
};
