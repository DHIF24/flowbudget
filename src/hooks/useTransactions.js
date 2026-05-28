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
      txList.sort((a, b) => {
        const timeA = a.date && typeof a.date.toDate === 'function'
          ? a.date.toDate().getTime()
          : (a.date?.seconds ? a.date.seconds * 1000 : new Date(a.date).getTime());
        
        const timeB = b.date && typeof b.date.toDate === 'function'
          ? b.date.toDate().getTime()
          : (b.date?.seconds ? b.date.seconds * 1000 : new Date(b.date).getTime());
          
        return (timeB || 0) - (timeA || 0);
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
