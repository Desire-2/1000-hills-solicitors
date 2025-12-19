'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Clock, DollarSign, ArrowRight, Users, TrendingUp, Heart, Award } from 'lucide-react';
import Link from 'next/link';

export default function Careers() {
  const openings = [
    {
      title: 'Senior Associate - Corporate Law',
      department: 'Corporate',
      location: 'Kigali, Rwanda',
      type: 'Full-time',
      salary: 'Competitive',
      experience: '5-7 years',
      description: 'We are seeking an experienced corporate lawyer to join our growing team and handle complex commercial transactions.'
    },
    {
      title: 'Junior Associate - Litigation',
      department: 'Litigation',
      location: 'Kigali, Rwanda',
      type: 'Full-time',
      salary: 'Competitive',
      experience: '1-3 years',
      description: 'Join our litigation team to support senior advocates in court proceedings and legal research.'
    },
    {
      title: 'Paralegal',
      department: 'General Practice',
      location: 'Kigali, Rwanda',
      type: 'Full-time',
      salary: 'Competitive',
      experience: '2-4 years',
      description: 'Provide essential support across multiple practice areas including legal research, document preparation, and client communication.'
    },
    {
      title: 'Legal Secretary',
      department: 'Administration',
      location: 'Kigali, Rwanda',
      type: 'Full-time',
      salary: 'Competitive',
      experience: '1-2 years',
      description: 'Support our legal team with administrative tasks, scheduling, and client coordination.'
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Compensation',
      description: 'Industry-leading salaries with performance bonuses and comprehensive benefits package.',
      color: 'text-1000-blue'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Clear career progression paths with mentorship programs and continuous professional development.',
      color: 'text-1000-green'
    },
    {
      icon: Heart,
      title: 'Work-Life Balance',
      description: 'Flexible working arrangements, generous leave policies, and wellness programs.',
      color: 'text-1000-gold'
    },
    {
      icon: Award,
      title: 'Learning & Development',
      description: 'Access to training courses, legal conferences, and advanced certifications.',
      color: 'text-1000-blue'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section bg-gradient-to-br from-1000-blue via-1000-blue/95 to-1000-charcoal text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Build your legal career with Rwanda's leading law firm
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-1000-charcoal">
              Why Choose <span className="text-1000-blue">1000 Hills</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join a team that values excellence, integrity, and professional growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${benefit.color.replace('text-', 'bg-')}/10 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${benefit.color}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-1000-charcoal">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-1000-blue mb-2">20+</div>
              <p className="text-gray-600 font-medium">Team Members</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-1000-green mb-2">15+</div>
              <p className="text-gray-600 font-medium">Years in Business</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-1000-gold mb-2">95%</div>
              <p className="text-gray-600 font-medium">Employee Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-1000-charcoal">Open Positions</h2>
            <p className="text-xl text-gray-600">Explore exciting opportunities to grow your legal career</p>
          </div>

          <div className="space-y-6">
            {openings.map((job, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all card-hover border-l-4 border-1000-blue">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-1000-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-1000-blue" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-1000-charcoal mb-2">{job.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{job.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 ml-16">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{job.experience} experience</span>
                      </div>
                    </div>
                  </div>

                  <Button className="bg-1000-blue hover:bg-1000-blue/90 lg:flex-shrink-0">
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-1000-charcoal">Our Hiring Process</h2>
            <p className="text-xl text-gray-600">A transparent and efficient recruitment process</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Submit Application', description: 'Send your CV and cover letter through our online portal' },
              { step: '02', title: 'Initial Review', description: 'Our HR team reviews your application within 5 business days' },
              { step: '03', title: 'Interview', description: 'Participate in interviews with our legal team and management' },
              { step: '04', title: 'Offer & Onboarding', description: 'Receive your offer and join our team with comprehensive onboarding' }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-1000-blue to-1000-green"></div>
                )}
                <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-1000-blue to-1000-green text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2 text-1000-charcoal">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-1000-blue to-1000-charcoal text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Don't See Your Role?</h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10">
            We're always interested in hearing from talented legal professionals. Send us your CV and let's talk.
          </p>
          <Button asChild size="lg" className="bg-white text-1000-blue hover:bg-gray-100 text-lg px-8 py-6 h-auto">
            <Link href="/contact">
              Send General Application
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
