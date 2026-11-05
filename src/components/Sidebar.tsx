import React from 'react';
import {
  UtensilsCrossed,
  LayoutGrid,
  ShoppingBag,
  Package,
  BarChart3,
  Calendar,
  FileText,
  Settings,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { getThemeClasses } from '../utils/themeHelper.ts';

export const Sidebar: React.FC = () => {
  const {
    t,
    activeTab,
    setActiveTab,
    currentStaff,
    setIsPinModalOpen,
    setPendingRoleSwitch,
    setPendingStaffUser,
    playSound,
    themeColor,
    criticalStockCount,
  } = useApp();

  const theme = getThemeClasses(themeColor);

  interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    roles: ('kasir' | 'manager' | 'admin')[];
    badge?: number;
  }

  const navItems: NavItem[] = [
    {
      id: 'pos',
      label: t('navPos'),
      icon: LayoutGrid,
      roles: ['kasir', 'manager', 'admin'],
    },
    {
      id: 'products',
      label: t('navProducts'),
      icon: ShoppingBag,
      roles: ['admin', 'manager'],
    },
    {
      id: 'stock',
      label: t('navStock'),
      icon: Package,
      roles: ['admin', 'manager'],
      badge: criticalStockCount > 0 ? criticalStockCount : undefined,
    },
    {
      id: 'dashboard',
      label: t('navDashboard'),
      icon: BarChart3,
      roles: ['manager', 'admin'],
    },
    {
      id: 'reports',
      label: t('navReports'),
      icon: FileText,
      roles: ['manager', 'admin'],
    },
    {
      id: 'calendar',
      label: t('navCalendar'),
      icon: Calendar,
      roles: ['kasir', 'manager', 'admin'],
    },
    {
      id: 'settings',
      label: t('navSettings'),
      icon: Settings,
      roles: ['kasir', 'manager', 'admin'],
    },
  ];

  const handleNavClick = (tabId: string) => {
    playSound('click');
    setActiveTab(tabId);
  };

  const handleLockClick = () => {
    playSound('click');
    setPendingStaffUser(currentStaff);
    setIsPinModalOpen(true);
  };

  return (
    <aside
      className="w-16 md:w-20 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-5 justify-between shrink-0 z-30 transition-colors"
      aria-label="Navigasi Utama"
    >
      {/* Brand Icon (Orange Ring like in screenshot) */}
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={() => handleNavClick('pos')}
          className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group focus:outline-none cursor-pointer"
          title={t('brandName')}
          aria-label={`${t('brandName')} Home`}
        >
          <div className="w-10 h-10 rounded-full border-4 border-orange-500 flex items-center justify-center bg-orange-50 dark:bg-orange-950/40 shadow-sm">
            <UtensilsCrossed className="w-5 h-5 text-orange-600 dark:text-orange-400 group-hover:rotate-12 transition-transform" />
          </div>
        </button>

        {/* Navigation items */}
        <nav className="flex flex-col items-center space-y-3" aria-label="Menu Aplikasi">
          {navItems.map((item) => {
            const hasAccess = item.roles.includes(currentStaff.role);
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => {
                    if (hasAccess) {
                      handleNavClick(item.id);
                    } else {
                      playSound('alert');
                      setPendingRoleSwitch(item.roles[0]);
                      setIsPinModalOpen(true);
                    }
                  }}
                  className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? `${theme.primaryBg} text-white shadow-md shadow-orange-500/20`
                      : hasAccess
                      ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                      : 'text-slate-300 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                  aria-label={item.label}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />

                  {/* Stock Alert Badge */}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse shadow-sm">
                      {item.badge}
                    </span>
                  )}

                  {/* Locked indicator if user doesn't have role */}
                  {!hasAccess && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500">
                      <Lock className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>

                {/* Floating tooltip on hover */}
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-md shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.label}
                  {!hasAccess && (
                    <span className="ml-1 text-orange-300 text-[10px]">
                      (Khusus {item.roles.join('/')})
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Switch Role / Lock */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleLockClick}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors group relative"
          title="Kunci / Ganti Akun dengan PIN"
          aria-label="Kunci atau Ganti Pengguna dengan PIN"
        >
          <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <div className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-xs rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            Ganti PIN / Kunci ({currentStaff.role.toUpperCase()})
          </div>
        </button>
      </div>
    </aside>
  );
};
