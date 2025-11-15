'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
}

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;
  
  const [service, setService] = useState<Service | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/auth/login');
    
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/services/${serviceId}`);
      const data = await res.json();
      setService(data);
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId,
          quantity,
          date,
          notes,
          totalPrice: (service?.price || 0) * quantity,
        }),
      });

      if (!res.ok) throw new Error('Booking failed');
      
      router.push('/customer/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          ← Back
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{service?.name}</h1>
          <p className="text-foreground/60 mb-8">{service?.description}</p>

          <div className="bg-primary/10 p-6 rounded-lg mb-8">
            <div className="flex justify-between items-center">
              <span className="text-foreground font-medium">Price per unit:</span>
              <span className="text-2xl font-bold text-primary">${service?.price}</span>
            </div>
          </div>

          <form onSubmit={handleBook} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground">Booking Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Quantity</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                className="mt-2"
                min="1"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special requests or notes..."
                className="w-full mt-2 p-3 border border-border rounded-lg"
              />
            </div>

            <div className="bg-primary/10 p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-foreground font-medium">Total:</span>
                <span className="text-2xl font-bold text-primary">${(service?.price || 0) * quantity}</span>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
