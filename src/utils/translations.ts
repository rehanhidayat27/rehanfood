import { AppLanguage, FoodCategory, MenuItem, CalendarEvent, RawMaterial } from '../types/index.ts';

export const translations = {
  id: {
    // Brand & Outlet
    brandName: 'Rehan Food',
    brandTagline: 'Sistem Kasir & Manajemen Kuliner Modern',
    restaurantAddress: 'Jl. Cibontet, Desa Cibalung, Kec. Cimanggu, Kabupaten Cilacap, Jawa Tengah',
    restaurantPhone: '082116541696',
    receiptThankYou: 'Terima kasih atas kunjungan Anda di Rehan Food!',

    // Navigation
    navPos: 'Kasir POS (Menu & Order)',
    navProducts: 'Manajemen Katalog Menu',
    navStock: 'Manajemen Stok Bahan Baku',
    navDashboard: 'Dashboard Analitik Penjualan',
    navReports: 'Laporan Keuangan & HPP',
    navCalendar: 'Kalender Jadwal Restoran',
    navSettings: 'Pengaturan & Cloud Backup',
    lockTooltip: 'Ganti PIN / Kunci Akun',

    // Header
    searchPlaceholder: 'Cari menu nusantara, kategori, atau ID...',
    cloudOnline: 'Cloud Online',
    offlineMode: 'Offline (Sync Lokal)',
    notifications: 'Pemberitahuan Real-Time',
    markAllRead: 'Tandai Dibaca',
    noNotifications: 'Tidak ada notifikasi saat ini.',
    role: 'Peran',
    switchRole: 'Ganti Peran / Pengguna',
    quickDemoSwitch: 'Pintas Demo (Tanpa PIN):',

    // POS View
    promoBadge: 'Promo Spesial Hari Ini',
    freeDelivery: 'GRATIS Ongkir',
    promoHeadline: 'Eksplorasi Kelezatan Menu Nusantara Hari Ini',
    promoSub: 'Sajian autentik dengan 100% rempah pilihan khas Indonesia. Dilengkapi takaran resep presisi & sinkronisasi stok bahan otomatis.',
    checkMenu: 'Lihat Semua Menu',
    fastTx: '⚡ Transaksi Cepat & Otomatis',
    categorySection: 'Kategori Kuliner Nusantara',
    dishesAvailable: 'menu tersedia',
    recommendedSection: 'Menu Terpilih Sesuai Selera Anda',
    recommendedSub: 'Pilihan hidangan tradisional favorit pelanggan restoran',
    viewAll: 'Lihat Semua',
    recipeBtn: 'Resep',
    price: 'Harga',
    addBtn: 'Tambah',
    addedToCart: 'Ditambahkan ke keranjang:',
    trendingSection: 'Trending Orders (Pesanan Paling Populer)',
    trendingSub: 'Update penjualan real-time',
    topWeek: 'Top of the week',
    topMonth: 'Top of the month',
    serves: 'Porsi',
    calories: 'kkal',

    // Cart Panel
    balanceTitle: 'Saldo Kasir POS',
    shiftTotal: 'Total Omset Shift Ini',
    locationTitle: 'Lokasi Meja / Pemesan',
    changeLocation: 'Ganti Meja',
    tableDefault: 'Layanan makan di tempat & takeaway Rehan Food',
    orderMenuTitle: 'Order Menu',
    clearBtn: 'Bersihkan',
    emptyCartTitle: 'Keranjang pesanan masih kosong',
    emptyCartSub: 'Klik "+ Tambah" pada menu makanan atau minuman',
    subtotal: 'Subtotal Menu',
    couponDiscount: 'Potongan Kupon',
    serviceFee: 'Biaya Layanan (Service 2%)',
    taxPB1: 'Pajak Restoran (PB1 10%)',
    totalBill: 'Total Tagihan',
    couponPlaceholder: 'Kupon diskon (HEMAT10)',
    applyCoupon: 'Klaim',
    proceedCheckout: 'Lanjut Pembayaran',

    // Payment & Receipt
    paymentTitle: 'Sistem Pembayaran Otomatis',
    paymentSub: 'Pilih metode bayar & verifikasi instan',
    totalRestaurantBill: 'Total Tagihan Restoran',
    selectPaymentMethod: 'Pilih Metode Pembayaran:',
    customerDataLabel: 'Data Pelanggan (Untuk Notifikasi WhatsApp & Email Otomatis):',
    customerNamePlaceholder: 'Nama Pelanggan (cth: Pak Bambang)',
    phonePlaceholder: 'No. WhatsApp (+62 812...)',
    emailPlaceholder: 'Email Pelanggan (untuk invoice struk PDF)',
    cancel: 'Batal',
    confirmPaymentBtn: 'Konfirmasi Pembayaran',
    paymentSuccessTitle: 'Pembayaran Berhasil Diterima',
    paymentSuccessSub: 'Stok bahan baku resep telah terpotong otomatis dan analitik penjualan telah diperbarui.',
    officialReceipt: 'Struk Resmi Pembayaran',
    printOrSavePDF: 'Cetak Struk / Unduh PDF',
    sendWhatsApp: 'Kirim via WhatsApp',
    emailSent: 'Email Terkirim',
    newTransaction: 'Transaksi Baru (Kasir)',
    cashChange: 'Kembalian:',
    insufficientCash: 'Uang Kurang!',
    cashPlaceholder: 'Atau ketik jumlah uang tunai...',
    paidStatus: 'LUNAS / PAID',
    receiptOrderNo: 'No. Order:',
    receiptTime: 'Waktu:',
    receiptCustomer: 'Pelanggan:',
    receiptTable: 'Meja / Tipe:',
    receiptCashier: 'Kasir:',
    receiptMenuHeader: 'MENU & TAKARAN',
    receiptSubtotalHeader: 'SUBTOTAL',

    // Dashboard
    dashboardTitle: 'Dasbor Analitik Penjualan Real-Time',
    dashboardSub: 'Pantau arus kas, laba bersih, serta tren menu kuliner favorit toko secara langsung.',
    dashboardBadge: 'Manajemen & Evaluasi Kinerja',
    liveSync: 'Live Sync',
    today: 'Hari Ini',
    sevenDays: '7 Hari',
    thisMonth: 'Bulan Ini',
    downloadPDF: 'Unduh PDF',
    exportCSV: 'Export CSV',
    grossRevenue: 'Total Omset (Gross)',
    netProfit: 'Estimasi Laba Bersih',
    totalOrders: 'Total Pesanan Masuk',
    avgOrderValue: 'Rata-Rata per Nota (AOV)',
    bestSellers: '5 Menu Paling Laris (Best Seller)',
    bestSellersSub: 'Berdasarkan kuantitas porsi terjual hari ini',
    paymentDistribution: 'Distribusi Metode Pembayaran',
    recentTransactions: 'Arus Transaksi Penjualan Terkini',
    orderIdCol: 'No. Order',
    timeCol: 'Waktu',
    customerCol: 'Pelanggan',
    itemsCol: 'Menu Pesanan',
    methodCol: 'Metode',
    totalCol: 'Total',
    statusCol: 'Status',
    actionCol: 'Aksi',
    viewReceipt: 'Lihat Struk',

    // Products Management
    productMgmtTitle: 'Manajemen Produk & Resep Kuliner',
    productMgmtSub: 'Unggah, sesuaikan harga, atur formula bahan baku resep, dan kelola ketersediaan menu.',
    addNewMenu: 'Tambah Menu Baru',
    searchMenuToEdit: 'Cari menu untuk diedit...',
    allCategories: 'Semua Kategori',
    dishAvailable: 'Tersedia',
    dishSoldOut: 'Habis',
    editDish: 'Edit',
    deleteDish: 'Hapus',
    recipeFormula: 'Komposisi Resep & HPP',

    // Stock Management
    stockMgmtTitle: 'Manajemen Stok & Bahan Baku Resep',
    stockMgmtSub: 'Pantau stok bahan pangan segar, batas minimum kritis, serta lakukan restock langsung ke supplier.',
    criticalWarning: 'Peringatan Kritis: Bahan Baku Mendekati Habis!',
    addRawMaterial: 'Tambah Bahan Baku',
    restockBtn: 'Restock',
    searchStock: 'Cari bahan baku atau supplier...',
    currentStockCol: 'Stok Saat Ini',
    minThresholdCol: 'Batas Minimal',
    costPerUnitCol: 'Harga Beli / Satuan',
    supplierCol: 'Supplier Utama',
    statusStockCol: 'Status Bahan',
    safeStock: 'Stok Aman',
    lowStock: 'Menipis',
    criticalStock: 'Kritis',

    // Financial Reports
    reportsTitle: 'Laporan Keuangan & Laba Rugi Bulanan',
    reportsSub: 'Analisis pendapatan kotor, HPP bahan baku dapur, estimasi beban operasional, serta margin bersih.',
    reportsBadge: 'Akuntansi & Arus Kas Restoran',
    totalCOGS: 'Total HPP Bahan Baku',
    operatingExpenses: 'Estimasi Operasional & Utilitas',
    grossMargin: 'Margin Laba Kotor',
    netMargin: 'Margin Laba Bersih',

    // Calendar
    calendarTitle: 'Jadwal Restoran & Kalender Shift',
    calendarSub: 'Kelola jadwal pasokan bahan, pergantian shift kasir, dan agenda pemeliharaan dapur.',
    addEventBtn: 'Tambah Kegiatan',
    eventTitleCol: 'Nama Kegiatan',
    eventDateCol: 'Tanggal & Jam',
    eventTypeCol: 'Kategori Agenda',
    eventAssigneeCol: 'Penanggung Jawab',

    // Settings
    settingsTitle: 'Pengaturan Aplikasi & Hak Akses',
    settingsSub: 'Kustomisasi tema warna, mode tampilan gelap/terang, backup cloud harian, dan sinkronisasi offline.',
    themeColorTitle: 'Warna Tema Tampilan (Custom Theme)',
    appearanceTitle: 'Tampilan, Bahasa & Audio',
    darkModeLabel: 'Mode Tampilan Gelap (Dark Mode)',
    soundLabel: 'Efek Suara Audio Responsif',
    languageLabel: 'Bahasa Sistem (Language)',
    cloudBackupTitle: 'Backup Cloud & Sinkronisasi Offline',
    backupNowBtn: 'Backup Data ke Cloud Sekarang',
    rbacTitle: 'Hak Akses Multi-Pengguna (RBAC)',
  },

  en: {
    // Brand & Outlet
    brandName: 'Rehan Food',
    brandTagline: 'Modern Indonesian Culinary POS & Restaurant Manager',
    restaurantAddress: 'Jl. Cibontet, Desa Cibalung, Kec. Cimanggu, Kabupaten Cilacap, Jawa Tengah',
    restaurantPhone: '082116541696',
    receiptThankYou: 'Thank you for dining with Rehan Food!',

    // Navigation
    navPos: 'POS Cashier (Menu & Order)',
    navProducts: 'Menu Catalog Manager',
    navStock: 'Raw Materials & Stock',
    navDashboard: 'Sales Analytics Dashboard',
    navReports: 'Financial & COGS Reports',
    navCalendar: 'Restaurant Schedule Calendar',
    navSettings: 'Settings & Cloud Backup',
    lockTooltip: 'Switch PIN / Lock Account',

    // Header
    searchPlaceholder: 'Search dishes, categories, or item ID...',
    cloudOnline: 'Cloud Online',
    offlineMode: 'Offline (Local Sync)',
    notifications: 'Real-Time Notifications',
    markAllRead: 'Mark all read',
    noNotifications: 'No notifications at this time.',
    role: 'Role',
    switchRole: 'Switch Role / User',
    quickDemoSwitch: 'Quick Demo Switch (No PIN):',

    // POS View
    promoBadge: "Today's Special Deal",
    freeDelivery: 'FREE Delivery',
    promoHeadline: 'Explore Authentic Indonesian Culinary Delights',
    promoSub: 'Authentic Indonesian dishes prepared with 100% hand-picked herbs & spices. Real-time recipe calculations & automated inventory deductions.',
    checkMenu: 'Explore All Dishes',
    fastTx: '⚡ Fast & Automated Checkout',
    categorySection: 'Indonesian Culinary Categories',
    dishesAvailable: 'dishes available',
    recommendedSection: 'Recommended Dishes Based On Your Taste',
    recommendedSub: 'Popular traditional delicacies loved by dining customers',
    viewAll: 'View All',
    recipeBtn: 'Recipe',
    price: 'Price',
    addBtn: 'Add',
    addedToCart: 'Added to cart:',
    trendingSection: 'Trending Orders (Most Popular)',
    trendingSub: 'Real-time sales updates',
    topWeek: 'Top of the week',
    topMonth: 'Top of the month',
    serves: 'Serves',
    calories: 'kcal',

    // Cart Panel
    balanceTitle: 'Cashier POS Balance',
    shiftTotal: 'Current Shift Total Revenue',
    locationTitle: 'Dining Location / Table',
    changeLocation: 'Change Table',
    tableDefault: 'Dine-in table & takeaway service Rehan Food',
    orderMenuTitle: 'Order Menu',
    clearBtn: 'Clear',
    emptyCartTitle: 'Order cart is currently empty',
    emptyCartSub: 'Click "+ Add" on any delicious food or beverage item',
    subtotal: 'Menu Subtotal',
    couponDiscount: 'Coupon Discount',
    serviceFee: 'Service Fee (2%)',
    taxPB1: 'Restaurant Tax (PB1 10%)',
    totalBill: 'Total Amount',
    couponPlaceholder: 'Coupon code (HEMAT10)',
    applyCoupon: 'Apply',
    proceedCheckout: 'Proceed to Checkout',

    // Payment & Receipt
    paymentTitle: 'Automated Payment System',
    paymentSub: 'Select payment method & instant verification',
    totalRestaurantBill: 'Total Restaurant Bill',
    selectPaymentMethod: 'Select Payment Method:',
    customerDataLabel: 'Customer Details (For Automated WhatsApp & Email Updates):',
    customerNamePlaceholder: 'Customer Name (e.g. Mr. Bambang)',
    phonePlaceholder: 'WhatsApp Number (+62 812...)',
    emailPlaceholder: 'Customer Email (for PDF receipt invoice)',
    cancel: 'Cancel',
    confirmPaymentBtn: 'Confirm Payment',
    paymentSuccessTitle: 'Payment Successfully Received',
    paymentSuccessSub: 'Recipe ingredients have been automatically deducted and sales analytics updated.',
    officialReceipt: 'Official Payment Receipt',
    printOrSavePDF: 'Print Receipt / Save PDF',
    sendWhatsApp: 'Send via WhatsApp',
    emailSent: 'Email Sent',
    newTransaction: 'New Transaction (POS)',
    cashChange: 'Change:',
    insufficientCash: 'Insufficient Cash!',
    cashPlaceholder: 'Or enter cash amount paid...',
    paidStatus: 'PAID / LUNAS',
    receiptOrderNo: 'Order No:',
    receiptTime: 'Time:',
    receiptCustomer: 'Customer:',
    receiptTable: 'Table / Type:',
    receiptCashier: 'Cashier:',
    receiptMenuHeader: 'MENU & PORTION',
    receiptSubtotalHeader: 'SUBTOTAL',

    // Dashboard
    dashboardTitle: 'Real-Time Sales Analytics Dashboard',
    dashboardSub: 'Monitor cash flow, estimated net profit, and customer-favorite culinary trends live.',
    dashboardBadge: 'Management & Performance Evaluation',
    liveSync: 'Live Sync',
    today: 'Today',
    sevenDays: '7 Days',
    thisMonth: 'This Month',
    downloadPDF: 'Download PDF',
    exportCSV: 'Export CSV',
    grossRevenue: 'Gross Revenue',
    netProfit: 'Estimated Net Profit',
    totalOrders: 'Total Orders Placed',
    avgOrderValue: 'Average Order Value (AOV)',
    bestSellers: 'Top 5 Best-Selling Dishes',
    bestSellersSub: 'Based on total portions sold today',
    paymentDistribution: 'Payment Method Breakdown',
    recentTransactions: 'Recent Sales Transactions Flow',
    orderIdCol: 'Order #',
    timeCol: 'Time',
    customerCol: 'Customer',
    itemsCol: 'Ordered Items',
    methodCol: 'Method',
    totalCol: 'Total',
    statusCol: 'Status',
    actionCol: 'Action',
    viewReceipt: 'View Receipt',

    // Products Management
    productMgmtTitle: 'Product Catalog & Recipe Manager',
    productMgmtSub: 'Add new items, adjust prices, configure recipe formulas, and manage availability.',
    addNewMenu: 'Add New Dish',
    searchMenuToEdit: 'Search dishes to edit...',
    allCategories: 'All Categories',
    dishAvailable: 'Available',
    dishSoldOut: 'Sold Out',
    editDish: 'Edit',
    deleteDish: 'Delete',
    recipeFormula: 'Recipe Formula & COGS',

    // Stock Management
    stockMgmtTitle: 'Raw Materials & Stock Inventory',
    stockMgmtSub: 'Monitor fresh ingredients, critical minimum thresholds, and execute restock orders.',
    criticalWarning: 'Critical Alert: Ingredients Low on Stock!',
    addRawMaterial: 'Add Raw Material',
    restockBtn: 'Restock',
    searchStock: 'Search ingredient or supplier...',
    currentStockCol: 'Current Stock',
    minThresholdCol: 'Min Threshold',
    costPerUnitCol: 'Unit Cost',
    supplierCol: 'Primary Supplier',
    statusStockCol: 'Stock Status',
    safeStock: 'Optimal',
    lowStock: 'Low Stock',
    criticalStock: 'Critical',

    // Financial Reports
    reportsTitle: 'Monthly Financial & PnL Report',
    reportsSub: 'Analyze gross sales, kitchen COGS, estimated operational overhead, and net margin.',
    reportsBadge: 'Restaurant Cash Flow & Accounting',
    totalCOGS: 'Total Kitchen COGS',
    operatingExpenses: 'Estimated Utilities & Overhead',
    grossMargin: 'Gross Profit Margin',
    netMargin: 'Net Profit Margin',

    // Calendar
    calendarTitle: 'Restaurant Schedule & Shift Calendar',
    calendarSub: 'Coordinate supplier deliveries, cashier shift rovers, and kitchen maintenance.',
    addEventBtn: 'Add Schedule Item',
    eventTitleCol: 'Event Title',
    eventDateCol: 'Date & Time',
    eventTypeCol: 'Schedule Category',
    eventAssigneeCol: 'Assigned Staff',

    // Settings
    settingsTitle: 'Application Settings & Access Control',
    settingsSub: 'Customize theme color palette, light/dark mode, daily cloud backups, and offline sync.',
    themeColorTitle: 'Accent Theme Palette (Custom Color)',
    appearanceTitle: 'Appearance, Language & Audio',
    darkModeLabel: 'Dark Mode Display',
    soundLabel: 'Synthesized Responsive Sound Effects',
    languageLabel: 'System Language',
    cloudBackupTitle: 'Cloud Backup & Offline Sync',
    backupNowBtn: 'Backup Data to Cloud Now',
    rbacTitle: 'Multi-User Role Access Control (RBAC)',
  },
};

// Comprehensive bilingual helpers ensuring 100% translation when English is selected
export const getDishName = (item: MenuItem, lang: AppLanguage): string => {
  return lang === 'en' && item.englishName ? item.englishName : item.name;
};

export const getDishDescription = (item: MenuItem, lang: AppLanguage): string => {
  return lang === 'en' && item.englishDescription ? item.englishDescription : item.description;
};

export const getDishCategory = (category: FoodCategory, lang: AppLanguage): string => {
  if (lang !== 'en') return category;
  switch (category) {
    case 'Semua':
      return 'All Dishes';
    case 'Makanan Utama':
      return 'Main Courses';
    case 'Ayam & Bebek':
      return 'Chicken & Duck';
    case 'Sate & Bakso':
      return 'Satay & Meatballs';
    case 'Sayur & Sup':
      return 'Vegetables & Soups';
    case 'Minuman Tradisional':
      return 'Traditional Drinks';
    case 'Dessert & Camilan':
      return 'Desserts & Snacks';
    default:
      return category;
  }
};

export const getDishServes = (item: MenuItem, lang: AppLanguage): string => {
  return lang === 'en' && item.englishServes ? item.englishServes : item.serves;
};

export const getSpiceLevelText = (spice: string | undefined, lang: AppLanguage): string => {
  if (!spice) return '';
  if (lang !== 'en') return spice;
  switch (spice) {
    case 'Tidak Pedas':
      return 'Non-Spicy';
    case 'Sedang':
      return 'Medium Spice';
    case 'Pedas':
      return '🌶️ Spicy';
    case 'Ekstra Pedas':
      return '🔥 Extra Hot';
    default:
      return spice;
  }
};

export const getEventTitle = (event: CalendarEvent, lang: AppLanguage): string => {
  return lang === 'en' && event.englishTitle ? event.englishTitle : event.title;
};

export const getEventDescription = (event: CalendarEvent, lang: AppLanguage): string => {
  return lang === 'en' && event.englishDescription ? event.englishDescription : event.description;
};

export const getMaterialName = (mat: RawMaterial, lang: AppLanguage): string => {
  return lang === 'en' && mat.englishName ? mat.englishName : mat.name;
};

export const getMaterialUnit = (mat: RawMaterial, lang: AppLanguage): string => {
  return lang === 'en' && mat.englishUnit ? mat.englishUnit : mat.unit;
};

export const getTableName = (table: string, lang: AppLanguage): string => {
  if (lang !== 'en') return table;
  return table
    .replace('Meja', 'Table')
    .replace('Bungkus', 'Takeaway')
    .replace('Ojek Online', 'Online Delivery');
};

