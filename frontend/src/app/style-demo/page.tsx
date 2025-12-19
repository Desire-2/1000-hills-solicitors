'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  MetricCard, 
  PresentationCard, 
  HighlightBox, 
  FeatureCard,
  ServiceCard,
  TestimonialCard 
} from '@/components/ui/Cards';
import { Shield, Target, Zap, Scale, Users, Building } from 'lucide-react';

export default function StyleDemo() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-16 bg-gradient-blue text-white py-16 rounded-lg">
            <h1 className="text-5xl font-bold mb-4">Presentation Style Demo</h1>
            <p className="text-xl opacity-90">
              Showcasing all the new presentation.html-inspired components
            </p>
          </div>

          {/* Metric Cards Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-6 text-1000-charcoal border-b-3 border-1000-green pb-4">
              Metric Cards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard value="500+" label="Cases Handled Successfully" variant="blue" />
              <MetricCard value="95%" label="Client Success Rate" variant="green" />
              <MetricCard value="15+" label="Years of Experience" variant="gold" />
              <MetricCard value="24/7" label="Client Support Available" variant="blue" />
            </div>
          </section>

          {/* Presentation Cards Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-6 text-1000-charcoal border-b-3 border-1000-green pb-4">
              Presentation Cards (Hover to see effect)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </section>

          {/* Feature Cards Section */}
          <section className="mb-20 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-1000-charcoal border-b-3 border-1000-green pb-4">
              Feature Cards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard
                icon={Shield}
                title="Expert Legal Team"
                description="Highly qualified lawyers with specialized expertise in Rwandan law."
                color="text-1000-blue"
              />
              <FeatureCard
                icon={Target}
                title="Results-Driven Approach"
                description="Strategic planning and execution focused on achieving outcomes."
                color="text-1000-green"
              />
              <FeatureCard
                icon={Zap}
                title="Swift & Efficient"
                description="Streamlined processes and timely responses to keep matters moving."
                color="text-1000-gold"
              />
              <FeatureCard
                icon={Users}
                title="Client-Centered Service"
                description="Personalized attention with transparent communication."
                color="text-1000-blue"
              />
            </div>
          </section>

          {/* Highlight Boxes Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-6 text-1000-charcoal border-b-3 border-1000-green pb-4">
              Highlight Boxes
            </h2>
            <div className="space-y-6">
              <HighlightBox title="🎯 Our Mission">
                Building Bridges to Justice through innovative legal solutions and unwavering commitment to our clients' success.
              </HighlightBox>
              <HighlightBox title="⚖️ Important Note">
                All legal consultations are confidential and protected under attorney-client privilege. We are committed to maintaining the highest standards of professional ethics.
              </HighlightBox>
              <HighlightBox>
                <strong className="text-amber-900">Pro Tip:</strong> Schedule your consultation early to ensure availability during peak legal seasons.
              </HighlightBox>
            </div>
          </section>

          {/* Service Cards Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-6 text-1000-charcoal border-b-3 border-1000-green pb-4">
              Service Cards (Existing Enhanced Style)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ServiceCard
                icon={Building}
                title="Corporate Law"
                description="Expert guidance on business formation, contracts, and corporate governance."
                href="/services#corporate"
                iconColor="text-1000-blue"
              />
              <ServiceCard
                icon={Scale}
                title="Litigation"
                description="Skilled representation in court proceedings with strategic planning."
                href="/services#litigation"
                iconColor="text-1000-green"
              />
              <ServiceCard
                icon={Users}
                title="Mediation"
                description="Alternative dispute resolution for fair and lasting solutions."
                href="/services#mediation"
                iconColor="text-1000-gold"
              />
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-6 text-1000-charcoal border-b-3 border-1000-green pb-4">
              Testimonial Cards (Existing Style)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TestimonialCard
                quote="Outstanding legal service! They handled our corporate matter with professionalism and expertise."
                author="Jean Baptiste Uwamahoro"
                role="CEO, Tech Innovations Ltd"
                rating={5}
              />
              <TestimonialCard
                quote="Compassionate and effective representation. Highly recommended for family law matters."
                author="Marie Claire Mukamana"
                role="Private Client"
                rating={5}
              />
            </div>
          </section>

          {/* Gradient Backgrounds Demo */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-6 text-1000-charcoal border-b-3 border-1000-green pb-4">
              Gradient Backgrounds
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-blue text-white p-8 rounded-lg text-center shadow-blue">
                <h3 className="text-2xl font-bold mb-2">Blue Gradient</h3>
                <p>Primary brand gradient</p>
              </div>
              <div className="bg-gradient-green text-white p-8 rounded-lg text-center shadow-green">
                <h3 className="text-2xl font-bold mb-2">Green Gradient</h3>
                <p>Success/growth gradient</p>
              </div>
              <div className="bg-gradient-gold text-white p-8 rounded-lg text-center shadow-gold">
                <h3 className="text-2xl font-bold mb-2">Gold Gradient</h3>
                <p>Premium/accent gradient</p>
              </div>
            </div>
          </section>

          {/* Color Palette */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-6 text-1000-charcoal border-b-3 border-1000-green pb-4">
              Brand Color Palette
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="bg-1000-blue h-24 rounded-lg mb-2 shadow-card"></div>
                <p className="text-sm font-medium">1000 Blue</p>
                <p className="text-xs text-gray-500">#1E40AF</p>
              </div>
              <div className="text-center">
                <div className="bg-1000-charcoal h-24 rounded-lg mb-2 shadow-card"></div>
                <p className="text-sm font-medium">1000 Charcoal</p>
                <p className="text-xs text-gray-500">#1F2937</p>
              </div>
              <div className="text-center">
                <div className="bg-1000-green h-24 rounded-lg mb-2 shadow-card"></div>
                <p className="text-sm font-medium">1000 Green</p>
                <p className="text-xs text-gray-500">#10B981</p>
              </div>
              <div className="text-center">
                <div className="bg-1000-gold h-24 rounded-lg mb-2 shadow-card"></div>
                <p className="text-sm font-medium">1000 Gold</p>
                <p className="text-xs text-gray-500">#F59E0B</p>
              </div>
              <div className="text-center">
                <div className="bg-1000-cream h-24 rounded-lg mb-2 shadow-card border border-gray-200"></div>
                <p className="text-sm font-medium">1000 Cream</p>
                <p className="text-xs text-gray-500">Light bg</p>
              </div>
            </div>
          </section>

          {/* Shadows Demo */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-6 text-1000-charcoal border-b-3 border-1000-green pb-4">
              Custom Shadows
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-lg shadow-blue">
                <p className="font-medium text-center">Blue Shadow</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-green">
                <p className="font-medium text-center">Green Shadow</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-gold">
                <p className="font-medium text-center">Gold Shadow</p>
              </div>
            </div>
          </section>

          {/* Animations Demo */}
          <section className="mb-20 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-1000-charcoal border-b-3 border-1000-green pb-4">
              Animations (Refresh page to see)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-lg shadow-card animate-fade-in">
                <p className="font-medium text-center">Fade In</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-card animate-slide-up">
                <p className="font-medium text-center">Slide Up</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-card animate-scale-in">
                <p className="font-medium text-center">Scale In</p>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
