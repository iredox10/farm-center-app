import { Search } from 'lucide-react';

export default function AdminUsers() {
  const users = [
    { id: '1', name: 'Mustapha Bello', email: 'mbello@example.com', role: 'Buyer', status: 'Active', joined: '2026-06-15' },
    { id: '2', name: 'Aisha Suleiman', email: 'asuleiman@example.com', role: 'Seller', status: 'Active', joined: '2026-05-02' },
    { id: '3', name: 'John Doe', email: 'johndoe@example.com', role: 'Buyer', status: 'Suspended', joined: '2026-01-20' },
    { id: '4', name: 'Aliyu Umar', email: 'aliumar@example.com', role: 'Admin', status: 'Active', joined: '2025-10-10' },
  ];

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manage Users</h1>
          <p className="text-on-surface-variant mt-2">View and manage all registered users.</p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm text-primary"
          />
        </div>
      </div>

      <div className="card bg-white overflow-hidden border border-outline-variant/50 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-outline-variant/50">
                <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Name</th>
                <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Email</th>
                <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Role</th>
                <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Status</th>
                <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Joined</th>
                <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-outline-variant/50 hover:bg-surface-container/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-primary whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-primary bg-surface-container px-2.5 py-1 rounded-md">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">{user.joined}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-3">
                      <button className="text-sm font-semibold text-primary hover:text-secondary transition-colors">
                        Edit
                      </button>
                      <button className="text-sm font-semibold text-error hover:text-red-800 transition-colors">
                        Ban
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
