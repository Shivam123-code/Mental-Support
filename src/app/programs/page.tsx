import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Users, Star, CheckCircle } from "lucide-react";

const programCategories = [
  {
    title: "Emotional Recovery",
    description: "Heal and rebuild your emotional foundation",
    programs: [
      { name: "Anxiety Reset", duration: "8 weeks", sessions: 16, image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=280&fit=crop", rating: 4.9 },
      { name: "Emotional Healing", duration: "12 weeks", sessions: 24, image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=280&fit=crop", rating: 4.8 },
      { name: "Burnout Recovery", duration: "6 weeks", sessions: 12, image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=280&fit=crop", rating: 4.9 },
      { name: "Confidence Rebuild", duration: "8 weeks", sessions: 16, image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=280&fit=crop", rating: 4.7 },
    ],
  },
  {
    title: "Relationships",
    description: "Strengthen bonds and heal connections",
    programs: [
      { name: "Couple Reconnection", duration: "10 weeks", sessions: 20, image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=280&fit=crop", rating: 4.8 },
      { name: "Marriage Wellbeing", duration: "12 weeks", sessions: 24, image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=280&fit=crop", rating: 4.9 },
      { name: "Parenting Confidence", duration: "8 weeks", sessions: 16, image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=280&fit=crop", rating: 4.8 },
    ],
  },
  {
    title: "Student Programs",
    description: "Academic success and emotional growth",
    programs: [
      { name: "Focus Improvement", duration: "4 weeks", sessions: 8, image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=280&fit=crop", rating: 4.7 },
      { name: "Exam Confidence", duration: "6 weeks", sessions: 12, image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=280&fit=crop", rating: 4.8 },
      { name: "Emotional Resilience", duration: "8 weeks", sessions: 16, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=280&fit=crop", rating: 4.9 },
    ],
  },
  {
    title: "Workplace Programs",
    description: "Thrive at work without burning out",
    programs: [
      { name: "Leadership Wellbeing", duration: "10 weeks", sessions: 20, image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=280&fit=crop", rating: 4.8 },
      { name: "Burnout Prevention", duration: "6 weeks", sessions: 12, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=280&fit=crop", rating: 4.9 },
      { name: "Workplace EQ", duration: "8 weeks", sessions: 16, image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=280&fit=crop", rating: 4.7 },
    ],
  },
  {
    title: "Lifestyle Wellness",
    description: "Build healthy habits for lasting wellbeing",
    programs: [
      { name: "Sleep Recovery", duration: "6 weeks", sessions: 12, image: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=400&h=280&fit=crop", rating: 4.9 },
      { name: "Mindfulness Journey", duration: "8 weeks", sessions: 16, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=280&fit=crop", rating: 4.8 },
      { name: "Emotional Fitness", duration: "12 weeks", sessions: 24, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=280&fit=crop", rating: 4.8 },
    ],
  },
];

export default function Programs() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-8 sm:py-12 md:py-16 lg:py-24 gradient-hero">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Guided Wellbeing <span className="text-gradient">Journeys</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 max-w-lg">
                Structured programs designed by experts to help you heal, grow, and build lasting emotional resilience. Step by step.
              </p>
              <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Expert-Designed
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-purple-600" />
                  Self-Paced
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-blue-600" />
                  Community Support
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1516534775068-ba3e7a1d2dad?w=550&h=450&fit=crop"
                alt="Personal growth journey"
                width={550}
                height={450}
                className="rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Program Categories */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          {programCategories.map((category) => (
            <div key={category.title} className="mb-12 sm:mb-16 md:mb-20">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{category.title}</h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">{category.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {category.programs.map((program) => (
                  <div key={program.name} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group cursor-pointer">
                    <div className="relative h-32 sm:h-40 md:h-44 overflow-hidden">
                      <Image
                        src={program.image}
                        alt={program.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 sm:p-4 md:p-5">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">{program.name}</h3>
                      <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1"><Clock size={14} /> {program.duration}</span>
                        <span>{program.sessions} sessions</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs sm:text-sm">
                          <Star size={14} className="text-amber-400 fill-amber-400" />
                          {program.rating}
                        </span>
                        <ArrowRight size={16} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-purple-50 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Not Sure Where to Start?</h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-6 sm:mb-8">Take a free assessment and we&apos;ll recommend the perfect program for you.</p>
          <Link href="/assessments" className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm bg-purple-700 text-white font-semibold rounded-full hover:bg-purple-800 transition-all">
            Take Free Assessment
          </Link>
        </div>
      </section>
    </div>
  );
}
