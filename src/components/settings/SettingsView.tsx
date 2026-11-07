import React from 'react';
import {
  Palette,
  Moon,
  Sun,
  Globe,
  Volume2,
  Cloud,
  Wifi,
  Users,
  Shield,
  Check,
  RefreshCw,
  Database,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { ThemeColor, AppLanguage } from '../../types/index.ts';
import { getThemeClasses } from '../../utils/themeHelper.ts';

export const SettingsView: React.FC = () => {
  const {
    themeColor,
    setThemeColor,
    darkMode,
    toggleDarkMode,
    language,
    setLanguage,
    soundEnabled,
    setSoundEnabled,
    offlineMode,
    setOfflineMode,
    lastCloudBackup,
    performCloudBackup,
    staffList,
    currentStaff,
    setIsPinModalOpen,
    setIsStaffModalOpen,
    setPendingRoleSwitch,
    setPendingStaffUser,
    resetToDefaultData,
    playSound,
  } = useApp();

  const theme = getThemeClasses(themeColor);

  const THEMES: { id: ThemeColor; name: string; bg: string }[] = [
    { id: 'orange', name: 'Refood Orange (Default)', bg: 'bg-orange-500' },
    { id: 'emerald', name: 'Pandan Emerald', bg: 'bg-emerald-600' },
    { id: 'blue', name: 'Samudra Blue', bg: 'bg-blue-600' },
    { id: 'rose', name: 'Delima Rose', bg: 'bg-rose-500' },
    { id: 'amber', name: 'Kunyit Amber', bg: 'bg-amber-500' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 space-y-6 custom-scrollbar pb-24 lg:pb-8 min-w-0">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
          Konfigurasi Preferensi & Sistem
        </span>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
          Pengaturan Aplikasi & Hak Akses
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Kustomisasi tema warna, mode tampilan gelap/terang, backup cloud harian, dan sinkronisasi offline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Theme Color Customization */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-orange-500" />
            <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">
              Warna Tema Tampilan (Custom Theme)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Pilih palet warna aksen aplikasi kasir Refood POS sesuai identitas restoran Anda:
          </p>

          <div className="space-y-2">
            {THEMES.map((t) => {
              const isSelected = themeColor === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    playSound('click');
                    setThemeColor(t.id);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all ${
                    isSelected
                      ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full ${t.bg} shadow-sm shrink-0`} />
                    <span>{t.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Display, Sound & Language */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">
              Tampilan, Bahasa & Audio
            </h3>
          </div>

          <div className="space-y-3 pt-1">
            {/* Dark / Light Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="space-y-0.5">
                <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  {darkMode ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <span>Mode Tampilan Gelap (Dark Mode)</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Menyesuaikan kenyamanan mata kasir di shift malam
                </div>
              </div>
              <button
                onClick={() => {
                  playSound('click');
                  toggleDarkMode();
                }}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  darkMode ? 'bg-orange-500' : 'bg-slate-300'
                }`}
                aria-label="Toggle Mode Gelap"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sound Effects Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="space-y-0.5">
                <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-orange-500" />
                  <span>Efek Suara Audio Responsif</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Suara sintetis saat tambah menu, klik, dan bayar
                </div>
              </div>
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  if (!soundEnabled) playSound('click');
                }}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  soundEnabled ? 'bg-orange-500' : 'bg-slate-300'
                }`}
                aria-label="Toggle Efek Suara"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 gap-2.5 sm:gap-4">
              <div className="space-y-0.5 min-w-0">
                <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Bahasa Sistem (Language)</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Dukungan multi-bahasa operasional
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value as AppLanguage);
                  playSound('click');
                }}
                className="w-full sm:w-auto text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold shrink-0 cursor-pointer shadow-sm"
              >
                <option value="id">ID Bahasa Indonesia</option>
                <option value="en">EN English (US)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Cloud Backup & Offline Synchronization */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-500" />
            <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">
              Backup Cloud & Sinkronisasi Offline
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Jadwal Cloud Backup:</span>
              <span className="font-bold text-emerald-600">Otomatis Setiap Hari (04:00 WIB)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Backup Terakhir:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{lastCloudBackup}</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={performCloudBackup}
                className={`flex-1 py-2.5 px-3 rounded-xl text-white text-xs font-bold ${theme.primaryBg} ${theme.primaryHover} shadow-md flex items-center justify-center gap-1.5 cursor-pointer`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Backup Cloud</span>
              </button>
              <button
                type="button"
                onClick={resetToDefaultData}
                className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                title="Pulihkan data katalog menu dan bahan baku ke setelan bawaan"
              >
                <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
                <span>Reset Data Awal</span>
              </button>
            </div>
          </div>

          {/* Offline Mode Switcher */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Wifi className="w-4 h-4 text-emerald-500" />
                <span>Simulasi Mode Offline (Tanpa Internet)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Sistem tetap berfungsi 100% dan sinkron otomatis saat online kembali.
              </div>
            </div>
            <button
              onClick={() => {
                setOfflineMode(!offlineMode);
                playSound('click');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                offlineMode
                  ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
              }`}
            >
              {offlineMode ? 'Aktif (Offline)' : 'Online Sync'}
            </button>
          </div>
        </div>

        {/* 4. Multi-User Access & PIN Management */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500 shrink-0" />
              <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">
                Hak Akses Multi-Pengguna (RBAC)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setIsStaffModalOpen(true);
              }}
              className="self-start sm:self-auto px-3 py-1.5 text-xs font-bold rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 border border-orange-200 dark:border-orange-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Admin & Manager dapat mengedit nama dan PIN staf kasir"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Kelola & Edit Nama Kasir</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {staffList.map((staff) => {
              const isCurrent = currentStaff.id === staff.id;
              return (
                <div
                  key={staff.id}
                  className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isCurrent
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                        <span className="truncate">{staff.name}</span>
                        {isCurrent ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500 text-white font-bold shrink-0">
                            Sedang Aktif
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold shrink-0 uppercase">
                            {staff.role}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                        Posisi: <span className="text-slate-700 dark:text-slate-200 font-semibold">{staff.shift || staff.role}</span>
                        <span className="mx-1.5">•</span>
                        Sandi PIN: <span className="font-mono font-bold text-orange-600 dark:text-orange-400">{staff.pin}</span>
                      </div>
                    </div>
                  </div>

                  {!isCurrent ? (
                    <button
                      type="button"
                      onClick={() => {
                        setPendingStaffUser(staff);
                        setPendingRoleSwitch(staff.role);
                        setIsPinModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors active:scale-95 whitespace-nowrap self-stretch sm:self-auto"
                    >
                      <Lock className="w-3.5 h-3.5" /> Ganti ke Akun Ini
                    </button>
                  ) : (
                    <span className="hidden sm:inline-flex text-[11px] font-bold text-orange-600 dark:text-orange-400 items-center gap-1 shrink-0">
                      ● Aktif Sekarang
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
