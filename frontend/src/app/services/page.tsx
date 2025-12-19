'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ServiceCard } from '@/components/ui/Cards';
import { 
  Building, 
  Scale, 
  Users, 
  Home as HomeIcon, 
  Heart, 
  FileText,
  Briefcase,
  Globe,
  Shield,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Services() {
  const services = [
    {
      id: 'corporate',
      icon: Building,
      title: 'Corporate Law',
      description: 'Comprehensive legal support for businesses of all sizes, from startups to established corporations.',
      features: [
        'Business formation and structuring',
        'Contract drafting and negotiation',
        'Mergers and acquisitions',
        'Corporate governance',
        'Compliance and regulatory matters',
        'Commercial transactions'
      ],
      color: 'text-1000-blue'
    },
    {
      id: 'litigation',
      icon: Scale,
      title: 'Litigation & Advocacy',
      description: 'Experienced trial lawyers providing strong representation in court and tribunal proceedings.',
      features: [
        'Civil litigation',
        'Commercial disputes',
        'Employment tribunals',
        'Appellate advocacy',
        'Arbitration proceedings',
        'Legal representation'
      ],
      color: 'text-1000-green'
    },
    {
      id: 'mediation',
      icon: Users,
      title: 'Mediation & ADR',
      description: 'Alternative dispute resolution services to achieve fair and lasting solutions outside of court.',
      features: [
        'Commercial mediation',
        'Family mediation',
        'Workplace disputes',
        'Negotiation services',
        'Conflict resolution',
        'Settlement agreements'
      ],
      color: 'text-1000-gold'
    },
    {
      id: 'property',
      icon: HomeIcon,
      title: 'Property Law',
      description: 'Complete real estate legal services for residential and commercial property matters.',
      features: [
        'Property transactions',
        'Land registration',
        'Title searches',
        'Lease agreements',
        'Property disputes',
        'Real estate development'
      ],
      color: 'text-1000-blue'
    },
    {
      id: 'family',
      icon: Heart,
      title: 'Family Law',
      description: 'Compassionate and sensitive legal support for family-related legal matters.',
      features: [
        'Divorce proceedings',
        'Child custody and support',
        'Adoption services',
        'Prenuptial agreements',
        'Estate planning',
        'Guardianship matters'
      ],
      color: 'text-1000-green'
    },
    {
      id: 'consultancy',
      icon: FileText,
      title: 'Legal Consultancy',
      description: 'Strategic legal advice and guidance for informed decision-making and risk management.',
      features: [
        'Legal opinions',
        'Contract review',
        'Compliance advisory',
        'Risk assessment',
        'Due diligence',
        'Regulatory guidance'
      ],
      color: 'text-1000-gold'
    },
    {
      id: 'employment',
      icon: Briefcase,
      title: 'Employment Law',
      description: 'Comprehensive employment law services for employers and employees.',
      features: [
        'Employment contracts',
        'Workplace policies',
        'Dismissal and redundancy',
        'Discrimination claims',
        'HR compliance',
        'Employee benefits'
      ],
      color: 'text-1000-blue'
    },
    {
      id: 'intellectual',
      icon: Shield,
      title: 'Intellectual Property',
      description: 'Protection and enforcement of intellectual property rights for creators and businesses.',
      features: [
        'Trademark registration',
        'Copyright protection',
        'Patent applications',
        'IP licensing',
        'Infringement claims',
        'Brand protection'
      ],
      color: 'text-1000-green'
    },
    {
      id: 'international',
      icon: Globe,
      title: 'International Law',
      description: 'Cross-border legal services and international commercial transactions.',
      features: [
        'International contracts',
        'Cross-border transactions',
        'Foreign investment',
        'Trade agreements',
        'Immigration law',
        'International arbitration'
      ],
      color: 'text-1000-gold'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section bg-gradient-to-br from-1000-blue via-1000-blue/95 to-1000-charcoal text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Legal Services</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Comprehensive legal solutions tailored to your unique needs. Excellence delivered with integrity.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.title}
                description={service.description}
                href={`#${service.id}`}
                iconColor={service.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-20">
          {services.map((service, index) => {
            const ServiceIcon = service.icon;
            return (
              <div key={service.id} id={service.id} className="scroll-mt-24">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${service.color.replace('text-', 'bg-')}/10 rounded-2xl mb-6`}>
                      <ServiceIcon className={`w-8 h-8 ${service.color}`} />
                    </div>
                    <h2 className="text-4xl font-bold mb-4 text-1000-charcoal">{service.title}</h2>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                    <Button asChild className="bg-1000-blue hover:bg-1000-blue/90">
                      <Link href="/submit-case">
                        Request This Service
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div className={`bg-white rounded-2xl p-8 shadow-lg ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <h3 className="text-xl font-bold mb-6 text-1000-charcoal">What We Offer:</h3>
                    <ul className="space-y-4">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className={`w-6 h-6 ${service.color.replace('text-', 'bg-')}/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}>
                            <div className={`w-2 h-2 ${service.color.replace('text-', 'bg-')} rounded-full`}></div>
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-1000-blue to-1000-charcoal text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Need Legal Assistance?</h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10">
            Let's discuss how we can help you navigate your legal challenges with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-1000-blue hover:bg-gray-100 text-lg px-8 py-6 h-auto">
              <Link href="/submit-case">
                Submit Your Case
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto">
              <Link href="/contact">Schedule Consultation</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      </main>
    </div>
  );
}
