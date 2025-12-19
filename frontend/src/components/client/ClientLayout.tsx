'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare,
  Bell,
  User as UserIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Plus,
  HelpCircle,
  Calendar,
  Clock,
  Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Cases', href: '/dashboard/cases', icon: FileText },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, badge: 2 },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Documents', href: '/dashboard/documents', icon: FileText },
    { name: 'Help & Support', href: '/dashboard/help', icon: HelpCircle },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-1000-blue rounded flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-1000-charcoal">1000 Hills</h1>
                <p className="text-xs text-gray-500">Client Portal</p>
              </div>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Button 
              asChild 
              className="bg-1000-blue hover:bg-1000-blue/90 hidden sm:flex"
              size="sm"
            >
              <Link href="/submit-case">
                <Plus className="w-4 h-4 mr-2" />
                New Case
              </Link>
            </Button>

            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-1000-blue rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">Client</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <UserIcon className="w-4 h-4" />
                    My Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-20 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="h-full overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group
                    ${isActive 
                      ? 'bg-1000-blue text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-1000-blue'}`} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-medium
                      ${isActive ? 'bg-white text-1000-blue' : 'bg-red-100 text-red-600'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Help Section */}
          <div className="absolute bottom-4 left-3 right-3">
            <div className="bg-gradient-to-br from-1000-blue to-blue-600 rounded-lg p-4 text-white">
              <HelpCircle className="w-8 h-8 mb-2" />
              <h3 className="font-semibold mb-1">Need Help?</h3>
              <p className="text-sm text-blue-100 mb-3">Our team is here to assist you</p>
              <Button 
                asChild 
                size="sm" 
                className="w-full bg-white text-1000-blue hover:bg-gray-100"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`
          pt-16 transition-all duration-300
          ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}
        `}
      >
        {children}
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
