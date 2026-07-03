'use client';

import { useState, useEffect } from 'react';
import {
  Package,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import type { OrderStatus, PaymentMethod, Order, OrderItem } from '@/types';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/appwrite/api';
import { databases } from '@/lib/appwrite/client';
import { DATABASE_ID, ORDER_ITEMS_COLLECTION } from '@/lib/appwrite/config';
import { Query } from 'appwrite';
import { toast } from 'react-hot-toast';

/* ─── Types ─── */
interface EnrichedOrder extends Order {
  items: OrderItem[];
}

const TABS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<EnrichedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user?.$id) return;
      try {
        const shop = await api.getShopByOwnerId(user.$id);
        if (!shop) {
          setIsLoading(false);
          return;
        }

        const shopIdStr = (shop as any).$id || shop.id;
        const shopOrders = await api.getShopOrders(shopIdStr);

        const enrichedOrders: EnrichedOrder[] = await Promise.all(
          shopOrders.map(async (order: Order) => {
            const orderIdStr = (order as any).$id || order.id;
            const itemsRes = await databases.listDocuments(
              DATABASE_ID,
              ORDER_ITEMS_COLLECTION,
              [Query.equal('orderId', orderIdStr)]
            );
            return { ...order, id: orderIdStr, items: itemsRes.documents as unknown as OrderItem[] };
          })
        );
        setOrders(enrichedOrders);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [user?.$id]);

  async function updateStatus(orderId: string, status: OrderStatus) {
    try {
      await api.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success(`Order marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  }

  const filteredOrders =
    activeTab === 'all' ? orders : orders.filter((o) => o.status === activeTab);

  function getStatusConfig(status: OrderStatus) {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
      case 'paid':
        return { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
      case 'processing':
        return { icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
      case 'shipped':
        return { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' };
      case 'delivered':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
      case 'cancelled':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
      default:
        return { icon: Clock, color: 'text-outline', bg: 'bg-surface-container', border: 'border-outline-variant' };
    }
  }

  function getPaymentLabel(method: PaymentMethod) {
    switch (method) {
      case 'paystack': return 'Paid via Paystack';
      case 'pay_on_delivery': return 'Pay on Delivery';
      case 'whatsapp': return 'Ordered via WhatsApp';
      default: return 'Unknown';
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-on-surface-variant">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-on-surface">Orders</h2>
        <p className="font-body text-sm text-on-surface-variant mt-1">
          Manage and track your customer orders
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {TABS.map((tab) => {
          const count =
            tab.value === 'all'
              ? orders.length
              : orders.filter((o) => o.status === tab.value).length;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-label font-medium whitespace-nowrap transition-all',
                activeTab === tab.value
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-transparent'
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] ml-1',
                  activeTab === tab.value ? 'bg-primary/20' : 'bg-surface-container-highest'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-outline-variant/50 rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-on-surface-variant/50" />
          </div>
          <h3 className="font-heading text-xl font-bold text-on-surface mb-2">No Orders Found</h3>
          <p className="font-body text-sm text-on-surface-variant">
            {activeTab === 'all'
              ? "You haven't received any orders yet."
              : `You don't have any ${activeTab} orders.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-outline-variant/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Header (Clickable) */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full text-left p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center shrink-0 border',
                        statusConfig.bg,
                        statusConfig.color,
                        statusConfig.border
                      )}
                    >
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-heading font-bold text-on-surface">
                          {order.orderNumber}
                        </span>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border',
                            statusConfig.bg,
                            statusConfig.color,
                            statusConfig.border
                          )}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant font-body">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pl-16 md:pl-0">
                    <div className="flex flex-col md:items-end">
                      <span className="text-xs text-on-surface-variant">Total Amount</span>
                      <span className="font-body text-sm font-bold text-on-surface">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                    <div className="hidden md:block text-on-surface-variant">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-outline-variant/50 p-4 md:p-5 space-y-4 bg-surface-container/30">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Order Items */}
                      <div className="md:col-span-2">
                        <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-3">Items</p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-3 rounded-xl bg-surface-container border border-outline-variant/50"
                            >
                              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shrink-0">
                                <Package className="w-5 h-5 text-on-surface-variant/50" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-body text-sm text-on-surface truncate">{item.productName}</p>
                                <p className="font-body text-xs text-on-surface-variant">
                                  Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                                </p>
                              </div>
                              <span className="font-body text-sm font-semibold text-on-surface">
                                {formatPrice(item.subtotal)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Info & Delivery */}
                      <div className="space-y-4">
                        <div>
                          <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-2">Delivery Details</p>
                          <div className="space-y-1 font-body text-sm">
                            <p className="text-on-surface font-semibold">{order.buyerName}</p>
                            <p className="text-on-surface-variant">{order.buyerPhone}</p>
                            <p className="text-on-surface-variant text-xs">{order.shippingAddress}, {order.shippingCity}, {order.shippingState}</p>
                          </div>
                        </div>

                        <div className="border border-outline-variant/50 rounded-xl p-3.5 bg-surface-container/50">
                          <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-2">Payment Details</p>
                          <p className="text-sm font-semibold">{getPaymentLabel(order.paymentMethod)}</p>
                          {order.paymentReference && (
                            <p className="text-[10px] text-on-surface-variant mt-1 font-mono break-all">
                              Ref: {order.paymentReference}
                            </p>
                          )}
                        </div>

                        {/* Status Actions */}
                        <div className="border border-outline-variant/50 rounded-xl p-3.5 bg-surface-container/50">
                           <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-2">Update Status</p>
                           <div className="flex flex-col gap-2">
                              {order.status === 'pending' || order.status === 'paid' ? (
                                <button onClick={() => updateStatus(order.id, 'processing')} className="w-full px-3 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Mark as Processing</button>
                              ) : null}
                              {order.status === 'processing' ? (
                                <button onClick={() => updateStatus(order.id, 'shipped')} className="w-full px-3 py-2 text-xs bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">Mark as Shipped</button>
                              ) : null}
                              {order.status === 'shipped' ? (
                                <button onClick={() => updateStatus(order.id, 'delivered')} className="w-full px-3 py-2 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">Mark as Delivered</button>
                              ) : null}
                              {order.status !== 'cancelled' && order.status !== 'delivered' ? (
                                <button onClick={() => updateStatus(order.id, 'cancelled')} className="w-full px-3 py-2 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">Cancel Order</button>
                              ) : null}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
