'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Role } from '@/lib/types';
import { getDashboardUrl } from '@/lib/role-utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role | Role[];
  redirectTo?: string;
}

/**
 * ProtectedRoute component ensures that only authenticated users can access certain pages.
 * Optionally, it can also check for specific user roles.
 * 
 * @param children - The content to render if the user is authorized
 * @param requiredRole - Optional role(s) required to access the route
 * @param redirectTo - Where to redirect if unauthorized (defaults to /login)
 */
export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // User not logged in
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Check if user has the required role
      if (requiredRole) {
        const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        
        if (!allowedRoles.includes(user.role)) {
          // Redirect to user's appropriate dashboard if they don't have the required role
          const userDashboard = getDashboardUrl(user.role);
          router.push(userDashboard);
        }
      }
    }
  }, [user, loading, requiredRole, router, redirectTo]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if user is not authorized
  if (!user) {
    return null;
  }

  // Don't render children if user doesn't have the required role
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!allowedRoles.includes(user.role)) {
      return null;
    }
  }

  // User is authorized, render children
  return <>{children}</>;
}
