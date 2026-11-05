import React, { useState } from 'react';
import {
  Search,
  Bell,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  ChevronDown,
  ShoppingBag,
  Globe,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { getThemeClasses } from '../utils/themeHelper.ts';

export const Header: React.FC<{ onOpenMobileCart?: () => void }> = ({ onOpenMobileCart }) => {
  const {
    t,
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    currentStaff,
    setIsPinModalOpen,
    setPendingStaffUser,
    soundEnabled,
    setSoundEnabled,
    darkMode,
    toggleDarkMode,
    offlineMode,
    setOfflineMode,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsRead,
    playSound,
    themeColor,
    cart,
  } = useApp();

  const theme = getThemeClasses(themeColor);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
      case 'kasir':
      default:
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
    }
  };

  return (
    <header className="h-16 md:h-18 px-2 sm:px-4 md:px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 sm:gap-3 shrink-0 transition-colors z-20 overflow-x-hidden">
      {/* Search Input matching reference design */}
      <div className="flex-1 min-w-0 max-w-[110px] xs:max-w-[140px] sm:max-w-xs md:max-w-md">
        <div className="relative">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={language === 'en' ? 'Search...' : 'Cari menu...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-850 transition-all truncate"
            aria-label="Cari menu makanan dan minuman"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
        {/* Language quick switcher */}
        <button
          onClick={() => {
            playSound('click');
            setLanguage(language === 'id' ? 'en' : 'id');
          }}
          className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 whitespace-nowrap"
          title={language === 'id' ? 'Beralih ke English' : 'Switch to Bahasa Indonesia'}
          aria-label="Ganti Bahasa / Switch Language"
        >
          <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500 shrink-0" />
          <span className="whitespace-nowrap">{language === 'id' ? 'ID' : 'EN'}</span>
        </button>

        {/* Offline / Online Sync Toggle */}
        <button
          onClick={() => {
            playSound('click');
            setOfflineMode(!offlineMode);
          }}
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border transition-all shrink-0 ${
            offlineMode
              ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
          }`}
          title={offlineMode ? 'Mode Offline aktif. Transaksi disimpan lokal dan otomatis sinkron saat online.' : 'Koneksi Online & Cloud Sync Otomatis'}
          aria-label="Status Sinkronisasi Jaringan"
        >
          {offlineMode ? (
            <>
              <WifiOff className="w-3.5 h-3.5 animate-pulse text-amber-600" />
              <span className="font-medium">{t('offlineMode')}</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium">{t('cloudOnline')}</span>
            </>
          )}
        </button>

        {/* Sound toggle (hidden on ultra-small mobile to preserve space) */}
        <button
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            if (!soundEnabled) playSound('click');
          }}
          className="hidden sm:flex p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer shrink-0"
          title={soundEnabled ? 'Matikan Efek Suara' : 'Aktifkan Efek Suara'}
          aria-label="Pengaturan Suara"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-orange-500" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={() => {
            playSound('click');
            toggleDarkMode();
          }}
          className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer shrink-0"
          title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          aria-label="Pengaturan Mode Gelap atau Terang"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
        </button>

        {/* Notifications Bell (visible on sm screens up to preserve mobile header space) */}
        <div className="relative shrink-0 hidden sm:block">
          <button
            onClick={() => {
              playSound('click');
              setShowNotifDropdown(!showNotifDropdown);
            }}
            className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative cursor-pointer"
            aria-label="Notifikasi Sistem"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t('notifications')}</h4>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 font-bold">
                      {unreadNotificationsCount} {language === 'en' ? 'New' : 'Baru'}
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-medium"
                >
                  {t('markAllRead')}
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 py-1">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">{t('noNotifications')}</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`py-2.5 px-2 rounded-lg transition-colors ${
                        !n.read ? 'bg-orange-50/50 dark:bg-orange-950/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Cart Button Toggle */}
        {onOpenMobileCart && (
          <button
            onClick={onOpenMobileCart}
            className={`lg:hidden relative p-1.5 sm:p-2 rounded-full ${theme.primaryBg} text-white shadow-md shrink-0`}
            aria-label="Buka Keranjang Pesanan"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {cartTotalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-600 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                {cartTotalItems}
              </span>
            )}
          </button>
        )}

        {/* Pemilihan User Button - Directly opens the 4-choice user selection modal without awkward scroll-down */}
        <div className="relative shrink-0">
          <button
            onClick={() => {
              playSound('click');
              setPendingStaffUser(currentStaff);
              setIsPinModalOpen(true);
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-orange-50/70 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 shadow-xs shrink-0 cursor-pointer group active:scale-95"
            aria-label="Tekan untuk Pemilihan User dan Hak Akses Kasir"
            title={language === 'en' ? 'Click for User Selection (Admin, Manager, Cashier)' : 'Tekan untuk Pemilihan User (Admin, Manager, Kasir Pagi/Siang)'}
          >
            <div className="relative shrink-0">
              <img
                src={currentStaff.avatar}
                alt={currentStaff.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-orange-500/40 shrink-0"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>

            {/* On desktop show Pemilihan User, name and role badge */}
            <div className="text-left hidden md:block">
              <div className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{language === 'en' ? 'Select User' : 'Pemilihan User'}</span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                <span className="truncate max-w-[110px]">{currentStaff.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider ${getRoleBadge(currentStaff.role)}`}>
                  {currentStaff.shift || currentStaff.role}
                </span>
              </div>
            </div>

            {/* On mobile devices show compact badge */}
            <div className="md:hidden flex flex-col items-start text-left">
              <span className="text-[9px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">
                User
              </span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase tracking-wider shrink-0 ${getRoleBadge(currentStaff.role)}`}>
                {currentStaff.shift?.includes('Siang') ? 'SIANG' : currentStaff.shift?.includes('Pagi') ? 'PAGI' : currentStaff.role.toUpperCase()}
              </span>
            </div>

            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-orange-500 transition-colors shrink-0" />
          </button>
        </div>
      </div>
    </header>

  );
};
