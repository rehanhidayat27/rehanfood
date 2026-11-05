import { ThemeColor } from '../types/index.ts';

export function getThemeClasses(theme: ThemeColor) {
  switch (theme) {
    case 'emerald':
      return {
        primaryBg: 'bg-emerald-600',
        primaryHover: 'hover:bg-emerald-700',
        primaryText: 'text-emerald-600 dark:text-emerald-400',
        primaryBorder: 'border-emerald-500',
        primaryRing: 'focus:ring-emerald-500',
        lightBg: 'bg-emerald-50 dark:bg-emerald-950/30',
        gradientCard: 'from-emerald-500 to-teal-700',
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
      };
    case 'blue':
      return {
        primaryBg: 'bg-blue-600',
        primaryHover: 'hover:bg-blue-700',
        primaryText: 'text-blue-600 dark:text-blue-400',
        primaryBorder: 'border-blue-500',
        primaryRing: 'focus:ring-blue-500',
        lightBg: 'bg-blue-50 dark:bg-blue-950/30',
        gradientCard: 'from-blue-500 to-indigo-700',
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      };
    case 'rose':
      return {
        primaryBg: 'bg-rose-500',
        primaryHover: 'hover:bg-rose-600',
        primaryText: 'text-rose-500 dark:text-rose-400',
        primaryBorder: 'border-rose-500',
        primaryRing: 'focus:ring-rose-500',
        lightBg: 'bg-rose-50 dark:bg-rose-950/30',
        gradientCard: 'from-rose-500 to-pink-700',
        badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
      };
    case 'amber':
      return {
        primaryBg: 'bg-amber-500',
        primaryHover: 'hover:bg-amber-600',
        primaryText: 'text-amber-600 dark:text-amber-400',
        primaryBorder: 'border-amber-500',
        primaryRing: 'focus:ring-amber-500',
        lightBg: 'bg-amber-50 dark:bg-amber-950/30',
        gradientCard: 'from-amber-500 to-orange-700',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
      };
    case 'orange':
    default:
      return {
        primaryBg: 'bg-orange-500',
        primaryHover: 'hover:bg-orange-600',
        primaryText: 'text-orange-500 dark:text-orange-400',
        primaryBorder: 'border-orange-500',
        primaryRing: 'focus:ring-orange-500',
        lightBg: 'bg-orange-50 dark:bg-orange-950/30',
        gradientCard: 'from-orange-500 via-orange-600 to-red-600',
        badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
      };
  }
}
