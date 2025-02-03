// src/services/consecutiveService.js
import { db } from './firebase';
import { doc, getDoc, runTransaction } from 'firebase/firestore';

export const ConsecutiveService = {
  async getNextConsecutive() {
    try {
      return await runTransaction(db, async (transaction) => {
        const consecutiveRef = doc(db, 'system-consecutives', 'document-consecutive');
        const consecutiveDoc = await transaction.get(consecutiveRef);

        const nextNumber = consecutiveDoc.exists() 
          ? consecutiveDoc.data().current + 1 
          : 16501;

        transaction.set(consecutiveRef, { 
          current: nextNumber,
          lastUpdated: new Date()
        });

        return nextNumber;
      });
    } catch (error) {
      console.error('Error al obtener consecutivo:', error);
      throw new Error('Error al generar número de documento');
    }
  }
};