import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formats a javascript Date or Firestore Timestamp in French locale.
 * @param {Date|Object} date - Date object or Firestore Timestamp
 * @param {string} formatStr - Target date format pattern
 * @returns {string} Formatted date text
 */
export function formatDate(date, formatStr = 'dd MMMM yyyy') {
  if (!date) return '';
  
  // Handle Firestore Timestamp
  let jsDate;
  if (date && typeof date.toDate === 'function') {
    jsDate = date.toDate();
  } else if (date && date.seconds !== undefined) {
    jsDate = new Date(date.seconds * 1000);
  } else {
    jsDate = new Date(date);
  }

  // Fallback check
  if (isNaN(jsDate.getTime())) {
    return '';
  }

  return format(jsDate, formatStr, { locale: fr });
}
