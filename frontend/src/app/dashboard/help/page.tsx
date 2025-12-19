'use client';

import ClientLayout from '@/components/client/ClientLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Search,
  ChevronDown,
  ChevronRight,
  Book,
  FileQuestion,
  Clock
} from 'lucide-react';
import { useState } from 'react';

function HelpContent() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [supportForm, setSupportForm] = useState({
    subject: '',
    category: '',
    message: '',
  });

  const faqs = [
    {
      id: 1,
      question: 'How do I upload documents to my case?',
      answer: 'Navigate to the Documents section from the sidebar menu. Click the "Upload Document" button and select the files from your computer. Make sure to categorize your documents correctly for easy reference.',
    },
    {
      id: 2,
      question: 'How can I schedule an appointment with my attorney?',
      answer: 'Go to the Appointments section and click "Book Appointment". Select your preferred date and time, choose between video call or in-person meeting, and submit your request. Your attorney will confirm the appointment.',
    },
    {
      id: 3,
      question: 'What are the different case statuses?',
      answer: 'Case statuses include: New (recently submitted), In Progress (actively being worked on), Under Review (waiting for review or decision), Resolved (successfully completed), and Closed (archived).',
    },
    {
      id: 4,
      question: 'How do I communicate with my legal team?',
      answer: 'Use the Messages section to send secure messages to your assigned attorney or case manager. You\'ll receive notifications when they respond. For urgent matters, you can also call our office.',
    },
    {
      id: 5,
      question: 'Can I track the progress of my case?',
      answer: 'Yes! Your dashboard shows real-time updates on your case status. You can also view detailed activity logs and receive notifications for important updates.',
    },
  ];

  const quickLinks = [
    { title: 'Getting Started Guide', icon: Book },
    { title: 'Legal Resources', icon: FileQuestion },
    { title: 'Service Hours', icon: Clock },
  ];

  const categories = [
    'Account & Billing',
    'Case Management',
    'Document Upload',
    'Appointments',
    'Technical Support',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit support ticket
    console.log('Support request:', supportForm);
    alert('Support ticket submitted successfully!');
    setSupportForm({ subject: '', category: '', message: '' });
  };

  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-1">Find answers and get assistance</p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <Phone className="w-8 h-8 text-1000-blue mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
            <p className="text-sm text-gray-600 mb-3">Monday - Friday, 9AM - 5PM</p>
            <a href="tel:+27315551234" className="text-1000-blue font-medium hover:underline">
              +27 31 555 1234
            </a>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <Mail className="w-8 h-8 text-1000-green mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-3">Response within 24 hours</p>
            <a href="mailto:support@1000hills.co.za" className="text-1000-green font-medium hover:underline">
              support@1000hills.co.za
            </a>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <MessageSquare className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-3">Available during business hours</p>
            <button className="text-purple-600 font-medium hover:underline">
              Start Chat
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FAQs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-6 h-6 text-1000-blue" />
                <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                />
              </div>

              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900 text-left">{faq.question}</span>
                      {expandedFaq === faq.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-4 text-gray-600 text-sm border-t border-gray-200 pt-4">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Support Ticket Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit a Support Request</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={supportForm.category}
                    onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={supportForm.message}
                    onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                    placeholder="Describe your issue in detail..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-1000-blue hover:bg-1000-blue/90">
                  Submit Request
                </Button>
              </form>
            </div>
          </div>

          {/* Quick Links Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                {quickLinks.map((link, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <link.icon className="w-5 h-5 text-1000-blue" />
                    <span className="text-sm text-gray-700">{link.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-gradient-to-br from-1000-blue to-blue-600 text-white rounded-lg p-6">
              <h3 className="font-semibold mb-4">Office Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9AM - 5PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>9AM - 1PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
              <h3 className="font-semibold text-red-900 mb-2">Emergency Contact</h3>
              <p className="text-sm text-red-700 mb-3">
                For urgent legal matters after hours
              </p>
              <a 
                href="tel:+27825551234" 
                className="text-red-600 font-medium hover:underline"
              >
                +27 82 555 1234
              </a>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

export default function Help() {
  return (
    <ProtectedRoute requiredRole={[Role.CLIENT]}>
      <HelpContent />
    </ProtectedRoute>
  );
}
