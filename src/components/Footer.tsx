import Link from "next/link";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            You&apos;re Not Alone.
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Take the first step towards emotional wellbeing. We&apos;re here for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/assessments" className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-full hover:bg-purple-50 transition-all">
              Start Assessment
            </Link>
            <Link href="/community" className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-full hover:bg-purple-400 transition-all">
              Join Community
            </Link>
            <Link href="/professionals" className="px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all">
              Book Session
            </Link>
            <Link href="/sos" className="px-6 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-all">
              SOS
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">KleverKlues</h3>
            <p className="text-gray-400 mb-4 max-w-sm">
              The World&apos;s Most Trusted Human Wellbeing & Emotional Support Ecosystem. Built for humanity.
            </p>
            <p className="text-sm text-gray-500 italic">&ldquo;Humanity, Connected.&rdquo;</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/get-support" className="hover:text-purple-400 transition-colors">Get Support</Link></li>
              <li><Link href="/assessments" className="hover:text-purple-400 transition-colors">Assessments</Link></li>
              <li><Link href="/programs" className="hover:text-purple-400 transition-colors">Programs</Link></li>
              <li><Link href="/professionals" className="hover:text-purple-400 transition-colors">Find Professional</Link></li>
              <li><Link href="/sos" className="hover:text-purple-400 transition-colors">Crisis Support</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/community" className="hover:text-purple-400 transition-colors">Community</Link></li>
              <li><Link href="/enterprise" className="hover:text-purple-400 transition-colors">Enterprise</Link></li>
              <li><Link href="/academy" className="hover:text-purple-400 transition-colors">Academy</Link></li>
              <li><Link href="/resources" className="hover:text-purple-400 transition-colors">Resources</Link></li>
              <li><Link href="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
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
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; 2025 KleverKlues&trade;. All rights reserved. Better Humans. Better World.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
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
