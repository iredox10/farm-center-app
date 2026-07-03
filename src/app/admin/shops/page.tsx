import { Search, CheckCircle, XCircle } from 'lucide-react';

export default function AdminShops() {
  const shops = [
    { id: '1', name: 'Tech Haven', owner: 'Ahmad Musa', status: 'Active', verified: true, joined: '2026-05-12' },
    { id: '2', name: 'Gadget World', owner: 'Fatima Ali', status: 'Pending', verified: false, joined: '2026-07-01' },
    { id: '3', name: 'Kano Phones Hub', owner: 'Usman Sani', status: 'Suspended', verified: true, joined: '2025-11-20' },
    { id: '4', name: 'Smart Accessories', owner: 'Zainab Ibrahim', status: 'Active', verified: true, joined: '2026-01-15' },
  ];

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manage Shops</h1>
          <p className="text-on-surface-variant mt-2">Approve, suspend, and verify marketplace sellers.</p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input 
            type="text" 
            placeholder="Search shops..." 
            className="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm text-primary"
          />
        </div>
      </div>

      <div className="card bg-white overflow-hidden border border-outline-variant/50 rounded-2xl">
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
              {shops.map((shop) => (
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
                        Approve
                      </button>
                      <button className="text-sm font-semibold text-error hover:text-red-800 transition-colors">
                        Suspend
                      </button>
                      <button className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
                        Verify
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
