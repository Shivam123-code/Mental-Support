import Image from "next/image";
import Link from "next/link";
import { Star, CheckCircle, Globe, Clock, Video, MessageCircle, ArrowRight } from "lucide-react";

const professionals = [
  {
    name: "Dr. Ananya Sharma",
    role: "Clinical Psychologist",
    specialization: "Anxiety, Depression, Trauma",
    experience: "12 years",
    languages: "English, Hindi",
    rating: 4.9,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop",
    available: true,
  },
  {
    name: "Rahul Mehta",
    role: "Counsellor",
    specialization: "Relationships, Career, Burnout",
    experience: "8 years",
    languages: "English, Hindi, Marathi",
    rating: 4.8,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop",
    available: true,
  },
  {
    name: "Dr. Priya Nair",
    role: "Psychologist",
    specialization: "Children, ADHD, Learning",
    experience: "15 years",
    languages: "English, Malayalam, Tamil",
    rating: 4.9,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop",
    available: false,
  },
  {
    name: "Kavita Desai",
    role: "Wellness Coach",
    specialization: "Stress, Mindfulness, Sleep",
    experience: "6 years",
    languages: "English, Hindi, Gujarati",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
    available: true,
  },
  {
    name: "Dr. Arun Patel",
    role: "Clinical Psychologist",
    specialization: "Addiction, Trauma, Crisis",
    experience: "18 years",
    languages: "English, Hindi, Bengali",
    rating: 4.9,
    reviews: 278,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop",
    available: true,
  },
  {
    name: "Sneha Iyer",
    role: "Mentor & EQ Coach",
    specialization: "Leadership, EQ, Communication",
    experience: "10 years",
    languages: "English, Tamil, Kannada",
    rating: 4.8,
    reviews: 201,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop",
    available: true,
  },
];

const categories = [
  { name: "Counsellors", count: "120+" },
  { name: "Psychologists", count: "85+" },
  { name: "Clinical Psychologists", count: "45+" },
  { name: "Coaches", count: "60+" },
  { name: "Mentors", count: "90+" },
  { name: "Wellness Experts", count: "50+" },
  { name: "Trainers", count: "35+" },
];

export default function Professionals() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 md:py-24 gradient-hero">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Find Your <span className="text-gradient">Perfect Match</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Connect with verified, experienced professionals who understand your unique needs. Every professional is carefully vetted and supervised.
              </p>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <span key={cat.name} className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 shadow-sm border border-gray-100">
                    {cat.name} <span className="text-purple-600 font-medium">({cat.count})</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=550&h=450&fit=crop"
                alt="Professional counselling session"
                width={550}
                height={450}
                className="rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Professionals Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-gradient">Professionals</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every professional is verified, qualified, and committed to your wellbeing.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((prof) => (
              <div key={prof.name} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={prof.image} alt={prof.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{prof.name}</h3>
                      <CheckCircle size={16} className="text-blue-500" />
                    </div>
                    <p className="text-sm text-purple-600">{prof.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium">{prof.rating}</span>
                      <span className="text-xs text-gray-400">({prof.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <p><span className="font-medium text-gray-800">Specialization:</span> {prof.specialization}</p>
                  <p className="flex items-center gap-1"><Globe size={14} /> {prof.languages}</p>
                  <p className="flex items-center gap-1"><Clock size={14} /> {prof.experience} experience</p>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                    <Video size={12} /> Video
                  </span>
                  <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                    <MessageCircle size={12} /> Chat
                  </span>
                  {prof.available && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Available Now
                    </span>
                  )}
                </div>
                <button className="w-full py-3 bg-purple-700 text-white font-medium rounded-full hover:bg-purple-800 transition-all text-sm">
                  Book Session
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/professionals" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-purple-700 text-purple-700 font-semibold rounded-full hover:bg-purple-50 transition-all">
              View All Professionals <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Verification Promise</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every professional on KleverKlues goes through a rigorous verification process.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Qualification Verified", desc: "Degrees and certifications validated" },
              { title: "Background Checked", desc: "Comprehensive background verification" },
              { title: "Clinically Supervised", desc: "Regular clinical supervision" },
              { title: "Continuously Monitored", desc: "Ongoing quality and feedback review" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 text-center">
                <CheckCircle className="mx-auto text-green-500 mb-3" size={32} />
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
