//src/components/PDFGenerator/hooks/usePDFForm.js
'use client';

import { useState } from 'react';
import { pdfService } from '../../../services/pdfService';
import { saveFormToFirestore } from '../../../services/firestoreService';

export const usePDFForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedId, setSavedId] = useState(null);
  
  const [formData, setFormData] = useState({
    empresa: '',
    responsableTrae: '',
    responsableFacturar: '',
    facturarA: '',
    horaLlegada: '',
    horaInicio: '',
    horaFinal: '',
    fechaSuperior: '',
    horaSuperior: '',
    fechaInferior: '',
    horaInferior: '',
    recepcionEntrega: '',
    descripcion: '',
    linea: '',
    procesoRef: '',
    codigoRef: '',
    excesosGrasas: false,
    excesosOxidacion: false,
    excesosCalamina: false,
    pintura: false,
    recubrimientoBuque: false,
    stickers: false,
    soldaduraMalEscoriada: false,
    perforacionDe: false,
    drenaje: false,
    otros: ''
  });

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generatePDF = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Primero guardamos en Firestore
      const saveResult = await saveFormToFirestore(formData);
      
      if (!saveResult.success) {
        throw new Error('Error al guardar los datos: ' + saveResult.error);
      }

      // Guardamos el ID del documento guardado
      setSavedId(saveResult.id);

      // Luego generamos el PDF
      const doc = await pdfService.generatePDF(formData);
      pdfService.savePDF('recepcion-producto.pdf');
      
      return true;
    } catch (error) {
      setError(error.message || 'Error al procesar la solicitud. Por favor, intente nuevamente.');
      console.error('Error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      empresa: '',
      responsableTrae: '',
      responsableFacturar: '',
      facturarA: '',
      horaLlegada: '',
      horaInicio: '',
      horaFinal: '',
      fechaSuperior: '',
      horaSuperior: '',
      fechaInferior: '',
      horaInferior: '',
      recepcionEntrega: '',
      descripcion: '',
      linea: '',
      procesoRef: '',
      codigoRef: '',
      excesosGrasas: false,
      excesosOxidacion: false,
      excesosCalamina: false,
      pintura: false,
      recubrimientoBuque: false,
      stickers: false,
      soldaduraMalEscoriada: false,
      perforacionDe: false,
      drenaje: false,
      otros: ''
    });
    setError(null);
    setSavedId(null);
  };

  return {
    formData,
    isLoading,
    error,
    savedId,
    handleFormChange,
    generatePDF,
    resetForm
  };
};