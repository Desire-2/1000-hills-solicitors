import { Role } from './types';

/**
 * Get the appropriate dashboard URL based on user role
 */
export function getDashboardUrl(role: Role): string {
  switch (role) {
    case Role.SUPER_ADMIN:
      return '/admin/dashboard';
    case Role.CASE_MANAGER:
      return '/manager/dashboard';
    case Role.CONTENT_EDITOR:
      return '/editor/dashboard';
    case Role.VIEWER:
      return '/viewer/dashboard';
    case Role.CLIENT:
    default:
      return '/dashboard';
  }
}

/**
 * Get role display name
 */
export function getRoleName(role: Role): string {
  const roleMap: Record<Role, string> = {
    [Role.CLIENT]: 'Client',
    [Role.CASE_MANAGER]: 'Case Manager',
    [Role.CONTENT_EDITOR]: 'Content Editor',
    [Role.SUPER_ADMIN]: 'Super Admin',
    [Role.VIEWER]: 'Viewer',
  };
  return roleMap[role];
}

/**
 * Check if user has admin-level access
 */
export function isAdmin(role: Role): boolean {
  return role === Role.SUPER_ADMIN;
}

/**
 * Check if user can manage cases
 */
export function canManageCases(role: Role): boolean {
  return [Role.SUPER_ADMIN, Role.CASE_MANAGER].includes(role);
}

/**
 * Check if user can edit content
 */
export function canEditContent(role: Role): boolean {
  return [Role.SUPER_ADMIN, Role.CONTENT_EDITOR].includes(role);
}
