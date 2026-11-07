import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  ShieldAlert,
  UserCheck,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  Users,
  Phone,
  Mail,
  AlertCircle,
  KeyRound,
  ArrowRightLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { StaffUser } from '../../types/index.ts';
import { canUserEditStaffRole } from '../../utils/posCalculations.ts';
import { getThemeClasses } from '../../utils/themeHelper.ts';

export const StaffManagementModal: React.FC = () => {
  const {
    language,
    isStaffModalOpen,
    setIsStaffModalOpen,
    staffList,
    currentStaff,
    updateStaffUser,
    directSwitchStaffUser,
    setIsPinModalOpen,
    playSound,
    themeColor,
  } = useApp();

  const theme = getThemeClasses(themeColor);

  // Editing state
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editShift, setEditShift] = useState('');
  const [editPin, setEditPin] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [showPinId, setShowPinId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  if (!isStaffModalOpen) return null;

  const isCashier = currentStaff.role === 'kasir';
  const isAdminOrManager = currentStaff.role === 'admin' || currentStaff.role === 'manager';

  const startEditing = (staff: StaffUser) => {
    playSound('click');
    setEditingStaffId(staff.id);
    setEditName(staff.name);
    setEditShift(staff.shift || staff.role);
    setEditPin(staff.pin);
    setEditPhone(staff.phone || '');
    setFormError('');
  };

  const cancelEditing = () => {
    playSound('click');
    setEditingStaffId(null);
    setFormError('');
  };

  const handleSave = (staffId: string) => {
    if (!editName.trim()) {
      setFormError(language === 'en' ? 'Staff name cannot be empty.' : 'Nama staf tidak boleh kosong.');
      playSound('alert');
      return;
    }

    if (!/^\d{6}$/.test(editPin.trim())) {
      setFormError(language === 'en' ? 'PIN must be exactly 6 digits.' : 'Sandi PIN harus terdiri dari 6 angka.');
      playSound('alert');
      return;
    }

    const result = updateStaffUser(staffId, {
      name: editName.trim(),
      shift: editShift.trim(),
      pin: editPin.trim(),
      phone: editPhone.trim(),
    });

    if (result.success) {
      setEditingStaffId(null);
      setFormError('');
    } else {
      setFormError(result.message);
    }
  };

  const handleQuickUnlock = () => {
    playSound('click');
    setIsStaffModalOpen(false);
    setIsPinModalOpen(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="staff-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 sm:space-y-5 animate-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-700 pb-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 id="staff-modal-title" className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                {language === 'en' ? 'Staff & Cashier Management' : 'Kelola & Edit Nama Staf Kasir'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'en'
                  ? 'Admin and Manager can modify staff names, shifts, and 6-digit PINs.'
                  : 'Admin & Manager dapat mengubah nama kasir, shift, dan sandi PIN.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setIsStaffModalOpen(false);
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Status Banner */}
        <div
          className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
            isCashier
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {isCashier ? (
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            ) : (
              <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-bold truncate">
                {language === 'en' ? 'Active User:' : 'Pengguna Aktif:'}{' '}
                <span className="underline">{currentStaff.name}</span> ({currentStaff.shift || currentStaff.role.toUpperCase()})
              </p>
              <p className="text-[11px] opacity-90 mt-0.5">
                {isCashier
                  ? language === 'en'
                    ? 'Read-Only Mode: Cashiers cannot edit staff. Log in as Admin/Manager to edit.'
                    : 'Akses Terbatas: Kasir tidak dapat mengubah data. Masuk sebagai Admin/Manager untuk mengedit.'
                  : language === 'en'
                  ? 'Authorized: You can edit cashier and staff names. Changes update everywhere immediately.'
                  : 'Hak Akses Penuh: Anda dapat mengedit nama kasir dan staf. Perubahan langsung terupdate otomatis.'}
              </p>
            </div>
          </div>

          {isCashier && (
            <button
              type="button"
              onClick={handleQuickUnlock}
              className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm transition-transform active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 inline mr-1" />
              {language === 'en' ? 'Unlock with PIN' : 'Ganti PIN Admin'}
            </button>
          )}
        </div>

        {/* Form Error Banner */}
        {formError && (
          <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Staff Cards List */}
        <div className="space-y-3">
          {staffList.map((staff) => {
            const isCurrent = currentStaff.id === staff.id;
            const canEditThisStaff = canUserEditStaffRole(currentStaff.role, staff.role);
            const isEditing = editingStaffId === staff.id;
            const isPinVisible = showPinId === staff.id;

            return (
              <div
                key={staff.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-orange-500 bg-orange-50/40 dark:bg-orange-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60'
                }`}
              >
                {isEditing ? (
                  /* Edit Form */
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-xs font-bold text-orange-600 uppercase">
                        Edit Data: {staff.role.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">ID: {staff.id}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                          {language === 'en' ? 'Staff Full Name:' : 'Nama Lengkap Kasir / Staf:'}
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Masukkan nama staf..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                          {language === 'en' ? 'Shift / Position Label:' : 'Label Shift / Posisi:'}
                        </label>
                        <input
                          type="text"
                          value={editShift}
                          onChange={(e) => setEditShift(e.target.value)}
                          placeholder="Contoh: Kasir Shift Pagi"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                          {language === 'en' ? '6-Digit Security PIN:' : 'Sandi PIN 6-Digit:'}
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={editPin}
                          onChange={(e) => setEditPin(e.target.value.replace(/\D/g, ''))}
                          placeholder="6 angka (contoh: 123456)"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                          {language === 'en' ? 'WhatsApp Phone:' : 'Nomor WhatsApp / Kontak:'}
                        </label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="+62 8..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        {language === 'en' ? 'Cancel' : 'Batal'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSave(staff.id)}
                        className={`px-4 py-1.5 rounded-xl text-white text-xs font-bold ${theme.primaryBg} ${theme.primaryHover} shadow-sm flex items-center gap-1.5 cursor-pointer`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        {language === 'en' ? 'Save Changes' : 'Simpan Perubahan'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display Row */
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                            {staff.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase shrink-0">
                            {staff.shift || staff.role}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500 text-white font-bold shrink-0">
                              Sedang Aktif
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <KeyRound className="w-3 h-3 text-orange-500 shrink-0" />
                            <span>Sandi PIN:</span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                              {isPinVisible ? staff.pin : '••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                playSound('click');
                                setShowPinId(isPinVisible ? null : staff.id);
                              }}
                              className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                              title={isPinVisible ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                              aria-label={isPinVisible ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                            >
                              {isPinVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          </span>

                          {staff.phone && (
                            <span className="hidden sm:inline-flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{staff.phone}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      {canEditThisStaff ? (
                        <button
                          type="button"
                          onClick={() => startEditing(staff)}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                          title={`Edit nama & PIN ${staff.name}`}
                        >
                          <Edit3 className="w-3.5 h-3.5 text-orange-500" />
                          <span>{language === 'en' ? 'Edit Name & PIN' : 'Edit Nama & PIN'}</span>
                        </button>
                      ) : isCashier ? (
                        <span className="text-[11px] text-slate-400 italic">
                          {language === 'en' ? 'Locked (Cashier)' : 'Terkunci (Hanya Admin)'}
                        </span>
                      ) : null}

                      {!isCurrent ? (
                        <button
                          type="button"
                          onClick={() => {
                            directSwitchStaffUser(staff.id);
                            setIsStaffModalOpen(false);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          title={`Beralih ke akun ${staff.name}`}
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Switch' : 'Ganti Akun'}</span>
                        </button>
                      ) : (
                        <span className="hidden sm:inline-flex text-[11px] font-bold text-orange-600 dark:text-orange-400 items-center gap-1">
                          ● Online
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info & close */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
          <p className="text-[11px] text-slate-400">
            {language === 'en'
              ? 'Changes are automatically saved and synced across all devices.'
              : 'Setiap nama atau PIN yang diubah otomatis tersimpan dan berlaku seketika di seluruh sistem.'}
          </p>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setIsStaffModalOpen(false);
                setIsPinModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 inline mr-1 text-orange-500" />
              {language === 'en' ? 'Keypad PIN Switch' : 'Keypad PIN Cepat'}
            </button>
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setIsStaffModalOpen(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold cursor-pointer"
            >
              {language === 'en' ? 'Close' : 'Selesai & Tutup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
