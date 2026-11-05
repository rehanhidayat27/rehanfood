import React from 'react';
import {
  Printer,
  Share2,
  UtensilsCrossed,
  CheckCircle2,
  ArrowRight,
  Download,
  X,
  FileDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatIDR } from '../../utils/exportUtils.ts';
import { getDishName, getSpiceLevelText, getTableName } from '../../utils/translations.ts';

export const ReceiptModal: React.FC = () => {
  const {
    receiptModalOrder,
    setReceiptModalOrder,
    setWhatsappModalOrder,
    playSound,
    t,
    language,
  } = useApp();

  if (!receiptModalOrder) return null;

  const order = receiptModalOrder;

  const handlePrint = () => {
    playSound('pay');
    window.print();
  };

  const handleShareWhatsApp = () => {
    setReceiptModalOrder(null);
    setWhatsappModalOrder(order);
  };

  const handleClose = () => {
    playSound('click');
    setReceiptModalOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-4 py-6 sm:py-8 overflow-y-auto">
      <div className="max-w-md w-full space-y-3 my-auto">
        {/* Receipt Slot & Paper Container */}
        <div className="relative">
          {/* Virtual Cash Register Paper Dispenser Slot */}
          <div className="w-48 h-3.5 mx-auto bg-slate-800 dark:bg-slate-700 rounded-full shadow-inner border border-slate-900" />

          {/* Thermal Receipt Paper with Print Animation */}
          <div
            id="printable-receipt"
            className="animate-receipt-print bg-white text-slate-900 rounded-2xl shadow-2xl p-6 md:p-7 font-mono text-xs border border-slate-200 mx-auto relative overflow-hidden space-y-4 mt-[-6px]"
          >
            {/* Top Close Button for screen view */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors no-print"
              aria-label="Tutup Struk"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Restaurant Brand Header */}
            <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white mx-auto flex items-center justify-center mb-1 shadow-sm">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h2 className="font-sans text-lg font-black tracking-tight text-orange-600">
                {t('brandName')}
              </h2>
              <p className="text-[11px] text-slate-600 font-sans font-medium">
                {language === 'en' ? 'Authentic Indonesian Cuisine' : 'Restoran Kuliner Khas Nusantara'}
              </p>
              <p className="text-[10px] text-slate-600 leading-snug px-2">
                {t('restaurantAddress')} • Telp: {t('restaurantPhone')}
              </p>
              <p className="text-[9px] text-slate-400">
                NPWPD: 03.921.821.2-541.000 • Izin Usaha Resto: 503/2026/F&B
              </p>
            </div>

            {/* Order Metadata */}
            <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 pb-3">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('receiptOrderNo')}</span>
                <span className="font-bold text-slate-900">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('receiptTime')}</span>
                <span>{new Date(order.timestamp).toLocaleString(language === 'en' ? 'en-US' : 'id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('receiptCustomer')}</span>
                <span className="font-bold">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('receiptTable')}</span>
                <span className="font-semibold text-orange-600">{getTableName(order.tableOrTakeaway, language)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('receiptCashier')}</span>
                <span>{order.cashierName}</span>
              </div>
            </div>

            {/* Itemized Menu List */}
            <div className="space-y-2 border-b border-dashed border-slate-300 pb-3">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex justify-between">
                <span>{t('receiptMenuHeader')}</span>
                <span>{t('receiptSubtotalHeader')}</span>
              </div>

              {order.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-900 leading-tight">
                      {item.quantity}x {getDishName(item.menuItem, language)}
                    </span>
                    <span className="font-bold shrink-0 ml-2">
                      {formatIDR(item.menuItem.price * item.quantity)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 pl-4">
                    <span>@{formatIDR(item.menuItem.price)}</span>
                    {item.spiceLevel && (
                      <span className="text-amber-700 bg-amber-50 px-1 rounded">
                        {language === 'en' ? 'Level' : 'Level'}: {getSpiceLevelText(item.spiceLevel, language)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="space-y-1.5 text-xs border-b border-dashed border-slate-300 pb-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Menu</span>
                <span>{formatIDR(order.subtotal)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Potongan Kupon</span>
                  <span>-{formatIDR(order.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Biaya Layanan (2%)</span>
                <span>{formatIDR(order.serviceFee)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Pajak Restoran (PB1 10%)</span>
                <span>{formatIDR(order.tax)}</span>
              </div>

              <div className="flex justify-between items-baseline text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span className="uppercase tracking-tight">TOTAL BAYAR</span>
                <span className="text-base font-extrabold text-orange-600">
                  {formatIDR(order.total)}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Metode Bayar:</span>
                <span className="uppercase font-bold text-slate-800">
                  {order.paymentMethod} (LUNAS)
                </span>
              </div>
            </div>

            {/* Stamp LUNAS / PAID Badge */}
            <div className="relative py-2 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400">Verifikasi Transaksi:</div>
                <div className="text-[10px] font-mono text-slate-600">{order.id}</div>
              </div>

              {/* Red/Green Cashier Stamp */}
              <div className="border-2 border-emerald-600 text-emerald-600 uppercase font-black text-xs px-3 py-1 rounded-lg tracking-widest rotate-[-8deg] shadow-xs">
                ✓ LUNAS / PAID
              </div>
            </div>

            {/* Simulated Barcode */}
            <div className="pt-2 text-center space-y-1 border-t border-dashed border-slate-200">
              <div className="h-9 w-4/5 mx-auto flex items-stretch justify-center gap-0.5 overflow-hidden">
                {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 4, 1, 2, 3, 2, 1, 4, 1].map((w, i) => (
                  <div
                    key={i}
                    className="bg-slate-800"
                    style={{ width: `${w * 1.5}px` }}
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                {t('receiptThankYou')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls for Cashier (Hidden during print) */}
        <div className="space-y-2 no-print">
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t('printOrSavePDF')}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              title="Kirim Struk via WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>{t('newTransaction')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
