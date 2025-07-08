// pages/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && (user.role === 'admin' || user.role === 'super_admin')) {
        router.replace('/admin');
      } else {
        router.replace('/login');
      }
    }
  }, [router, user, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader className="animate-spin h-8 w-8 text-emerald-500 mx-auto" />
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}