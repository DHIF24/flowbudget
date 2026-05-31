import React, { useState, useEffect } from 'react';
import {
  X,
  Utensils,
  Car,
  Receipt,
  Gamepad2,
  Coins,
  Layers,
  Coffee,
  Shirt,
  Wifi,
  Calendar,
  Check,
  Plus,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORY_LIST, CATEGORIES } from '../../constants/categories';
import { useBudget } from '../../context/BudgetContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Toggle from '../ui/Toggle';

const IconMap = {
  Utensils,
  Car,
  Receipt,
  Gamepad2,
  Coins,
  Layers,
  Coffee,
  Shirt,
  Wifi,
  Tag
};

export default function AddTransactionModal({ isOpen, onClose, transactionToEdit = null, defaultType = 'expense', activeMonth = null }) {
  const { addTransaction, removeTransaction, settings, allCategories, addCustomCategory, deleteCustomCategory } = useBudget();
  
  // Helper to get default date based on activeMonth
  const getDefaultDate = () => {
    if (activeMonth) {
      // Use today's date but in the activeMonth
      const today = new Date();
      const [year, month] = activeMonth.split('-');
      return `${year}-${month}-${String(today.getDate()).padStart(2, '0')}`;
    }
    return new Date().toISOString().split('T')[0];
  };
  
  // State variables
  const [type, setType] = useState(defaultType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(() => getDefaultDate());
  const [note, setNote] = useState('');

  // New category state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [showAddCategory, setShowAddCategory] = useState(false);
  // Local optimistic custom categories that appear immediately
  const [localCustomCategories, setLocalCustomCategories] = useState({});

  const categoryColors = [
    '#3B82F6', '#EF4444', '#1D9E75', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#A0522D', '#64748B', '#D85A30'
  ];

  const [errors, setErrors] = useState({});

  // Merge context categories with local optimistic categories
  const mergedCategories = {
    ...(allCategories || CATEGORIES),
    ...localCustomCategories
  };

  // Reset or fill values when modal opens
  useEffect(() => {
    if (isOpen) {
      if (transactionToEdit) {
        setType(transactionToEdit.type || 'expense');
        setTitle(transactionToEdit.title || '');
        setAmount(transactionToEdit.amount || '');
        setCategory(transactionToEdit.category || 'food');
        
        let formattedDate = getDefaultDate();
        if (transactionToEdit.date) {
          const tDate = transactionToEdit.date.toDate 
            ? transactionToEdit.date.toDate() 
            : new Date(transactionToEdit.date?.seconds * 1000 || transactionToEdit.date);
          if (!isNaN(tDate.getTime())) {
            formattedDate = tDate.toISOString().split('T')[0];
          }
        }
        setDate(formattedDate);
        setNote(transactionToEdit.note || '');
      } else {
        // Defaults for NEW transaction - use date from activeMonth
        setType(defaultType);
        setTitle('');
        setAmount('');
        setCategory(defaultType === 'income' ? 'salary' : 'food');
        setDate(getDefaultDate()); // Use activeMonth date
        setNote('');
      }
      setErrors({});
    }
    // Reset local custom categories when modal closes
    if (!isOpen) {
      setLocalCustomCategories({});
      setShowAddCategory(false);
      setNewCategoryName('');
    }
  }, [isOpen, transactionToEdit, defaultType, activeMonth]);

  // Handle Type changes (auto-adjust appropriate category defaults)
  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory('salary');
    } else {
      setCategory('food');
    }
  };

  const handleValidation = () => {
    const tempErrors = {};
    if (!title.trim()) tempErrors.title = 'Le titre est obligatoire.';
    if (title.length > 100) tempErrors.title = 'Titre trop long (max 100 caractères).';
    
    if (!amount) {
      tempErrors.amount = 'Le montant est obligatoire.';
    } else if (isNaN(amount) || Number(amount) <= 0) {
      tempErrors.amount = 'Veuillez saisir un montant valide supérieur à 0.';
    }

    if (!date) tempErrors.date = 'La date est obligatoire.';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    // Use the date from the form - this respects activeMonth selection
    // Add current time (hours/minutes/seconds) so it appears at top of the list
    const dateFromForm = new Date(date);
    const now = new Date();
    const transactionDate = new Date(
      dateFromForm.getFullYear(),
      dateFromForm.getMonth(),
      dateFromForm.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );

    const payload = {
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      date: transactionDate,
      note: note.trim() || null
    };

    if (transactionToEdit) {
      payload.id = transactionToEdit.id;
    }

    await addTransaction(payload);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900 z-50 pointer-events-auto"
          />

          {/* Modal / Slider Sheet wrapper */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-2xl md:rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden max-h-[80vh] md:max-h-[600px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                {transactionToEdit ? 'Modifier la transaction' : 'Nouvelle transaction'}
              </h3>
              <button 
                onClick={onClose}
                className="p-1 px-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable form body */}
            <form onSubmit={handleSubmit} className="p-4 md:p-5 overflow-y-auto space-y-3 md:space-y-4">
              
              {/* Toggle Expense / Income */}
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-2 block uppercase tracking-wider font-mono">
                  Type de Transaction
                </label>
                <Toggle value={type} onChange={handleTypeChange} />
              </div>

              {/* Title & Amount (Grid for desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Intitulé / Titre"
                  id="tx-title"
                  placeholder={type === 'income' ? 'اكتب اسم المدخول' : 'اكتب اسم المصروف'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={errors.title}
                />

                <Input
                  label="Montant"
                  id="tx-amount"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  suffix={settings.currency}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  error={errors.amount}
                />
              </div>

              {/* Date */}
              <Input
                label="Date"
                id="tx-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                error={errors.date}
              />

              {/* Category Grid */}
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider font-mono">
                  Sélecteur de Catégorie
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {Object.values(mergedCategories)
                    .filter((cat) => {
                      // Filter categories based on transaction type
                      if (type === 'income') {
                        // Income mode: show only salary and custom categories with type='income'
                        return cat.id === 'salary' || cat.type === 'income';
                      } else {
                        // Expense mode: show all except salary and custom categories with type='income'
                        return cat.id !== 'salary' && cat.type !== 'income';
                      }
                    })
                    .map((cat) => {
                    const IconComponent = IconMap[cat.icon] || Layers;
                    const isSelected = category === cat.id;
                    const isCustom = cat.id?.startsWith('custom_');
                    return (
                      <div key={cat.id} className="relative">
                        <button
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`
                            w-full flex flex-col items-center justify-center p-2 rounded-xl border text-center relative transition-all duration-150 group min-h-[56px] active:scale-95
                            ${isSelected
                              ? 'bg-slate-50 dark:bg-zinc-800 scale-[1.02] ring-2 ring-[#534AB7]/20 border-[#534AB7]'
                              : 'bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800'
                            }
                          `}
                        >
                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 bg-[#534AB7] text-white p-0.5 rounded-full">
                              <Check className="h-3 w-3" />
                            </span>
                          )}
                          <div
                            className="p-1.5 rounded-lg mb-1 transition-colors"
                            style={{
                              backgroundColor: isSelected ? `${cat.color}20` : 'transparent',
                              color: cat.color
                            }}
                          >
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <span className="text-[10px] font-medium text-slate-700 dark:text-zinc-300 truncate w-full px-0.5">
                            {cat.name}
                          </span>
                        </button>
                        {/* Delete button for custom categories */}
                        {isCustom && !isSelected && (
                          <button
                            type="button"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (confirm('Supprimer cette catégorie ?')) {
                                await deleteCustomCategory(cat.id);
                                // Remove from local state
                                setLocalCustomCategories(prev => {
                                  const { [cat.id]: _, ...rest } = prev;
                                  return rest;
                                });
                                // Reset category if it was selected
                                if (category === cat.id) {
                                  setCategory(type === 'income' ? 'salary' : 'food');
                                }
                              }
                            }}
                            className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                          >
                            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {/* Add New Category Button */}
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(!showAddCategory)}
                    className={`
                      flex flex-col items-center justify-center p-2 rounded-xl border border-dashed text-center relative transition-all duration-150 min-h-[56px]
                      ${showAddCategory
                        ? 'bg-[#534AB7]/10 border-[#534AB7] text-[#534AB7]'
                        : 'bg-white dark:bg-zinc-950 border-slate-300 dark:border-zinc-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800'
                      }
                    `}
                  >
                    <div className="p-1.5 rounded-lg mb-1">
                      <Plus className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-medium truncate w-full px-0.5">
                      {showAddCategory ? 'Annuler' : 'Nouvelle'}
                    </span>
                  </button>
                </div>

                {/* Add New Category Form */}
                {showAddCategory && (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-3">
                    <input
                      type="text"
                      placeholder="Nom de la catégorie"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#534AB7] focus:border-transparent"
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      {categoryColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-lg transition ${selectedColor === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!newCategoryName.trim()) return;
                        const newCategory = {
                          id: `custom_${Date.now()}`,
                          name: newCategoryName.trim(),
                          color: selectedColor,
                          icon: 'Tag',
                          type: type, // 'income' or 'expense'
                          bgLight: 'bg-opacity-10',
                          border: 'border-opacity-20'
                        };
                        // Add to local state immediately for instant display
                        setLocalCustomCategories(prev => ({ ...prev, [newCategory.id]: newCategory }));
                        // Select the new category immediately
                        setCategory(newCategory.id);
                        // Save to backend (async, doesn't block UI)
                        addCustomCategory(newCategory);
                        // Reset form
                        setNewCategoryName('');
                        setShowAddCategory(false);
                      }}
                      disabled={!newCategoryName.trim()}
                      className="w-full py-2 bg-[#534AB7] text-white rounded-lg text-sm font-medium hover:bg-[#534AB7]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Ajouter et sélectionner
                    </button>
                  </div>
                )}
              </div>

              {/* Notes TextArea */}
              <div className="flex flex-col gap-1">
                <label htmlFor="tx-note" className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                  Note (facultatif)
                </label>
                <textarea
                  id="tx-note"
                  rows={1}
                  placeholder="Ajouter des précisions..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 placeholder-slate-400 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant={type === 'income' ? 'success' : 'primary'}
                  className="flex-1"
                >
                  {transactionToEdit ? 'Enregistrer' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
