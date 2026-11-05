import React, { useEffect, useRef } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const ConfirmDeleteModal: React.FC = () => {
  const { confirmDeleteModal, closeConfirmDeleteModal, playSound } = useApp();
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirmDeleteModal?.isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeConfirmDeleteModal();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [confirmDeleteModal?.isOpen]);

  if (!confirmDeleteModal || !confirmDeleteModal.isOpen) return null;

  const handleConfirm = () => {
    try {
      confirmDeleteModal.onConfirm();
    } finally {
      closeConfirmDeleteModal();
    }
  };

  const domain = typeof window !== 'undefined' && window.location.host ? window.location.host : 'refood-alpha.vercel.app';

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={closeConfirmDeleteModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-200 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Top header badge simulating origin / app title matching user reference */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">{domain} says:</span>
          </div>
          <button
            onClick={() => {
              playSound('click');
              closeConfirmDeleteModal();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Tutup dialog"
            aria-label="Tutup dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-950/60 rounded-2xl text-red-600 shrink-0 shadow-inner">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <h3
              id="confirm-delete-title"
              className="text-base font-extrabold text-slate-900 dark:text-white leading-snug break-words"
            >
              {confirmDeleteModal.message}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tindakan ini permanen. Data yang dihapus tidak akan ditampilkan lagi di katalog atau stok gudang.
            </p>
          </div>
        </div>

        {/* Action Buttons matching standard alert/confirm dialog */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              closeConfirmDeleteModal();
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-extrabold shadow-lg shadow-red-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmDeleteModal.confirmLabel || 'Hapus'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
