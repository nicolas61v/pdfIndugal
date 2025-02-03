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
  
  const [formData, setFormData] = useState({
    documentNumber: null, // El consecutivo se generará automáticamente
    empresa: '',
    responsableTrae: '',
    responsableFacturar: '',
    facturarA: '',
    horaLlegada: '',
    horaInicio: '',
    horaFinal: '',
    fechaSuperior: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    horaSuperior: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    fechaInferior: '',
    horaInferior: '',
    recepcionEntrega: 'R', // Valor por defecto
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

  // Obtener el consecutivo al montar el componente
  useEffect(() => {
    const initializeDocument = async () => {
      try {
        const consecutive = await ConsecutiveService.getNextConsecutive();
        setFormData(prev => ({
          ...prev,
          documentNumber: consecutive
        }));
      } catch (error) {
        console.error('Error al obtener consecutivo:', error);
        setError('Error al generar número de documento');
      }
    };

    initializeDocument();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    // Solo validamos los campos realmente necesarios
    const requiredFields = [
      'documentNumber', // El consecutivo es obligatorio
      'fechaSuperior'  // Al menos necesitamos la fecha de recepción
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      throw new Error('Error en validación del formulario');
    }
  };

  const generatePDF = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      validateForm();

      // Guardamos en Firestore
      const saveResult = await saveFormToFirestore({
        ...formData,
        createdAt: new Date()
      });
      
      if (!saveResult.success) {
        throw new Error('Error al guardar los datos: ' + saveResult.error);
      }

      setSavedId(saveResult.id);

      // Generamos el PDF
      const doc = await pdfService.generatePDF(formData);
      pdfService.savePDF(`recepcion-producto-${formData.documentNumber}.pdf`);
      
      return true;
    } catch (error) {
      setError(error.message || 'Error al procesar la solicitud.');
      console.error('Error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = async () => {
    try {
      // Obtener nuevo consecutivo para el siguiente formulario
      const newConsecutive = await ConsecutiveService.getNextConsecutive();
      
      setFormData({
        documentNumber: newConsecutive,
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
      setError(null);
      setSavedId(null);
    } catch (error) {
      console.error('Error al resetear formulario:', error);
      setError('Error al generar nuevo número de documento');
    }
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