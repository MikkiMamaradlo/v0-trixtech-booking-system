'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Customer {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'admin') {
      router.push('/auth/login');
      return;
    }
    
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">TRIXTECH Admin</h1>
          <div className="space-x-4">
            <Button 
              variant="ghost"
              onClick={() => router.push('/admin/dashboard')}
              className="text-primary-foreground hover:bg-white/20"
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-white/20"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-foreground mb-8">Manage Customers</h2>

        {loading ? (
          <div className="text-center text-foreground/60">Loading customers...</div>
        ) : customers.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-foreground/60">No customers yet</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {customers.map((customer) => (
              <Card key={customer._id} className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">{customer.name}</h3>
                <p className="text-foreground/60 text-sm mb-2">{customer.email}</p>
                <p className="text-foreground/60 text-xs">
                  Member since: {new Date(customer.createdAt).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
