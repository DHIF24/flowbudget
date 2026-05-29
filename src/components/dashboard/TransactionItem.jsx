import React from 'react';
import { 
  Utensils, 
  Car, 
  Receipt, 
  Gamepad2, 
  Coins, 
  Layers,
  Coffee,
  Shirt,
  Wifi,
  Trash2,
  Edit2
} from 'lucide-react';
import { CATEGORIES } from '../../constants/categories';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const IconMap = {
  Utensils,
  Car,
  Receipt,
  Gamepad2,
  Coins,
  Layers,
  Coffee,
  Shirt,
  Wifi
};

export default function TransactionItem({ 
  transaction, 
  currency = 'DT', 
  onEdit, 
  onDelete 
}) {
  const { title, amount, type, category, date, note } = transaction;
  const currentCategory = CATEGORIES[category] || CATEGORIES.other;
  const IconComponent = IconMap[currentCategory.icon] || Layers;

  const isIncome = type === 'income';

  return (
    <div className="flex items-center justify-between p-3.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-805 rounded-xl transition-all duration-150 group hover:border-slate-300 dark:hover:border-zinc-700 shadow-sm">
      
      {/* Transaction Icon & Text Info */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div 
          className="p-3 rounded-xl text-white shrink-0"
          style={{ backgroundColor: currentCategory.color }}
        >
          <IconComponent className="h-5 w-5" />
        </div>
        
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate">
            {title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
              {formatDate(date, 'dd MMM yyyy')}
            </span>
            {note && (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-zinc-700" />
                <span className="text-[10px] text-slate-500 max-w-[120px] sm:max-w-xs truncate italic">
                  {note}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Amount and micro action buttons on Hover */}
      <div className="flex items-center gap-4">
        <span 
          className={`text-sm font-bold font-mono whitespace-nowrap select-all
            ${isIncome ? 'text-[#1D9E75]' : 'text-[#D85A30]'}
          `}
        >
          {isIncome ? '+' : '-'} {formatCurrency(amount, currency)}
        </span>

        {/* Edit / Delete actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(transaction)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-zinc-200 transition"
              title="Modifier"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                onDelete(transaction.id);
              }}
              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-slate-400 hover:text-red-500 transition"
              title="Supprimer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
