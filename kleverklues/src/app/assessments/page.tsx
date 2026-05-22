import Image from "next/image";
import Link from "next/link";
import { Brain, Heart, Users, Briefcase, TrendingUp, Shield, ArrowRight, Clock, CheckCircle } from "lucide-react";

const assessmentCategories = [
  {
    title: "Emotional Wellness",
    icon: Heart,
    color: "bg-purple-100 text-purple-700",
    assessments: [
      { name: "Anxiety Index", duration: "5 min", description: "Understand your anxiety patterns and triggers" },
      { name: "Stress Score", duration: "4 min", description: "Measure your current stress levels" },
      { name: "Burnout Meter", duration: "6 min", description: "Check if you're heading towards burnout" },
      { name: "Mood Assessment", duration: "3 min", description: "Track and understand your emotional state" },
      { name: "Emotional Stability Check", duration: "7 min", description: "Evaluate your emotional regulation skills" },
    ],
  },
  {
    title: "Personality & Potential",
    icon: Brain,
    color: "bg-amber-100 text-amber-700",
    assessments: [
      { name: "Personality Insights", duration: "10 min", description: "Discover your personality traits and strengths" },
      { name: "EQ Assessment", duration: "8 min", description: "Measure your emotional intelligence" },
      { name: "Leadership Style", duration: "7 min", description: "Understand your natural leadership approach" },
      { name: "Communication Style", duration: "5 min", description: "Learn how you connect with others" },
    ],
  },
  {
    title: "Career & Learning",
    icon: Briefcase,
    color: "bg-blue-100 text-blue-700",
    assessments: [
      { name: "Career Aptitude", duration: "12 min", description: "Find careers that align with your strengths" },
      { name: "Learning Potential", duration: "8 min", description: "Discover your best learning methods" },
      { name: "Cognitive Strengths", duration: "10 min", description: "Map your cognitive abilities" },
      { name: "Productivity Analysis", duration: "6 min", description: "Optimize your work patterns" },
    ],
  },
  {
    title: "Relationship & Family",
    icon: Users,
    color: "bg-pink-100 text-pink-700",
    assessments: [
      { name: "Relationship Wellness", duration: "8 min", description: "Evaluate the health of your relationships" },
      { name: "Parenting Style", duration: "7 min", description: "Understand your approach to parenting" },
      { name: "Family Emotional Health", duration: "10 min", description: "Assess your family's emotional dynamics" },
    ],
  },
  {
    title: "Workplace Wellness",
    icon: TrendingUp,
    color: "bg-green-100 text-green-700",
    assessments: [
      { name: "Burnout Risk", duration: "5 min", description: "Identify early signs of workplace burnout" },
      { name: "Workforce Wellbeing", duration: "8 min", description: "Measure your overall work-life balance" },
      { name: "Leadership EQ", duration: "10 min", description: "Assess your leadership emotional intelligence" },
    ],
  },
];

export default function Assessments() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 md:py-24 gradient-hero">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
                <Brain size={16} />
                Intelligence Center
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Understand Yourself <span className="text-gradient">Better</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Take scientifically-designed assessments to gain deep insights into your emotional health, personality, relationships, and potential.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-purple-600" />
                  <span>3-12 minutes each</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield size={16} className="text-purple-600" />
                  <span>100% Private</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Expert-Designed</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=550&h=450&fit=crop"
                alt="Person taking assessment"
                width={550}
                height={450}
                className="rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Categories */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          {assessmentCategories.map((category, idx) => (
            <div key={category.title} className={`mb-16 ${idx % 2 === 0 ? '' : ''}`}>
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center`}>
                  <category.icon size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">{category.title}</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.assessments.map((assessment) => (
                  <div key={assessment.name} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all hover:border-purple-200 group cursor-pointer">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-700 transition-colors">{assessment.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{assessment.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-600 bg-purple-50 px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock size={12} /> {assessment.duration}
                      </span>
                      <ArrowRight size={18} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Integration Preview */}
      <section className="py-16 bg-gradient-to-br from-purple-900 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Brain className="mx-auto mb-4" size={48} />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Insights Coming Soon</h2>
          <p className="text-purple-200 max-w-2xl mx-auto mb-8">
            Our AI engine will provide personalized wellbeing insights, smart recommendations, emotional trend prediction, and personalized care journeys.
          </p>
          <Link href="/assessments" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 font-semibold rounded-full hover:bg-purple-50 transition-all">
            Start Your First Assessment <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
