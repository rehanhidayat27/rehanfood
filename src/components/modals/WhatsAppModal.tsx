import React from 'react';
import { MessageSquare, ExternalLink, Check, Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatIDR } from '../../utils/exportUtils.ts';

export const WhatsAppModal: React.FC = () => {
  const { whatsappModalOrder, setWhatsappModalOrder, playSound } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!whatsappModalOrder) return null;

  const order = whatsappModalOrder;
  const itemsText = order.items
    .map(i => `• ${i.quantity}x ${i.menuItem.name} (${formatIDR(i.menuItem.price * i.quantity)})`)
    .join('\n');

  const waMessage = `*REHAN FOOD - STRUK PEMBAYARAN RESMI* 🍲
Jl. Cibontet, Desa Cibalung, Kec. Cimanggu, Kab. Cilacap, Jawa Tengah
Telp/WA: 082116541696
---------------------------------------
No. Pesanan: *${order.orderNumber}*
Tanggal: ${new Date(order.timestamp).toLocaleString('id-ID')}
Pelanggan: ${order.customerName} (${order.tableOrTakeaway})
Kasir: ${order.cashierName}
---------------------------------------
*Detail Pesanan:*
${itemsText}
---------------------------------------
Subtotal: ${formatIDR(order.subtotal)}
Diskon: ${formatIDR(order.discount)}
Servis (2%): ${formatIDR(order.serviceFee)}
Pajak PB1 (10%): ${formatIDR(order.tax)}
*TOTAL DIBAYAR: ${formatIDR(order.total)}*
Metode Bayar: *${order.paymentMethod.toUpperCase()} (LUNAS)*
---------------------------------------
Terima kasih atas kunjungan Anda di Rehan Food! 🙏`;

  const cleanPhone = (order.customerPhone || '628123456789').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(waMessage);
    setCopied(true);
    playSound('pay');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Notifikasi WhatsApp Otomatis
              </h3>
              <p className="text-[11px] text-slate-400">Ke: {order.customerPhone || '+62 812-3456-7890'}</p>
            </div>
          </div>
          <button
            onClick={() => setWhatsappModalOrder(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {/* WhatsApp Chat Preview Bubble */}
        <div className="bg-[#e5ddd5] dark:bg-slate-950 p-3 rounded-2xl border border-emerald-900/10">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm text-[11px] text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
            {waMessage}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Kirim via WA</span>
          </a>
        </div>
      </div>
    </div>
  );
};
