export type UserRole = 'kasir' | 'manager' | 'admin';

export interface StaffUser {
  id: string;
  name: string;
  role: UserRole;
  shift?: string; // e.g. 'Shift Pagi', 'Shift Sore', 'Manager Shift'
  pin: string; // 6-digit PIN
  avatar: string;
  email: string;
  phone: string;
}

export type FoodCategory =
  | 'Semua'
  | 'Makanan Utama'
  | 'Ayam & Bebek'
  | 'Sate & Bakso'
  | 'Sayur & Sup'
  | 'Minuman Tradisional'
  | 'Dessert & Camilan';

export interface RecipeIngredient {
  rawMaterialId: string;
  rawMaterialName: string;
  amountNeeded: number;
  unit: string;
}

export interface MenuItem {
  id: string;
  name: string;
  englishName?: string;
  indonesianName: string;
  category: FoodCategory;
  price: number;
  costPrice: number; // HPP
  calories: number;
  serves: string;
  englishServes?: string;
  rating: number;
  image: string;
  description: string;
  englishDescription?: string;
  available: boolean;
  isTopWeek?: boolean;
  isTopMonth?: boolean;
  recipe: RecipeIngredient[];
}

export interface RawMaterial {
  id: string;
  name: string;
  englishName?: string;
  unit: string; // kg, gram, liter, butir, ikat
  englishUnit?: string;
  currentStock: number;
  minThreshold: number; // critical alert threshold
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  spiceLevel?: 'Sedang' | 'Pedas' | 'Ekstra Pedas' | 'Tidak Pedas';
}

export type PaymentMethod = 'qris' | 'cash' | 'card' | 'ewallet';

export interface OrderTransaction {
  id: string;
  orderNumber: string;
  timestamp: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  tableOrTakeaway: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  serviceFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  cashierName: string;
  notes?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  englishTitle?: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: 'restock' | 'shift' | 'promo' | 'maintenance';
  description: string;
  englishDescription?: string;
  assignee: string;
}

export type ThemeColor = 'orange' | 'emerald' | 'blue' | 'rose' | 'amber';
export type AppLanguage = 'id' | 'en';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'system';
  timestamp: string;
  read: boolean;
}
