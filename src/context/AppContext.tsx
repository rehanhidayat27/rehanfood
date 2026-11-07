import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserRole,
  StaffUser,
  MenuItem,
  RawMaterial,
  CartItem,
  OrderTransaction,
  CalendarEvent,
  ThemeColor,
  AppLanguage,
  NotificationItem,
  FoodCategory,
} from '../types/index.ts';
import {
  INITIAL_STAFF,
  INITIAL_MENU_ITEMS,
  INITIAL_RAW_MATERIALS,
  INITIAL_ORDERS,
  INITIAL_CALENDAR_EVENTS,
} from '../utils/mockData.ts';
import { soundEffects } from '../utils/soundEffects.ts';
import { calculateOrderTotals, checkLowStock, canUserEditStaffRole, validateStaffUpdates } from '../utils/posCalculations.ts';
import { translations } from '../utils/translations.ts';

interface AppContextType {
  // Translations
  t: (key: keyof typeof translations.id) => string;

  // Auth & Roles
  staffList: StaffUser[];
  currentStaff: StaffUser;
  switchStaffRoleWithPin: (pin: string, specificStaffId?: string) => boolean;
  directSwitchStaffRole: (role: UserRole) => void;
  directSwitchStaffUser: (staffId: string) => void;
  isPinModalOpen: boolean;
  setIsPinModalOpen: (open: boolean) => void;
  isStaffModalOpen: boolean;
  setIsStaffModalOpen: (open: boolean) => void;
  updateStaffUser: (
    staffId: string,
    updates: Partial<Pick<StaffUser, 'name' | 'pin' | 'shift' | 'phone' | 'email' | 'avatar'>>
  ) => { success: boolean; message: string };
  pendingRoleSwitch: UserRole | null;
  setPendingRoleSwitch: (role: UserRole | null) => void;
  pendingStaffUser: StaffUser | null;
  setPendingStaffUser: (staff: StaffUser | null) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: FoodCategory;
  setSelectedCategory: (category: FoodCategory) => void;

  // Cart & POS
  cart: CartItem[];
  addToCart: (item: MenuItem, spiceLevel?: CartItem['spiceLevel'], notes?: string) => void;
  updateCartQty: (menuItemId: string, delta: number) => void;
  removeFromCart: (menuItemId: string) => void;
  clearCart: () => void;
  activeTableOrTakeaway: string;
  setActiveTableOrTakeaway: (table: string) => void;
  appliedCoupon: string;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountPercentage: number;
  couponDiscountAmount: number;

  // Calculation helpers
  subtotal: number;
  serviceFee: number;
  tax: number;
  total: number;

  // Checkout & Transactions
  orders: OrderTransaction[];
  completeCheckout: (
    paymentMethod: OrderTransaction['paymentMethod'],
    customerName: string,
    customerPhone: string,
    customerEmail: string,
    notes?: string
  ) => OrderTransaction;

  // Products CRUD
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;

  // Raw Materials / Stock CRUD
  rawMaterials: RawMaterial[];
  addRawMaterial: (material: Omit<RawMaterial, 'id'>) => void;
  updateRawMaterial: (material: RawMaterial) => void;
  restockRawMaterial: (id: string, additionalAmount: number) => void;
  deleteRawMaterial: (id: string) => void;
  criticalStockCount: number;
  resetToDefaultData: () => void;

  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (id: string) => void;

  // Settings & Theme
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  offlineMode: boolean;
  setOfflineMode: (offline: boolean) => void;
  lastCloudBackup: string;
  performCloudBackup: () => void;

  // Notifications
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;
  activeToast: string | null;
  dismissToast: () => void;

  // Modals
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  whatsappModalOrder: OrderTransaction | null;
  setWhatsappModalOrder: (order: OrderTransaction | null) => void;
  receiptModalOrder: OrderTransaction | null;
  setReceiptModalOrder: (order: OrderTransaction | null) => void;
  selectedRecipeItem: MenuItem | null;
  setSelectedRecipeItem: (item: MenuItem | null) => void;
  confirmDeleteModal: {
    isOpen: boolean;
    title?: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
  } | null;
  requestConfirmDelete: (options: {
    message: string;
    title?: string;
    confirmLabel?: string;
    onConfirm: () => void;
  }) => void;
  closeConfirmDeleteModal: () => void;

  // Sound triggering helper
  playSound: (type: 'click' | 'cart' | 'pay' | 'alert' | 'remove') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Staff & Role
  const [staffList, setStaffList] = useState<StaffUser[]>(() => {
    const saved = localStorage.getItem('refood_staff_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return INITIAL_STAFF.map(init => {
            const found = parsed.find((p: StaffUser) => p.id === init.id);
            if (!found) return init;
            return {
              ...init,
              ...found,
              // Always guarantee Rehan Hidayat's uploaded photo is preserved
              avatar: init.id === 'staff-admin' ? init.avatar : found.avatar,
            };
          });
        }
      } catch (e) {
        console.error('Failed to parse refood_staff_list:', e);
      }
    }
    return INITIAL_STAFF;
  });

  const [currentStaff, setCurrentStaff] = useState<StaffUser>(() => {
    const savedId = localStorage.getItem('refood_current_staff_id');
    if (savedId) {
      const found = INITIAL_STAFF.find(s => s.id === savedId);
      if (found) return found;
    }
    // Default to Kasir Shift Pagi for operational POS start
    return INITIAL_STAFF.find(s => s.id === 'staff-kasir-pagi') || INITIAL_STAFF[0];
  });
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [pendingRoleSwitch, setPendingRoleSwitch] = useState<UserRole | null>(null);
  const [pendingStaffUser, setPendingStaffUser] = useState<StaffUser | null>(null);

  // Navigation
  const [activeTab, setActiveTab] = useState('pos'); // pos, dashboard, products, stock, reports, calendar, settings

  // Search & Category
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('Semua');

  // Menu items state with automatic english translation merge
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('refood_menu_items');
    if (!saved) return INITIAL_MENU_ITEMS;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map((item: MenuItem) => {
          const init = INITIAL_MENU_ITEMS.find((p: MenuItem) => p.id === item.id);
          return init
            ? {
                ...init,
                ...item,
                englishName: item.englishName || init.englishName,
                englishDescription: item.englishDescription || init.englishDescription,
                englishServes: item.englishServes || init.englishServes,
              }
            : item;
        });
      }
      return INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  // Raw materials state with automatic english translation merge
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(() => {
    const saved = localStorage.getItem('refood_raw_materials');
    if (!saved) return INITIAL_RAW_MATERIALS;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map((item: RawMaterial) => {
          const init = INITIAL_RAW_MATERIALS.find((p: RawMaterial) => p.id === item.id);
          return init
            ? {
                ...init,
                ...item,
                englishName: item.englishName || init.englishName,
                englishUnit: item.englishUnit || init.englishUnit,
              }
            : item;
        });
      }
      return INITIAL_RAW_MATERIALS;
    } catch {
      return INITIAL_RAW_MATERIALS;
    }
  });

  // Orders state
  const [orders, setOrders] = useState<OrderTransaction[]>(() => {
    const saved = localStorage.getItem('refood_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Calendar with automatic english translation merge
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('refood_calendar');
    if (!saved) return INITIAL_CALENDAR_EVENTS;
    try {
      const parsed = JSON.parse(saved);
      return INITIAL_CALENDAR_EVENTS.map(init => {
        const found = parsed.find((p: CalendarEvent) => p.id === init.id);
        return found
          ? {
              ...init,
              ...found,
              englishTitle: init.englishTitle,
              englishDescription: init.englishDescription,
            }
          : init;
      });
    } catch {
      return INITIAL_CALENDAR_EVENTS;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTableOrTakeaway, setActiveTableOrTakeaway] = useState('Meja 04');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);

  // Settings
  const [themeColor, setThemeColor] = useState<ThemeColor>('orange');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('refood_dark_mode');
    if (saved !== null) return saved === 'true';
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('refood_language');
    return (saved === 'en' || saved === 'id') ? saved : 'id';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [lastCloudBackup, setLastCloudBackup] = useState<string>('2026-10-29 04:00 WIB');

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('refood_language', lang);
    showToast(lang === 'en' ? 'Language set to English 🇬🇧' : 'Bahasa diatur ke Bahasa Indonesia 🇮🇩');
  };

  const t = (key: keyof typeof translations.id): string => {
    const dict = translations[language] || translations.id;
    return (dict as Record<string, string>)[key] || translations.id[key] || key;
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Peringatan Stok Menipis!',
      message: 'Daging Ayam Fillet tersisa 4.0 kg (di bawah batas kritis 6.0 kg). Segera pesan ke supplier.',
      type: 'stock',
      timestamp: 'Baru saja',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Transaksi Berhasil #1092',
      message: 'Pesanan Meja 04 senilai Rp 125.664 telah berhasil dibayar via QRIS.',
      type: 'order',
      timestamp: '25 mnt lalu',
      read: false,
    },
  ]);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [whatsappModalOrder, setWhatsappModalOrder] = useState<OrderTransaction | null>(null);
  const [receiptModalOrder, setReceiptModalOrder] = useState<OrderTransaction | null>(null);
  const [selectedRecipeItem, setSelectedRecipeItem] = useState<MenuItem | null>(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
  } | null>(null);

  const requestConfirmDelete = (options: {
    message: string;
    title?: string;
    confirmLabel?: string;
    onConfirm: () => void;
  }) => {
    playSound('alert');
    setConfirmDeleteModal({
      isOpen: true,
      title: options.title || 'Konfirmasi Hapus',
      message: options.message,
      confirmLabel: options.confirmLabel || (language === 'en' ? 'Delete' : 'Hapus'),
      onConfirm: options.onConfirm,
    });
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDeleteModal(null);
  };

  // Update HTML class for dark mode and persist
  useEffect(() => {
    localStorage.setItem('refood_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist items, materials, orders
  useEffect(() => {
    localStorage.setItem('refood_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('refood_raw_materials', JSON.stringify(rawMaterials));
  }, [rawMaterials]);

  useEffect(() => {
    localStorage.setItem('refood_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('refood_calendar', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  // Sound trigger helper
  const playSound = (type: 'click' | 'cart' | 'pay' | 'alert' | 'remove') => {
    if (!soundEnabled) return;
    switch (type) {
      case 'click':
        soundEffects.playClick();
        break;
      case 'cart':
        soundEffects.playAddToCart();
        break;
      case 'pay':
        soundEffects.playPaymentSuccess();
        break;
      case 'alert':
        soundEffects.playAlert();
        break;
      case 'remove':
        soundEffects.playRemove();
        break;
    }
  };

  const showToast = (message: string) => {
    setActiveToast(message);
    setTimeout(() => {
      setActiveToast(prev => (prev === message ? null : prev));
    }, 4500);
  };

  const dismissToast = () => setActiveToast(null);

  // Switch role or specific staff with PIN verification according to position
  const switchStaffRoleWithPin = (pin: string, specificStaffId?: string): boolean => {
    let targetUser: StaffUser | undefined;

    // 1. If a specific staff was explicitly selected or passed
    if (specificStaffId) {
      targetUser = staffList.find(s => s.id === specificStaffId);
    } else if (pendingStaffUser) {
      targetUser = pendingStaffUser;
    } else if (pendingRoleSwitch) {
      targetUser = staffList.find(s => s.role === pendingRoleSwitch);
    }

    // Strict validation: if a target user was selected, verify that specific position's PIN!
    if (targetUser) {
      if (targetUser.pin === pin.trim()) {
        setCurrentStaff(targetUser);
        localStorage.setItem('refood_current_staff_id', targetUser.id);
        setIsPinModalOpen(false);
        setPendingRoleSwitch(null);
        setPendingStaffUser(null);
        playSound('pay');
        showToast(
          language === 'en'
            ? `Logged in as ${targetUser.shift || targetUser.role.toUpperCase()} (${targetUser.name})`
            : `Berhasil masuk sebagai ${targetUser.shift || targetUser.role.toUpperCase()} (${targetUser.name})`
        );
        return true;
      }
      return false;
    }

    // 2. Direct pin fallback: match against distinct position PIN
    const matched = staffList.find(s => s.pin === pin.trim());
    if (matched) {
      setCurrentStaff(matched);
      localStorage.setItem('refood_current_staff_id', matched.id);
      setIsPinModalOpen(false);
      setPendingRoleSwitch(null);
      setPendingStaffUser(null);
      playSound('pay');
      showToast(
        language === 'en'
          ? `Logged in as ${matched.shift || matched.role.toUpperCase()} (${matched.name})`
          : `Berhasil masuk sebagai ${matched.shift || matched.role.toUpperCase()} (${matched.name})`
      );
      return true;
    }

    return false;
  };

  const directSwitchStaffRole = (role: UserRole) => {
    const user = staffList.find(s => s.role === role);
    if (user) {
      setCurrentStaff(user);
      playSound('click');
      showToast(
        language === 'en'
          ? `Access switched to ${user.name} (${user.shift || user.role.toUpperCase()})`
          : `Hak akses berganti ke ${user.name} (${user.shift || user.role.toUpperCase()})`
      );
    }
  };

  const directSwitchStaffUser = (staffId: string) => {
    const user = staffList.find(s => s.id === staffId);
    if (user) {
      setCurrentStaff(user);
      localStorage.setItem('refood_current_staff_id', user.id);
      setIsPinModalOpen(false);
      setPendingRoleSwitch(null);
      setPendingStaffUser(null);
      playSound('pay');
      showToast(
        language === 'en'
          ? `Access switched to ${user.shift || user.role.toUpperCase()} (${user.name})`
          : `Hak akses berganti ke ${user.shift || user.role.toUpperCase()} (${user.name})`
      );
    }
  };

  const updateStaffUser = (
    staffId: string,
    updates: Partial<Pick<StaffUser, 'name' | 'pin' | 'shift' | 'phone' | 'email' | 'avatar'>>
  ): { success: boolean; message: string } => {
    const target = staffList.find(s => s.id === staffId);
    if (!target) {
      return { success: false, message: 'Staf tidak ditemukan.' };
    }

    // Role-based permission check: Kasir cannot edit anyone!
    if (!canUserEditStaffRole(currentStaff.role, target.role)) {
      playSound('alert');
      const err = currentStaff.role === 'kasir'
        ? (language === 'en'
            ? 'Access Denied: Cashiers cannot edit staff accounts or PINs. Only Admin and Manager can make edits!'
            : 'Akses Ditolak: Kasir tidak memiliki izin untuk mengedit nama atau PIN staf. Hanya Admin dan Manager yang dapat mengedit!')
        : (language === 'en'
            ? 'Access Denied: Managers cannot edit Admin accounts!'
            : 'Akses Ditolak: Manager tidak dapat mengedit akun Admin!');
      showToast(`⚠️ ${err}`);
      return { success: false, message: err };
    }

    // Validate updates
    const validation = validateStaffUpdates({
      name: updates.name,
      pin: updates.pin,
      shift: updates.shift,
    });
    if (!validation.isValid) {
      playSound('alert');
      showToast(`⚠️ ${validation.message}`);
      return { success: false, message: validation.message || 'Data tidak valid' };
    }

    const updatedList = staffList.map(s => {
      if (s.id === staffId) {
        return {
          ...s,
          ...updates,
          name: updates.name !== undefined ? updates.name.trim() : s.name,
          pin: updates.pin !== undefined ? updates.pin.trim() : s.pin,
          shift: updates.shift !== undefined ? updates.shift.trim() : s.shift,
          phone: updates.phone !== undefined ? updates.phone.trim() : s.phone,
          email: updates.email !== undefined ? updates.email.trim() : s.email,
        };
      }
      return s;
    });

    setStaffList(updatedList);
    localStorage.setItem('refood_staff_list', JSON.stringify(updatedList));

    // If target is the active current staff, sync currentStaff immediately!
    if (currentStaff.id === staffId) {
      const updatedCurrent = updatedList.find(s => s.id === staffId);
      if (updatedCurrent) {
        setCurrentStaff(updatedCurrent);
      }
    }

    playSound('pay');
    showToast(
      language === 'en'
        ? `Staff data "${updates.name || target.name}" successfully updated!`
        : `Data staf "${updates.name || target.name}" berhasil diperbarui!`
    );

    return {
      success: true,
      message: language === 'en' ? 'Staff updated successfully' : 'Data staf berhasil diperbarui',
    };
  };

  // Cart calculations
  const rawSubtotal = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const totals = calculateOrderTotals({
    subtotal: rawSubtotal,
    discountPercentage,
    couponDiscountAmount,
    serviceFeeRate: 0.02,
    taxRate: 0.10,
  });

  const subtotal = totals.subtotal;
  const serviceFee = totals.serviceFeeAmount;
  const tax = totals.taxAmount;
  const total = totals.total;

  const addToCart = (item: MenuItem, spiceLevel: CartItem['spiceLevel'] = 'Sedang', notes = '') => {
    playSound('cart');
    setCart(prev => {
      const existingIdx = prev.findIndex(i => i.menuItem.id === item.id && i.spiceLevel === spiceLevel);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      } else {
        return [...prev, { menuItem: item, quantity: 1, spiceLevel, notes }];
      }
    });
    showToast(`Ditambahkan ke keranjang: ${item.name}`);
  };

  const updateCartQty = (menuItemId: string, delta: number) => {
    playSound('click');
    setCart(prev => {
      return prev
        .map(item => {
          if (item.menuItem.id === menuItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    playSound('remove');
    setCart(prev => prev.filter(i => i.menuItem.id !== menuItemId));
  };

  const clearCart = () => {
    playSound('remove');
    setCart([]);
    setAppliedCoupon('');
    setDiscountPercentage(0);
    setCouponDiscountAmount(0);
  };

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'HEMAT10') {
      setAppliedCoupon('HEMAT10 (Diskon 10%)');
      setDiscountPercentage(10);
      setCouponDiscountAmount(0);
      playSound('pay');
      return { success: true, message: 'Kupon HEMAT10 berhasil! Potongan 10% diterapkan.' };
    } else if (normalized === 'REFOODFREE') {
      setAppliedCoupon('REFOODFREE (Potongan Rp 15.000)');
      setDiscountPercentage(0);
      setCouponDiscountAmount(15000);
      playSound('pay');
      return { success: true, message: 'Kupon REFOODFREE berhasil! Potongan Rp 15.000 diterapkan.' };
    }
    return { success: false, message: 'Kode kupon tidak valid. Coba kode: HEMAT10 atau REFOODFREE' };
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
    setDiscountPercentage(0);
    setCouponDiscountAmount(0);
  };

  // Complete checkout & automatically deduct inventory based on recipes
  const completeCheckout = (
    paymentMethod: OrderTransaction['paymentMethod'],
    customerName: string,
    customerPhone = '+62 812-3456-7890',
    customerEmail = 'pelanggan@gmail.com',
    notes = ''
  ): OrderTransaction => {
    const orderNumber = `#${1093 + orders.length}`;
    const newOrder: OrderTransaction = {
      id: `ORD-${Date.now()}`,
      orderNumber,
      timestamp: new Date().toISOString(),
      customerName: customerName || 'Pelanggan Walk-in',
      customerPhone,
      customerEmail,
      tableOrTakeaway: activeTableOrTakeaway,
      items: [...cart],
      subtotal,
      discount: totals.discountAmount,
      serviceFee,
      tax,
      total,
      paymentMethod,
      paymentStatus: 'paid',
      cashierName: currentStaff.name,
      notes,
    };

    // Deduct stock for ingredients in order's menu items
    setRawMaterials(prevMaterials => {
      const updatedMaterials = [...prevMaterials];
      const newlyCriticalItems: string[] = [];

      for (const cartItem of cart) {
        if (cartItem.menuItem.recipe && cartItem.menuItem.recipe.length > 0) {
          for (const ingredient of cartItem.menuItem.recipe) {
            const matIdx = updatedMaterials.findIndex(m => m.id === ingredient.rawMaterialId);
            if (matIdx >= 0) {
              const current = updatedMaterials[matIdx];
              const neededTotal = ingredient.amountNeeded * cartItem.quantity;
              const newStock = Math.max(0, Number((current.currentStock - neededTotal).toFixed(2)));
              updatedMaterials[matIdx] = {
                ...current,
                currentStock: newStock,
              };

              const stockStatus = checkLowStock(newStock, current.minThreshold);
              if (stockStatus.isCritical) {
                newlyCriticalItems.push(`${current.name} (${newStock} ${current.unit})`);
              }
            }
          }
        }
      }

      if (newlyCriticalItems.length > 0) {
        playSound('alert');
        setNotifications(prev => [
          {
            id: `alert-${Date.now()}`,
            title: '⚠️ Peringatan Bahan Kritis!',
            message: `Bahan baku mendekati habis: ${newlyCriticalItems.join(', ')}. Segera lakukan restock!`,
            type: 'stock',
            timestamp: 'Baru saja',
            read: false,
          },
          ...prev,
        ]);
      }

      return updatedMaterials;
    });

    // Add order to orders list
    setOrders(prev => [newOrder, ...prev]);

    // Push notification for transaction success
    setNotifications(prev => [
      {
        id: `ord-notif-${Date.now()}`,
        title: `✅ Transaksi Sukses ${newOrder.orderNumber}`,
        message: `${newOrder.customerName} (${newOrder.tableOrTakeaway}) - Total: Rp ${newOrder.total.toLocaleString('id-ID')} via ${newOrder.paymentMethod.toUpperCase()}`,
        type: 'order',
        timestamp: 'Baru saja',
        read: false,
      },
      ...prev,
    ]);

    playSound('pay');
    showToast(`Pesanan ${newOrder.orderNumber} berhasil dicatat & dibayar!`);
    clearCart();
    setIsPaymentModalOpen(false);
    // Display animated thermal receipt immediately as requested
    setReceiptModalOrder(newOrder);
    return newOrder;
  };

  // Menu items CRUD
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}`,
    };
    setMenuItems(prev => [newItem, ...prev]);
    showToast(`Menu baru "${newItem.name}" berhasil ditambahkan.`);
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenuItems(prev => prev.map(m => (m.id === item.id ? item : m)));
    showToast(`Menu "${item.name}" berhasil diperbarui.`);
  };

  const deleteMenuItem = (id: string) => {
    const itemToDelete = menuItems.find(m => m.id === id);
    const itemName = itemToDelete ? (itemToDelete.indonesianName || itemToDelete.name) : 'Menu';
    setMenuItems(prev => {
      const updated = prev.filter(m => m.id !== id);
      localStorage.setItem('refood_menu_items', JSON.stringify(updated));
      return updated;
    });
    playSound('remove');
    showToast(`🗑️ Menu "${itemName}" berhasil dihapus dari sistem.`);
  };

  // Raw materials CRUD
  const addRawMaterial = (material: Omit<RawMaterial, 'id'>) => {
    const newMaterial: RawMaterial = {
      ...material,
      id: `raw-${Date.now()}`,
      lastRestocked: new Date().toISOString().slice(0, 10),
    };
    setRawMaterials(prev => {
      const updated = [...prev, newMaterial];
      localStorage.setItem('refood_raw_materials', JSON.stringify(updated));
      return updated;
    });
    showToast(`Bahan baku "${newMaterial.name}" berhasil ditambahkan.`);
  };

  const updateRawMaterial = (material: RawMaterial) => {
    setRawMaterials(prev => {
      const updated = prev.map(m => (m.id === material.id ? material : m));
      localStorage.setItem('refood_raw_materials', JSON.stringify(updated));
      return updated;
    });
    showToast(`Bahan "${material.name}" berhasil diupdate.`);
  };

  const restockRawMaterial = (id: string, additionalAmount: number) => {
    setRawMaterials(prev => {
      const updated = prev.map(m => {
        if (m.id === id) {
          const newQty = Number((m.currentStock + additionalAmount).toFixed(2));
          return {
            ...m,
            currentStock: newQty,
            lastRestocked: new Date().toISOString().slice(0, 10),
          };
        }
        return m;
      });
      localStorage.setItem('refood_raw_materials', JSON.stringify(updated));
      return updated;
    });
    playSound('pay');
    showToast(`Restock berhasil ditambahkan! Stok terupdate.`);
  };

  const deleteRawMaterial = (id: string) => {
    const matToDelete = rawMaterials.find(m => m.id === id);
    const matName = matToDelete ? matToDelete.name : 'Bahan baku';
    setRawMaterials(prev => {
      const updated = prev.filter(m => m.id !== id);
      localStorage.setItem('refood_raw_materials', JSON.stringify(updated));
      return updated;
    });
    playSound('remove');
    showToast(`🗑️ Bahan baku "${matName}" berhasil dihapus dari sistem.`);
  };

  const resetToDefaultData = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    setRawMaterials(INITIAL_RAW_MATERIALS);
    setStaffList(INITIAL_STAFF);
    localStorage.removeItem('refood_menu_items');
    localStorage.removeItem('refood_raw_materials');
    localStorage.removeItem('refood_staff_list');
    playSound('pay');
    showToast('Data menu, stok, dan staf berhasil di-reset ke data default!');
  };

  const criticalStockCount = rawMaterials.filter(m => m.currentStock <= m.minThreshold).length;

  // Calendar CRUD
  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `ev-${Date.now()}`,
    };
    setCalendarEvents(prev => [...prev, newEvent]);
    showToast(`Jadwal "${newEvent.title}" berhasil dibuat.`);
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
    showToast('Jadwal berhasil dihapus.');
  };

  // Cloud backup simulation
  const performCloudBackup = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';
    setLastCloudBackup(formatted);
    playSound('pay');
    showToast('☁️ Backup data ke cloud berhasil disinkronkan secara aman!');
  };

  // Notifications
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <AppContext.Provider
      value={{
        t,
        staffList,
        currentStaff,
        switchStaffRoleWithPin,
        directSwitchStaffRole,
        directSwitchStaffUser,
        isPinModalOpen,
        setIsPinModalOpen,
        isStaffModalOpen,
        setIsStaffModalOpen,
        updateStaffUser,
        pendingRoleSwitch,
        setPendingRoleSwitch,
        pendingStaffUser,
        setPendingStaffUser,

        activeTab,
        setActiveTab,

        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,

        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        activeTableOrTakeaway,
        setActiveTableOrTakeaway,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountPercentage,
        couponDiscountAmount,

        subtotal,
        serviceFee,
        tax,
        total,

        orders,
        completeCheckout,

        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,

        rawMaterials,
        addRawMaterial,
        updateRawMaterial,
        restockRawMaterial,
        deleteRawMaterial,
        criticalStockCount,
        resetToDefaultData,

        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,

        themeColor,
        setThemeColor,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        language,
        setLanguage,
        soundEnabled,
        setSoundEnabled,
        offlineMode,
        setOfflineMode,
        lastCloudBackup,
        performCloudBackup,

        notifications,
        markAllNotificationsRead,
        unreadNotificationsCount,
        activeToast,
        dismissToast,

        isPaymentModalOpen,
        setIsPaymentModalOpen,
        whatsappModalOrder,
        setWhatsappModalOrder,
        receiptModalOrder,
        setReceiptModalOrder,
        selectedRecipeItem,
        setSelectedRecipeItem,
        confirmDeleteModal,
        requestConfirmDelete,
        closeConfirmDeleteModal,

        playSound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
