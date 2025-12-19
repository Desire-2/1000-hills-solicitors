import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export const metadata = {
  title: 'Register',
  description: 'Create your 1000 Hills Solicitors account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-emerald-700 mb-2">
              1000 Hills Solicitors
            </h1>
          </Link>
          <p className="text-gray-600">Building Bridges to Justice</p>
        </div>
        
        <RegisterForm />

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
