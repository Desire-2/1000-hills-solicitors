'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, CheckCircle, ArrowLeft, Shield, Clock, FileText, Loader2, AlertCircle, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import apiService from '@/lib/api';
import { Role } from '@/lib/types';

export default function SubmitCase() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedCaseId, setSubmittedCaseId] = useState<number | null>(null);
  const [submissionTimestamp, setSubmissionTimestamp] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [autoFilled, setAutoFilled] = useState(false);
  
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

  // Role-based access control & auto-fill user data
  useEffect(() => {
    if (!authLoading) {
      // Redirect non-CLIENT users
      if (user && user.role !== Role.CLIENT) {
        router.push('/dashboard?message=Only clients can submit cases. Please contact an admin for assistance.');
        return;
      }

      // Auto-fill form with user profile data
      if (user && !autoFilled) {
        setFormData(prev => ({
          ...prev,
          name: user.name || prev.name,
          email: user.email || prev.email,
          // Phone would be filled if it exists in user profile
        }));
        setAutoFilled(true);
      }
    }
  }, [user, authLoading, router, autoFilled]);

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('case-submission-draft');
    if (savedDraft && !user) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...draft }));
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, [user]);

  // Save draft to localStorage
  useEffect(() => {
    if (!user && (formData.title || formData.description)) {
      localStorage.setItem('case-submission-draft', JSON.stringify({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        urgency: formData.urgency,
      }));
    }
  }, [formData.title, formData.description, formData.category, formData.urgency, user]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Alt+N for Next (when not in step 3)
      if (e.altKey && e.key === 'n' && step < 3) {
        e.preventDefault();
        handleNext();
      }
      // Alt+P for Previous (when not in step 1)
      if (e.altKey && e.key === 'p' && step > 1 && step < 4) {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('case-submission-draft');
    setFormData(prev => ({
      ...prev,
      title: '',
      description: '',
      category: 'CORPORATE_LAW',
      urgency: 'MEDIUM',
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files || []);
      const maxSize = 10 * 1024 * 1024; // 10MB
      const invalidFiles = files.filter(file => file.size > maxSize);
      
      if (invalidFiles.length > 0) {
        setFormErrors(prev => ({
          ...prev,
          files: `Some files exceed the 10MB limit: ${invalidFiles.map(f => f.name).join(', ')}`
        }));
        return;
      }
      
      setFormData(prev => ({ ...prev, files }));
      if (formErrors.files) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.files;
          return newErrors;
        });
      }
    }
  };

  const validateStep = (stepNum: number): boolean => {
    const errors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!formData.name.trim()) {
        errors.name = 'Full name is required';
      }
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
        errors.phone = 'Please enter a valid phone number';
      }
    }

    if (stepNum === 2) {
      if (!formData.category) {
        errors.category = 'Please select a case category';
      }
      if (!formData.title.trim()) {
        errors.title = 'Case title is required';
      }
      if (!formData.description.trim()) {
        errors.description = 'Case description is required';
      } else if (formData.description.length < 50) {
        errors.description = `Description must be at least 50 characters (currently ${formData.description.length})`;
      }
      if (!formData.urgency) {
        errors.urgency = 'Please select an urgency level';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateStep(2)) {
      setStep(2); // Go back to step 2 if validation fails
      return;
    }

    // Check if user is authenticated and is a CLIENT
    if (!user && !authLoading) {
      // Redirect to login with return URL
      router.push('/login?redirect=/submit-case&message=Please login or register to submit a case');
      return;
    }

    // Additional check: Ensure user is CLIENT role
    if (user && user.role !== Role.CLIENT) {
      setError('Only clients can submit cases. Please contact support for assistance.');
      return;
    }

    setLoading(true);

    try {
      // Submit case to backend
      const response = await apiService.createCase({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.urgency, // Map urgency to priority
      });

      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }

      // Success - store case ID and move to confirmation
      const responseData = response.data as any;
      if (responseData?.case?.id) {
        setSubmittedCaseId(responseData.case.id);
      } else if (responseData?.id) {
        setSubmittedCaseId(responseData.id);
      }

      // Set submission timestamp
      setSubmissionTimestamp(new Date().toLocaleString());

      // Clear localStorage draft on successful submission
      localStorage.removeItem('case-submission-draft');
      
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit case. Please try again.');
    } finally {
      setLoading(false);
    }
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
          {/* Auth Warning */}
          {!user && !authLoading && step < 4 && (
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-800 font-medium">Login Required</p>
                <p className="text-blue-700 text-sm mt-1">
                  You need to be logged in to submit a case. You'll be redirected to login when you submit the form.{' '}
                  <Link href="/login?redirect=/submit-case" className="underline font-medium">
                    Login now
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Auto-fill Success Message */}
          {user && user.role === Role.CLIENT && autoFilled && step === 1 && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-800 font-medium">Profile Information Loaded</p>
                <p className="text-green-700 text-sm mt-1">
                  Your contact details have been automatically filled from your profile. You can edit them if needed.
                </p>
              </div>
            </div>
          )}
          
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
        {/* Global Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Submission Failed</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Step 1: Contact Information */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-3xl font-bold text-1000-charcoal">Contact Information</h2>
                {user && user.role === Role.CLIENT && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <UserCheck className="w-4 h-4" />
                    <span>Auto-filled from profile</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-8">Please provide your contact details so we can reach you</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name * 
                    {user && formData.name === user.name && (
                      <span className="ml-2 text-xs text-green-600">(from profile)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      user && formData.name === user.name ? 'bg-green-50 border-green-200' :
                      formErrors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-1000-blue'
                    }`}
                    placeholder="John Doe"
                    required
                    readOnly={user?.role !== Role.CLIENT}
                  />
                  {formErrors.name && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                    {user && formData.email === user.email && (
                      <span className="ml-2 text-xs text-green-600">(from profile)</span>
                    )}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      user && formData.email === user.email ? 'bg-green-50 border-green-200' :
                      formErrors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-1000-blue'
                    }`}
                    placeholder="john@example.com"
                    required
                    readOnly={user?.role !== Role.CLIENT}
                  />
                  {formErrors.email && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      formErrors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-1000-blue'
                    }`}
                    placeholder="+250 788 123 456"
                    required
                  />
                  {formErrors.phone && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Case Details */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-1000-charcoal">Case Details</h2>
                  <p className="text-gray-600 mt-2">Tell us about your legal matter</p>
                  {!user && (formData.title || formData.description) && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Draft saved locally
                    </p>
                  )}
                </div>
                {!user && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearDraft}
                    className="text-gray-600 hover:text-red-600 hover:border-red-300"
                  >
                    Clear Draft
                  </Button>
                )}
              </div>
              <div className="space-y-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Case Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      formErrors.category ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-1000-blue'
                    }`}
                  >
                    <option value="">Select a category</option>
                    <option value="IMMIGRATION">Immigration</option>
                    <option value="FAMILY_LAW">Family Law</option>
                    <option value="CRIMINAL_DEFENSE">Criminal Defense</option>
                    <option value="CIVIL_LITIGATION">Civil Litigation</option>
                    <option value="CORPORATE_LAW">Corporate Law</option>
                    <option value="PROPERTY_LAW">Property Law</option>
                    <option value="EMPLOYMENT_LAW">Employment Law</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {formErrors.category && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.category}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Case Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      formErrors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-1000-blue'
                    }`}
                    placeholder="Brief title for your case"
                    required
                  />
                  {formErrors.title && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.title}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Case Description *
                    <span className="ml-2 text-xs text-gray-500 font-normal">
                      (Include key dates, parties involved, and desired outcome)
                    </span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={8}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors resize-none ${
                      formErrors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-1000-blue'
                    }`}
                    placeholder="Example: I need assistance with... The situation involves... I would like to achieve..."
                    required
                  ></textarea>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                      Minimum 50 characters
                      <span className="ml-2 text-xs">• Be specific for better assistance</span>
                    </p>
                    <p className={`text-sm font-medium ${formData.description.length < 50 ? 'text-gray-400' : formData.description.length < 100 ? 'text-yellow-600' : 'text-1000-green'}`}>
                      {formData.description.length} chars
                      {formData.description.length >= 100 && ' ✓'}
                    </p>
                  </div>
                  {formErrors.description && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.description}
                    </p>
                  )}
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
                            : formErrors.urgency
                            ? 'border-red-200 hover:border-red-300'
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
                  {formErrors.urgency && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.urgency}
                    </p>
                  )}
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
                <p className="text-2xl font-bold text-1000-blue mb-4">
                  {submittedCaseId ? `CASE-${submittedCaseId}` : 'Processing...'}
                </p>
                <p className="text-sm text-gray-600"><strong>Submitted:</strong> {submissionTimestamp || 'Just now'}</p>
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
              <div className="flex items-center gap-4">
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
                {step > 1 && (
                  <span className="text-xs text-gray-500">Alt+P</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                {step < 3 && (
                  <span className="text-xs text-gray-500">Alt+N</span>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    size="lg"
                    className="bg-1000-blue hover:bg-1000-blue/90"
                    disabled={loading}
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-1000-green hover:bg-1000-green/90"
                    disabled={loading || authLoading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Case
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </form>
      </div>

      <Footer />
      </main>
    </div>
  );
}
