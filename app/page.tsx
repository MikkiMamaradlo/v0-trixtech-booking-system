'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token) {
      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/customer/home');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">TRIXTECH</h1>
          <p className="text-foreground/60">Booking & Reservation System</p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => router.push('/auth/login')}
            className="w-full h-12 text-base"
          >
            Login
          </Button>
          <Button 
            onClick={() => router.push('/auth/register')}
            variant="outline"
            className="w-full h-12 text-base"
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}
