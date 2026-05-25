import Image from "next/image";
import Link from "next/link";
import { Star, CheckCircle, Globe, Clock, Video, MessageCircle, ArrowRight } from "lucide-react";
import SafetyDisclaimer from "@/components/SafetyDisclaimer";

const professionals = [
  { name: "Dr. Ananya Sharma", role: "Clinical Psychologist", specialization: "Anxiety, Depression, Trauma", experience: "12 years", languages: "English, Hindi", rating: 4.9, reviews: 234, image: "/images/prof-dr-ananya.png", available: true },
  { name: "Rahul Mehta", role: "Counsellor", specialization: "Relationships, Career, Burnout", experience: "8 years", languages: "English, Hindi, Marathi", rating: 4.8, reviews: 189, image: "/images/prof-rahul.png", available: true },
  { name: "Dr. Priya Nair", role: "Psychologist", specialization: "Children, ADHD, Learning", experience: "15 years", languages: "English, Malayalam, Tamil", rating: 4.9, reviews: 312, image: "/images/prof-dr-ananya.png", available: false },
  { name: "Kavita Desai", role: "Wellness Coach", specialization: "Stress, Mindfulness, Sleep", experience: "6 years", languages: "English, Hindi, Gujarati", rating: 4.7, reviews: 156, image: "/images/prof-kavita.png", available: true },
  { name: "Dr. Arun Patel", role: "Clinical Psychologist", specialization: "Addiction, Trauma, Crisis", experience: "18 years", languages: "English, Hindi, Bengali", rating: 4.9, reviews: 278, image: "/images/prof-rahul.png", available: true },
  { name: "Sneha Iyer", role: "Mentor & EQ Coach", specialization: "Leadership, EQ, Communication", experience: "10 years", languages: "English, Tamil, Kannada", rating: 4.8, reviews: 201, image: "/images/prof-kavita.png", available: true },
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
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="absolute top-10 right-[8%] w-[280px] h-[280px] border border-[var(--primary-bright)]/8 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-display-xl text-[var(--on-surface)] mb-6">
                Find Your <span className="text-gradient">Perfect Match</span>
              </h1>
              <p className="text-body-lg text-[var(--on-surface-variant)] mb-10 max-w-lg">
                Connect with verified, experienced professionals who understand your unique needs.
              </p>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <span key={cat.name} className="chip">
                    {cat.name} <span className="opacity-60">({cat.count})</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="/images/therapist-session.png"
                alt="Professional counselling session"
                width={550}
                height={450}
                className="rounded-xl shadow-ambient"
              />
            </div>
          </div>
        </div>
      </section>


      {/* Professionals Grid */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Our Professionals</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Every professional is verified, qualified, and committed to your wellbeing.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((prof) => (
              <div key={prof.name} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start gap-4 mb-5">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-[var(--primary-fixed)]">
                    <Image src={prof.image} alt={prof.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[var(--on-surface)] text-sm truncate">{prof.name}</h3>
                      <CheckCircle size={14} className="text-[var(--primary-bright)] flex-shrink-0" />
                    </div>
                    <p className="text-xs text-[var(--primary)]">{prof.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={12} className="text-[var(--tertiary-bright)] fill-[var(--tertiary-bright)]" />
                      <span className="text-xs font-medium text-[var(--on-surface)]">{prof.rating}</span>
                      <span className="text-xs text-[var(--on-surface-variant)]">({prof.reviews})</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-5 text-sm text-[var(--on-surface-variant)]">
                  <p><span className="font-medium text-[var(--on-surface)]">Specialization:</span> {prof.specialization}</p>
                  <p className="flex items-center gap-1.5"><Globe size={13} /> {prof.languages}</p>
                  <p className="flex items-center gap-1.5"><Clock size={13} /> {prof.experience}</p>
                </div>
                <div className="flex items-center gap-2 mb-5">
                  <span className="chip !py-1 !px-2.5 text-xs"><Video size={11} /> Video</span>
                  <span className="chip !py-1 !px-2.5 text-xs !bg-[var(--secondary-fixed)]/30 !text-[var(--secondary)]"><MessageCircle size={11} /> Chat</span>
                  {prof.available && <span className="text-xs bg-[var(--primary-fixed)] text-[var(--primary)] px-2.5 py-1 rounded-full font-medium">Available</span>}
                </div>
                <Link href="/book-session" className="block w-full btn-primary !py-3 text-sm text-center">Book Session</Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/professionals" className="btn-secondary inline-flex items-center gap-2">
              View All Professionals <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>


      {/* Verification Process */}
      <section className="section-gap bg-[var(--surface-container)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-headline-md text-[var(--on-surface)] mb-4">Our Verification Promise</h2>
            <p className="text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Every professional on KleverKlues&trade; goes through a rigorous verification process.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Qualification Verified", desc: "Degrees and certifications validated" },
              { title: "Background Checked", desc: "Comprehensive background verification" },
              { title: "Clinically Supervised", desc: "Regular clinical supervision" },
              { title: "Continuously Monitored", desc: "Ongoing quality and feedback review" },
            ].map((item) => (
              <div key={item.title} className="card text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
                  <CheckCircle className="text-[var(--primary)]" size={22} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Disclaimer */}
      <section className="py-6 sm:py-8 bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <SafetyDisclaimer />
        </div>
      </section>
    </div>
  );
}