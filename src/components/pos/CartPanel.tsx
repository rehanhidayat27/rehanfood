import React, { useState } from 'react';
import {
  CreditCard,
  MapPin,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Wifi,
  Receipt,
  Utensils,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatIDR } from '../../utils/exportUtils.ts';
import { getThemeClasses } from '../../utils/themeHelper.ts';
import { getDishName, getSpiceLevelText, getTableName } from '../../utils/translations.ts';

export const CartPanel: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const {
    t,
    language,
    cart,
    updateCartQty,
    removeFromCart,
    clearCart,
    subtotal,
    serviceFee,
    tax,
    total,
    activeTableOrTakeaway,
    setActiveTableOrTakeaway,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponDiscountAmount,
    discountPercentage,
    setIsPaymentModalOpen,
    playSound,
    themeColor,
  } = useApp();

  const theme = getThemeClasses(themeColor);
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isChangingTable, setIsChangingTable] = useState(false);

  const TABLES = [
    'Meja 01 (Indoor)',
    'Meja 02 (Indoor)',
    'Meja 03 (Indoor)',
    'Meja 04 (Non-Smoking)',
    'Meja 05 (Outdoor)',
    'Meja 06 (Outdoor)',
    'Meja 07 (VIP Room)',
    'Takeaway / Bungkus #1',
    'Takeaway / Bungkus #2',
    'Ojek Online (Grab/Gojek)',
  ];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponFeedback({ type: 'success', text: res.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ type: 'error', text: res.message });
    }
  };

  const discountAmount = Math.round(
    (subtotal * discountPercentage) / 100 + couponDiscountAmount
  );

  return (
    <aside
      className="w-full lg:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden transition-colors shrink-0"
      aria-label="Panel Pesanan dan Kasir"
    >
      <div className="p-5 md:p-6 flex-1 overflow-y-auto space-y-5 custom-scrollbar">
        {/* Mobile close button if on small screen */}
        {onCloseMobile && (
          <div className="flex lg:hidden items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white">
              {language === 'en' ? 'Current Order' : 'Pesanan Saat Ini'}
            </h3>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              {language === 'en' ? '✕ Close' : '✕ Tutup'}
            </button>
          </div>
        )}

        {/* 1. "Your Balance" Card matching reference mockup */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {t('balanceTitle')}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">ID: REF-8842</span>
          </div>

          <div
            className={`rounded-2xl p-5 text-white bg-gradient-to-br ${theme.gradientCard} shadow-lg relative overflow-hidden transition-all duration-300`}
          >
            {/* Background geometric accents */}
            <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute top-2 right-4 text-white/40">
              <Wifi className="w-5 h-5 rotate-90" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wider text-white/90">
                  REFOOD MERCHANT WALLET
                </span>
                <CreditCard className="w-5 h-5 text-white/80" />
              </div>

              <div>
                <span className="text-[10px] uppercase text-white/70 block">{t('shiftTotal')}</span>
                <div className="text-2xl font-black tracking-tight">Rp 5.285.800</div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-white/80 pt-1">
                <span>•••• •••• 8645</span>
                <span>08/28</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. "Your Address" / Table Destination matching reference mockup */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {t('locationTitle')}
            </h3>
            <button
              onClick={() => setIsChangingTable(!isChangingTable)}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
            >
              {isChangingTable ? 'OK' : t('changeLocation')}
            </button>
          </div>

          {isChangingTable ? (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700 animate-in fade-in">
              <label className="text-[11px] font-semibold text-slate-500 block">
                {language === 'en' ? 'Select Table / Order Type:' : 'Pilih Meja / Jenis Order:'}
              </label>
              <select
                value={activeTableOrTakeaway}
                onChange={(e) => {
                  setActiveTableOrTakeaway(e.target.value);
                  setIsChangingTable(false);
                  playSound('click');
                }}
                className="w-full text-xs p-2 rounded-lg bg-white dark:bg-slate-750 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
              >
                {TABLES.map((tableItem) => (
                  <option key={tableItem} value={tableItem}>
                    {getTableName(tableItem, language)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {getTableName(activeTableOrTakeaway, language)}
                </h4>
                <p className="text-[11px] text-slate-400 truncate">
                  {t('tableDefault')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3. "Order Menu" List matching reference */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="w-3.5 h-3.5 text-orange-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t('orderMenuTitle')} ({cart.length})
              </h3>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                title="Kosongkan Keranjang"
              >
                <Trash2 className="w-3 h-3" /> {t('clearBtn')}
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
              <Receipt className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('emptyCartTitle')}</p>
              <p className="text-[11px] text-slate-400">{t('emptyCartSub')}</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.menuItem.id}-${item.spiceLevel}`}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60 transition-all hover:border-slate-200"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.menuItem.image}
                    alt={getDishName(item.menuItem, language)}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {getDishName(item.menuItem, language)}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-extrabold text-orange-600 dark:text-orange-400">
                        {formatIDR(item.menuItem.price)}
                      </span>
                      {item.spiceLevel && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold">
                          {getSpiceLevelText(item.spiceLevel, language)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stepper buttons [-] [qty] [+] */}
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 p-0.5 shrink-0 shadow-sm">
                    <button
                      onClick={() => updateCartQty(item.menuItem.id, -1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-orange-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                      aria-label="Kurangi kuantitas"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <span className="w-6 text-center text-xs font-bold text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateCartQty(item.menuItem.id, 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-orange-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                      aria-label="Tambah kuantitas"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Delete Item */}
                  <button
                    onClick={() => removeFromCart(item.menuItem.id)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                    title="Hapus dari pesanan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Bill Summary Calculation matching reference layout */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>{t('subtotal')}</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{formatIDR(subtotal)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" /> {t('couponDiscount')}
              </span>
              <span>-{formatIDR(discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>{t('serviceFee')}</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{formatIDR(serviceFee)}</span>
          </div>

          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>{t('taxPB1')}</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{formatIDR(tax)}</span>
          </div>

          <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
            <span>{t('totalBill')}</span>
            <span className="text-orange-600 dark:text-orange-400">{formatIDR(total)}</span>
          </div>
        </div>

        {/* 5. Coupon code box matching reference design ("Have a coupon code?") */}
        <div className="space-y-1.5 pt-1">
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" />
                <span className="font-bold">{appliedCoupon}</span>
              </div>
              <button
                onClick={removeCoupon}
                className="text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer"
              >
                {language === 'en' ? 'Remove' : 'Hapus'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('couponPlaceholder')}
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white uppercase placeholder-normal placeholder:capitalize focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white shrink-0 transition-colors cursor-pointer"
              >
                {t('applyCoupon')}
              </button>
            </form>
          )}

          {couponFeedback && (
            <p
              className={`text-[11px] ${
                couponFeedback.type === 'success' ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {couponFeedback.text}
            </p>
          )}
        </div>
      </div>

      {/* 6. Checkout CTA Button (Prominent Orange Button matching mockup) */}
      <div className="p-4 md:p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <button
          onClick={() => {
            if (cart.length === 0) return;
            playSound('click');
            setIsPaymentModalOpen(true);
          }}
          disabled={cart.length === 0}
          className={`w-full py-3.5 px-4 rounded-2xl text-sm font-extrabold text-white cursor-pointer ${
            cart.length > 0
              ? `${theme.primaryBg} ${theme.primaryHover} shadow-lg shadow-orange-500/25 active:scale-[0.98]`
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
          } transition-all duration-200 flex items-center justify-center gap-2`}
          aria-label="Lanjutkan ke Pembayaran Otomatis"
        >
          <span>{t('proceedCheckout')} ({formatIDR(total)})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
