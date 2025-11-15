'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Booking {
  _id: string;
  serviceId: { name: string; price: number };
  status: string;
  date: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/auth/login');
    
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

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
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
          <h1 className="text-3xl font-bold">TRIXTECH</h1>
          <div className="space-x-4">
            <Button 
              variant="ghost"
              onClick={() => router.push('/customer/home')}
              className="text-primary-foreground hover:bg-white/20"
            >
              Browse Services
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
        <h2 className="text-2xl font-bold text-foreground mb-8">My Bookings</h2>

        {loading ? (
          <div className="text-center text-foreground/60">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-foreground/60 mb-4">No bookings yet</p>
            <Button onClick={() => router.push('/customer/home')}>
              Browse Services
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{booking.serviceId.name}</h3>
                    <p className="text-foreground/60 text-sm">
                      Date: {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <p className="text-foreground/60 text-sm">Quantity: {booking.quantity}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                      booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <p className="text-lg font-bold text-primary mt-2">${booking.totalPrice}</p>
                  </div>
                </div>
                {booking.status === 'pending' && (
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancel(booking._id)}
                    className="mt-4"
                  >
                    Cancel Booking
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
