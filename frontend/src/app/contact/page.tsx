'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Implement form submission
    setTimeout(() => {
      alert('Thank you for contacting us! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section bg-gradient-to-br from-1000-blue via-1000-blue/95 to-1000-charcoal text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Get In Touch</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            We're here to help. Reach out to us for legal consultation or any inquiries.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-1000-charcoal">Contact Information</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-1000-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-1000-charcoal mb-2">Office Address</h3>
                    <p className="text-gray-600">KN 3 Ave, Kigali</p>
                    <p className="text-gray-600">Rwanda</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-green-50 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-1000-green rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-1000-charcoal mb-2">Phone Numbers</h3>
                    <p className="text-gray-600">+250 788 123 456</p>
                    <p className="text-gray-600">+250 788 654 321</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-yellow-50 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-1000-gold rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-1000-charcoal mb-2">Email Address</h3>
                    <p className="text-gray-600">info@1000hills.rw</p>
                    <p className="text-gray-600">legal@1000hills.rw</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-purple-50 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-1000-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-1000-charcoal mb-2">Office Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="font-bold text-1000-charcoal mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  <a href="#" className="w-12 h-12 bg-1000-blue rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-1000-blue rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <Twitter className="w-5 h-5 text-white" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-1000-blue rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-1000-blue rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-1000-charcoal">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                      placeholder="+250 788 123 456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="consultation">Legal Consultation</option>
                      <option value="case">New Case Inquiry</option>
                      <option value="corporate">Corporate Services</option>
                      <option value="property">Property Law</option>
                      <option value="family">Family Law</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent resize-none"
                      placeholder="Tell us about your legal needs..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-1000-blue hover:bg-1000-blue/90 text-lg py-6 h-auto"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-1000-charcoal">Find Us</h2>
          <div className="bg-gray-300 rounded-2xl overflow-hidden h-96 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <MapPin className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg">Interactive map will be displayed here</p>
              <p className="text-sm">KN 3 Ave, Kigali, Rwanda</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </main>
    </div>
  );
}
