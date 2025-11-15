'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Booking {
  _id: string;
  userId: { name: string; email: string };
  serviceId: { name: string; price: number };
  status: string;
  date: string;
  quantity: number;
  totalPrice: number;
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'admin') {
      router.push('/auth/login');
      return;
    }
    
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating booking:', error);
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
        <h2 className="text-2xl font-bold text-foreground mb-8">Manage Bookings</h2>

        {loading ? (
          <div className="text-center text-foreground/60">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-foreground/60">No bookings yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking._id} className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{booking.serviceId.name}</h3>
                    <p className="text-foreground/60 text-sm">Customer: {booking.userId.name}</p>
                    <p className="text-foreground/60 text-sm">{booking.userId.email}</p>
                    <p className="text-foreground/60 text-sm mt-2">
                      Date: {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <p className="text-foreground/60 text-sm">Quantity: {booking.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary mb-4">${booking.totalPrice}</p>
                    <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                      booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    
                    <div className="mt-4 space-y-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button 
                            size="sm"
                            className="w-full"
                            onClick={() => handleUpdateStatus(booking._id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm"
                            variant="destructive"
                            className="w-full"
                            onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                          >
                            Decline
                          </Button>
                        </>
                      )}
                      {booking.status === 'approved' && (
                        <Button 
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => handleUpdateStatus(booking._id, 'completed')}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
