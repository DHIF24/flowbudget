/**
 * Formats a numeric value with the specified currency symbol.
 * @param {number} amount - The transaction amount
 * @param {string} currencyCode - Currency code ("DT", "EUR", "USD", "GBP")
 * @param {number} decimalPlaces - Number of decimal places (default: 2)
 * @returns {string} Fully formatted currency string
 */
export function formatCurrency(amount, currencyCode = 'DT', decimalPlaces = 2) {
  const value = Number(amount || 0).toLocaleString('fr-FR', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  switch (currencyCode) {
    case 'EUR':
      return `${value} €`;
    case 'USD':
      return `$ ${value}`;
    case 'GBP':
      return `£ ${value}`;
    case 'DT':
    default:
      return `${value} DT`;
  }
}
