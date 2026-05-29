import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';

/**
 * Real-time listener for user finance transactions
 * @param {string} userId
 */
export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const path = `users/${userId}/transactions`;
    const colRef = collection(db, 'users', userId, 'transactions');

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const txList = [];
      snapshot.forEach((doc) => {
        txList.push({ id: doc.id, ...doc.data() });
      });

      // Avoid Composite Index issues by doing immediate robust sorting client-side
      // Sort by date descending (newest first), then by id descending (newest first)
      txList.sort((a, b) => {
        const getTimestamp = (t) => {
          if (!t || !t.date) return 0;
          
          // Firestore Timestamp with toDate() method
          if (typeof t.date.toDate === 'function') {
            return t.date.toDate().getTime();
          }
          
          // Firestore timestamp object { seconds, nanoseconds }
          if (t.date.seconds !== undefined) {
            return t.date.seconds * 1000 + Math.floor((t.date.nanoseconds || 0) / 1000000);
          }
          
          // JavaScript Date object
          if (t.date instanceof Date) {
            return t.date.getTime();
          }
          
          // String or number timestamp
          const parsed = new Date(t.date);
          return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
        };
        
        const timeA = getTimestamp(a);
        const timeB = getTimestamp(b);
        
        // Primary sort: date descending (newest first)
        if (timeB !== timeA) {
          return timeB - timeA;
        }
        
        // Secondary sort: document ID descending (newer first)
        return (b.id || '').localeCompare(a.id || '');
      });

      setTransactions(txList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { transactions, loading };
}
