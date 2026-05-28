import { 
  doc, 
  setDoc, 
  deleteDoc, 
  collection, 
  addDoc, 
  Timestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';

/**
 * Creates or updates a transaction in Firestore
 * @param {string} userId - Current user ID
 * @param {Object} transaction - Transaction object
 */
export async function saveTransaction(userId, transaction) {
  const isUpdate = !!transaction.id;
  const txRef = isUpdate 
    ? doc(db, 'users', userId, 'transactions', transaction.id)
    : doc(collection(db, 'users', userId, 'transactions'));
  
  const id = isUpdate ? transaction.id : txRef.id;

  // Formatting date for Firestore
  let firestoreDate;
  if (transaction.date instanceof Date) {
    firestoreDate = Timestamp.fromDate(transaction.date);
  } else if (typeof transaction.date === 'string') {
    firestoreDate = Timestamp.fromDate(new Date(transaction.date));
  } else {
    firestoreDate = transaction.date; // Use existing Firestore Timestamp
  }

  const payload = {
    id,
    title: String(transaction.title),
    amount: Number(transaction.amount),
    type: transaction.type, // 'income' or 'expense'
    category: String(transaction.category),
    date: firestoreDate,
  };

  if (transaction.note) {
    payload.note = String(transaction.note).trim();
  }

  try {
    await setDoc(txRef, payload);
  } catch (error) {
    handleFirestoreError(error, isUpdate ? OperationType.UPDATE : OperationType.CREATE, `users/${userId}/transactions/${id}`);
  }
}

/**
 * Deletes a transaction from Firestore
 * @param {string} userId - User identifier
 * @param {string} transactionId - Transaction ID
 */
export async function deleteTransaction(userId, transactionId) {
  const txRef = doc(db, 'users', userId, 'transactions', transactionId);
  try {
    await deleteDoc(txRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${userId}/transactions/${transactionId}`);
  }
}

/**
 * Saves or updates budget limits
 * @param {string} userId - User ID
 * @param {string} category - Category key
 * @param {number} limit - Budget limit
 * @param {string} month - Month formatted as "YYYY-MM"
 */
export async function saveBudget(userId, category, limit, month) {
  const budgetId = `${month}_${category}`;
  const budgetRef = doc(db, 'users', userId, 'budgets', budgetId);
  const payload = {
    category: String(category),
    limit: Number(limit),
    month: String(month),
  };

  try {
    await setDoc(budgetRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/budgets/${budgetId}`);
  }
}

/**
 * Saves or updates preferences settings
 * @param {string} userId - User ID
 * @param {Object} settings - Settings values
 */
export async function saveSettings(userId, settings) {
  const settingsRef = doc(db, 'users', userId, 'settings', 'preferences');
  const payload = {
    currency: String(settings.currency || 'DT'),
    savingsGoal: Number(settings.savingsGoal || 0),
    displayName: String(settings.displayName || '')
  };

  try {
    await setDoc(settingsRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/settings/preferences`);
  }
}
