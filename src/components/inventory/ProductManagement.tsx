import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  BookOpen,
  CheckCircle2,
  XCircle,
  Flame,
  UtensilsCrossed,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatIDR } from '../../utils/exportUtils.ts';
import { MenuItem, FoodCategory, RecipeIngredient } from '../../types/index.ts';
import { getThemeClasses } from '../../utils/themeHelper.ts';
import { getDishName, getDishCategory } from '../../utils/translations.ts';

const CATEGORIES: FoodCategory[] = [
  'Makanan Utama',
  'Ayam & Bebek',
  'Sate & Bakso',
  'Sayur & Sup',
  'Minuman Tradisional',
  'Dessert & Camilan',
];

export const ProductManagement: React.FC = () => {
  const {
    t,
    language,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    resetToDefaultData,
    requestConfirmDelete,
    rawMaterials,
    setSelectedRecipeItem,
    playSound,
    themeColor,
  } = useApp();

  const theme = getThemeClasses(themeColor);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [indonesianName, setIndonesianName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Makanan Utama');
  const [price, setPrice] = useState<number>(30000);
  const [costPrice, setCostPrice] = useState<number>(12000);
  const [calories, setCalories] = useState<number>(350);
  const [serves, setServes] = useState('1 porsi');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [available, setAvailable] = useState(true);
  const [recipe, setRecipe] = useState<RecipeIngredient[]>([]);

  // Temp recipe ingredient selector
  const [selectedRawId, setSelectedRawId] = useState('');
  const [rawAmount, setRawAmount] = useState<number>(0.1);

  const filteredItems = menuItems.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setIndonesianName('');
    setCategory('Makanan Utama');
    setPrice(35000);
    setCostPrice(15000);
    setCalories(400);
    setServes('1 porsi');
    setImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80');
    setDescription('Hidangan istimewa khas nusantara dengan racikan bumbu rempah alami.');
    setAvailable(true);
    setRecipe([]);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setIndonesianName(item.indonesianName);
    setCategory(item.category);
    setPrice(item.price);
    setCostPrice(item.costPrice);
    setCalories(item.calories);
    setServes(item.serves);
    setImage(item.image);
    setDescription(item.description);
    setAvailable(item.available);
    setRecipe([...item.recipe]);
    setIsModalOpen(true);
  };

  const handleAddIngredient = () => {
    if (!selectedRawId) return;
    const raw = rawMaterials.find((r) => r.id === selectedRawId);
    if (!raw) return;

    const exists = recipe.some((r) => r.rawMaterialId === raw.id);
    if (exists) {
      setRecipe(prev =>
        prev.map(r => (r.rawMaterialId === raw.id ? { ...r, amountNeeded: rawAmount } : r))
      );
    } else {
      setRecipe(prev => [
        ...prev,
        {
          rawMaterialId: raw.id,
          rawMaterialName: raw.name,
          amountNeeded: rawAmount,
          unit: raw.unit,
        },
      ]);
    }
  };

  const handleRemoveIngredient = (rawId: string) => {
    setRecipe(prev => prev.filter(r => r.rawMaterialId !== rawId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      updateMenuItem({
        ...editingItem,
        name,
        indonesianName: indonesianName || name,
        category,
        price,
        costPrice,
        calories,
        serves,
        image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        description,
        available,
        recipe,
      });
    } else {
      addMenuItem({
        name,
        indonesianName: indonesianName || name,
        category,
        price,
        costPrice,
        calories,
        serves,
        rating: 4.8,
        image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        description,
        available,
        recipe,
      });
    }

    playSound('pay');
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 custom-scrollbar pb-24 lg:pb-8 min-w-0">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            {language === 'en' ? 'Catalog & Recipe Formulas' : 'Katalog & Formula Masakan'}
          </span>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {t('productMgmtTitle')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('productMgmtSub')}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold text-white ${theme.primaryBg} ${theme.primaryHover} shadow-md shadow-orange-500/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer`}
        >
          <Plus className="w-4 h-4" />
          <span>{t('addNewMenu')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('searchMenuToEdit')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          />
        </div>
        <span className="text-xs text-slate-400 font-semibold self-end sm:self-auto">
          {filteredItems.length} {language === 'en' ? 'menu items' : 'menu tercatat'}
        </span>
      </div>

      {/* Product List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm flex gap-3 sm:gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-600 overflow-hidden min-w-0"
          >
            <img
              src={item.image}
              alt={getDishName(item, language)}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
            />

            <div className="flex-1 min-w-0 space-y-2 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-1.5 min-w-0">
                <div className="flex-1 min-w-0 pr-1">
                  <span className="text-[10px] font-bold text-orange-600 uppercase block truncate">
                    {getDishCategory(item.category, language)}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug break-words">
                    {getDishName(item, language)}
                  </h3>
                </div>

                <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title={language === 'en' ? 'Edit Menu' : 'Edit Menu'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const itemName = language === 'en' ? (item.englishName || item.name) : (item.indonesianName || item.name);
                      requestConfirmDelete({
                        title: 'Konfirmasi Hapus Menu',
                        message: language === 'en' ? `Delete menu "${itemName}"?` : `Hapus menu "${itemName}"?`,
                        confirmLabel: language === 'en' ? 'Delete' : 'Hapus',
                        onConfirm: () => deleteMenuItem(item.id),
                      });
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer active:scale-90"
                    title={language === 'en' ? `Delete menu "${item.name}"` : `Hapus menu "${item.name}"`}
                    aria-label={`Hapus menu ${item.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-1 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-slate-400 block">{language === 'en' ? 'Price / Cost' : 'Harga / HPP'}</span>
                  <span className="font-extrabold text-orange-600 block text-xs sm:text-sm truncate">
                    {formatIDR(item.price)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-normal truncate">
                    HPP: {formatIDR(item.costPrice)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRecipeItem(item)}
                  className="px-2 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[10px] font-bold flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
                  title={language === 'en' ? 'View Recipe Ratios' : 'Lihat Formula & Takaran Resep'}
                >
                  <BookOpen className="w-3 h-3 shrink-0" />
                  <span>{item.recipe.length} <span className="hidden sm:inline">{language === 'en' ? 'Ingredients' : 'Bahan'}</span></span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="flex items-center gap-1">
                  {item.available ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-0.5 text-[10px] sm:text-xs">
                      <CheckCircle2 className="w-3 h-3" /> {language === 'en' ? 'Available' : 'Tersedia'}
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold flex items-center gap-0.5 text-[10px] sm:text-xs">
                      <XCircle className="w-3 h-3" /> {language === 'en' ? 'Out of Stock' : 'Habis'}
                    </span>
                  )}
                </span>
                <span className="text-slate-400 text-[10px] sm:text-xs">{item.calories} kkal</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 space-y-3">
          <UtensilsCrossed className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            {language === 'en' ? 'No Menu Items Found' : 'Tidak Ada Menu yang Ditemukan'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {language === 'en'
              ? 'All menu items have been deleted or the search query returned no results.'
              : 'Semua menu telah dihapus atau pencarian tidak cocok dengan menu yang ada.'}
          </p>
          <button
            type="button"
            onClick={resetToDefaultData}
            className="mt-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md shadow-orange-500/20"
          >
            {language === 'en' ? 'Restore Default Menus' : 'Pulihkan 11 Menu Kuliner Default'}
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingItem ? 'Edit Menu Kuliner' : 'Tambah Menu Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Menu:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Soto Betawi Kuah Susu"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kategori Menu:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FoodCategory)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Harga Jual (Rp):
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    HPP Modal (Rp):
                  </label>
                  <input
                    type="number"
                    required
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kalori (kkal):
                  </label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Porsi:
                  </label>
                  <input
                    type="text"
                    value={serves}
                    onChange={(e) => setServes(e.target.value)}
                    placeholder="1 orang"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  URL Foto Menu:
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Deskripsi Kuliner:
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Recipe Ingredients Binding */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Formula Takaran Bahan Baku (Pengurangan Otomatis)
                  </span>
                  <span className="text-[10px] text-slate-400">Resep Masakan</span>
                </div>

                <div className="flex gap-2">
                  <select
                    value={selectedRawId}
                    onChange={(e) => setSelectedRawId(e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="">Pilih Bahan Baku...</option>
                    {rawMaterials.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.unit})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={rawAmount}
                    onChange={(e) => setRawAmount(Number(e.target.value))}
                    className="w-20 p-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                    placeholder="Jumlah"
                  />

                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                  >
                    + Ikat Bahan
                  </button>
                </div>

                {recipe.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                    {recipe.map((r) => (
                      <div
                        key={r.rawMaterialId}
                        className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-700 text-xs"
                      >
                        <span className="font-semibold">{r.rawMaterialName}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-orange-600 font-bold">
                            {r.amountNeeded} {r.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient(r.rawMaterialId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Status Menu Aktif & Siap Dipesan
                  </span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2.5 rounded-xl text-white font-bold ${theme.primaryBg} ${theme.primaryHover} shadow-md`}
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
