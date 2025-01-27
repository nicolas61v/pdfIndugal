// src/services/firestoreService.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const saveFormToFirestore = async (formData) => {
  try {
    const dataToSave = {
      ...formData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'recepciones'), dataToSave);
    return {
      success: true,
      id: docRef.id
    };
  } catch (error) {
    console.error('Error al guardar en Firestore:', error);
    return {
      success: false,
      error: error.message
    };
  }
};