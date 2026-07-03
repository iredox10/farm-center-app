'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Loader2, Plus, X, Copy } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface Shop {
  id: string;
  name: string;
  owner: string;
  status: string;
  verified: boolean;
  joined: string;
}

interface CreateShopFormData {
  shopName: string;
  ownerName: string;
  ownerEmail: string;
  phone: string;
}

export default function AdminShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Credentials from successful creation
  const [newCredentials, setNewCredentials] = useState<{ email: string; password: string | null } | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<CreateShopFormData>();

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/shops');
      const data = await res.json();
      if (data.success) {
        setShops(data.shops);
      }
    } catch (error) {
      console.error('Failed to fetch shops', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CreateShopFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        setNewCredentials(result.credentials || { email: data.ownerEmail, password: 'User already had an account. No new password generated.' });
        fetchShops(); // Refresh list
        reset(); // Clear form
      } else {
        setError('root', { message: result.error || 'Failed to create shop' });
      }
    } catch (error: any) {
      setError('root', { message: error.message || 'Network error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setNewCredentials(null);
  };

  return (
    <div className="p-8 relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manage Shops</h1>
          <p className="text-on-surface-variant mt-2">Approve, suspend, verify, and create marketplace sellers.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input 
              type="text" 
              placeholder="Search shops..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm text-primary"
            />
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add Shop
          </button>
        </div>
      </div>

      <div className="card bg-white overflow-hidden border border-outline-variant/50 rounded-2xl min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-outline-variant/50">
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Shop Name</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Owner</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap text-center">Verified</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Joined</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shops.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">
                      No shops found.
                    </td>
                  </tr>
                ) : (
                  shops.map((shop) => (
                    <tr key={shop.id} className="border-b border-outline-variant/50 hover:bg-surface-container/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-primary whitespace-nowrap">{shop.name}</td>
                      <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">{shop.owner}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          shop.status === 'Active' ? 'bg-green-100 text-green-800' :
                          shop.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {shop.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
                          {shop.verified ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-outline-variant" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">{shop.joined}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-3">
                          <button className="text-sm font-semibold text-primary hover:text-secondary transition-colors">
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE SHOP MODAL */}
      {isModalOpen && !newCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={closeModals}
              className="absolute top-6 right-6 text-outline hover:text-primary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-primary mb-2">Create New Shop</h2>
            <p className="text-on-surface-variant text-sm mb-6">Enter the shop and owner details to provision a new seller account.</p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errors.root && (
                <div className="bg-error/10 text-error text-sm p-3 rounded-lg font-medium">
                  {errors.root.message}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">Shop Name</label>
                <input 
                  type="text"
                  {...register('shopName', { required: 'Shop name is required' })}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="e.g. Kano Gadget Store"
                />
                {errors.shopName && <p className="text-error text-xs mt-1">{errors.shopName.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">Owner Full Name</label>
                <input 
                  type="text"
                  {...register('ownerName', { required: 'Owner name is required' })}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="e.g. Ahmad Musa"
                />
                {errors.ownerName && <p className="text-error text-xs mt-1">{errors.ownerName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">Owner Email</label>
                <input 
                  type="email"
                  {...register('ownerEmail', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                  })}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="ahmad@example.com"
                />
                {errors.ownerEmail && <p className="text-error text-xs mt-1">{errors.ownerEmail.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">Owner Phone</label>
                <input 
                  type="tel"
                  {...register('phone', { required: 'Phone is required' })}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="+2348000000000"
                />
                {errors.phone && <p className="text-error text-xs mt-1">{errors.phone.message}</p>}
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModals}
                  className="px-6 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Shop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {newCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Shop Created!</h2>
            <p className="text-on-surface-variant text-sm mb-6">
              The shop was created successfully. Here are the seller's login credentials. Please share them securely.
            </p>
            
            <div className="bg-surface-container rounded-xl p-4 text-left mb-6 relative group">
              <p className="text-sm text-on-surface-variant font-medium mb-1">Email</p>
              <p className="font-semibold text-primary">{newCredentials.email}</p>
              
              <div className="mt-4">
                <p className="text-sm text-on-surface-variant font-medium mb-1">Temporary Password</p>
                <p className="font-semibold text-primary break-all">{newCredentials.password}</p>
              </div>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`Email: ${newCredentials.email}\nPassword: ${newCredentials.password}`);
                  alert('Copied to clipboard');
                }}
                className="absolute top-4 right-4 text-outline hover:text-primary"
                title="Copy Credentials"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              onClick={closeModals}
              className="w-full bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
