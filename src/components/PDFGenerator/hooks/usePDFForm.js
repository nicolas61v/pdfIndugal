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
    otros: '',
    documentNumber: null
  });

  useEffect(() => {
    const initializeDocument = async () => {
      try {
        setIsLoading(true);
        const consecutive = await ConsecutiveService.getNextConsecutive();
        setDocumentNumber(consecutive);
        setFormData(prev => ({
          ...prev,
          documentNumber: consecutive
        }));
      } catch (error) {
        setError('Error al obtener número de documento');
        console.error('Error inicializando documento:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!documentNumber) {
      initializeDocument();
    }
  }, [documentNumber]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'empresa',
      'responsableTrae',
      'facturarA',
      'responsableFacturar',
      'fechaSuperior',
      'fechaInferior'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      throw new Error('Por favor complete todos los campos requeridos');
    }

    if (!documentNumber) {
      throw new Error('No se ha generado un número de documento válido');
    }
  };

  const generatePDF = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      validateForm();

      // Asegurarnos de que el número de documento sigue siendo válido
      const isValid = await ConsecutiveService.validateConsecutive(documentNumber);
      if (!isValid) {
        throw new Error('El número de documento ya no es válido. Por favor, recargue el formulario.');
      }

      // Guardamos en Firestore incluyendo el número de documento
      const saveResult = await saveFormToFirestore({
        ...formData,
        documentNumber,
        createdAt: new Date(),
        status: 'completed'
      });
      
      if (!saveResult.success) {
        throw new Error('Error al guardar los datos: ' + saveResult.error);
      }

      setSavedId(saveResult.id);

      // Generamos el PDF con el número de documento
      const doc = await pdfService.generatePDF({
        ...formData,
        documentNumber
      });
      
      // Guardamos el PDF
      const filename = `recepcion-producto-${documentNumber}.pdf`;
      pdfService.savePDF(filename);
      
      return true;
    } catch (error) {
      setError(error.message || 'Error al procesar la solicitud. Por favor, intente nuevamente.');
      console.error('Error en generatePDF:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = async () => {
    setIsLoading(true);
    try {
      // Obtener nuevo número de documento
      const newConsecutive = await ConsecutiveService.getNextConsecutive();
      
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
        otros: '',
        documentNumber: newConsecutive
      });
      
      setDocumentNumber(newConsecutive);
      setError(null);
      setSavedId(null);
    } catch (error) {
      setError('Error al reiniciar el formulario');
      console.error('Error en resetForm:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    savedId,
    documentNumber,
    handleFormChange,
    handleDateChange,
    generatePDF,
    resetForm
  };
};

export default usePDFForm;