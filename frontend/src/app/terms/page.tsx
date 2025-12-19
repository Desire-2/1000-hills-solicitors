'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section bg-gradient-to-br from-1000-blue via-1000-blue/95 to-1000-charcoal text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl text-blue-100">Last updated: December 18, 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2 className="text-3xl font-bold text-1000-charcoal mb-4">Acceptance of Terms</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            By accessing and using the services of 1000 Hills Solicitors, you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-3xl font-bold text-1000-charcoal mb-4 mt-12">Legal Services</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Our legal services are provided subject to the following conditions:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>We will provide legal services with reasonable skill and care</li>
            <li>You agree to provide accurate and complete information</li>
            <li>You will cooperate fully with our requests for information and documents</li>
            <li>All legal advice is provided based on Rwandan law unless otherwise specified</li>
          </ul>

          <h2 className="text-3xl font-bold text-1000-charcoal mb-4 mt-12">Fees and Payment</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Fees for our services will be communicated to you in writing before we commence work. Payment terms are typically 
            30 days from the date of invoice unless otherwise agreed. Late payments may incur interest charges.
          </p>

          <h2 className="text-3xl font-bold text-1000-charcoal mb-4 mt-12">Confidentiality</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We are committed to maintaining the confidentiality of all information you provide to us in accordance with 
            professional legal ethics and applicable law. Attorney-client privilege protects our communications except 
            where disclosure is required by law.
          </p>

          <h2 className="text-3xl font-bold text-1000-charcoal mb-4 mt-12">Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            While we strive to provide the highest quality legal services, we cannot guarantee specific outcomes. 
            Our liability is limited to the fees paid for the specific service in question, except in cases of proven negligence.
          </p>

          <h2 className="text-3xl font-bold text-1000-charcoal mb-4 mt-12">Termination of Services</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Either party may terminate the legal services relationship with written notice. Upon termination, you remain 
            responsible for fees incurred up to the date of termination. We will return your documents and provide a 
            final accounting of fees.
          </p>

          <h2 className="text-3xl font-bold text-1000-charcoal mb-4 mt-12">Dispute Resolution</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Any disputes arising from our services will first be addressed through good faith negotiations. If unresolved, 
            disputes will be submitted to mediation before pursuing other legal remedies.
          </p>

          <h2 className="text-3xl font-bold text-1000-charcoal mb-4 mt-12">Contact Information</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            For questions about these Terms of Service, please contact:
            <br /><br />
            <strong>Email:</strong> legal@1000hills.rw<br />
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
