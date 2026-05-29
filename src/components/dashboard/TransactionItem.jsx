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
    <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
      {/* Transaction Icon */}
      <div
        className="p-2 rounded-xl text-white shrink-0"
        style={{ backgroundColor: currentCategory.color }}
      >
        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>

      {/* Transaction Info - takes remaining space */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate">
          {title}
        </p>
        <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono truncate">
          {formatDate(date, 'dd/MM/yy')}
        </p>
      </div>

      {/* Amount */}
      <span
        className={`text-xs sm:text-sm font-bold font-mono whitespace-nowrap shrink-0
          ${isIncome ? 'text-[#1D9E75]' : 'text-[#D85A30]'}
        `}
      >
        {isIncome ? '+' : '-'} {formatCurrency(amount, currency)}
      </span>

      {/* Actions - compact */}
      <div className="flex items-center shrink-0">
        {onEdit && (
          <button
            onClick={() => onEdit(transaction)}
            className="p-1.5 text-slate-400"
            title="Modifier"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(transaction.id)}
            className="p-1.5 text-slate-400"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
