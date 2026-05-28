/**
 * Exports a set of transactions into a downloaded CSV file.
 * @param {Array} transactions - The list of transaction details
 * @param {string} currency - The active currency symbol
 */
export function exportCSV(transactions, currency = 'DT') {
  if (!transactions || transactions.length === 0) return;

  const headers = ['Titre', 'Montant', 'Devise', 'Type', 'Categorie', 'Date', 'Note'];
  
  const rows = transactions.map(t => {
    let jsDate;
    if (t.date && typeof t.date.toDate === 'function') {
      jsDate = t.date.toDate();
    } else if (t.date && t.date.seconds !== undefined) {
      jsDate = new Date(t.date.seconds * 1000);
    } else {
      jsDate = new Date(t.date);
    }
    const dateStr = isNaN(jsDate.getTime()) ? '' : jsDate.toISOString().split('T')[0];

    return [
      (t.title || '').replace(/"/g, '""'),
      t.amount || 0,
      currency,
      t.type === 'income' ? 'Revenu' : 'Depense',
      t.category || 'autre',
      dateStr,
      (t.note || '').replace(/"/g, '""')
    ];
  });

  // Adding dynamic CSV lines
  const csvContent = [
    headers.join(','),
    ...rows.map(e => e.map(val => `"${val}"`).join(','))
  ].join('\n');

  // Prefixing UTF-8 Byte Order Mark (BOM) for correct localized Excel reading
  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `flowbudget_transactions_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
