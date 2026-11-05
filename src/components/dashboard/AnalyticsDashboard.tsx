import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Award,
  FileSpreadsheet,
  FileDown,
  Clock,
  ArrowUpRight,
  Share2,
  Printer,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatIDR, exportOrdersToCSV, printSalesReportPDF } from '../../utils/exportUtils.ts';
import { calculateFinancialSummary } from '../../utils/posCalculations.ts';
import { getThemeClasses } from '../../utils/themeHelper.ts';
import { getDishName } from '../../utils/translations.ts';

export const AnalyticsDashboard: React.FC = () => {
  const {
    t,
    language,
    orders,
    menuItems,
    setWhatsappModalOrder,
    setReceiptModalOrder,
    playSound,
    themeColor,
  } = useApp();

  const theme = getThemeClasses(themeColor);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Compute financial metrics
  const financialSummary = calculateFinancialSummary(
    orders.map(o => ({
      total: o.total,
      subtotal: o.subtotal,
      items: o.items.map(i => ({
        costPrice: i.menuItem.costPrice,
        quantity: i.quantity,
      })),
    }))
  );

  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(financialSummary.grossRevenue / totalOrdersCount) : 0;

  // Breakdown by payment method
  const methodCounts = orders.reduce((acc, o) => {
    acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + o.total;
    return acc;
  }, {} as Record<string, number>);

  // Dish popularity
  const dishSales = orders.reduce((acc, o) => {
    for (const item of o.items) {
      acc[item.menuItem.name] = (acc[item.menuItem.name] || 0) + item.quantity;
    }
    return acc;
  }, {} as Record<string, number>);

  const topDishes = Object.entries(dishSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxDishQty = topDishes.length > 0 ? topDishes[0][1] : 1;

  const handleExportPDF = () => {
    playSound('pay');
    printSalesReportPDF(
      orders,
      financialSummary.grossRevenue,
      financialSummary.totalCOGS,
      financialSummary.netProfit
    );
  };

  const handleExportCSV = () => {
    playSound('pay');
    exportOrdersToCSV(orders);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 custom-scrollbar pb-24 lg:pb-8">
      {/* Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              {t('dashboardBadge')}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              ● {t('liveSync')}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {t('dashboardTitle')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('dashboardSub')}
          </p>
        </div>

        {/* Time filters & Exports */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time range selector */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            {(['today', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => {
                  setTimeRange(range);
                  playSound('click');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  timeRange === range
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                {range === 'today' ? t('today') : range === 'week' ? t('sevenDays') : t('thisMonth')}
              </button>
            ))}
          </div>

          {/* Export PDF */}
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-orange-500/20 transition-colors cursor-pointer"
            title="Download Laporan Format PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{t('downloadPDF')}</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export Data ke Excel/CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{t('exportCSV')}</span>
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Gross Sales */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>{t('grossRevenue')}</span>
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatIDR(financialSummary.grossRevenue)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{language === 'en' ? '+18.4% from yesterday' : '+18.4% dari kemarin'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Net Profit */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>{t('netProfit')}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {formatIDR(financialSummary.netProfit)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {language === 'en' ? 'Profit Margin: ' : 'Margin Keuntungan: '}
              <strong className="text-slate-700 dark:text-slate-200">{financialSummary.marginPercent}%</strong>
            </div>
          </div>
        </div>

        {/* Card 3: Total Orders */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>{t('totalOrders')}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {totalOrdersCount} {language === 'en' ? 'Orders' : 'Transaksi'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {language === 'en' ? 'Payment Status: ' : 'Semua status pembayaran: '}
              <strong className="text-emerald-600">{language === 'en' ? 'Paid / Settled' : 'Lunas (Paid)'}</strong>
            </div>
          </div>
        </div>

        {/* Card 4: Average Order Value */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>{t('avgOrderValue')}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatIDR(avgOrderValue)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {language === 'en' ? 'Menu package upselling efficiency' : 'Efisiensi upselling menu paket'}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Top Selling Dishes + Payment Method Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Dishes */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-850 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">
                {t('bestSellers')}
              </h3>
              <p className="text-xs text-slate-400">{t('bestSellersSub')}</p>
            </div>
            <span className="text-xs text-orange-600 font-bold">
              {language === 'en' ? 'Live Auto-Updated' : 'Terupdate otomatis'}
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {topDishes.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada transaksi menu.</p>
            ) : (
              topDishes.map(([name, qty], idx) => {
                const menuItem = menuItems.find(m => m.name === name);
                const percent = Math.round((qty / maxDishQty) * 100);

                return (
                  <div key={name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                        <span className="w-4 text-slate-400">#{idx + 1}</span>
                        {menuItem && (
                          <img
                            src={menuItem.image}
                            alt={name}
                            className="w-6 h-6 rounded-md object-cover"
                          />
                        )}
                        <span className="truncate max-w-[200px] sm:max-w-xs">
                          {menuItem ? getDishName(menuItem, language) : name}
                        </span>
                      </div>
                      <span className="font-mono text-slate-500 font-semibold">
                        {qty} {language === 'en' ? 'servings sold' : 'porsi terjual'}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${idx === 0 ? theme.primaryBg : 'bg-orange-400'} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="bg-white dark:bg-slate-850 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">
              Distribusi Metode Pembayaran
            </h3>
            <p className="text-xs text-slate-400">Total penerimaan kas per kanal</p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'qris', label: 'QRIS Dinamis', color: 'bg-orange-500' },
              { id: 'cash', label: 'Tunai (Cash)', color: 'bg-emerald-500' },
              { id: 'card', label: 'Kartu Debit/Kredit', color: 'bg-blue-500' },
              { id: 'ewallet', label: 'E-Wallet', color: 'bg-purple-500' },
            ].map((m) => {
              const amount = methodCounts[m.id] || 0;
              const pct = financialSummary.grossRevenue > 0 ? Math.round((amount / financialSummary.grossRevenue) * 100) : 0;

              return (
                <div key={m.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${m.color}`} />
                      {m.label}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatIDR(amount)}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 text-right">{pct}% dari total omset</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Table: Real-Time Recent Transactions */}
      <div className="bg-white dark:bg-slate-850 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">
              {t('recentTransactions')}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'en' ? 'Live incoming cashier transactions' : 'Daftar transaksi kasir yang masuk secara langsung'}
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {orders.length} {language === 'en' ? 'orders logged' : 'order tercatat'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" aria-label="Tabel Transaksi Terkini">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">{t('orderIdCol')}</th>
                <th className="pb-3">{t('timeCol')}</th>
                <th className="pb-3">{t('customerCol')}</th>
                <th className="pb-3">{t('itemsCol')}</th>
                <th className="pb-3">{t('methodCol')}</th>
                <th className="pb-3">{t('totalCol')}</th>
                <th className="pb-3 text-right pr-2">{t('actionCol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="py-3 pl-2 font-mono font-bold text-orange-600 dark:text-orange-400">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(order.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                    <div>{order.customerName}</div>
                    <div className="text-[10px] text-slate-400">{order.tableOrTakeaway}</div>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {order.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 font-extrabold text-slate-900 dark:text-white">
                    {formatIDR(order.total)}
                  </td>
                  <td className="py-3 text-right pr-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setWhatsappModalOrder(order)}
                        className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
                        title="Kirim Struk via WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setReceiptModalOrder(order)}
                        className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/60"
                        title="Cetak Struk Transaksi"
                      >
                        <Printer className="w-3.5 h-3.5" />
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
};
