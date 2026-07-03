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
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-600', dot: 'bg-yellow-500', icon: Clock, label: 'Pending' },
  paid: { bg: 'bg-blue-500/10', text: 'text-blue-600', dot: 'bg-blue-500', icon: CreditCard, label: 'Paid' },
  processing: { bg: 'bg-indigo-500/10', text: 'text-indigo-600', dot: 'bg-indigo-500', icon: Package, label: 'Processing' },
  shipped: { bg: 'bg-cyan-500/10', text: 'text-cyan-600', dot: 'bg-cyan-500', icon: Truck, label: 'Shipped' },
  delivered: { bg: 'bg-green-500/10', text: 'text-green-600', dot: 'bg-green-500', icon: CheckCircle, label: 'Delivered' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-600', dot: 'bg-red-500', icon: XCircle, label: 'Cancelled' },
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
        <h2 className="font-heading text-2xl font-bold text-on-surface">Orders</h2>
        <p className="font-body text-sm text-on-surface-variant mt-1">
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
                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-label font-medium whitespace-nowrap transition-all',
                activeTab === tab.value
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-transparent'
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-xs',
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
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <ShoppingCart className="w-10 h-10 text-primary/50" />
          </div>
          <h3 className="font-heading text-xl font-bold text-on-surface mb-2">
            No orders yet
          </h3>
          <p className="font-body text-sm text-on-surface-variant max-w-sm mx-auto">
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
              <div key={order.id} className="bg-white border border-outline-variant/50 rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] overflow-hidden">
                {/* Order Header */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-4 text-left hover:bg-surface-container/50 transition-colors"
                >
                  <div className="flex items-center justify-between md:hidden">
                    <span className="text-xs font-mono text-on-surface-variant">{order.orderNumber}</span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-label font-bold',
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
                        <span className="text-sm font-mono text-on-surface-variant">{order.orderNumber}</span>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-xs font-label font-bold',
                            status.bg,
                            status.text
                          )}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="font-body text-sm text-on-surface font-medium truncate">
                        {order.buyerName}
                      </p>
                    </div>
                  </div>

                  {/* Mobile buyer name */}
                  <p className="font-body text-sm text-on-surface font-medium md:hidden">
                    {order.buyerName}
                  </p>

                  {/* Items preview */}
                  <div className="flex items-center gap-2 flex-1 min-w-0 md:max-w-[200px]">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center border-2 border-surface-container-lowest"
                        >
                          <Package className="w-3.5 h-3.5 text-on-surface-variant/50" />
                        </div>
                      ))}
                    </div>
                    <span className="font-body text-xs text-on-surface-variant">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="flex items-center gap-1.5">
                      <PaymentIcon className="w-3.5 h-3.5 text-on-surface-variant" />
                      <span className="font-body text-xs text-on-surface-variant">{payment.label}</span>
                    </div>
                    <span className="font-body text-sm font-bold text-on-surface">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <div className="hidden md:block">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-on-surface-variant" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-on-surface-variant" />
                      )}
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
                                <p className="font-body text-sm text-on-surface truncate">{item.name}</p>
                                <p className="font-body text-xs text-on-surface-variant">
                                  Qty: {item.quantity} × {formatPrice(item.price)}
                                </p>
                              </div>
                              <span className="font-body text-sm font-semibold text-on-surface">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-4">
                        <div>
                          <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-2">Customer</p>
                          <div className="space-y-1 font-body text-sm">
                            <p className="text-on-surface font-semibold">{order.buyerName}</p>
                            <p className="text-on-surface-variant">{order.buyerPhone}</p>
                            <p className="text-on-surface-variant text-xs">{order.shippingAddress}</p>
                            <p className="text-on-surface-variant text-[11px]">
                              Ordered: {new Date(order.date).toLocaleString('en-NG', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Escrow Details */}
                        <div className="border border-outline-variant/50 rounded-xl p-3.5 bg-surface-container/50">
                          <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-2">Escrow Protection</p>
                          {order.paymentMethod === 'paystack' ? (
                            order.status === 'delivered' ? (
                              <div>
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                                  🔓 Payout Disbursed
                                </span>
                                <p className="text-[10px] text-on-surface-variant mt-1.5 leading-relaxed">
                                  Commission (5%) processed. Payout sent to your bank account.
                                </p>
                              </div>
                            ) : order.status === 'cancelled' ? (
                              <div>
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                  ↩️ Refunded
                                </span>
                                <p className="text-[10px] text-on-surface-variant mt-1.5 leading-relaxed">
                                  Funds returned to the buyer's credit/debit card.
                                </p>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    🔒 Held in Escrow
                                  </span>
                                  <button
                                    onClick={() => updateStatus(order.id, 'delivered')}
                                    className="text-[10px] font-bold text-primary hover:underline hover:text-secondary"
                                  >
                                    Release Payout
                                  </button>
                                </div>
                                <p className="text-[10px] text-on-surface-variant mt-1.5 leading-relaxed">
                                  Secured by platform. Released on customer receipt confirmation.
                                </p>
                              </div>
                            )
                          ) : (
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                              Escrow not active for {order.paymentMethod === 'pay_on_delivery' ? 'Pay on Delivery' : 'WhatsApp Orders'}.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {actions.length > 0 && (
                      <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant/50">
                        {actions.map((action) => (
                          <button
                            key={action.label}
                            onClick={action.onClick}
                            className={cn(
                              'px-4 py-2 rounded-lg text-sm font-label font-bold transition-all',
                              action.variant === 'primary' &&
                                'bg-primary text-on-primary hover:opacity-90',
                              action.variant === 'danger' &&
                                'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
                              action.variant === 'default' &&
                                'bg-surface-container text-on-surface border border-outline-variant/50 hover:bg-surface-container-highest'
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
