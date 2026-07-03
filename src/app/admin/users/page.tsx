'use client';

import { useState, useEffect } from 'react';
import { Search, MoreVertical, Loader2 } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  phone: string;
  role: string;
  joined: string;
  status: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery)
  );

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manage Users</h1>
          <p className="text-on-surface-variant mt-2">View and manage all registered platform users.</p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm text-primary"
          />
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
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Name</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Phone</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Role</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Joined</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-outline-variant/50 hover:bg-surface-container/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-primary whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user.fullName.charAt(0)}
                          </div>
                          {user.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">{user.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="capitalize font-semibold text-primary">{user.role}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">{user.joined}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-outline hover:text-primary transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
