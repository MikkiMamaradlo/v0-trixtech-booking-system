'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Report {
  totalBookings: number;
  totalRevenue: number;
  bookingsByStatus: Array<{ _id: string; count: number }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'admin') {
      router.push('/auth/login');
      return;
    }
    
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/reports', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setReport(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
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
              onClick={() => router.push('/admin/services')}
              className="text-primary-foreground hover:bg-white/20"
            >
              Services
            </Button>
            <Button 
              variant="ghost"
              onClick={() => router.push('/admin/bookings')}
              className="text-primary-foreground hover:bg-white/20"
            >
              Bookings
            </Button>
            <Button 
              variant="ghost"
              onClick={() => router.push('/admin/customers')}
              className="text-primary-foreground hover:bg-white/20"
            >
              Customers
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
        <h2 className="text-2xl font-bold text-foreground mb-8">Dashboard Overview</h2>

        {loading ? (
          <div className="text-center text-foreground/60">Loading reports...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-center">
                <p className="text-foreground/60 text-sm mb-2">Total Bookings</p>
                <p className="text-4xl font-bold text-primary">{report?.totalBookings || 0}</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <p className="text-foreground/60 text-sm mb-2">Total Revenue</p>
                <p className="text-4xl font-bold text-primary">${report?.totalRevenue || 0}</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <p className="text-foreground/60 text-sm mb-2">Booking Status</p>
                <div className="mt-4 space-y-2 text-sm">
                  {report?.bookingsByStatus.map((item) => (
                    <div key={item._id} className="flex justify-between">
                      <span className="text-foreground/60">{item._id}:</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              variant="outline"
              onClick={() => router.push('/admin/services?action=create')}
              className="h-12"
            >
              Add New Service
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/admin/bookings')}
              className="h-12"
            >
              Review Pending Bookings
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
