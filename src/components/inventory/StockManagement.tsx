import React, { useState } from 'react';
import {
  Package,
  Plus,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Trash2,
  Edit2,
  TrendingDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatIDR, exportInventoryToCSV } from '../../utils/exportUtils.ts';
import { RawMaterial } from '../../types/index.ts';
import { checkLowStock } from '../../utils/posCalculations.ts';
import { getThemeClasses } from '../../utils/themeHelper.ts';
import { getMaterialName, getMaterialUnit } from '../../utils/translations.ts';

export const StockManagement: React.FC = () => {
  const {
    t,
    language,
    rawMaterials,
    addRawMaterial,
    updateRawMaterial,
    restockRawMaterial,
    deleteRawMaterial,
    resetToDefaultData,
    requestConfirmDelete,
    playSound,
    themeColor,
  } = useApp();

  const theme = getThemeClasses(themeColor);
  const [search, setSearch] = useState('');
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedMaterialForRestock, setSelectedMaterialForRestock] = useState<RawMaterial | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(10);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);

  // Form states for create/edit
  const [matName, setMatName] = useState('');
  const [matUnit, setMatUnit] = useState('kg');
  const [matStock, setMatStock] = useState<number>(10);
  const [matThreshold, setMatThreshold] = useState<number>(5);
  const [matCost, setMatCost] = useState<number>(30000);
  const [matSupplier, setMatSupplier] = useState('');

  const filteredMaterials = rawMaterials.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.supplier.toLowerCase().includes(search.toLowerCase())
  );

  const criticalMaterials = rawMaterials.filter(
    (m) => checkLowStock(m.currentStock, m.minThreshold).isCritical
  );

  const openRestock = (m: RawMaterial) => {
    setSelectedMaterialForRestock(m);
    setRestockAmount(10);
    setIsRestockModalOpen(true);
  };

  const handleConfirmRestock = () => {
    if (selectedMaterialForRestock && restockAmount > 0) {
      restockRawMaterial(selectedMaterialForRestock.id, restockAmount);
      setIsRestockModalOpen(false);
      setSelectedMaterialForRestock(null);
    }
  };

  const openCreateModal = () => {
    setEditingMaterial(null);
    setMatName('');
    setMatUnit('kg');
    setMatStock(15);
    setMatThreshold(5);
    setMatCost(35000);
    setMatSupplier('PD Pasar Jaya');
    setIsEditModalOpen(true);
  };

  const openEditModal = (m: RawMaterial) => {
    setEditingMaterial(m);
    setMatName(m.name);
    setMatUnit(m.unit);
    setMatStock(m.currentStock);
    setMatThreshold(m.minThreshold);
    setMatCost(m.costPerUnit);
    setMatSupplier(m.supplier);
    setIsEditModalOpen(true);
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matName.trim()) return;

    if (editingMaterial) {
      updateRawMaterial({
        ...editingMaterial,
        name: matName,
        unit: matUnit,
        currentStock: matStock,
        minThreshold: matThreshold,
        costPerUnit: matCost,
        supplier: matSupplier,
      });
    } else {
      addRawMaterial({
        name: matName,
        unit: matUnit,
        currentStock: matStock,
        minThreshold: matThreshold,
        costPerUnit: matCost,
        supplier: matSupplier,
        lastRestocked: new Date().toISOString().slice(0, 10),
      });
    }

    playSound('pay');
    setIsEditModalOpen(false);
  };

  const handleExportCSV = () => {
    playSound('pay');
    exportInventoryToCSV(rawMaterials);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 custom-scrollbar pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            {language === 'en' ? 'Warehouse & Kitchen Supplies' : 'Pengendalian Gudang & Dapur'}
          </span>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {t('stockMgmtTitle')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('stockMgmtSub')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{t('exportCSV')}</span>
          </button>

          <button
            onClick={openCreateModal}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold text-white ${theme.primaryBg} ${theme.primaryHover} shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer`}
          >
            <Plus className="w-4 h-4" />
            <span>{t('addRawMaterial')}</span>
          </button>
        </div>
      </div>

      {/* Critical Stock Alert Banner if items are critically low */}
      {criticalMaterials.length > 0 && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start gap-3 animate-in fade-in">
          <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-extrabold text-red-800 dark:text-red-300">
              {language === 'en'
                ? `Critical Alert: ${criticalMaterials.length} Ingredients Low on Stock!`
                : `Peringatan Kritis: ${criticalMaterials.length} Bahan Baku Mendekati Habis!`}
            </h4>
            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
              {language === 'en'
                ? `The following ingredients are below minimum threshold: ${criticalMaterials.map(m => `${getMaterialName(m, language)} (${m.currentStock} ${getMaterialUnit(m, language)})`).join(', ')}. Please restock now!`
                : `Bahan berikut berada di bawah batas minimum: ${criticalMaterials.map(m => `${m.name} (${m.currentStock} ${m.unit})`).join(', ')}. Lakukan pemesanan ulang agar dapur tidak kehabisan stok sajian!`}
            </p>
          </div>
        </div>
      )}

      {/* Search and stats bar */}
      <div className="p-4 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('searchStock')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          />
        </div>
        <span className="text-xs text-slate-400 font-semibold">
          {rawMaterials.length} {language === 'en' ? 'ingredients tracked' : 'jenis bahan terpantau'}
        </span>
      </div>

      {/* Table of Raw Materials */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" aria-label="Tabel Manajemen Stok Bahan Baku">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 pl-4">{language === 'en' ? 'Ingredient' : 'Bahan Baku'}</th>
                <th className="py-3.5">{t('currentStockCol')}</th>
                <th className="py-3.5">{t('minThresholdCol')}</th>
                <th className="py-3.5">{t('statusStockCol')}</th>
                <th className="py-3.5">{t('costPerUnitCol')}</th>
                <th className="py-3.5">{t('supplierCol')}</th>
                <th className="py-3.5 pr-4 text-right">{t('actionCol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMaterials.map((m) => {
                const stockStatus = checkLowStock(m.currentStock, m.minThreshold);
                const percent = Math.min(100, Math.round((m.currentStock / (m.minThreshold * 2.5)) * 100));

                return (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3 pl-4 font-bold text-slate-900 dark:text-white">
                      <div>{getMaterialName(m, language)}</div>
                      <div className="text-[10px] text-slate-400">ID: {m.id}</div>
                    </td>

                    <td className="py-3">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {m.currentStock} {getMaterialUnit(m, language)}
                      </span>
                      <div className="w-24 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            stockStatus.isCritical
                              ? 'bg-red-500'
                              : stockStatus.isLow
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3 text-slate-500 dark:text-slate-400">
                      {m.minThreshold} {getMaterialUnit(m, language)}
                    </td>

                    <td className="py-3">
                      {stockStatus.isCritical ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 flex items-center gap-1 w-max">
                          <AlertTriangle className="w-3 h-3" /> {language === 'en' ? 'Critical (Out)' : 'Kritis (Habis)'}
                        </span>
                      ) : stockStatus.isLow ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 flex items-center gap-1 w-max">
                          <TrendingDown className="w-3 h-3" /> {language === 'en' ? 'Low Stock' : 'Menipis'}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3" /> {language === 'en' ? 'In Stock' : 'Stok Aman'}
                        </span>
                      )}
                    </td>

                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                      {formatIDR(m.costPerUnit)} / {getMaterialUnit(m, language)}
                    </td>

                    <td className="py-3 text-slate-500 dark:text-slate-400">
                      {m.supplier}
                    </td>

                    <td className="py-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openRestock(m)}
                          className="px-2.5 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 font-bold flex items-center gap-1 transition-colors"
                          title="Tambah Stok (Restock)"
                        >
                          <RefreshCw className="w-3 h-3" /> Restock
                        </button>
                        <button
                          onClick={() => openEditModal(m)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Edit Info Bahan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            requestConfirmDelete({
                              title: 'Konfirmasi Hapus Bahan Baku',
                              message: `Hapus bahan "${m.name}"?`,
                              confirmLabel: language === 'en' ? 'Delete' : 'Hapus',
                              onConfirm: () => deleteRawMaterial(m.id),
                            });
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all cursor-pointer active:scale-90"
                          title={`Hapus bahan baku "${m.name}"`}
                          aria-label={`Hapus bahan baku ${m.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredMaterials.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Package className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                      {language === 'en' ? 'No ingredients found' : 'Tidak ada bahan baku'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {language === 'en'
                        ? 'All ingredients have been deleted or search query does not match.'
                        : 'Semua bahan telah dihapus atau kata kunci pencarian tidak ditemukan.'}
                    </p>
                    <button
                      type="button"
                      onClick={resetToDefaultData}
                      className="mt-3 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      {language === 'en' ? 'Restore Default Ingredients' : 'Pulihkan Bahan Baku Default'}
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {isRestockModalOpen && selectedMaterialForRestock && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Restock Pasokan Bahan Baku
                </h3>
                <p className="text-[11px] text-slate-400">{selectedMaterialForRestock.name}</p>
              </div>
              <button
                onClick={() => setIsRestockModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Stok Saat Ini:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedMaterialForRestock.currentStock} {selectedMaterialForRestock.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Supplier:</span>
                <span>{selectedMaterialForRestock.supplier}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Jumlah Penambahan Stok ({selectedMaterialForRestock.unit}):
              </label>
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {[5, 10, 20, 50].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRestockAmount(amt)}
                    className={`py-1.5 rounded-lg text-xs font-bold border ${
                      restockAmount === amt
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    +{amt}
                  </button>
                ))}
              </div>

              <input
                type="number"
                min="0.1"
                step="0.1"
                value={restockAmount}
                onChange={(e) => setRestockAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsRestockModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmRestock}
                className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold ${theme.primaryBg} ${theme.primaryHover} shadow-md`}
              >
                Konfirmasi Restock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Material Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {editingMaterial ? 'Edit Bahan Baku' : 'Tambah Bahan Baku Baru'}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Bahan Baku:
                </label>
                <input
                  type="text"
                  required
                  value={matName}
                  onChange={(e) => setMatName(e.target.value)}
                  placeholder="Contoh: Daging Sapi Tetelan"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Satuan Takar:
                  </label>
                  <select
                    value={matUnit}
                    onChange={(e) => setMatUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="gram">gram</option>
                    <option value="liter">liter</option>
                    <option value="butir">butir (Telur)</option>
                    <option value="ikat">ikat (Sayur)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Batas Kritis Minimum:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={matThreshold}
                    onChange={(e) => setMatThreshold(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Stok Awal:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={matStock}
                    onChange={(e) => setMatStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Harga Beli / Satuan (Rp):
                  </label>
                  <input
                    type="number"
                    required
                    value={matCost}
                    onChange={(e) => setMatCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Supplier / Vendor:
                </label>
                <input
                  type="text"
                  value={matSupplier}
                  onChange={(e) => setMatSupplier(e.target.value)}
                  placeholder="Nama toko / pasar rekanan"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl text-white font-bold ${theme.primaryBg} ${theme.primaryHover} shadow-md`}
                >
                  Simpan Bahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
