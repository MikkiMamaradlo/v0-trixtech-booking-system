'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Booking {
  _id: string;
  serviceId: { name: string; price: number };
  quantity: number;
  totalPrice: number;
  date: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as string;
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/auth/login');
    
    // Mock: In a real app, fetch booking data
    setBooking({
      _id: bookingId,
      serviceId: { name: 'Professional Event Booking', price: 500 },
      quantity: 1,
      totalPrice: 500,
      date: new Date().toLocaleDateString(),
    });
    setLoading(false);
  }, [bookingId]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId,
          amount: booking?.totalPrice,
          status: 'completed',
          method: 'card',
        }),
      });

      if (!res.ok) throw new Error('Payment failed');
      
      alert('Payment successful!');
      router.push('/customer/bookings');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
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
          <h1 className="text-3xl font-bold text-primary mb-8">Complete Payment</h1>

          <div className="bg-primary/10 p-6 rounded-lg mb-8">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-foreground">Service:</span>
                <span className="font-medium">{booking?.serviceId.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Date:</span>
                <span className="font-medium">{booking?.date}</span>
              </div>
              <div className="flex justify-between border-t border-primary/20 pt-2 mt-2">
                <span className="text-foreground font-medium">Total Amount:</span>
                <span className="text-2xl font-bold text-primary">${booking?.totalPrice}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground">Card Holder Name</label>
              <Input
                type="text"
                value={cardData.cardName}
                onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                placeholder="John Doe"
                className="mt-2"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Card Number</label>
              <Input
                type="text"
                value={cardData.cardNumber}
                onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                placeholder="1234 5678 9012 3456"
                className="mt-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Expiry Date</label>
                <Input
                  type="text"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                  placeholder="MM/YY"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">CVV</label>
                <Input
                  type="text"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                  placeholder="123"
                  className="mt-2"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full h-12 text-base"
              disabled={submitting}
            >
              {submitting ? 'Processing Payment...' : `Pay $${booking?.totalPrice}`}
            </Button>

            <p className="text-xs text-foreground/50 text-center">
              This is a demo. Use any test card number. Your payment information is secure.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
