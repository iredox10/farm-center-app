import { Save } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Platform Settings</h1>
        <p className="text-on-surface-variant mt-2">Configure core marketplace parameters.</p>
      </div>

      <div className="space-y-6">
        {/* Commission Settings */}
        <div className="card bg-white p-6 border border-outline-variant/50 rounded-2xl">
          <h2 className="text-xl font-bold text-primary mb-4">Commission Structure</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                Standard Commission Rate (%)
              </label>
              <input 
                type="number" 
                defaultValue="5"
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm text-primary font-medium"
              />
              <p className="text-sm text-outline mt-1">Percentage taken from every successful sale.</p>
            </div>
          </div>
        </div>

        {/* Shop Limits */}
        <div className="card bg-white p-6 border border-outline-variant/50 rounded-2xl">
          <h2 className="text-xl font-bold text-primary mb-4">Shop Limits</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                Free Tier Product Limit
              </label>
              <input 
                type="number" 
                defaultValue="50"
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm text-primary font-medium"
              />
              <p className="text-sm text-outline mt-1">Maximum number of products a free shop can list.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                Premium Tier Product Limit
              </label>
              <input 
                type="number" 
                defaultValue="1000"
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm text-primary font-medium"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-container transition-colors font-medium">
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
