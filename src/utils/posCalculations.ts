export interface OrderCalculationInput {
  subtotal: number;
  discountPercentage?: number;
  couponDiscountAmount?: number;
  taxRate?: number; // e.g. 0.10 for 10% PB1
  serviceFeeRate?: number; // e.g. 0.05 for 5%
}

export interface OrderCalculationResult {
  subtotal: number;
  discountAmount: number;
  afterDiscount: number;
  taxAmount: number;
  serviceFeeAmount: number;
  total: number;
}

export function calculateOrderTotals(input: OrderCalculationInput): OrderCalculationResult {
  const subtotal = Math.max(0, input.subtotal);
  const percentDiscount = input.discountPercentage ? (subtotal * input.discountPercentage) / 100 : 0;
  const couponDiscount = input.couponDiscountAmount || 0;
  const discountAmount = Math.min(subtotal, Math.round(percentDiscount + couponDiscount));
  const afterDiscount = Math.max(0, subtotal - discountAmount);

  const serviceFeeRate = input.serviceFeeRate ?? 0.02; // default 2%
  const serviceFeeAmount = Math.round(afterDiscount * serviceFeeRate);

  const taxRate = input.taxRate ?? 0.10; // default 10% PB1 restoran
  const taxAmount = Math.round((afterDiscount + serviceFeeAmount) * taxRate);

  const total = afterDiscount + serviceFeeAmount + taxAmount;

  return {
    subtotal,
    discountAmount,
    afterDiscount,
    serviceFeeAmount,
    taxAmount,
    total,
  };
}

export function calculateCashChange(total: number, cashGiven: number): { change: number; isSufficient: boolean } {
  const change = cashGiven - total;
  return {
    change: Math.max(0, change),
    isSufficient: change >= 0,
  };
}

export function checkLowStock(currentStock: number, threshold: number): { isLow: boolean; isCritical: boolean } {
  if (currentStock <= 0) {
    return { isLow: true, isCritical: true };
  }
  if (currentStock <= threshold * 0.5) {
    return { isLow: true, isCritical: true };
  }
  if (currentStock <= threshold) {
    return { isLow: true, isCritical: false };
  }
  return { isLow: false, isCritical: false };
}

export function calculateFinancialSummary(orders: Array<{ total: number; subtotal: number; items: Array<{ costPrice?: number; quantity: number }> }>) {
  let grossRevenue = 0;
  let totalCOGS = 0; // HPP (Harga Pokok Penjualan)

  for (const order of orders) {
    grossRevenue += order.total;
    for (const item of order.items) {
      const cogs = item.costPrice || 0;
      totalCOGS += cogs * item.quantity;
    }
  }

  const grossProfit = grossRevenue - totalCOGS;
  const estimatedOpex = Math.round(grossRevenue * 0.15); // operational expenses ~15%
  const netProfit = grossProfit - estimatedOpex;

  return {
    grossRevenue,
    totalCOGS,
    grossProfit,
    estimatedOpex,
    netProfit,
    marginPercent: grossRevenue > 0 ? Math.round((netProfit / grossRevenue) * 100) : 0,
  };
}

export function verifyStaffPin(
  targetStaffPin: string,
  enteredPin: string
): { isValid: boolean; message?: string } {
  const cleanEntered = enteredPin.trim();
  if (cleanEntered.length !== 6) {
    return { isValid: false, message: 'PIN harus 6 digit angka.' };
  }
  if (cleanEntered === targetStaffPin.trim()) {
    return { isValid: true };
  }
  return { isValid: false, message: 'Sandi PIN salah untuk posisi yang dipilih!' };
}

export function formatDeletePrompt(type: 'bahan' | 'menu' | 'jadwal', name: string): string {
  switch (type) {
    case 'bahan':
      return `Hapus bahan "${name}"?`;
    case 'menu':
      return `Hapus menu "${name}"?`;
    case 'jadwal':
      return `Hapus jadwal "${name}"?`;
    default:
      return `Hapus "${name}"?`;
  }
}

export function canUserEditStaffRole(
  currentUserRole: 'kasir' | 'manager' | 'admin',
  targetUserRole: 'kasir' | 'manager' | 'admin'
): boolean {
  if (currentUserRole === 'admin') {
    return true; // Admin can edit all roles
  }
  if (currentUserRole === 'manager') {
    // Manager can edit kasir and manager, but cannot edit admin
    return targetUserRole !== 'admin';
  }
  // Kasir cannot edit anyone
  return false;
}

export function validateStaffUpdates(updates: {
  name?: string;
  pin?: string;
  shift?: string;
}): { isValid: boolean; message?: string } {
  if (updates.name !== undefined && updates.name.trim().length === 0) {
    return { isValid: false, message: 'Nama staf tidak boleh kosong.' };
  }
  if (updates.pin !== undefined) {
    const cleanPin = updates.pin.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      return { isValid: false, message: 'Sandi PIN harus terdiri dari tepat 6 angka numerik.' };
    }
  }
  return { isValid: true };
}


