import Link from 'next/link';
import { Scale, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-1000-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-1000-blue rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">1000 Hills</span>
                <span className="text-xs text-gray-400">Solicitors</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Building bridges to justice. Trusted legal services in Rwanda since 2010.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-1000-blue transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-1000-blue transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-1000-blue transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-1000-blue transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-1000-gold">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Our Services</Link></li>
              <li><Link href="/team" className="hover:text-white transition-colors">Our Team</Link></li>
              <li><Link href="/insights" className="hover:text-white transition-colors">Legal Insights</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold mb-4 text-1000-gold">Practice Areas</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/services#corporate" className="hover:text-white transition-colors">Corporate Law</Link></li>
              <li><Link href="/services#litigation" className="hover:text-white transition-colors">Litigation</Link></li>
              <li><Link href="/services#mediation" className="hover:text-white transition-colors">Mediation</Link></li>
              <li><Link href="/services#family" className="hover:text-white transition-colors">Family Law</Link></li>
              <li><Link href="/services#property" className="hover:text-white transition-colors">Property Law</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-1000-gold">Contact Us</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>KN 3 Ave, Kigali, Rwanda</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+250788123456" className="hover:text-white transition-colors">+250 788 123 456</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@1000hills.rw" className="hover:text-white transition-colors">info@1000hills.rw</a>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-gray-500">Office Hours:</p>
              <p className="text-sm text-gray-400">Mon - Fri: 8:00 AM - 6:00 PM</p>
              <p className="text-sm text-gray-400">Sat: 9:00 AM - 1:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} 1000 Hills Solicitors. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
