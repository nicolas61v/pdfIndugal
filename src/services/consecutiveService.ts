// src/services/consecutiveService.js
import { db } from './firebase';
import { doc, getDoc, runTransaction, collection, query, where, getDocs } from 'firebase/firestore';

const CONSECUTIVE_DOC = 'document-consecutive';
const CONSECUTIVE_COLLECTION = 'system-consecutives';

export const ConsecutiveService = {
  /**
   * Verifica la conexión con Firebase
   */
  async testFirebaseConnection() {
    try {
      console.log('🔍 Probando conexión con Firebase...');
      const testRef = doc(db, 'test', 'connection');
      await getDoc(testRef);
      console.log('✅ Conexión con Firebase exitosa');
      return true;
    } catch (error) {
      console.error('❌ Error de conexión con Firebase:', error);
      return false;
    }
  },

  /**
   * Obtiene el próximo número consecutivo
   */
  async getNextConsecutive() {
    try {
      console.log('🔄 Iniciando obtención de consecutivo desde Firebase...');
      
      // Verificar conexión primero
      const isConnected = await this.testFirebaseConnection();
      if (!isConnected) {
        throw new Error('No hay conexión con Firebase. Verifica tu configuración.');
      }

      return await runTransaction(db, async (transaction) => {
        console.log('🔄 Ejecutando transacción de consecutivo...');
        
        const consecutiveRef = doc(db, CONSECUTIVE_COLLECTION, CONSECUTIVE_DOC);
        const consecutiveDoc = await transaction.get(consecutiveRef);

        let nextNumber;
        if (consecutiveDoc.exists()) {
          const currentData = consecutiveDoc.data();
          nextNumber = (currentData.current || 16500) + 1;
          console.log(`📄 Documento existe. Consecutivo actual: ${currentData.current}, Próximo: ${nextNumber}`);
        } else {
          nextNumber = 16501;
          console.log(`📄 Documento no existe. Iniciando con: ${nextNumber}`);
        }

        // Validar que el número no exista en recepciones
        console.log(`🔍 Verificando si ${nextNumber} ya existe en recepciones...`);
        const receiptsRef = collection(db, 'recepciones');
        const q = query(receiptsRef, where('consecutivo', '==', nextNumber));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          console.log(`⚠️ Número ${nextNumber} ya existe, buscando siguiente...`);
          // Buscar siguiente disponible
          return await this.findNextAvailableNumber(nextNumber + 1);
        }

        // Guardar el nuevo consecutivo
        console.log(`💾 Guardando consecutivo: ${nextNumber}`);
        transaction.set(consecutiveRef, { 
          current: nextNumber,
          lastUpdated: new Date(),
          updatedBy: 'web-app'
        });

        console.log(`✅ Consecutivo generado exitosamente: ${nextNumber}`);
        return nextNumber;
      });

    } catch (error) {
      console.error('❌ Error detallado en getNextConsecutive:', error);
      
      // Manejo específico de errores
      if (error.code === 'permission-denied') {
        throw new Error('Permisos insuficientes en Firestore. Verifica las reglas de seguridad.');
      } else if (error.code === 'unavailable') {
        throw new Error('Firestore no disponible. Verifica tu conexión a internet.');
      } else if (error.message && error.message.includes('duplicado')) {
        console.log('🔄 Reintentando obtener consecutivo...');
        return await this.findNextAvailableNumber(16501);
      } else {
        throw new Error(`Error al generar número de documento: ${error.message}`);
      }
    }
  },

  /**
   * Busca el próximo número disponible
   */
  async findNextAvailableNumber(startNumber) {
    console.log(`🔍 Buscando número disponible desde: ${startNumber}`);
    
    for (let i = 0; i < 50; i++) { // Límite de 50 intentos
      const numberToCheck = startNumber + i;
      
      try {
        const receiptsRef = collection(db, 'recepciones');
        const q = query(receiptsRef, where('consecutivo', '==', numberToCheck));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.log(`✅ Número disponible encontrado: ${numberToCheck}`);
          
          // Actualizar el consecutivo
          const consecutiveRef = doc(db, CONSECUTIVE_COLLECTION, CONSECUTIVE_DOC);
          await runTransaction(db, async (transaction) => {
            transaction.set(consecutiveRef, { 
              current: numberToCheck,
              lastUpdated: new Date(),
              updatedBy: 'web-app-search'
            });
          });
          
          return numberToCheck;
        }
      } catch (error) {
        console.error(`❌ Error verificando número ${numberToCheck}:`, error);
      }
    }
    
    throw new Error('No se pudo encontrar un número consecutivo disponible');
  },

  /**
   * Obtiene el consecutivo actual sin incrementarlo
   */
  async getCurrentConsecutive() {
    try {
      console.log('📋 Obteniendo consecutivo actual desde Firebase...');
      
      const consecutiveRef = doc(db, CONSECUTIVE_COLLECTION, CONSECUTIVE_DOC);
      const consecutiveDoc = await getDoc(consecutiveRef);

      if (!consecutiveDoc.exists()) {
        console.log('📄 Documento consecutivo no existe, retornando valor inicial');
        return 16500;
      }

      const current = consecutiveDoc.data().current || 16500;
      console.log(`📋 Consecutivo actual: ${current}`);
      return current;

    } catch (error) {
      console.error('❌ Error al obtener consecutivo actual:', error);
      return 16500;
    }
  },

  /**
   * Valida si un número consecutivo está disponible
   */
  async validateConsecutive(number) {
    try {
      console.log(`🔍 Validando consecutivo: ${number}`);
      
      const receiptsRef = collection(db, 'recepciones');
      const q = query(receiptsRef, where('consecutivo', '==', number));
      const querySnapshot = await getDocs(q);
      
      const isAvailable = querySnapshot.empty;
      console.log(`${isAvailable ? '✅' : '❌'} Consecutivo ${number} ${isAvailable ? 'disponible' : 'no disponible'}`);
      
      return isAvailable;
    } catch (error) {
      console.error('❌ Error validando consecutivo:', error);
      return false;
    }
  },

  /**
   * Inicializa el documento consecutivo si no existe
   */
  async initializeConsecutive() {
    try {
      console.log('🚀 Inicializando documento consecutivo...');
      
      const consecutiveRef = doc(db, CONSECUTIVE_COLLECTION, CONSECUTIVE_DOC);
      const consecutiveDoc = await getDoc(consecutiveRef);

      if (!consecutiveDoc.exists()) {
        await runTransaction(db, async (transaction) => {
          transaction.set(consecutiveRef, {
            current: 16500,
            createdAt: new Date(),
            lastUpdated: new Date(),
            createdBy: 'web-app-init'
          });
        });
        console.log('✅ Documento consecutivo inicializado con valor 16500');
      } else {
        console.log('📄 Documento consecutivo ya existe');
      }

      return true;
    } catch (error) {
      console.error('❌ Error inicializando consecutivo:', error);
      return false;
    }
  }
};

export default ConsecutiveService;