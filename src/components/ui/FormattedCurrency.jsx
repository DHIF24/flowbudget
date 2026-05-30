import React from 'react';

/**
 * Component that displays currency with smaller decimal places
 * Main number is large, decimals after virgule are smaller
 */
export function FormattedCurrency({ amount, currencyCode = 'DT', decimalPlaces = 3, className = '' }) {
  // Format the number with specified decimal places
  const formatted = Number(amount || 0).toLocaleString('fr-FR', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  // Split into main number and decimals
  const parts = formatted.split(',');
  const mainNumber = parts[0];
  const decimals = parts[1] || '';

  // Get currency symbol
  let currencySymbol = 'DT';
  if (currencyCode === 'EUR') currencySymbol = '€';
  if (currencyCode === 'USD') currencySymbol = '$';
  if (currencyCode === 'GBP') currencySymbol = '£';

  return (
    <span className={`font-mono ${className}`}>
      <span className="text-[1em]">{mainNumber}</span>
      {decimals && (
        <span className="text-[0.6em] opacity-70">,{decimals}</span>
      )}
      <span className="text-[0.7em] opacity-80 ml-1">{currencySymbol}</span>
    </span>
  );
}

export default FormattedCurrency;
