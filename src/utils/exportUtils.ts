import { OrderTransaction, RawMaterial } from '../types/index.ts';

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateIndo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function exportOrdersToCSV(orders: OrderTransaction[]) {
  const headers = [
    'No Pesanan',
    'Tanggal & Waktu',
    'Pelanggan',
    'No Telp',
    'Meja/Takeaway',
    'Item Pesanan',
    'Subtotal (IDR)',
    'Diskon (IDR)',
    'Service Fee (IDR)',
    'Pajak PB1 (IDR)',
    'Total (IDR)',
    'Metode Bayar',
    'Kasir'
  ];

  const rows = orders.map(order => [
    order.orderNumber,
    new Date(order.timestamp).toLocaleString('id-ID'),
    `"${order.customerName.replace(/"/g, '""')}"`,
    order.customerPhone || '-',
    order.tableOrTakeaway,
    `"${order.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join('; ')}"`,
    order.subtotal,
    order.discount,
    order.serviceFee,
    order.tax,
    order.total,
    order.paymentMethod.toUpperCase(),
    `"${order.cashierName.replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Laporan_Penjualan_RefoodPOS_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportInventoryToCSV(rawMaterials: RawMaterial[]) {
  const headers = ['ID', 'Nama Bahan Baku', 'Stok Saat Ini', 'Satuan', 'Batas Kritis', 'Harga per Unit (IDR)', 'Supplier', 'Restock Terakhir'];
  const rows = rawMaterials.map(m => [
    m.id,
    `"${m.name.replace(/"/g, '""')}"`,
    m.currentStock,
    m.unit,
    m.minThreshold,
    m.costPerUnit,
    `"${m.supplier.replace(/"/g, '""')}"`,
    m.lastRestocked
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Laporan_Stok_RefoodPOS_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printSalesReportPDF(orders: OrderTransaction[], grossTotal: number, totalCogs: number, netProfit: number) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const orderRowsHtml = orders.map((o, idx) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px;">${idx + 1}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: bold;">${o.orderNumber}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px;">${new Date(o.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px;">${o.customerName} (${o.tableOrTakeaway})</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px;">${o.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-transform: uppercase;">${o.paymentMethod}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: right; font-weight: bold;">${formatIDR(o.total)}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Laporan Penjualan Refood POS</title>
        <style>
          body { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; color: #1e293b; padding: 24px; margin: 0; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ea580c; padding-bottom: 16px; margin-bottom: 24px; }
          .title { font-size: 24px; font-weight: 800; color: #ea580c; }
          .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
          .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
          .stat-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; }
          .stat-val { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th { background: #f1f5f9; padding: 10px 8px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569; }
          .footer { margin-top: 32px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">REHAN FOOD - RESTORAN KULINER NUSANTARA</div>
            <div class="subtitle">Jl. Cibontet, Desa Cibalung, Kec. Cimanggu, Kab. Cilacap, Jawa Tengah • Telp: 082116541696</div>
            <div class="subtitle">Laporan Transaksi & Kinerja Keuangan Harian | Dicetak: ${new Date().toLocaleString('id-ID')}</div>
          </div>
          <div>
            <button onclick="window.print()" style="background: #ea580c; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer;">
              🖨️ Cetak / Simpan ke PDF
            </button>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Omset Penjualan (Gross)</div>
            <div class="stat-val" style="color: #ea580c;">${formatIDR(grossTotal)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total HPP Bahan Baku (COGS)</div>
            <div class="stat-val" style="color: #64748b;">${formatIDR(totalCogs)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Laba Bersih Estimasi (Net Profit)</div>
            <div class="stat-val" style="color: #16a34a;">${formatIDR(netProfit)}</div>
          </div>
        </div>

        <h3 style="font-size: 16px; margin-bottom: 8px;">Daftar Transaksi Kasir</h3>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Order ID</th>
              <th>Jam</th>
              <th>Pelanggan</th>
              <th>Detail Menu</th>
              <th>Metode</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderRowsHtml}
          </tbody>
        </table>

        <div class="footer">
          Refood POS • Terintegrasi Cloud & Multi-Hak Akses • Sistem Kasir Kuliner Nusantara
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
