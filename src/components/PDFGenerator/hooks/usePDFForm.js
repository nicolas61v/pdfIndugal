// src/components/PDFGenerator/hooks/usePDFForm.js
// VERSIÓN TEMPORAL SIN FIREBASE PARA TESTING
'use client';

import { useState, useEffect } from 'react';
import { templatePdfService } from '../../../services/templatePdfService';
// Comentamos Firebase temporalmente
// import { saveFormToFirestore } from '../../../services/firestoreService';
// import { ConsecutiveService } from '../../../services/consecutiveService';

export const usePDFForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);
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
    tiempoEntregaPor: '',
    nombreTiempoEntrega: '',
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

  // CONSECUTIVO TEMPORAL - Usar localStorage
  const getNextConsecutive = () => {
    const current = localStorage.getItem('tempConsecutive') || '16500';
    const next = parseInt(current) + 1;
    localStorage.setItem('tempConsecutive', next.toString());
    console.log(`🔢 Consecutivo temporal generado: ${next}`);
    return next;
  };

  // Inicializar consecutivo temporal
  useEffect(() => {
    const initializeDocument = async () => {
      try {
        if (!documentNumber) {
          // Usar localStorage en lugar de Firebase temporalmente
          const current = localStorage.getItem('tempConsecutive') || '16500';
          const next = parseInt(current) + 1;
          
          setDocumentNumber(next);
          setFormData(prev => ({
            ...prev,
            documentNumber: next
          }));
          
          console.log(`📄 Documento temporal inicializado: ${next}`);
        }
      } catch (error) {
        console.error('Error al inicializar documento temporal:', error);
        setError('Error al obtener número de documento temporal');
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

  /**
   * Genera el PDF principal con las 4 copias
   * VERSIÓN TEMPORAL SIN FIREBASE
   */
  const generateMainPDF = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Iniciando generación de PDF principal...');
      
      // Generar consecutivo temporal
      const newConsecutive = getNextConsecutive();
      const updatedFormData = {
        ...formData,
        documentNumber: newConsecutive
      };

      console.log('📄 Datos del formulario:', updatedFormData);

      // COMENTADO TEMPORALMENTE - Firebase
      /*
      // Guardar en Firestore
      const saveResult = await saveFormToFirestore({
        ...updatedFormData,
        createdAt: new Date()
      });
      
      if (!saveResult.success) {
        throw new Error('Error al guardar los datos: ' + saveResult.error);
      }

      setSavedId(saveResult.id);
      */

      // Simular guardado exitoso
      setSavedId(`temp-${newConsecutive}`);
      console.log('💾 Datos "guardados" temporalmente (sin Firebase)');

      // Generar PDF principal
      console.log('🎨 Generando PDF con plantillas...');
      await templatePdfService.generateMainPDF(updatedFormData);
      templatePdfService.savePDF(`recepcion-producto-${newConsecutive}.pdf`);
      
      // Actualizar el documentNumber
      setDocumentNumber(newConsecutive);
      setFormData(prev => ({
        ...prev,
        documentNumber: newConsecutive
      }));
      
      console.log('✅ PDF principal generado exitosamente');
      return true;
      
    } catch (error) {
      console.error('❌ Error generando PDF principal:', error);
      setError(`Error al generar PDF: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Genera el PDF de la guía manual (sin datos)
   */
  const generateGuidePDF = async () => {
    setIsLoadingGuide(true);
    setError(null);
    
    try {
      console.log('📋 Generando PDF de guía manual...');
      
      // Generar PDF de guía
      await templatePdfService.generateGuidePDF();
      templatePdfService.savePDF('guia-manual-reverso.pdf');
      
      console.log('✅ PDF de guía generado exitosamente');
      return true;
      
    } catch (error) {
      console.error('❌ Error generando guía:', error);
      setError('Error al generar guía manual: ' + error.message);
      return false;
    } finally {
      setIsLoadingGuide(false);
    }
  };

  const resetForm = () => {
    console.log('🔄 Reseteando formulario...');
    
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
      tiempoEntregaPor: '',
      nombreTiempoEntrega: '',
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
    isLoadingGuide,
    error,
    savedId,
    handleFormChange,
    generateMainPDF,
    generateGuidePDF,
    resetForm
  };
};