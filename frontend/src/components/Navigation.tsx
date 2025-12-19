'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, Scale, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getDashboardUrl } from '@/lib/role-utils';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
  };

  const dashboardUrl = user ? getDashboardUrl(user.role) : '/dashboard';

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/team', label: 'Our Team' },
    { href: '/insights', label: 'Insights' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-1000-blue rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-1000-charcoal">1000 Hills</span>
              <span className="text-xs text-gray-600 font-medium">Solicitors</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-gray-700 hover:text-1000-blue hover:bg-blue-50 rounded-lg transition-all font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && user ? (
              // Logged in user menu
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      href={dashboardUrl}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Profile
                    </Link>
                    {user.role === 'SUPER_ADMIN' && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Not logged in - show login/register buttons
              <>
                <Button asChild variant="outline" className="border-1000-blue text-1000-blue hover:bg-blue-50">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-1000-blue hover:bg-1000-blue/90">
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 animate-slide-up">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-gray-700 hover:text-1000-blue hover:bg-blue-50 rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                {!loading && user ? (
                  // Logged in user - mobile menu
                  <>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Signed in as</p>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Button asChild variant="outline" className="w-full border-1000-blue text-1000-blue">
                      <Link href={dashboardUrl} onClick={() => setIsOpen(false)}>Dashboard</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/profile" onClick={() => setIsOpen(false)}>My Profile</Link>
                    </Button>
                    {user.role === 'SUPER_ADMIN' && (
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>Admin Panel</Link>
                      </Button>
                    )}
                    <Button 
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      variant="outline" 
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  // Not logged in - mobile menu
                  <>
                    <Button asChild variant="outline" className="w-full border-1000-blue text-1000-blue">
                      <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
                    </Button>
                    <Button asChild className="w-full bg-1000-blue hover:bg-1000-blue/90">
                      <Link href="/register" onClick={() => setIsOpen(false)}>Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
