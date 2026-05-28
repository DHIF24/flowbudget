import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';

/**
 * Real-time listener for user budget configurations
 * @param {string} userId
 */
export function useBudgets(userId) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const path = `users/${userId}/budgets`;
    const colRef = collection(db, 'users', userId, 'budgets');

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const budgetItems = [];
      snapshot.forEach((doc) => {
        budgetItems.push({ id: doc.id, ...doc.data() });
      });
      setBudgets(budgetItems);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { budgets, loading };
}
