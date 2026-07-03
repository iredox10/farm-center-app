'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, ShoppingBag, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  shopName: string;
  date: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shopName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentBadge = (method: string) => {
    switch (method) {
      case 'paystack':
        return 'Paystack';
      case 'pay_on_delivery':
        return 'COD';
      case 'whatsapp':
        return 'WhatsApp';
      default:
        return method;
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-primary" />
            Manage Orders
          </h1>
          <p className="text-on-surface-variant mt-2">
            Monitor and track all marketplace transactions.
          </p>
        </div>

        <div className="relative w-full sm:w-auto">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Search orders..."
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
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Order ID</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Customer</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Shop</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Date</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Total</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Payment</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-outline-variant/50 hover:bg-surface-container/20 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-primary whitespace-nowrap">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-on-surface whitespace-nowrap">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">
                        {order.shopName}
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary whitespace-nowrap">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-surface-container text-on-surface-variant border border-outline-variant/50">
                          {getPaymentBadge(order.paymentMethod)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-3">
                          <button className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-secondary transition-colors">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-on-surface-variant font-body text-sm"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
