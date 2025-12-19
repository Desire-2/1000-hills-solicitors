'use client';

import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ServiceCard, StatsCard, TestimonialCard, FeatureCard, MetricCard, PresentationCard, HighlightBox } from '@/components/ui/Cards';
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  FileText, 
  Zap, 
  Shield, 
  Clock, 
  Award, 
  TrendingUp,
  Heart,
  Target,
  Scale,
  Building,
  Home as HomeIcon,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="main-content">
        {/* Hero Section - Enhanced */}
        <section className="hero-section relative bg-gradient-to-br from-1000-blue via-1000-blue/95 to-1000-charcoal text-white py-24 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-block mb-6">
              <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                ✨ Rwanda's Trusted Legal Partner Since 2010
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Building Bridges to <span className="text-1000-gold">Justice</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Expert legal services for individuals and businesses. Navigate complex legal challenges with confidence and clarity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button asChild size="lg" className="bg-white text-1000-blue hover:bg-gray-100 hover:scale-105 transition-all text-lg px-8 py-6 h-auto">
                <Link href="/submit-case">
                  Submit Your Case
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto">
                <Link href="/contact">Book Free Consultation</Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-1000-green" />
                <span>500+ Cases Resolved</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-1000-green" />
                <span>95% Success Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-1000-green" />
                <span>15+ Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Counter - Enhanced with Presentation Style */}
      <section className="bg-gradient-page py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-1000-charcoal">
              Our Track Record Speaks for Itself
            </h2>
            <p className="text-xl text-gray-600">
              Delivering excellence in legal services across Rwanda
            </p>
          </div>
          
          {/* New Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <MetricCard value="500+" label="Cases Handled Successfully" variant="blue" />
            <MetricCard value="95%" label="Client Success Rate" variant="green" />
            <MetricCard value="15+" label="Years of Experience" variant="gold" />
            <MetricCard value="24/7" label="Client Support Available" variant="blue" />
          </div>
          
          {/* Highlight Box */}
          <HighlightBox title="🎯 Our Mission">
            Building Bridges to Justice through innovative legal solutions and unwavering commitment to our clients' success.
          </HighlightBox>
        </div>
      </section>

      {/* Featured Services - Enhanced */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-1000-charcoal">
              Our <span className="text-gradient">Legal Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive legal solutions tailored to meet your unique needs with excellence and integrity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              icon={Building}
              title="Corporate Law"
              description="Expert guidance on business formation, contracts, compliance, and corporate governance for growing enterprises."
              href="/services#corporate"
              iconColor="text-1000-blue"
            />
            <ServiceCard
              icon={Scale}
              title="Litigation & Advocacy"
              description="Skilled representation in court proceedings with strategic planning and strong advocacy for your interests."
              href="/services#litigation"
              iconColor="text-1000-green"
            />
            <ServiceCard
              icon={Users}
              title="Mediation Services"
              description="Alternative dispute resolution and conflict management to achieve fair and lasting solutions."
              href="/services#mediation"
              iconColor="text-1000-gold"
            />
            <ServiceCard
              icon={HomeIcon}
              title="Property Law"
              description="Comprehensive real estate services including transactions, disputes, and land registration matters."
              href="/services#property"
              iconColor="text-1000-blue"
            />
            <ServiceCard
              icon={Heart}
              title="Family Law"
              description="Compassionate legal support for divorce, child custody, adoption, and family dispute matters."
              href="/services#family"
              iconColor="text-1000-green"
            />
            <ServiceCard
              icon={FileText}
              title="Legal Consultancy"
              description="Strategic legal advice, contract review, and compliance guidance for informed decision-making."
              href="/services#consultancy"
              iconColor="text-1000-gold"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced */}
      <section className="bg-1000-cream py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-1000-charcoal">
              Why Choose <span className="text-1000-blue">1000 Hills</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine legal expertise with genuine care for our clients' success and well-being.
            </p>
          </div>
          
          {/* Presentation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <PresentationCard
              title="Expert Legal Team"
              description="Highly qualified lawyers with specialized expertise in Rwandan law and international best practices."
            />
            <PresentationCard
              title="Results-Driven Approach"
              description="Strategic planning and execution focused on achieving the best possible outcomes for every client."
            />
            <PresentationCard
              title="Client-Centered Service"
              description="Personalized attention with transparent communication and genuine commitment to your success."
            />
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={Shield}
              title="Expert Legal Team"
              description="Highly qualified lawyers with specialized expertise in Rwandan law and international best practices."
              color="text-1000-blue"
            />
            <FeatureCard
              icon={Target}
              title="Results-Driven Approach"
              description="Strategic planning and execution focused on achieving the best possible outcomes for every client."
              color="text-1000-green"
            />
            <FeatureCard
              icon={Heart}
              title="Client-Centered Service"
              description="Personalized attention with transparent communication and genuine commitment to your success."
              color="text-1000-gold"
            />
            <FeatureCard
              icon={Zap}
              title="Swift & Efficient"
              description="Streamlined processes and timely responses to keep your legal matters moving forward."
              color="text-1000-blue"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-1000-charcoal">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients have to say.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="1000 Hills Solicitors handled my property dispute with professionalism and care. Their expertise made all the difference."
              author="Jean-Claude Mugabo"
              role="Business Owner, Kigali"
              rating={5}
            />
            <TestimonialCard
              quote="The team's dedication and attention to detail during our corporate merger was outstanding. Highly recommended!"
              author="Grace Uwimana"
              role="CEO, Tech Startup"
              rating={5}
            />
            <TestimonialCard
              quote="They provided excellent guidance through a difficult family matter. Compassionate, professional, and effective."
              author="Eric Nshimiyimana"
              role="Private Client"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="relative bg-gradient-to-r from-1000-blue to-1000-charcoal text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed">
            Submit your case today and let our expert team guide you through your legal journey with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-1000-blue hover:bg-gray-100 hover:scale-105 transition-all text-lg px-8 py-6 h-auto">
              <Link href="/submit-case">
                Submit Your Case Now
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
