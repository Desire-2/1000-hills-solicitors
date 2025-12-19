'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Insights() {
  const featuredArticle = {
    title: 'Understanding Rwanda\'s New Corporate Governance Framework',
    excerpt: 'A comprehensive guide to the latest regulatory changes affecting businesses in Rwanda and what they mean for corporate compliance.',
    author: 'Dr. Jean-Baptiste Nshimiyimana',
    date: '2025-12-10',
    readTime: '8 min read',
    category: 'Corporate Law',
    image: 'corporate-governance'
  };

  const articles = [
    {
      title: 'Navigating Property Transactions in Rwanda: A Buyer\'s Guide',
      excerpt: 'Essential legal considerations for purchasing residential and commercial property in Rwanda.',
      author: 'Emmanuel Mugisha',
      date: '2025-12-05',
      readTime: '6 min read',
      category: 'Property Law'
    },
    {
      title: 'Family Law Updates: Recent Changes to Custody Regulations',
      excerpt: 'New amendments to family law affecting custody arrangements and their implications for families.',
      author: 'Grace Mukamana',
      date: '2025-11-28',
      readTime: '7 min read',
      category: 'Family Law'
    },
    {
      title: 'The Rise of Alternative Dispute Resolution in Rwanda',
      excerpt: 'How mediation and arbitration are transforming the legal landscape and reducing court backlogs.',
      author: 'Advocate Marie Claire Uwera',
      date: '2025-11-20',
      readTime: '5 min read',
      category: 'Mediation'
    },
    {
      title: 'Employment Contracts: Key Clauses Every Employer Should Include',
      excerpt: 'Protecting your business with comprehensive employment agreements that comply with Rwandan labor law.',
      author: 'Sarah Ingabire',
      date: '2025-11-15',
      readTime: '6 min read',
      category: 'Employment Law'
    },
    {
      title: 'Intellectual Property Protection for Startups',
      excerpt: 'Essential strategies for protecting your innovations, trademarks, and creative works in the digital age.',
      author: 'Aline Umutoni',
      date: '2025-11-08',
      readTime: '7 min read',
      category: 'IP Law'
    },
    {
      title: 'Understanding Legal Due Diligence in M&A Transactions',
      excerpt: 'A step-by-step guide to conducting thorough legal due diligence during mergers and acquisitions.',
      author: 'Patrick Habimana',
      date: '2025-11-01',
      readTime: '9 min read',
      category: 'Corporate Law'
    }
  ];

  const categories = ['All', 'Corporate Law', 'Property Law', 'Family Law', 'Employment Law', 'Litigation', 'IP Law'];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section bg-gradient-to-br from-1000-blue via-1000-blue/95 to-1000-charcoal text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Legal Insights</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Expert analysis, updates, and guidance on legal matters affecting Rwanda
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 bg-gray-50 sticky top-20 z-40 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  category === 'All'
                    ? 'bg-1000-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-1000-blue/10 to-1000-green/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-1000-blue to-1000-green h-64 lg:h-auto flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}></div>
                </div>
                <BookOpen className="w-32 h-32 text-white relative z-10" />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-block">
                  <span className="bg-1000-gold text-white px-4 py-1 rounded-full text-sm font-medium">
                    Featured Article
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mt-4 mb-4 text-1000-charcoal">
                  {featuredArticle.title}
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{featuredArticle.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(featuredArticle.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredArticle.readTime}</span>
                  </div>
                </div>
                <Button className="bg-1000-blue hover:bg-1000-blue/90 w-fit">
                  Read Full Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Articles Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-1000-charcoal">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <article key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all card-hover group">
                <div className="h-48 bg-gradient-to-br from-1000-blue to-1000-green relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-1000-blue px-3 py-1 rounded-full text-xs font-bold">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-1000-charcoal group-hover:text-1000-blue transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-3">By {article.author}</p>
                    <Link href="#" className="text-1000-blue hover:text-1000-blue/80 font-medium flex items-center group-hover:gap-3 transition-all">
                      Read More <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-1000-blue text-1000-blue hover:bg-blue-50">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gradient-to-r from-1000-blue to-1000-charcoal text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Stay Informed</h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10">
            Subscribe to our newsletter for the latest legal insights and updates
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-1000-gold"
            />
            <Button type="submit" size="lg" className="bg-1000-gold hover:bg-1000-gold/90 text-white px-8">
              Subscribe
            </Button>
          </form>
          <p className="text-sm text-blue-100 mt-4">
            Join 1,000+ legal professionals receiving our monthly insights
          </p>
        </div>
      </section>

      <Footer />
      </main>
    </div>
  );
}
