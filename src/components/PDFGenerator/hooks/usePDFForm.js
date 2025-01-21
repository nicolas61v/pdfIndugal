// src/components/PDFGenerator/hooks/usePDFForm.js
'use client';

import { useState } from 'react';
import { pdfService } from '@/services/pdfService';

export const usePDFForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
      const doc = await pdfService.generatePDF(formData);
      pdfService.savePDF('recepcion-producto.pdf');
      return true;
    } catch (error) {
      setError('Error al generar el PDF. Por favor, intente nuevamente.');
      console.error('Error al generar PDF:', error);
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
  };

  return {
    formData,
    isLoading,
    error,
    handleFormChange,
    generatePDF,
    resetForm
  };
};