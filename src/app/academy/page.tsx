import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Award, Clock, Users, Star, ArrowRight, CheckCircle, BookOpen } from "lucide-react";

const trainingCategories = [
  {
    title: "Professional Certifications",
    description: "Become a certified wellbeing professional",
    courses: [
      { name: "Certified Counsellor Training", duration: "6 months", level: "Professional", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=280&fit=crop", price: "₹49,999" },
      { name: "EQ Expert Certification", duration: "3 months", level: "Advanced", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=280&fit=crop", price: "₹29,999" },
      { name: "Emotional Wellbeing Facilitator", duration: "4 months", level: "Intermediate", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=280&fit=crop", price: "₹34,999" },
      { name: "Mindfulness Trainer", duration: "3 months", level: "Professional", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=280&fit=crop", price: "₹24,999" },
    ],
  },
  {
    title: "Parenting & Child Programs",
    description: "Build confident, emotionally intelligent children",
    courses: [
      { name: "Parenting Mastery Workshop", duration: "8 weeks", level: "All Levels", image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=280&fit=crop", price: "₹9,999" },
      { name: "Child Emotional Intelligence", duration: "6 weeks", level: "Parents", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=280&fit=crop", price: "₹7,999" },
    ],
  },
  {
    title: "Student Skill Programs",
    description: "Build essential life skills for academic success",
    courses: [
      { name: "Focus Enhancement", duration: "4 weeks", level: "Students", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=280&fit=crop", price: "₹4,999" },
      { name: "Communication Skills Mastery", duration: "6 weeks", level: "Students", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=280&fit=crop", price: "₹5,999" },
      { name: "Confidence Building Lab", duration: "4 weeks", level: "Students", image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=280&fit=crop", price: "₹4,499" },
    ],
  },
  {
    title: "Corporate Training",
    description: "Wellbeing training for organizational leaders",
    courses: [
      { name: "Leadership EQ Program", duration: "8 weeks", level: "Leaders", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=280&fit=crop", price: "₹19,999" },
      { name: "Workforce Resilience Training", duration: "6 weeks", level: "Teams", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=280&fit=crop", price: "₹14,999" },
      { name: "Stress Management for Managers", duration: "4 weeks", level: "Managers", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=280&fit=crop", price: "₹12,999" },
    ],
  },
];

export default function Academy() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 md:py-24 gradient-hero">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
                <GraduationCap size={16} />
                KleverKlues Academy
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Learn. Grow. <span className="text-gradient">Certify.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Professional certifications, skill programs, and wellness training designed to help you grow and help others grow.
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-amber-500" />
                  Certified Programs
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-purple-600" />
                  Expert Instructors
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-blue-600" />
                  Community Learning
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=550&h=450&fit=crop"
                alt="Academy learning"
                width={550}
                height={450}
                className="rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          {trainingCategories.map((category) => (
            <div key={category.title} className="mb-20">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{category.title}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.courses.map((course) => (
                  <div key={course.name} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group cursor-pointer">
                    <div className="relative h-44 overflow-hidden">
                      <Image src={course.image} alt={course.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-purple-700">
                        {course.level}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">{course.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-700">{course.price}</span>
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

      {/* Why Academy */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Why KleverKlues Academy?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: "Industry Recognized", desc: "Certifications valued by employers" },
              { icon: Star, title: "Expert Faculty", desc: "Learn from top practitioners" },
              { icon: Users, title: "Community Support", desc: "Learn alongside peers" },
              { icon: CheckCircle, title: "Earn While Learning", desc: "Start earning as you certify" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6">
                <item.icon className="mx-auto text-purple-600 mb-3" size={32} />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
