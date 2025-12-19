import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role } from '@/lib/types';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole={[Role.SUPER_ADMIN, Role.ADMIN]}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
