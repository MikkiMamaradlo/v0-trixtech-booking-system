'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  availability: boolean;
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    availability: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'admin') {
      router.push('/auth/login');
      return;
    }
    
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

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (res.ok) {
        setFormData({ name: '', description: '', category: '', price: '', availability: true });
        setShowForm(false);
        fetchServices();
      }
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Failed to add service');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Manage Services</h2>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Service'}
          </Button>
        </div>

        {showForm && (
          <Card className="p-6 mb-8">
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Service Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Service name"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Service description"
                  className="w-full mt-1 p-3 border border-border rounded-lg"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Event, Supply, Service"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Price</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Available</label>
              </div>

              <Button type="submit" className="w-full">Add Service</Button>
            </form>
          </Card>
        )}

        {loading ? (
          <div className="text-center text-foreground/60">Loading services...</div>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <Card key={service._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{service.name}</h3>
                    <p className="text-foreground/60 text-sm">{service.description}</p>
                    <p className="text-foreground/60 text-sm mt-2">Category: {service.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${service.price}</p>
                    <span className={`inline-block px-3 py-1 rounded text-sm font-medium mt-2 ${
                      service.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {service.availability ? 'Available' : 'Unavailable'}
                    </span>
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteService(service._id)}
                      className="mt-4 ml-2"
                    >
                      Delete
                    </Button>
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
