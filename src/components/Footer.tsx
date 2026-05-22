import Link from "next/link";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 overflow-x-hidden">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-600 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            You&apos;re Not Alone.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-purple-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Take the first step towards emotional wellbeing. We&apos;re here for you.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <Link href="/assessments" className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm bg-white text-purple-700 font-semibold rounded-full hover:bg-purple-50 transition-all">
              Start Assessment
            </Link>
            <Link href="/community" className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm bg-purple-500 text-white font-semibold rounded-full hover:bg-purple-400 transition-all">
              Join Community
            </Link>
            <Link href="/professionals" className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all">
              Book Session
            </Link>
            <Link href="/sos" className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-all">
              SOS
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">KleverKlues</h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-400 mb-3 sm:mb-4 max-w-sm">
              The World&apos;s Most Trusted Human Wellbeing & Emotional Support Ecosystem. Built for humanity.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 italic">&ldquo;Humanity, Connected.&rdquo;</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Support</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/get-support" className="hover:text-purple-400 transition-colors">Get Support</Link></li>
              <li><Link href="/assessments" className="hover:text-purple-400 transition-colors">Assessments</Link></li>
              <li><Link href="/programs" className="hover:text-purple-400 transition-colors">Programs</Link></li>
              <li><Link href="/professionals" className="hover:text-purple-400 transition-colors">Find Professional</Link></li>
              <li><Link href="/sos" className="hover:text-purple-400 transition-colors">Crisis Support</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Platform</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/community" className="hover:text-purple-400 transition-colors">Community</Link></li>
              <li><Link href="/enterprise" className="hover:text-purple-400 transition-colors">Enterprise</Link></li>
              <li><Link href="/academy" className="hover:text-purple-400 transition-colors">Academy</Link></li>
              <li><Link href="/resources" className="hover:text-purple-400 transition-colors">Resources</Link></li>
              <li><Link href="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Contact</h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-purple-400" />
                <span>support@kleverklues.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-purple-400" />
                <span>+91-XXXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-purple-400" />
                <span>India (Global)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-gray-500">
            &copy; 2025 KleverKlues&trade;. All rights reserved. Better Humans. Better World.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Trust Center</span>
            <span>Safety Standards</span>
          </div>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            Made with <Heart size={12} className="text-red-400" /> for Humanity
          </p>
        </div>
      </div>
    </footer>
  );
}
