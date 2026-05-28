import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';

/**
 * Real-time listener for user settings
 * @param {string} userId
 */
export function useSettings(userId) {
  const [settings, setSettings] = useState({
    currency: 'DT',
    savingsGoal: 200,
    displayName: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const path = `users/${userId}/settings/preferences`;
    const docRef = doc(db, 'users', userId, 'settings', 'preferences');

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          currency: data.currency || 'DT',
          savingsGoal: Number(data.savingsGoal) || 0,
          displayName: data.displayName || ''
        });
      } else {
        setSettings({
          currency: 'DT',
          savingsGoal: 0,
          displayName: ''
        });
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { settings, loading };
}
