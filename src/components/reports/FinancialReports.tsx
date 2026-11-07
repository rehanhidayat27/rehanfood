import React, { useState } from 'react';
import {
  FileText,
  FileDown,
  FileSpreadsheet,
  Calendar,
  TrendingUp,
  DollarSign,
  Percent,
  Wallet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatIDR, exportOrdersToCSV, printSalesReportPDF } from '../../utils/exportUtils.ts';
import { calculateFinancialSummary } from '../../utils/posCalculations.ts';
import { getThemeClasses } from '../../utils/themeHelper.ts';

export const FinancialReports: React.FC = () => {
  const { t, language, orders, playSound, themeColor } = useApp();
  const theme = getThemeClasses(themeColor);
  const [selectedMonth, setSelectedMonth] = useState('2026-10');

  const summary = calculateFinancialSummary(
    orders.map(o => ({
      total: o.total,
      subtotal: o.subtotal,
      items: o.items.map(i => ({
        costPrice: i.menuItem.costPrice,
        quantity: i.quantity,
      })),
    }))
  );

  const handleDownloadPDF = () => {
    playSound('pay');
    printSalesReportPDF(orders, summary.grossRevenue, summary.totalCOGS, summary.netProfit);
  };

  const handleExportCSV = () => {
    playSound('pay');
    exportOrdersToCSV(orders);
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 space-y-6 custom-scrollbar pb-24 lg:pb-8 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            {t('reportsBadge')}
          </span>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {t('reportsTitle')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('reportsSub')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />

          <button
            onClick={handleDownloadPDF}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold text-white ${theme.primaryBg} ${theme.primaryHover} shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer shrink-0`}
          >
            <FileDown className="w-4 h-4 shrink-0" />
            <span>{t('downloadPDF')}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4 shrink-0" />
            <span>Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Profit & Loss Statement Card */}
      <div className="bg-white dark:bg-slate-850 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white break-words">
              Ikhtisar Laba Rugi (P&L Summary) - Periode Oktober 2026
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Berdasarkan data transaksi kasir POS terverifikasi</p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0 whitespace-nowrap">
            Status: Sehat & Profit
          </span>
        </div>

        {/* Financial Flow Breakdown */}
        <div className="space-y-3 text-xs md:text-sm">
          {/* Revenue */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 p-3.5 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-100/80 dark:border-orange-900/40">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-500 shrink-0" />
              <span>1. Total Pendapatan Penjualan Kotor (Gross Revenue)</span>
            </span>
            <span className="font-extrabold text-slate-900 dark:text-white text-base self-end sm:self-auto shrink-0">
              {formatIDR(summary.grossRevenue)}
            </span>
          </div>

          {/* COGS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
            <span className="font-medium text-slate-600 dark:text-slate-400 sm:pl-6">
              2. Harga Pokok Penjualan Bahan Baku (COGS / HPP)
            </span>
            <span className="font-bold text-red-500 text-sm sm:text-base self-end sm:self-auto shrink-0">
              -{formatIDR(summary.totalCOGS)}
            </span>
          </div>

          {/* Gross Profit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-750 font-bold border border-slate-200/80 dark:border-slate-700">
            <span className="text-slate-800 dark:text-slate-200 sm:pl-6">
              3. Laba Kotor Penjualan (Gross Profit)
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 text-sm sm:text-base self-end sm:self-auto shrink-0">
              {formatIDR(summary.grossProfit)}
            </span>
          </div>

          {/* OPEX */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
            <span className="font-medium text-slate-600 dark:text-slate-400 sm:pl-6">
              4. Estimasi Beban Operasional (Gaji, Listrik, Sewa ~15%)
            </span>
            <span className="font-bold text-red-500 text-sm sm:text-base self-end sm:self-auto shrink-0">
              -{formatIDR(summary.estimatedOpex)}
            </span>
          </div>

          {/* Net Profit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <div>
              <span className="text-xs uppercase font-extrabold text-emerald-800 dark:text-emerald-300 block">
                5. Estimasi Laba Bersih (Net Profit)
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                Setelah pengurangan bahan baku dan biaya toko
              </span>
            </div>
            <span className="font-black text-emerald-700 dark:text-emerald-300 text-lg sm:text-xl self-end sm:self-auto shrink-0">
              {formatIDR(summary.netProfit)}
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Order Details */}
      <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
          Rincian Transaksi Penjualan Masuk
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[640px]" aria-label="Rincian Pembukuan">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Waktu</th>
                <th className="pb-3">Pelanggan</th>
                <th className="pb-3">Subtotal</th>
                <th className="pb-3">Pajak PB1</th>
                <th className="pb-3">Total Bersih</th>
                <th className="pb-3">Metode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 font-mono font-bold text-orange-600">{o.orderNumber}</td>
                  <td className="py-3 text-slate-400">{new Date(o.timestamp).toLocaleString('id-ID')}</td>
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                    {o.customerName} ({o.tableOrTakeaway})
                  </td>
                  <td className="py-3">{formatIDR(o.subtotal)}</td>
                  <td className="py-3">{formatIDR(o.tax)}</td>
                  <td className="py-3 font-extrabold text-slate-900 dark:text-white">
                    {formatIDR(o.total)}
                  </td>
                  <td className="py-3">
                    <span className="uppercase text-[10px] font-bold bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                      {o.paymentMethod}
                    </span>
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
