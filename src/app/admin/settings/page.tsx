'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Settings as SettingsIcon } from 'lucide-react';

export default function AdminSettings() {
  const [commissionRate, setCommissionRate] = useState<number>(5.0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.config) {
        setCommissionRate(data.config.commissionRate);
      }
    } catch (error) {
      console.error('Failed to load settings', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commissionRate: Number(commissionRate) })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save settings.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Network error occurred.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <SettingsIcon className="w-8 h-8 text-primary" />
            Platform Settings
          </h1>
          <p className="text-on-surface-variant mt-2">Manage global platform configurations.</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSave} className="card bg-white p-6 border border-outline-variant/50 rounded-2xl">
          <h2 className="text-xl font-bold text-primary mb-6 border-b border-outline-variant/50 pb-4">Financial Settings</h2>
          
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">
                  Global Commission Rate (%)
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                    className="w-full max-w-xs px-4 py-3 rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <p className="text-sm text-on-surface-variant mt-2">
                    The percentage the platform takes from every successful order.
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-outline-variant/50 flex items-center gap-4">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Changes
                </button>
                {message && (
                  <span className={`text-sm font-semibold ${message.type === 'success' ? 'text-green-600' : 'text-error'}`}>
                    {message.text}
                  </span>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
