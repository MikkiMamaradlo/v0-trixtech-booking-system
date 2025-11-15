'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  availability: boolean;
}

export default function CustomerHome() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/auth/login');
    
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/services');
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
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
              onClick={() => router.push('/customer/bookings')}
              className="text-primary-foreground hover:bg-white/20"
            >
              My Bookings
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
        <h2 className="text-2xl font-bold text-foreground mb-8">Available Services</h2>

        {loading ? (
          <div className="text-center text-foreground/60">Loading services...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service._id} className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">{service.name}</h3>
                <p className="text-foreground/60 text-sm mb-4">{service.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-primary font-bold text-lg">${service.price}</span>
                  <span className={`text-xs px-2 py-1 rounded ${service.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {service.availability ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <Button 
                  className="w-full"
                  disabled={!service.availability}
                  onClick={() => router.push(`/customer/booking/${service._id}`)}
                >
                  Book Now
                </Button>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
