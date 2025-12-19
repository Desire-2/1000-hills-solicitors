'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section bg-gradient-to-br from-1000-blue via-1000-blue/95 to-1000-charcoal text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-blue-100">Last updated: December 18, 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2 className="text-3xl font-bold text-1000-charcoal mb-4">Introduction</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            At 1000 Hills Solicitors, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
          </p>

          <h2 className="text-3xl font-bold text-1000-charcoal mb-4 mt-12">Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed mb-4">We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Personal identification information (name, email address, phone number)</li>
            <li>Case details and legal matter information</li>
            <li>Documents and files you submit to us</li>
            <li>Payment and billing information</li>
            <li>Communication preferences and correspondence</li>
          </ul>

          <h2 className="text-3xl font-bold text-1000-charcoal mb-4 mt-12">How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Provide legal services and case management</li>
            <li>Communicate with you about your legal matters</li>
            <li>Process payments and maintain billing records</li>
            <li>Improve our services and website functionality</li>
            <li>Comply with legal obligations and professional requirements</li>
            <li>Send you updates and legal insights (with your consent)</li>
          </ul>

          <h2 className="text-3xl font-bold text-1000-charcoal mb-4 mt-12">Information Security</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We implement appropriate technical and organizational security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
          </p>

          <h2 className="text-3xl font-bold text-1000-charcoal mb-4 mt-12">Data Retention</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
            unless a longer retention period is required by law or professional regulations.
          </p>

          <h2 className="text-3xl font-bold text-1000-charcoal mb-4 mt-12">Your Rights</h2>
          <p className="text-gray-600 leading-relaxed mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Access your personal information</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Request deletion of your information (subject to legal requirements)</li>
            <li>Object to processing of your information</li>
            <li>Withdraw consent where applicable</li>
          </ul>

          <h2 className="text-3xl font-bold text-1000-charcoal mb-4 mt-12">Contact Us</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
            <br /><br />
            <strong>Email:</strong> privacy@1000hills.rw<br />
            <strong>Phone:</strong> +250 788 123 456<br />
            <strong>Address:</strong> KN 3 Ave, Kigali, Rwanda
          </p>
        </div>
      </section>

      <Footer />
      </main>
    </div>
  );
}
