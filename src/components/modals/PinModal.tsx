import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Briefcase,
  Sun,
  Moon,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Delete,
  X,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { StaffUser } from '../../types/index.ts';
import { getThemeClasses } from '../../utils/themeHelper.ts';

export const PinModal: React.FC = () => {
  const {
    language,
    isPinModalOpen,
    setIsPinModalOpen,
    pendingRoleSwitch,
    setPendingRoleSwitch,
    pendingStaffUser,
    setPendingStaffUser,
    staffList,
    currentStaff,
    switchStaffRoleWithPin,
    directSwitchStaffUser,
    playSound,
    themeColor,
  } = useApp();

  const theme = getThemeClasses(themeColor);

  // Selected target position from the 4 user choices
  const [selectedStaffId, setSelectedStaffId] = useState<string>('staff-admin');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);

  // Initialize selected position when modal opens
  useEffect(() => {
    if (isPinModalOpen) {
      setPin('');
      setErrorMsg('');
      setShake(false);

      if (pendingStaffUser) {
        setSelectedStaffId(pendingStaffUser.id);
      } else if (pendingRoleSwitch) {
        const found = staffList.find(s => s.role === pendingRoleSwitch);
        setSelectedStaffId(found?.id || staffList[0]?.id || 'staff-admin');
      } else {
        // Default to a staff different from current, or current staff
        setSelectedStaffId(currentStaff.id);
      }
    }
  }, [isPinModalOpen, pendingStaffUser, pendingRoleSwitch, currentStaff, staffList]);

  const selectedStaff: StaffUser =
    staffList.find(s => s.id === selectedStaffId) ||
    currentStaff ||
    staffList[0];

  const handleVerify = useCallback(
    (pinToTest: string, staffId: string) => {
      const success = switchStaffRoleWithPin(pinToTest, staffId);
      if (!success) {
        playSound('alert');
        const target = staffList.find(s => s.id === staffId);
        setErrorMsg(
          language === 'en'
            ? `Incorrect PIN! The PIN for ${target?.shift || target?.name} is ${target?.pin}`
            : `Sandi PIN salah! Sandi untuk ${target?.shift || target?.name} adalah ${target?.pin}`
        );
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setPin('');
        }, 700);
      }
    },
    [switchStaffRoleWithPin, playSound, language, staffList]
  );

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length < 6) {
        const nextPin = pin + digit;
        setPin(nextPin);
        playSound('click');
        setErrorMsg('');
        if (nextPin.length === 6) {
          handleVerify(nextPin, selectedStaffId);
        }
      }
    },
    [pin, playSound, handleVerify, selectedStaffId]
  );

  const handleBackspace = useCallback(() => {
    playSound('click');
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  }, [playSound]);

  const handleClear = useCallback(() => {
    playSound('click');
    setPin('');
    setErrorMsg('');
  }, [playSound]);

  const handleClose = useCallback(() => {
    setIsPinModalOpen(false);
    setPendingRoleSwitch(null);
    setPendingStaffUser(null);
    setPin('');
    setErrorMsg('');
  }, [setIsPinModalOpen, setPendingRoleSwitch, setPendingStaffUser]);

  // Keyboard navigation support
  useEffect(() => {
    if (!isPinModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPinModalOpen, handleDigit, handleBackspace, handleClose]);

  if (!isPinModalOpen) return null;

  // Visual metadata for the 4 core positions
  const getPositionMeta = (staff: StaffUser) => {
    if (staff.role === 'admin' || staff.shift?.toLowerCase().includes('admin')) {
      return {
        icon: Shield,
        badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        activeRing: 'ring-2 ring-purple-500 border-purple-500 bg-purple-50/60 dark:bg-purple-950/30',
        accentColor: 'text-purple-600 dark:text-purple-400',
        title: 'Admin',
        duty: 'Hak Akses Penuh Sistem & Laporan',
      };
    }
    if (staff.role === 'manager' || staff.shift?.toLowerCase().includes('manager')) {
      return {
        icon: Briefcase,
        badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        activeRing: 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/60 dark:bg-blue-950/30',
        accentColor: 'text-blue-600 dark:text-blue-400',
        title: 'Manager',
        duty: 'Kelola Menu, Resep & Analitik',
      };
    }
    if (staff.shift?.toLowerCase().includes('siang') || staff.shift?.toLowerCase().includes('sore')) {
      return {
        icon: Moon,
        badgeColor: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800',
        activeRing: 'ring-2 ring-teal-500 border-teal-500 bg-teal-50/60 dark:bg-teal-950/30',
        accentColor: 'text-teal-600 dark:text-teal-400',
        title: 'Kasir Shift Siang',
        duty: 'Operasional Kasir (15:00 - 23:00)',
      };
    }
    // Default: Kasir Shift Pagi
    return {
      icon: Sun,
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      activeRing: 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/60 dark:bg-amber-950/30',
      accentColor: 'text-amber-600 dark:text-amber-400',
      title: 'Kasir Shift Pagi',
      duty: 'Operasional Kasir (07:00 - 15:00)',
    };
  };

  const selectedMeta = getPositionMeta(selectedStaff);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-user-selection-title"
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-auto animate-in fade-in zoom-in-95 transition-all ${
          shake ? 'animate-bounce' : ''
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="modal-user-selection-title"
                className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight"
              >
                {language === 'en' ? 'User Selection & PIN' : 'Pemilihan User & Kasir'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {language === 'en'
                  ? 'Select position and enter the corresponding PIN'
                  : 'Pilih posisi menu di bawah lalu gunakan sandi PIN yang sesuai'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup dialog pemilihan user"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Core User Selection Menu Cards - No scrolling needed! */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{language === 'en' ? 'Select Position:' : 'Pilihan Menu User:'}</span>
            <span className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold lowercase">
              (tekan untuk memilih)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {staffList.map((staff) => {
              const meta = getPositionMeta(staff);
              const Icon = meta.icon;
              const isSelected = selectedStaff.id === staff.id;
              const isCurrentActive = currentStaff.id === staff.id;

              return (
                <button
                  key={staff.id}
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setSelectedStaffId(staff.id);
                    setPin('');
                    setErrorMsg('');
                  }}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? `${meta.activeRing} shadow-md`
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {/* Top line with Icon and Active Badge */}
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-1.5">
                      <div className={`p-1.5 rounded-xl ${meta.badgeColor} shrink-0`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                        {meta.title}
                      </span>
                    </div>

                    {isCurrentActive && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-bold shrink-0">
                        Aktif
                      </span>
                    )}
                  </div>

                  {/* Staff Name & Shift */}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-1">
                    {staff.name}
                  </div>

                  {/* Sandi PIN Display */}
                  <div className="mt-auto pt-1 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-mono">
                      Sandi: <strong className={`${meta.accentColor} font-mono font-bold tracking-wider`}>{staff.pin}</strong>
                    </span>
                    {isSelected && (
                      <CheckCircle2 className={`w-3 h-3 ${meta.accentColor}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PIN Input Section for Selected Position */}
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200 dark:border-slate-800 text-center space-y-2.5">
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              <span>
                {language === 'en' ? 'Target Position' : 'Posisi Terpilih'}:{' '}
                <strong className={selectedMeta.accentColor}>{selectedMeta.title}</strong>
              </span>
            </div>
            <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
              {language === 'en'
                ? `Enter 6-Digit PIN for ${selectedMeta.title}`
                : `Masukkan Sandi PIN untuk ${selectedMeta.title}`}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'en' ? 'Official PIN:' : 'Sandi Resmi Posisi Ini:'}{' '}
              <span className={`font-mono font-bold ${selectedMeta.accentColor} px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700`}>
                {selectedStaff.pin}
              </span>
            </div>
          </div>

          {/* 6 PIN Indicator Bullets */}
          <div className="flex justify-center gap-2.5 py-1">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const isFilled = idx < pin.length;
              return (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-200 ${
                    isFilled
                      ? `${theme.primaryBg} scale-110 shadow-sm ring-2 ring-orange-400/40`
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              );
            })}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-semibold animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tactile Keypad */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 max-w-[240px] mx-auto pt-0.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigit(digit)}
                className="h-10 sm:h-11 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 text-base font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center justify-center cursor-pointer"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-10 sm:h-11 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleDigit('0')}
              className="h-10 sm:h-11 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 text-base font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center justify-center cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-10 sm:h-11 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center cursor-pointer"
              aria-label="Hapus satu angka"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {language === 'en' ? 'Cancel' : 'Batal'}
          </button>

          {/* Instant 1-Click Switch Button for Seamless Testing */}
          <button
            type="button"
            onClick={() => {
              directSwitchStaffUser(selectedStaff.id);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white ${theme.primaryBg} ${theme.primaryHover} shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all`}
            title={`Masuk langsung ke ${selectedMeta.title} tanpa mengetik PIN`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {language === 'en' ? 'Quick Login' : 'Masuk Langsung'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
