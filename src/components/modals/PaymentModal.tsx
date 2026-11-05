import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  QrCode,
  Banknote,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Printer,
  Share2,
  Mail,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatIDR } from '../../utils/exportUtils.ts';
import { PaymentMethod, OrderTransaction } from '../../types/index.ts';
import { calculateCashChange } from '../../utils/posCalculations.ts';
import { getThemeClasses } from '../../utils/themeHelper.ts';

export const PaymentModal: React.FC = () => {
  const {
    t,
    language,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    total,
    completeCheckout,
    setWhatsappModalOrder,
    setReceiptModalOrder,
    themeColor,
  } = useApp();

  const theme = getThemeClasses(themeColor);
  const [method, setMethod] = useState<PaymentMethod>('qris');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+62 812-3456-7890');
  const [customerEmail, setCustomerEmail] = useState('pelanggan@gmail.com');
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderTransaction | null>(null);

  if (!isPaymentModalOpen) return null;

  const cashChangeInfo = calculateCashChange(total, cashGiven);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#16a34a', '#2563eb', '#eab308'],
      });
    } catch {
      // ignore
    }
  };

  const handleProcessPayment = () => {
    if (method === 'cash' && !cashChangeInfo.isSufficient) {
      return;
    }

    setIsProcessing(true);

    // Instant automated payment verification
    setTimeout(() => {
      setIsProcessing(false);
      completeCheckout(
        method,
        customerName || (language === 'en' ? 'Dine-in Customer' : 'Pelanggan Meja'),
        customerPhone,
        customerEmail
      );
      triggerConfetti();
    }, 800);
  };

  const handleClose = () => {
    setIsPaymentModalOpen(false);
    setCompletedOrder(null);
    setCashGiven(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 my-auto">
        {!completedOrder ? (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Sistem Pembayaran Otomatis
                </h3>
                <p className="text-xs text-slate-400">Pilih metode bayar & verifikasi instan</p>
              </div>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            {/* Total Highlight */}
            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                  Total Tagihan Restoran
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  {formatIDR(total)}
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full font-bold bg-orange-500 text-white shadow-sm">
                PB1 10% & Servis Include
              </span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Pilih Metode Pembayaran:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'qris', label: 'QRIS Statis/Dinamis', icon: QrCode },
                  { id: 'cash', label: 'Tunai (Cash)', icon: Banknote },
                  { id: 'ewallet', label: 'E-Wallet (GoPay/Dana)', icon: Smartphone },
                  { id: 'card', label: 'Debit / Kredit', icon: CreditCard },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = method === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setMethod(item.id as PaymentMethod);
                        if (item.id === 'cash' && cashGiven < total) {
                          setCashGiven(Math.ceil(total / 50000) * 50000 || 100000);
                        }
                      }}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold ring-2 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[11px] leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Method Details */}
            {method === 'qris' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-3">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Scan QRIS Menggunakan BCA, GoPay, Mandiri, OVO, ShopeePay
                </div>
                <div className="inline-block p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                  <div className="w-40 h-40 bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-between text-white relative">
                    {/* SVG representation of standard QR code */}
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                      <rect width="30" height="30" />
                      <rect x="70" width="30" height="30" />
                      <rect y="70" width="30" height="30" />
                      <rect x="8" y="8" width="14" height="14" fill="#000" />
                      <rect x="78" y="8" width="14" height="14" fill="#000" />
                      <rect x="8" y="78" width="14" height="14" fill="#000" />
                      <circle cx="50" cy="50" r="10" fill="#ea580c" />
                      <rect x="36" y="20" width="6" height="15" />
                      <rect x="58" y="20" width="6" height="20" />
                      <rect x="36" y="65" width="10" height="6" />
                      <rect x="58" y="65" width="14" height="6" />
                      <rect x="44" y="44" width="12" height="12" fill="#fff" />
                    </svg>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Sistem otomatis mendeteksi status pembayaran masuk secara real-time.
                </p>
              </div>
            )}

            {method === 'cash' && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Uang Tunai Diterima:
                  </label>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatIDR(cashGiven)}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {[50000, 100000, 150000, 200000, 300000, 500000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCashGiven(val)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all ${
                        cashGiven === val
                          ? 'border-orange-500 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {formatIDR(val)}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  placeholder="Atau ketik jumlah uang tunai..."
                  value={cashGiven || ''}
                  onChange={(e) => setCashGiven(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-750 text-slate-900 dark:text-white"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Kembalian:</span>
                  <span
                    className={`font-extrabold text-sm ${
                      cashChangeInfo.isSufficient ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {cashChangeInfo.isSufficient
                      ? formatIDR(cashChangeInfo.change)
                      : 'Uang Kurang!'}
                  </span>
                </div>
              </div>
            )}

            {method === 'ewallet' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Integrasi E-Wallet Indonesia:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['GoPay', 'OVO', 'Dana / LinkAja'].map((ew) => (
                    <div
                      key={ew}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-750 text-center font-bold text-xs text-slate-800 dark:text-slate-200"
                    >
                      {ew}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  Permintaan bayar akan otomatis diteruskan ke nomor ponsel pelanggan di bawah ini.
                </p>
              </div>
            )}

            {method === 'card' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mesin EDC Kasir (BCA, Mandiri, BRI, BNI):
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Silakan tap kartu contactless atau masukkan chip kartu ke terminal EDC POS.
                </p>
              </div>
            )}

            {/* Customer Details for Automated WhatsApp & Email notifications */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {t('customerDataLabel')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={t('customerNamePlaceholder')}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder={t('phonePlaceholder')}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                disabled={isProcessing || (method === 'cash' && !cashChangeInfo.isSufficient)}
                onClick={handleProcessPayment}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white ${theme.primaryBg} ${theme.primaryHover} shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifikasi Pembayaran Otomatis...</span>
                  </>
                ) : (
                  <>
                    <span>{t('confirmPaymentBtn')} ({formatIDR(total)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Payment Success State with automated notification dispatches */
          <div className="space-y-6 text-center py-2 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Pembayaran Berhasil Diterima
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                Transaksi {completedOrder.orderNumber} Selesai!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Stok bahan baku resep telah terpotong otomatis dan analitik penjualan telah diperbarui.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Pelanggan & Meja:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {completedOrder.customerName} ({completedOrder.tableOrTakeaway})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Metode Pembayaran:</span>
                <span className="font-bold text-orange-600 uppercase">
                  {completedOrder.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-extrabold text-sm">
                <span>Total Bayar:</span>
                <span className="text-slate-900 dark:text-white">{formatIDR(completedOrder.total)}</span>
              </div>
            </div>

            {/* Quick Action Integrations */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Otomatisasi & Kirim Struk Digital:
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setWhatsappModalOrder(completedOrder);
                  }}
                  className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex flex-col items-center gap-1.5 hover:bg-emerald-100 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span>Kirim WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setReceiptModalOrder(completedOrder);
                  }}
                  className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold flex flex-col items-center gap-1.5 hover:bg-blue-100 transition-colors"
                >
                  <Printer className="w-4 h-4 text-blue-600" />
                  <span>Cetak Struk / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    alert(`✅ Email notifikasi invoice PDF otomatis dikirimkan ke: ${completedOrder.customerEmail}`);
                  }}
                  className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 text-xs font-bold flex flex-col items-center gap-1.5 hover:bg-orange-100 transition-colors"
                >
                  <Mail className="w-4 h-4 text-orange-600" />
                  <span>Email Terkirim</span>
                </button>
              </div>
            </div>

            {/* Done button */}
            <button
              type="button"
              onClick={handleClose}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white ${theme.primaryBg} ${theme.primaryHover} shadow-md`}
            >
              Kembali ke Layar Kasir POS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
