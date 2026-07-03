import { Download, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminCommissions() {
  const transactions = [
    { id: 'TRX-1092', shop: 'Tech Haven', amount: '₦120,000', commission: '₦6,000', date: '2026-07-03' },
    { id: 'TRX-1093', shop: 'Smart Accessories', amount: '₦45,000', commission: '₦2,250', date: '2026-07-02' },
    { id: 'TRX-1094', shop: 'Kano Phones Hub', amount: '₦350,000', commission: '₦17,500', date: '2026-07-01' },
    { id: 'TRX-1095', shop: 'Gadget World', amount: '₦80,000', commission: '₦4,000', date: '2026-06-30' },
  ];

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Commissions</h1>
          <p className="text-on-surface-variant mt-2">Track 5% platform fees from marketplace sales.</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-container transition-colors font-medium">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-white p-6 border border-outline-variant/50 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-on-surface-variant font-medium">Total Commissions</h3>
          </div>
          <p className="text-3xl font-bold text-primary">₦245,800</p>
          <p className="text-sm text-secondary mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +12% this month
          </p>
        </div>
        
        <div className="card bg-white p-6 flex flex-col justify-center border border-outline-variant/50 rounded-2xl">
          <h3 className="text-on-surface-variant font-medium mb-2">Pending Payouts</h3>
          <p className="text-3xl font-bold text-primary">₦32,450</p>
        </div>
        
        <div className="card bg-white p-6 flex flex-col justify-center border border-outline-variant/50 rounded-2xl">
          <h3 className="text-on-surface-variant font-medium mb-2">Current Rate</h3>
          <p className="text-3xl font-bold text-primary">5.0%</p>
        </div>
      </div>

      <div className="card bg-white overflow-hidden border border-outline-variant/50 rounded-2xl">
        <div className="p-6 border-b border-outline-variant/50">
          <h2 className="text-lg font-bold text-primary">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-outline-variant/50">
                <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Transaction ID</th>
                <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Shop</th>
                <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Order Amount</th>
                <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Commission (5%)</th>
                <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx) => (
                <tr key={trx.id} className="border-b border-outline-variant/50 hover:bg-surface-container/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-primary whitespace-nowrap">{trx.id}</td>
                  <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">{trx.shop}</td>
                  <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">{trx.amount}</td>
                  <td className="px-6 py-4 font-semibold text-green-600 whitespace-nowrap">+{trx.commission}</td>
                  <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">{trx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
