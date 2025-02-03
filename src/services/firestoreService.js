// src/services/firestoreService.js
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export const saveFormToFirestore = async (formData) => {
  try {
    // Verificar si el consecutivo ya existe
    const consecutivoExiste = await checkConsecutivoExists(formData.documentNumber);
    if (consecutivoExiste) {
      throw new Error('El número de documento ya existe');
    }

    const dataToSave = {
      ...formData,
      consecutivo: formData.documentNumber,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'active'
    };

    const docRef = await addDoc(collection(db, 'recepciones'), dataToSave);
    
    // También guardamos el registro del consecutivo
    await addDoc(collection(db, 'consecutivos'), {
      numero: formData.documentNumber,
      recepcionId: docRef.id,
      createdAt: serverTimestamp(),
      status: 'used'
    });

    return {
      success: true,
      id: docRef.id,
      consecutivo: formData.documentNumber
    };
  } catch (error) {
    console.error('Error al guardar en Firestore:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función auxiliar para verificar si un consecutivo existe
const checkConsecutivoExists = async (numero) => {
  try {
    const recepcionesRef = collection(db, 'recepciones');
    const q = query(recepcionesRef, where('consecutivo', '==', numero));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error verificando consecutivo:', error);
    return true; // Por seguridad, asumimos que existe si hay error
  }
};