/**
 * Categories list with styling colors and identifiers
 */
export const CATEGORIES = {
  food: {
    id: 'food',
    name: 'Mekla',
    icon: 'Utensils',
    color: '#D85A30', // Coral
    bgLight: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-800'
  },
  transport: {
    id: 'transport',
    name: 'Transport',
    icon: 'Car',
    color: '#3B82F6', // Blue
    bgLight: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800'
  },
  bills: {
    id: 'bills',
    name: 'Factures & Loyer',
    icon: 'Receipt',
    color: '#EF4444', // Red
    bgLight: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-red-200 dark:border-red-800'
  },
  entertainment: {
    id: 'entertainment',
    name: 'Loisirs',
    icon: 'Gamepad2',
    color: '#534AB7', // Purple
    bgLight: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-200 dark:border-purple-800'
  },
  salary: {
    id: 'salary',
    name: 'Salaire',
    icon: 'Coins',
    color: '#1D9E75', // Teal
    bgLight: 'bg-teal-50 dark:bg-teal-950/20',
    border: 'border-teal-200 dark:border-teal-800'
  },
  other: {
    id: 'other',
    name: 'Autre',
    icon: 'Layers',
    color: '#64748B', // Slate
    bgLight: 'bg-slate-50 dark:bg-slate-950/20',
    border: 'border-slate-200 dark:border-slate-800'
  },
  cafe: {
    id: 'cafe',
    name: 'Café',
    icon: 'Coffee',
    color: '#A0522D', // Brown
    bgLight: 'bg-orange-50 dark:bg-orange-950/20',
    border: 'border-orange-200 dark:border-orange-800'
  },
  clothes: {
    id: 'clothes',
    name: 'Vêtements',
    icon: 'Shirt',
    color: '#EC4899', // Pink
    bgLight: 'bg-pink-50 dark:bg-pink-950/20',
    border: 'border-pink-200 dark:border-pink-800'
  },
  internet: {
    id: 'internet',
    name: 'Internet',
    icon: 'Wifi',
    color: '#06B6D4', // Cyan
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/20',
    border: 'border-cyan-200 dark:border-cyan-800'
  }
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
