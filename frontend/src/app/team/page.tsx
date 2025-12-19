'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { TeamMemberCard } from '@/components/ui/Cards';
import { Button } from '@/components/ui/button';
import { Award, Users, Target, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Team() {
  const partners = [
    {
      name: 'Dr. Jean-Baptiste Nshimiyimana',
      role: 'Managing Partner',
      bio: 'Over 20 years of experience in corporate and commercial law. LLM from Harvard Law School.',
      email: 'jb.nshimiyimana@1000hills.rw',
      linkedin: '#'
    },
    {
      name: 'Advocate Marie Claire Uwera',
      role: 'Senior Partner - Litigation',
      bio: 'Specializes in commercial litigation and arbitration. Former judge at Kigali Commercial Court.',
      email: 'm.uwera@1000hills.rw',
      linkedin: '#'
    },
    {
      name: 'Emmanuel Mugisha',
      role: 'Partner - Property Law',
      bio: 'Expert in real estate transactions and land law. Over 15 years of experience.',
      email: 'e.mugisha@1000hills.rw',
      linkedin: '#'
    }
  ];

  const associates = [
    {
      name: 'Grace Mukamana',
      role: 'Senior Associate - Family Law',
      bio: 'Compassionate advocate specializing in family law and mediation services.',
      email: 'g.mukamana@1000hills.rw',
      linkedin: '#'
    },
    {
      name: 'Patrick Habimana',
      role: 'Associate - Corporate Law',
      bio: 'Advises on business transactions, mergers, and corporate governance.',
      email: 'p.habimana@1000hills.rw',
      linkedin: '#'
    },
    {
      name: 'Sarah Ingabire',
      role: 'Associate - Employment Law',
      bio: 'Focuses on employment contracts, workplace disputes, and HR compliance.',
      email: 's.ingabire@1000hills.rw',
      linkedin: '#'
    },
    {
      name: 'David Nsengiyumva',
      role: 'Junior Associate',
      bio: 'Recently qualified lawyer with focus on legal research and consultancy.',
      email: 'd.nsengiyumva@1000hills.rw',
      linkedin: '#'
    },
    {
      name: 'Aline Umutoni',
      role: 'Junior Associate',
      bio: 'Passionate about intellectual property and technology law.',
      email: 'a.umutoni@1000hills.rw',
      linkedin: '#'
    },
    {
      name: 'Eric Niyonzima',
      role: 'Paralegal',
      bio: 'Provides essential support in case preparation and legal documentation.',
      email: 'e.niyonzima@1000hills.rw',
      linkedin: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section bg-gradient-to-br from-1000-blue via-1000-blue/95 to-1000-charcoal text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Meet Our Team</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Experienced legal professionals dedicated to delivering excellence and achieving justice for our clients.
          </p>
        </div>
      </section>

      {/* Team Values */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-1000-charcoal">What Drives Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team is united by shared values and a commitment to excellence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-1000-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-1000-blue" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-1000-charcoal">Excellence</h3>
              <p className="text-gray-600 text-sm">Commitment to the highest standards of legal practice</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-1000-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-1000-green" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-1000-charcoal">Integrity</h3>
              <p className="text-gray-600 text-sm">Upholding ethical standards in everything we do</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-1000-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-1000-gold" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-1000-charcoal">Collaboration</h3>
              <p className="text-gray-600 text-sm">Working together to deliver the best outcomes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-1000-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-1000-blue" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-1000-charcoal">Results</h3>
              <p className="text-gray-600 text-sm">Focused on achieving measurable success</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-1000-charcoal">Our Partners</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leading legal minds with decades of combined experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partners.map((member) => (
              <TeamMemberCard key={member.email} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* Associates & Staff */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-1000-charcoal">Associates & Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Talented professionals supporting our clients with dedication and expertise.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {associates.map((member) => (
              <TeamMemberCard key={member.email} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="bg-gradient-to-r from-1000-blue to-1000-charcoal text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10">
            We're always looking for talented legal professionals to join our growing team.
          </p>
          <Button asChild size="lg" className="bg-white text-1000-blue hover:bg-gray-100 text-lg px-8 py-6 h-auto">
            <Link href="/careers">
              View Open Positions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
      </main>
    </div>
  );
}
