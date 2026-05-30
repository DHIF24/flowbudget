/**
 * Formats a numeric value with the specified currency symbol.
 * @param {number} amount - The transaction amount
 * @param {string} currencyCode - Currency code ("DT", "EUR", "USD", "GBP")
 * @returns {string} Fully formatted currency string
 */
export function formatCurrency(amount, currencyCode = 'DT') {
  const value = Number(amount || 0).toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
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
