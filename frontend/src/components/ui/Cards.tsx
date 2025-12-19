import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  iconColor?: string;
}

export function ServiceCard({ icon: Icon, title, description, href, iconColor = 'text-1000-blue' }: ServiceCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-2xl transition-all duration-300 card-hover group">
      <div className={`w-14 h-14 ${iconColor.replace('text-', 'bg-')}/10 rounded-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-7 h-7 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-bold mb-3 text-1000-charcoal group-hover:text-1000-blue transition-colors">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">
        {description}
      </p>
      <Link href={href} className="text-1000-blue hover:text-1000-blue/80 flex items-center font-medium group-hover:gap-3 transition-all">
        Learn more <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </div>
  );
}

interface StatsCardProps {
  value: string;
  label: string;
  icon?: LucideIcon;
  color?: string;
}

export function StatsCard({ value, label, icon: Icon, color = 'text-1000-blue' }: StatsCardProps) {
  return (
    <div className="text-center animate-scale-in">
      {Icon && (
        <div className="flex justify-center mb-3">
          <Icon className={`w-10 h-10 ${color}`} />
        </div>
      )}
      <div className={`text-5xl font-bold ${color} mb-2`}>{value}</div>
      <p className="text-gray-700 font-medium">{label}</p>
    </div>
  );
}

// New Presentation-style Metric Card
interface MetricCardProps {
  value: string;
  label: string;
  variant?: 'blue' | 'green' | 'gold';
}

export function MetricCard({ value, label, variant = 'blue' }: MetricCardProps) {
  const variantClass = variant === 'blue' ? 'metric-card-blue' : 
                       variant === 'green' ? 'metric-card-green' : 'metric-card-gold';
  
  return (
    <div className={variantClass}>
      <div className="text-4xl font-bold my-2.5">{value}</div>
      <div className="text-sm opacity-95">{label}</div>
    </div>
  );
}

// New Presentation-style Card
interface PresentationCardProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function PresentationCard({ title, description, children }: PresentationCardProps) {
  return (
    <div className="presentation-card">
      <h4 className="text-1000-blue mb-2.5 text-lg font-semibold">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
      {children}
    </div>
  );
}

// New Highlight Box
interface HighlightBoxProps {
  title?: string;
  children: ReactNode;
}

export function HighlightBox({ title, children }: HighlightBoxProps) {
  return (
    <div className="highlight-box">
      {title && <strong className="text-amber-900 block mb-2">{title}</strong>}
      <div className="text-gray-700">{children}</div>
    </div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  rating?: number;
}

export function TestimonialCard({ quote, author, role, rating = 5 }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <svg key={i} className="w-5 h-5 text-1000-gold fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-700 italic mb-6 leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div>
        <p className="font-bold text-1000-charcoal">{author}</p>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
}

export function FeatureCard({ icon: Icon, title, description, color = 'text-1000-blue' }: FeatureCardProps) {
  return (
    <div className="feature-card">
      <div className="flex-shrink-0 text-2xl">{Icon && <Icon className={`w-6 h-6 ${color}`} />}</div>
      <div>
        <h4 className="text-1000-blue mb-1 font-semibold">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}

interface TeamMemberCardProps {
  name: string;
  role: string;
  image?: string;
  bio?: string;
  email?: string;
  linkedin?: string;
}

export function TeamMemberCard({ name, role, image, bio, email, linkedin }: TeamMemberCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all card-hover">
      <div className="h-64 bg-gradient-to-br from-1000-blue to-1000-green relative overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl font-bold text-white/20">{name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-1000-charcoal mb-1">{name}</h3>
        <p className="text-1000-blue font-medium mb-3">{role}</p>
        {bio && <p className="text-gray-600 text-sm mb-4">{bio}</p>}
        <div className="flex gap-3">
          {email && (
            <a href={`mailto:${email}`} className="text-gray-400 hover:text-1000-blue transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-1000-blue transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
