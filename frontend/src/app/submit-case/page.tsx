'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, CheckCircle, ArrowLeft, Shield, Clock, FileText } from 'lucide-react';
import Link from 'next/link';

export default function SubmitCase() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'CORPORATE_LAW',
    title: '',
    description: '',
    urgency: 'MEDIUM',
    files: [] as File[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, files: Array.from(e.target.files || []) }));
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to backend API
    console.log('Submitting case:', formData);
    setStep(4); // Show confirmation
  };

  const steps = [
    { number: 1, title: 'Contact Info', icon: FileText },
    { number: 2, title: 'Case Details', icon: FileText },
    { number: 3, title: 'Documents', icon: Upload },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section bg-gradient-to-br from-1000-blue via-1000-blue/95 to-1000-charcoal text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Submit Your Case</h1>
          <p className="text-xl text-blue-100">
            Get expert legal assistance from 1000 Hills Solicitors
          </p>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Shield className="w-5 h-5 text-1000-green" />
              <span className="font-medium">Confidential & Secure</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-1000-blue" />
              <span className="font-medium">24h Response Time</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="w-5 h-5 text-1000-gold" />
              <span className="font-medium">Free Initial Consultation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Indicator */}
      {step < 4 && (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between relative">
            {steps.map((s, index) => {
              const StepIcon = s.icon;
              return (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center font-bold transition-all ${
                      s.number < step 
                        ? 'bg-1000-green text-white shadow-lg' 
                        : s.number === step
                        ? 'bg-1000-blue text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {s.number < step ? <CheckCircle className="w-7 h-7" /> : <StepIcon className="w-6 h-6" />}
                    </div>
                    <span className={`mt-3 text-sm font-medium ${s.number <= step ? 'text-1000-blue' : 'text-gray-500'}`}>
                      {s.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 transition-all ${s.number < step ? 'bg-1000-green' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Step 1: Contact Information */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-2 text-1000-charcoal">Contact Information</h2>
              <p className="text-gray-600 mb-8">Please provide your contact details so we can reach you</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-1000-blue transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-1000-blue transition-colors"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-1000-blue transition-colors"
                    placeholder="+250 788 123 456"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Case Details */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-2 text-1000-charcoal">Case Details</h2>
              <p className="text-gray-600 mb-8">Tell us about your legal matter</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Case Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-1000-blue transition-colors"
                  >
                    <option value="CORPORATE_LAW">Corporate Law</option>
                    <option value="PROPERTY_LAW">Property Law</option>
                    <option value="FAMILY_LAW">Family Law</option>
                    <option value="LITIGATION">Litigation</option>
                    <option value="MEDIATION">Mediation Services</option>
                    <option value="EMPLOYMENT_LAW">Employment Law</option>
                    <option value="INTELLECTUAL_PROPERTY">Intellectual Property</option>
                    <option value="CONSULTANCY">Legal Consultancy</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Case Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-1000-blue transition-colors"
                    placeholder="Brief title for your case"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Case Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-1000-blue transition-colors resize-none"
                    placeholder="Please provide a detailed description of your case..."
                    required
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-2">Minimum 50 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((level) => (
                      <label
                        key={level}
                        className={`flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.urgency === level
                            ? 'border-1000-blue bg-1000-blue/10 text-1000-blue'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="urgency"
                          value={level}
                          checked={formData.urgency === level}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <span className="font-medium capitalize">{level.toLowerCase()}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Document Upload */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-2 text-1000-charcoal">Document Upload</h2>
              <p className="text-gray-600 mb-8">Upload any relevant documents (optional)</p>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-1000-blue transition-colors bg-gradient-to-br from-gray-50 to-blue-50">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">Drag and drop your documents here</p>
                <p className="text-gray-500 mb-6">or</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload">
                  <Button type="button" variant="outline" className="cursor-pointer border-1000-blue text-1000-blue hover:bg-blue-50">
                    Browse Files
                  </Button>
                </label>
                <p className="text-sm text-gray-500 mt-4">Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)</p>
                {formData.files.length > 0 && (
                  <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                    <p className="font-semibold mb-3 text-left text-gray-700">Selected files ({formData.files.length}):</p>
                    <ul className="text-left space-y-2">
                      {formData.files.map((file, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded">
                          <FileText className="w-4 h-4 text-1000-blue" />
                          <span className="flex-1">{file.name}</span>
                          <span className="text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="animate-scale-in text-center py-8">
              <div className="w-20 h-20 bg-1000-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-1000-green" />
              </div>
              <h2 className="text-3xl font-bold text-1000-charcoal mb-4">Case Submitted Successfully!</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Your case has been submitted successfully. You will receive a confirmation email shortly with your case reference number.
              </p>
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-1000-blue/20 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <p className="text-sm text-gray-600 mb-2"><strong>Case Reference:</strong></p>
                <p className="text-2xl font-bold text-1000-blue mb-4">1000HILLS-2025-{Math.floor(Math.random() * 1000)}</p>
                <p className="text-sm text-gray-600"><strong>Submitted:</strong> {new Date().toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
                <p className="text-gray-700 leading-relaxed">
                  <strong className="text-1000-blue">What's next?</strong><br />
                  Our expert legal team will review your case within 24 hours. You'll receive an email with:
                </p>
                <ul className="mt-4 space-y-2 text-left text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-1000-green flex-shrink-0" />
                    <span>Initial case assessment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-1000-green flex-shrink-0" />
                    <span>Consultation appointment options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-1000-green flex-shrink-0" />
                    <span>Estimated timeline and costs</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-1000-blue hover:bg-1000-blue/90">
                  <Link href="/">Back to Home</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-1000-blue text-1000-blue hover:bg-blue-50">
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex justify-between mt-10 pt-8 border-t-2 border-gray-100">
              <Button
                type="button"
                onClick={handlePrev}
                variant="outline"
                disabled={step === 1}
                size="lg"
                className="disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  size="lg"
                  className="bg-1000-blue hover:bg-1000-blue/90"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  className="bg-1000-green hover:bg-1000-green/90"
                >
                  Submit Case
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </form>
      </div>

      <Footer />
      </main>
    </div>
  );
}
