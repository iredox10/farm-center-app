'use client';

import { useState } from 'react';
import {
  ShoppingCart,
  Package,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  CreditCard,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Eye,
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import type { OrderStatus, PaymentMethod } from '@/types';

/* ─── Mock Orders ─── */

interface MockOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface MockOrder {
  id: string;
  orderNumber: string;
  date: string;
  buyerName: string;
  buyerPhone: string;
  items: MockOrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  shippingAddress: string;
}

const MOCK_ORDERS: MockOrder[] = [
  {
    id: '1',
    orderNumber: 'FC-20260701-A3F1',
    date: '2026-07-01T14:30:00',
    buyerName: 'Adaeze Okonkwo',
    buyerPhone: '+2348023456789',
    items: [
      { id: 'i1', name: 'iPhone 15 Pro Max 256GB', quantity: 1, price: 950000, imageUrl: '' },
      { id: 'i2', name: 'AirPods Pro 2nd Gen', quantity: 1, price: 185000, imageUrl: '' },
    ],
    totalAmount: 1135000,
    paymentMethod: 'paystack',
    status: 'delivered',
    shippingAddress: '12 Admiralty Way, Lekki Phase 1, Lagos',
  },
  {
    id: '2',
    orderNumber: 'FC-20260701-B7C2',
    date: '2026-07-01T10:15:00',
    buyerName: 'Emeka Nwankwo',
    buyerPhone: '+2348034567890',
    items: [
      { id: 'i3', name: 'Samsung Galaxy S24 Ultra', quantity: 1, price: 720000, imageUrl: '' },
    ],
    totalAmount: 720000,
    paymentMethod: 'paystack',
    status: 'processing',
    shippingAddress: '45 Allen Avenue, Ikeja, Lagos',
  },
  {
    id: '3',
    orderNumber: 'FC-20260630-D4E8',
    date: '2026-06-30T16:45:00',
    buyerName: 'Fatima Suleiman',
    buyerPhone: '+2348045678901',
    items: [
      { id: 'i4', name: 'MacBook Air M3 2024', quantity: 1, price: 1200000, imageUrl: '' },
    ],
    totalAmount: 1200000,
    paymentMethod: 'pay_on_delivery',
    status: 'paid',
    shippingAddress: '7 Ahmadu Bello Way, Victoria Island, Lagos',
  },
  {
    id: '4',
    orderNumber: 'FC-20260630-F1G9',
    date: '2026-06-30T09:20:00',
    buyerName: 'Chidi Okafor',
    buyerPhone: '+2348056789012',
    items: [
      { id: 'i5', name: 'JBL Flip 6 Speaker', quantity: 2, price: 75000, imageUrl: '' },
    ],
    totalAmount: 150000,
    paymentMethod: 'whatsapp',
    status: 'pending',
    shippingAddress: '23 Herbert Macaulay Road, Yaba, Lagos',
  },
  {
    id: '5',
    orderNumber: 'FC-20260629-H6J3',
    date: '2026-06-29T13:10:00',
    buyerName: 'Blessing Eze',
    buyerPhone: '+2348067890123',
    items: [
      { id: 'i6', name: 'iPhone 15 Pro Max 256GB', quantity: 1, price: 950000, imageUrl: '' },
    ],
    totalAmount: 950000,
    paymentMethod: 'paystack',
    status: 'shipped',
    shippingAddress: '56 Opebi Road, Ikeja, Lagos',
  },
  {
    id: '6',
    orderNumber: 'FC-20260628-K2L4',
    date: '2026-06-28T11:00:00',
    buyerName: 'Oluwaseun Adeyemi',
    buyerPhone: '+2348078901234',
    items: [
      { id: 'i7', name: 'AirPods Pro 2nd Gen', quantity: 2, price: 185000, imageUrl: '' },
    ],
    totalAmount: 370000,
    paymentMethod: 'paystack',
    status: 'cancelled',
    shippingAddress: '89 Awolowo Road, Ikoyi, Lagos',
  },
];

/* ─── Status Config ─── */

const STATUS_CONFIG: Record<
  OrderStatus,
  { bg: string; text: string; dot: string; icon: React.ComponentType<{ className?: string }>; label: string }
> = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400', icon: Clock, label: 'Pending' },
  paid: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400', icon: CreditCard, label: 'Paid' },
  processing: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', dot: 'bg-indigo-400', icon: Package, label: 'Processing' },
  shipped: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', dot: 'bg-cyan-400', icon: Truck, label: 'Shipped' },
  delivered: { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'bg-green-400', icon: CheckCircle, label: 'Delivered' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400', icon: XCircle, label: 'Cancelled' },
};

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  paystack: { label: 'Paystack', icon: CreditCard },
  pay_on_delivery: { label: 'Pay on Delivery', icon: Package },
  whatsapp: { label: 'WhatsApp', icon: MessageCircle },
};

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
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const filteredOrders =
    activeTab === 'all' ? orders : orders.filter((o) => o.status === activeTab);

  function updateStatus(orderId: string, newStatus: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  }

  function getActionButtons(order: MockOrder) {
    const buttons: { label: string; onClick: () => void; variant: 'primary' | 'danger' | 'default' }[] = [];

    switch (order.status) {
      case 'pending':
      case 'paid':
        buttons.push({
          label: 'Confirm Order',
          onClick: () => updateStatus(order.id, 'processing'),
          variant: 'primary',
        });
        buttons.push({
          label: 'Cancel',
          onClick: () => updateStatus(order.id, 'cancelled'),
          variant: 'danger',
        });
        break;
      case 'processing':
        buttons.push({
          label: 'Mark Shipped',
          onClick: () => updateStatus(order.id, 'shipped'),
          variant: 'primary',
        });
        buttons.push({
          label: 'Cancel',
          onClick: () => updateStatus(order.id, 'cancelled'),
          variant: 'danger',
        });
        break;
      case 'shipped':
        buttons.push({
          label: 'Mark Delivered',
          onClick: () => updateStatus(order.id, 'delivered'),
          variant: 'primary',
        });
        break;
      default:
        break;
    }

    return buttons;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-text-primary">Orders</h2>
        <p className="text-sm text-text-secondary mt-1">
          Manage and fulfill customer orders
        </p>
      </div>

      {/* Tab Filters */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
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
                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                activeTab === tab.value
                  ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                  : 'text-text-muted hover:text-text-secondary hover:bg-white/5 border border-transparent'
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-xs',
                  activeTab === tab.value ? 'bg-green-400/20' : 'bg-white/5'
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
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-green-400/10 flex items-center justify-center mb-5">
            <ShoppingCart className="w-10 h-10 text-green-400/50" />
          </div>
          <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
            No orders yet
          </h3>
          <p className="text-sm text-text-secondary max-w-sm mx-auto">
            {activeTab === 'all'
              ? "You haven't received any orders yet. Share your shop to get started!"
              : `No ${activeTab} orders at the moment.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = STATUS_CONFIG[order.status];
            const StatusIcon = status.icon;
            const payment = PAYMENT_METHOD_LABELS[order.paymentMethod];
            const PaymentIcon = payment.icon;
            const isExpanded = expandedOrder === order.id;
            const actions = getActionButtons(order);

            return (
              <div key={order.id} className="glass-card overflow-hidden">
                {/* Order Header */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-4 text-left hover:bg-white/2 transition-colors"
                >
                  <div className="flex items-center justify-between md:hidden">
                    <span className="text-xs font-mono text-text-muted">{order.orderNumber}</span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                        status.bg,
                        status.text
                      )}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:flex items-center gap-4 flex-1 min-w-0">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', status.bg)}>
                      <StatusIcon className={cn('w-5 h-5', status.text)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-mono text-text-muted">{order.orderNumber}</span>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium',
                            status.bg,
                            status.text
                          )}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-text-primary font-medium truncate">
                        {order.buyerName}
                      </p>
                    </div>
                  </div>

                  {/* Mobile buyer name */}
                  <p className="text-sm text-text-primary font-medium md:hidden">
                    {order.buyerName}
                  </p>

                  {/* Items preview */}
                  <div className="flex items-center gap-2 flex-1 min-w-0 md:max-w-[200px]">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="w-8 h-8 rounded-lg bg-navy-800 border-2 border-navy-900 flex items-center justify-center"
                        >
                          <Package className="w-3.5 h-3.5 text-text-muted/50" />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-text-muted">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="flex items-center gap-1.5">
                      <PaymentIcon className="w-3.5 h-3.5 text-text-muted" />
                      <span className="text-xs text-text-muted">{payment.label}</span>
                    </div>
                    <span className="text-sm font-bold text-text-primary">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <div className="hidden md:block">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-text-muted" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-text-muted" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-white/6 p-4 md:p-5 space-y-4 bg-white/[0.02]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Order Items */}
                      <div className="md:col-span-2">
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Items</p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/4"
                            >
                              <div className="w-12 h-12 rounded-lg bg-navy-800 flex items-center justify-center shrink-0">
                                <Package className="w-5 h-5 text-text-muted/30" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-text-primary truncate">{item.name}</p>
                                <p className="text-xs text-text-muted">
                                  Qty: {item.quantity} × {formatPrice(item.price)}
                                </p>
                              </div>
                              <span className="text-sm font-semibold text-text-primary">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Customer</p>
                        <div className="space-y-2 text-sm">
                          <p className="text-text-primary">{order.buyerName}</p>
                          <p className="text-text-secondary">{order.buyerPhone}</p>
                          <p className="text-text-muted text-xs">{order.shippingAddress}</p>
                          <p className="text-text-muted text-xs">
                            {new Date(order.date).toLocaleString('en-NG', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {actions.length > 0 && (
                      <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/6">
                        {actions.map((action) => (
                          <button
                            key={action.label}
                            onClick={action.onClick}
                            className={cn(
                              'px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]',
                              action.variant === 'primary' &&
                                'bg-gradient-to-r from-green-400 to-green-600 text-navy-950 hover:shadow-lg hover:shadow-green-400/25',
                              action.variant === 'danger' &&
                                'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
                              action.variant === 'default' &&
                                'bg-white/5 text-text-secondary border border-white/8 hover:bg-white/10'
                            )}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
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
