// src/services/consecutiveService.js
import { db } from './firebase';
import { doc, getDoc, runTransaction, collection, query, where, getDocs } from 'firebase/firestore';

const CONSECUTIVE_DOC = 'document-consecutive';
const CONSECUTIVE_COLLECTION = 'system-consecutives';

export const ConsecutiveService = {
  async getNextConsecutive() {
    try {
      return await runTransaction(db, async (transaction) => {
        const consecutiveRef = doc(db, CONSECUTIVE_COLLECTION, CONSECUTIVE_DOC);
        const consecutiveDoc = await transaction.get(consecutiveRef);

        const nextNumber = consecutiveDoc.exists() 
          ? consecutiveDoc.data().current + 1 
          : 16501;

        // Validar que el número no exista en la colección de recibos
        const receiptsRef = collection(db, 'recepciones');
        const q = query(receiptsRef, where('consecutivo', '==', nextNumber));
        const querySnapshot = await getDocs(q);

        // Si el número ya existe, intentamos con el siguiente
        if (!querySnapshot.empty) {
          throw new Error('Número de documento duplicado, intentando con el siguiente');
        }

        // Guardar el nuevo consecutivo
        transaction.set(consecutiveRef, { 
          current: nextNumber,
          lastUpdated: new Date(),
        });

        return nextNumber;
      });
    } catch (error) {
      console.error('Error al obtener consecutivo:', error);
      // Reintentar en caso de conflicto
      if (error.message.includes('duplicado')) {
        return this.getNextConsecutive();
      }
      throw new Error('Error al generar número de documento');
    }
  },

  // Nuevo método para obtener el consecutivo actual sin incrementarlo
  async getCurrentConsecutive() {
    try {
      const consecutiveRef = doc(db, CONSECUTIVE_COLLECTION, CONSECUTIVE_DOC);
      const consecutiveDoc = await getDoc(consecutiveRef);

      if (!consecutiveDoc.exists()) {
        // Si no existe, retornamos el valor inicial - 1
        return 16500;
      }

      return consecutiveDoc.data().current;
    } catch (error) {
      console.error('Error al obtener consecutivo actual:', error);
      // En caso de error, retornamos el valor inicial - 1
      return 16500;
    }
  },

  async validateConsecutive(number) {
    try {
      const receiptsRef = collection(db, 'recepciones');
      const q = query(receiptsRef, where('consecutivo', '==', number));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.empty;
    } catch (error) {
      console.error('Error validando consecutivo:', error);
      return false;
    }
  }
};

export default ConsecutiveService;