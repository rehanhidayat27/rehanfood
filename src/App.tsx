import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { PosView } from './components/pos/PosView.tsx';
import { CartPanel } from './components/pos/CartPanel.tsx';
import { AnalyticsDashboard } from './components/dashboard/AnalyticsDashboard.tsx';
import { ProductManagement } from './components/inventory/ProductManagement.tsx';
import { StockManagement } from './components/inventory/StockManagement.tsx';
import { FinancialReports } from './components/reports/FinancialReports.tsx';
import { CalendarView } from './components/calendar/CalendarView.tsx';
import { SettingsView } from './components/settings/SettingsView.tsx';
import { PaymentModal } from './components/modals/PaymentModal.tsx';
import { PinModal } from './components/modals/PinModal.tsx';
import { WhatsAppModal } from './components/modals/WhatsAppModal.tsx';
import { ReceiptModal } from './components/modals/ReceiptModal.tsx';
import { RecipeModal } from './components/modals/RecipeModal.tsx';
import { ConfirmDeleteModal } from './components/modals/ConfirmDeleteModal.tsx';
import { StaffManagementModal } from './components/modals/StaffManagementModal.tsx';
import { Bell, CheckCircle, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, activeToast, dismissToast } = useApp();
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased selection:bg-orange-500 selection:text-white transition-colors">
      {/* Slim left navigation bar matching reference screenshot */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header onOpenMobileCart={() => setMobileCartOpen(true)} />

        {/* Tab content area */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {/* Active view component */}
          <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden" role="main">
            {activeTab === 'pos' && <PosView />}
            {activeTab === 'dashboard' && <AnalyticsDashboard />}
            {activeTab === 'products' && <ProductManagement />}
            {activeTab === 'stock' && <StockManagement />}
            {activeTab === 'reports' && <FinancialReports />}
            {activeTab === 'calendar' && <CalendarView />}
            {activeTab === 'settings' && <SettingsView />}
          </main>

          {/* Right sidebar: POS Cart (shown directly on POS tab for desktop) */}
          {activeTab === 'pos' && (
            <div className="hidden lg:block h-full">
              <CartPanel />
            </div>
          )}

          {/* Mobile slide-out drawer for cart */}
          {mobileCartOpen && (
            <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-sm flex justify-end">
              <div className="w-full max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-300">
                <CartPanel onCloseMobile={() => setMobileCartOpen(false)} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Global Modals */}
      <PaymentModal />
      <PinModal />
      <WhatsAppModal />
      <ReceiptModal />
      <RecipeModal />
      <ConfirmDeleteModal />
      <StaffManagementModal />

      {/* Push Notification Toast */}
      {activeToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-slate-700/50 dark:border-slate-300/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold leading-relaxed flex-1">{activeToast}</span>
          <button
            onClick={dismissToast}
            className="text-slate-400 hover:text-white dark:hover:text-slate-900 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
