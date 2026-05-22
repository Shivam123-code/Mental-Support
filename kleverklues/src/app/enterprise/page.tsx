import Image from "next/image";
import Link from "next/link";
import { Building2, GraduationCap, Heart, Shield, TrendingUp, Users, ArrowRight, CheckCircle, BarChart3 } from "lucide-react";

const sectors = [
  { name: "Corporates", icon: Building2, desc: "Employee wellness & burnout prevention" },
  { name: "Healthcare", icon: Heart, desc: "Staff resilience & emotional support" },
  { name: "Schools", icon: GraduationCap, desc: "Student & teacher wellbeing" },
  { name: "Universities", icon: GraduationCap, desc: "Campus mental wellness programs" },
  { name: "Manufacturing", icon: Building2, desc: "Worker safety & emotional health" },
  { name: "Government", icon: Shield, desc: "Public sector wellness initiatives" },
];

const features = [
  { title: "Employee Assistance Program (EAP)", desc: "Comprehensive emotional support for your entire workforce with anonymous access", icon: Users },
  { title: "Burnout Analytics", desc: "Real-time burnout risk detection and prevention with AI-powered insights", icon: BarChart3 },
  { title: "Workforce Wellbeing Dashboards", desc: "Track engagement, wellness trends, and emotional health metrics", icon: TrendingUp },
  { title: "Leadership Support", desc: "Specialized coaching and support for leaders and managers", icon: Building2 },
  { title: "Anonymous Emotional Support", desc: "Employees can access help without fear of judgment or exposure", icon: Shield },
  { title: "Workshops & Programs", desc: "Customized wellness workshops, training sessions, and team programs", icon: GraduationCap },
];

const stats = [
  { value: "43%", label: "Reduction in Burnout" },
  { value: "67%", label: "Improved Engagement" },
  { value: "89%", label: "User Satisfaction" },
  { value: "3.5x", label: "ROI on Wellness" },
];

export default function Enterprise() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-purple-200 rounded-full text-sm font-medium mb-6">
                <Building2 size={16} />
                Enterprise Solutions
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Build Emotionally <span className="text-purple-300">Resilient</span> Teams
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg">
                Reduce burnout. Improve workforce wellbeing. Increase productivity. Build emotionally resilient organizations with KleverKlues Enterprise.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/enterprise" className="px-8 py-4 bg-white text-purple-700 font-semibold rounded-full hover:bg-purple-50 transition-all">
                  Schedule Demo
                </Link>
                <Link href="/enterprise" className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all">
                  Download Brochure
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=550&h=450&fit=crop"
                alt="Enterprise team wellness"
                width={550}
                height={450}
                className="rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold text-purple-700">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Serving Every <span className="text-gradient">Sector</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tailored wellbeing solutions for organizations of every size and sector.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector) => (
              <div key={sector.name} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all hover:border-purple-200">
                <sector.icon className="text-purple-600 mb-4" size={32} />
                <h3 className="font-semibold text-lg mb-2">{sector.name}</h3>
                <p className="text-gray-600 text-sm">{sector.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise <span className="text-gradient">Features</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all">
                <feature.icon className="text-purple-600 mb-4" size={28} />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Enterprise <span className="text-gradient">Dashboard</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Get real-time insights into your organization&apos;s emotional health with our comprehensive analytics dashboard.
              </p>
              <ul className="space-y-4">
                {["Utilization trends", "Burnout indicators", "Emotional wellness analytics", "Engagement metrics", "Risk insights & alerts"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/enterprise" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-purple-700 text-white font-semibold rounded-full hover:bg-purple-800 transition-all">
                Request Demo <ArrowRight size={18} />
              </Link>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=450&fit=crop"
                alt="Analytics dashboard"
                width={600}
                height={450}
                className="rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
