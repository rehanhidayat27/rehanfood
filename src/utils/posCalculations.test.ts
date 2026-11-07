import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOrderTotals,
  calculateCashChange,
  checkLowStock,
  calculateFinancialSummary,
  verifyStaffPin,
  formatDeletePrompt,
  canUserEditStaffRole,
  validateStaffUpdates,
} from './posCalculations.ts';

test('calculateOrderTotals applies subtotal, discount, 2% service fee, and 10% tax correctly', () => {
  const result = calculateOrderTotals({
    subtotal: 100000,
    discountPercentage: 10, // 10,000 discount -> 90,000
    couponDiscountAmount: 0,
    serviceFeeRate: 0.02, // 1,800
    taxRate: 0.10, // (90,000 + 1,800) * 10% = 9,180
  });

  assert.equal(result.subtotal, 100000);
  assert.equal(result.discountAmount, 10000);
  assert.equal(result.afterDiscount, 90000);
  assert.equal(result.serviceFeeAmount, 1800);
  assert.equal(result.taxAmount, 9180);
  assert.equal(result.total, 90000 + 1800 + 9180);
});

test('calculateCashChange computes correct change and sufficiency', () => {
  const ok = calculateCashChange(75000, 100000);
  assert.equal(ok.change, 25000);
  assert.equal(ok.isSufficient, true);

  const short = calculateCashChange(75000, 50000);
  assert.equal(short.change, 0);
  assert.equal(short.isSufficient, false);
});

test('checkLowStock flags warning and critical accurately', () => {
  const normal = checkLowStock(20, 10);
  assert.equal(normal.isLow, false);
  assert.equal(normal.isCritical, false);

  const low = checkLowStock(8, 10);
  assert.equal(low.isLow, true);
  assert.equal(low.isCritical, false);

  const critical = checkLowStock(4, 10);
  assert.equal(critical.isLow, true);
  assert.equal(critical.isCritical, true);

  const empty = checkLowStock(0, 10);
  assert.equal(empty.isCritical, true);
});

test('calculateFinancialSummary computes COGS, gross profit, and margin correctly', () => {
  const orders = [
    {
      total: 150000,
      subtotal: 130000,
      items: [
        { costPrice: 20000, quantity: 2 },
        { costPrice: 15000, quantity: 1 }
      ]
    }
  ];
  const summary = calculateFinancialSummary(orders);
  assert.equal(summary.grossRevenue, 150000);
  assert.equal(summary.totalCOGS, 55000); // 20k*2 + 15k*1
  assert.equal(summary.grossProfit, 95000);
});

test('verifyStaffPin correctly verifies exact 6-digit PIN and rejects mismatch or wrong length', () => {
  // Exact match
  const adminOk = verifyStaffPin('888888', '888888');
  assert.equal(adminOk.isValid, true);

  const kasirPagiOk = verifyStaffPin('123456', '123456');
  assert.equal(kasirPagiOk.isValid, true);

  const kasirSiangOk = verifyStaffPin('654321', '654321');
  assert.equal(kasirSiangOk.isValid, true);

  // Mismatch PIN (e.g. typing kasir pagi pin for admin)
  const mismatch = verifyStaffPin('888888', '123456');
  assert.equal(mismatch.isValid, false);
  assert.equal(mismatch.message, 'Sandi PIN salah untuk posisi yang dipilih!');

  // Short length
  const short = verifyStaffPin('888888', '888');
  assert.equal(short.isValid, false);
  assert.equal(short.message, 'PIN harus 6 digit angka.');
});

test('formatDeletePrompt formats exact deletion confirmation matching user requirements', () => {
  assert.equal(
    formatDeletePrompt('bahan', 'Daging Sapi Has Luar (Sirloin)'),
    'Hapus bahan "Daging Sapi Has Luar (Sirloin)"?'
  );
  assert.equal(
    formatDeletePrompt('bahan', 'Daging Ayam Fillet'),
    'Hapus bahan "Daging Ayam Fillet"?'
  );
  assert.equal(
    formatDeletePrompt('menu', 'Rendang Daging Padang Autentik'),
    'Hapus menu "Rendang Daging Padang Autentik"?'
  );
  assert.equal(
    formatDeletePrompt('jadwal', 'Briefing Operasional Dapur'),
    'Hapus jadwal "Briefing Operasional Dapur"?'
  );
});

test('canUserEditStaffRole enforces that only Admin and Manager can edit staff, and Kasir cannot edit', () => {
  // Admin can edit kasir, manager, and admin
  assert.equal(canUserEditStaffRole('admin', 'kasir'), true);
  assert.equal(canUserEditStaffRole('admin', 'manager'), true);
  assert.equal(canUserEditStaffRole('admin', 'admin'), true);

  // Manager can edit kasir and manager, but NOT admin
  assert.equal(canUserEditStaffRole('manager', 'kasir'), true);
  assert.equal(canUserEditStaffRole('manager', 'manager'), true);
  assert.equal(canUserEditStaffRole('manager', 'admin'), false);

  // Kasir CANNOT edit anyone (kasir, manager, admin)
  assert.equal(canUserEditStaffRole('kasir', 'kasir'), false);
  assert.equal(canUserEditStaffRole('kasir', 'manager'), false);
  assert.equal(canUserEditStaffRole('kasir', 'admin'), false);
});

test('validateStaffUpdates validates name and 6-digit PIN correctly', () => {
  // Valid updates
  assert.equal(validateStaffUpdates({ name: 'Fajar Nugraha', pin: '112233' }).isValid, true);
  assert.equal(validateStaffUpdates({ name: 'Kasir Baru' }).isValid, true);
  assert.equal(validateStaffUpdates({ pin: '654321' }).isValid, true);

  // Invalid empty name
  const emptyName = validateStaffUpdates({ name: '   ' });
  assert.equal(emptyName.isValid, false);
  assert.equal(emptyName.message, 'Nama staf tidak boleh kosong.');

  // Invalid PIN (less than 6 digits)
  const shortPin = validateStaffUpdates({ pin: '1234' });
  assert.equal(shortPin.isValid, false);
  assert.equal(shortPin.message, 'Sandi PIN harus terdiri dari tepat 6 angka numerik.');

  // Invalid PIN (non-numeric characters)
  const alphaPin = validateStaffUpdates({ pin: '12345a' });
  assert.equal(alphaPin.isValid, false);
});

