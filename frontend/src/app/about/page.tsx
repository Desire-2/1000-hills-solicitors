'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FeatureCard, StatsCard } from '@/components/ui/Cards';
import { Award, Users, Target, Heart, Shield, Scale, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section bg-gradient-to-br from-1000-blue via-1000-blue/95 to-1000-charcoal text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About 1000 Hills Solicitors</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Building bridges to justice in Rwanda since 2010
          </p>
        </div>
      </section>

      {/* Firm History */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-1000-charcoal">Our Story</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded in 2010, 1000 Hills Solicitors emerged from a vision to provide exceptional legal services 
                to the people of Rwanda. Our name reflects the country's natural beauty and our commitment to building 
                bridges across the legal landscape.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Over the past 15 years, we have successfully handled over 500 cases, earning a reputation for 
                excellence, integrity, and client-focused service. Our team of experienced lawyers brings deep 
                knowledge of Rwandan law and international best practices.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we continue to serve individuals, businesses, and organizations with unwavering commitment 
                to justice and professional excellence. We believe that everyone deserves access to quality legal 
                representation, and we work tirelessly to make that a reality.
              </p>
            </div>
            <div className="bg-gradient-to-br from-1000-blue/10 to-1000-green/10 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-1000-charcoal">Key Milestones</h3>
              <div className="space-y-6">
                {[
                  { year: '2010', event: 'Firm founded with 3 founding partners', color: 'bg-1000-blue' },
                  { year: '2014', event: 'Expanded to 10+ staff members', color: 'bg-1000-green' },
                  { year: '2018', event: 'Opened second office in Huye', color: 'bg-1000-gold' },
                  { year: '2022', event: 'Launched digital case management platform', color: 'bg-1000-blue' },
                  { year: '2025', event: 'Introduced AI-powered legal research tools', color: 'bg-1000-green' }
                ].map((milestone, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`${milestone.color} text-white font-bold px-4 py-2 rounded-lg flex-shrink-0 shadow-md`}>
                      {milestone.year}
                    </div>
                    <p className="text-gray-700 pt-2 leading-relaxed">{milestone.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-1000-charcoal">Our Impact in Numbers</h2>
            <p className="text-xl text-gray-600">A track record of excellence and client satisfaction</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatsCard value="500+" label="Cases Successfully Resolved" icon={Scale} color="text-1000-blue" />
            <StatsCard value="95%" label="Client Satisfaction Rate" icon={Heart} color="text-1000-green" />
            <StatsCard value="15+" label="Years of Excellence" icon={Award} color="text-1000-gold" />
            <StatsCard value="24/7" label="Client Support Available" icon={Clock} color="text-1000-blue" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-1000-charcoal">
              Our Core <span className="text-gradient">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape how we serve our clients.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white border-2 border-blue-100 rounded-2xl p-8 hover:shadow-2xl transition-all card-hover">
              <div className="w-14 h-14 bg-1000-blue/10 rounded-xl flex items-center justify-center mb-5">
                <Award className="w-7 h-7 text-1000-blue" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-1000-charcoal">Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                We strive for excellence in every aspect of our work, from legal research to client communication. 
                Our commitment to the highest standards ensures exceptional outcomes for every client.
              </p>
            </div>
            <div className="bg-white border-2 border-green-100 rounded-2xl p-8 hover:shadow-2xl transition-all card-hover">
              <div className="w-14 h-14 bg-1000-green/10 rounded-xl flex items-center justify-center mb-5">
                <Heart className="w-7 h-7 text-1000-green" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-1000-charcoal">Integrity</h3>
              <p className="text-gray-600 leading-relaxed">
                We uphold the highest ethical standards and maintain unwavering commitment to honesty and transparency. 
                Your trust is our most valuable asset.
              </p>
            </div>
            <div className="bg-white border-2 border-yellow-100 rounded-2xl p-8 hover:shadow-2xl transition-all card-hover">
              <div className="w-14 h-14 bg-1000-gold/10 rounded-xl flex items-center justify-center mb-5">
                <Users className="w-7 h-7 text-1000-gold" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-1000-charcoal">Client-Focused</h3>
              <p className="text-gray-600 leading-relaxed">
                Your needs are our priority. We listen, understand, and deliver personalized legal solutions 
                tailored to your unique circumstances and goals.
              </p>
            </div>
            <div className="bg-white border-2 border-blue-100 rounded-2xl p-8 hover:shadow-2xl transition-all card-hover">
              <div className="w-14 h-14 bg-1000-blue/10 rounded-xl flex items-center justify-center mb-5">
                <Target className="w-7 h-7 text-1000-blue" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-1000-charcoal">Results-Driven</h3>
              <p className="text-gray-600 leading-relaxed">
                We focus on achieving the best possible outcomes for our clients through strategic planning, 
                meticulous execution, and persistent advocacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-1000-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-1000-charcoal">
              Why Choose 1000 Hills Solicitors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine deep legal expertise with genuine care for our clients' success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              title="Proven Expertise"
              description="Our team brings decades of combined experience and specialized knowledge across all areas of Rwandan law."
              color="text-1000-blue"
            />
            <FeatureCard
              icon={Users}
              title="Personalized Service"
              description="Every client receives dedicated attention and customized legal strategies designed for their specific needs."
              color="text-1000-green"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Track Record"
              description="95% success rate with over 500 cases resolved favorably for our clients across diverse practice areas."
              color="text-1000-gold"
            />
            <FeatureCard
              icon={Clock}
              title="Always Available"
              description="24/7 client support ensures you can reach us whenever you need legal guidance or assistance."
              color="text-1000-blue"
            />
            <FeatureCard
              icon={Scale}
              title="Transparent Pricing"
              description="Clear, competitive fee structures with no hidden costs. You'll always know what to expect."
              color="text-1000-green"
            />
            <FeatureCard
              icon={Target}
              title="Results Focused"
              description="Strategic approach driven by measurable outcomes and long-term client success."
              color="text-1000-gold"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-1000-blue to-1000-charcoal text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Work With Us?</h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10">
            Let's discuss how we can help you achieve your legal objectives with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-1000-blue hover:bg-gray-100 text-lg px-8 py-6 h-auto">
              <Link href="/submit-case">Submit Your Case</Link>
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
