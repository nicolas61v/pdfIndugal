// src/components/PDFGenerator/hooks/usePDFForm.js
'use client';

import { useState, useEffect } from 'react';
import { pdfService } from '../../../services/pdfService';
import { saveFormToFirestore } from '../../../services/firestoreService';
import { ConsecutiveService } from '../../../services/consecutiveService';

export const usePDFForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [documentNumber, setDocumentNumber] = useState(null);
  
  const [formData, setFormData] = useState({
    documentNumber: null,
    empresa: '',
    responsableTrae: '',
    responsableFacturar: '',
    facturarA: '',
    horaLlegada: '',
    horaInicio: '',
    horaFinal: '',
    fechaSuperior: new Date().toISOString().split('T')[0],
    horaSuperior: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    fechaInferior: '',
    horaInferior: '',
    recepcionEntrega: 'R',
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

  // Obtener el consecutivo solo una vez al montar el componente
  useEffect(() => {
    const initializeDocument = async () => {
      try {
        // Verificar si ya tenemos un número de documento
        if (!documentNumber) {
          const consecutive = await ConsecutiveService.getCurrentConsecutive();
          setDocumentNumber(consecutive + 1);
          setFormData(prev => ({
            ...prev,
            documentNumber: consecutive + 1
          }));
        }
      } catch (error) {
        console.error('Error al obtener consecutivo:', error);
        setError('Error al obtener número de documento');
      }
    };

    initializeDocument();
  }, []); // Solo se ejecuta al montar el componente

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
      // Aquí obtenemos y actualizamos el consecutivo
      const newConsecutive = await ConsecutiveService.getNextConsecutive();
      setFormData(prev => ({
        ...prev,
        documentNumber: newConsecutive
      }));

      // Guardamos en Firestore
      const saveResult = await saveFormToFirestore({
        ...formData,
        documentNumber: newConsecutive,
        createdAt: new Date()
      });
      
      if (!saveResult.success) {
        throw new Error('Error al guardar los datos: ' + saveResult.error);
      }

      setSavedId(saveResult.id);

      // Generamos el PDF
      const doc = await pdfService.generatePDF({
        ...formData,
        documentNumber: newConsecutive
      });
      pdfService.savePDF(`recepcion-producto-${newConsecutive}.pdf`);
      
      // Actualizamos el documentNumber para el siguiente uso
      setDocumentNumber(newConsecutive);
      
      return true;
    } catch (error) {
      setError(error.message || 'Error al procesar la solicitud.');
      console.error('Error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(prev => ({
      ...prev,
      empresa: '',
      responsableTrae: '',
      responsableFacturar: '',
      facturarA: '',
      horaLlegada: '',
      horaInicio: '',
      horaFinal: '',
      fechaSuperior: new Date().toISOString().split('T')[0],
      horaSuperior: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      fechaInferior: '',
      horaInferior: '',
      recepcionEntrega: 'R',
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
    }));
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