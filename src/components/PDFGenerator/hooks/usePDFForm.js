// src/components/PDFGenerator/hooks/usePDFForm.js
// VERSIÓN COMPLETA CON FIREBASE RESTAURADA
'use client';

import { useState, useEffect } from 'react';
import { templatePdfService } from '../../../services/templatePdfService';
import { saveFormToFirestore } from '../../../services/firestoreService';
import { ConsecutiveService } from '../../../services/consecutiveService';

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
    esRecepcion: true,
    esEntrega: false,
    tiempoEntregaPor: '',
    nombreTiempoEntrega: '',
    productos: [{
      descripcion: '',
      linea: '',
      procesoRef: '',
      codigoRef: '',
      documentoCliente: '',
      unidades: '',
      pesoBruto: '',
      unidadesRecipientes: '',
      pesoRecipientes: '',
      pesoNeto: ''
    }],
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

  // Obtener el consecutivo de Firebase al montar el componente
  useEffect(() => {
    const initializeDocument = async () => {
      try {
        console.log('🔄 Inicializando consecutivo desde Firebase...');
        
        if (!documentNumber) {
          // Usar Firebase ConsecutiveService
          const consecutive = await ConsecutiveService.getCurrentConsecutive();
          const nextNumber = consecutive + 1;
          
          setDocumentNumber(nextNumber);
          setFormData(prev => ({
            ...prev,
            documentNumber: nextNumber
          }));
          
          console.log(`📄 Consecutivo inicializado desde Firebase: ${nextNumber}`);
        }
      } catch (error) {
        console.error('❌ Error al obtener consecutivo de Firebase:', error);
        setError(`Error al conectar con Firebase: ${error.message}`);
        
        // Fallback temporal a localStorage si Firebase falla
        console.log('⚠️ Usando fallback temporal...');
        const fallback = localStorage.getItem('tempConsecutive') || '16500';
        const nextFallback = parseInt(fallback) + 1;
        setDocumentNumber(nextFallback);
        setFormData(prev => ({
          ...prev,
          documentNumber: nextFallback
        }));
      }
    };

    initializeDocument();
  }, [documentNumber]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = value;
    
    // Convertir horas a formato 12 horas con AM/PM
    if ((name === 'horaInferior' || name === 'horaSuperior') && value) {
      processedValue = convertTo12HourFormat(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));
  };

  // Función para convertir hora de 24h a 12h con AM/PM
  const convertTo12HourFormat = (time24) => {
    if (!time24) return time24;
    
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  // Funciones para manejar productos múltiples
  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      productos: [...prev.productos, {
        descripcion: '',
        linea: '',
        procesoRef: '',
        codigoRef: '',
        documentoCliente: '',
        unidades: '',
        pesoBruto: '',
        unidadesRecipientes: '',
        pesoRecipientes: '',
        pesoNeto: ''
      }]
    }));
  };

  const removeProduct = (index) => {
    setFormData(prev => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index)
    }));
  };

  const updateProduct = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      productos: prev.productos.map((producto, i) => 
        i === index ? { ...producto, [field]: value } : producto
      )
    }));
  };

  /**
   * Genera el PDF principal con las 4 copias usando Firebase
   */
  const generateMainPDF = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Iniciando generación de PDF con Firebase...');
      
      // Obtener y actualizar el consecutivo desde Firebase
      console.log('📊 Obteniendo consecutivo de Firebase...');
      const newConsecutive = await ConsecutiveService.getNextConsecutive();
      
      const updatedFormData = {
        ...formData,
        documentNumber: newConsecutive
      };

      console.log(`📄 Nuevo consecutivo obtenido: ${newConsecutive}`);
      console.log('💾 Guardando en Firestore...');

      // Guardar en Firestore
      const saveResult = await saveFormToFirestore({
        ...updatedFormData,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'web-app'
      });
      
      if (!saveResult.success) {
        throw new Error(`Error al guardar en Firestore: ${saveResult.error}`);
      }

      console.log(`✅ Datos guardados en Firestore con ID: ${saveResult.id}`);
      setSavedId(saveResult.id);

      // Generar PDF principal
      console.log('🎨 Generando PDF con plantillas optimizadas...');
      await templatePdfService.generateMainPDF(updatedFormData);
      templatePdfService.savePDF(`recepcion-producto-${newConsecutive}.pdf`);
      
      // Actualizar el documentNumber para el siguiente uso
      setDocumentNumber(newConsecutive);
      setFormData(prev => ({
        ...prev,
        documentNumber: newConsecutive
      }));
      
      console.log(`🎉 PDF principal generado exitosamente: recepcion-producto-${newConsecutive}.pdf`);
      return true;
      
    } catch (error) {
      console.error('❌ Error en generación de PDF:', error);
      
      // Manejo específico de errores de Firebase
      if (error.message.includes('permission-denied')) {
        setError('Error de permisos en Firebase. Verifica las reglas de Firestore.');
      } else if (error.message.includes('unavailable')) {
        setError('Firebase no disponible. Verifica tu conexión a internet.');
      } else if (error.message.includes('firebase')) {
        setError(`Error de Firebase: ${error.message}`);
      } else {
        setError(`Error al generar PDF: ${error.message}`);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Genera el PDF de la guía manual (sin datos, no requiere Firebase)
   */
  const generateGuidePDF = async () => {
    setIsLoadingGuide(true);
    setError(null);
    
    try {
      console.log('📋 Generando PDF de guía manual...');
      
      // Generar PDF de guía (no requiere Firebase)
      await templatePdfService.generateGuidePDF();
      templatePdfService.savePDF('guia-manual-reverso.pdf');
      
      console.log('✅ PDF de guía generado exitosamente');
      return true;
      
    } catch (error) {
      console.error('❌ Error generando guía:', error);
      setError(`Error al generar guía manual: ${error.message}`);
      return false;
    } finally {
      setIsLoadingGuide(false);
    }
  };

  /**
   * Reinicia el formulario manteniendo consecutivo
   */
  const resetForm = () => {
    console.log('🔄 Reseteando formulario...');
    
    setFormData(prev => ({
      ...prev,
      // Mantener documentNumber actual
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
      esRecepcion: true,
      esEntrega: false,
      tiempoEntregaPor: '',
      nombreTiempoEntrega: '',
      productos: [{
        descripcion: '',
        linea: '',
        procesoRef: '',
        codigoRef: '',
        documentoCliente: '',
        unidades: '',
        pesoBruto: '',
        unidadesRecipientes: '',
        pesoRecipientes: '',
        pesoNeto: ''
      }],
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
    
    console.log('✅ Formulario reseteado');
  };

  /**
   * Función auxiliar para probar la conexión con Firebase
   */
  const testFirebaseConnection = async () => {
    try {
      console.log('🔍 Probando conexión con Firebase...');
      
      const testResult = await ConsecutiveService.testFirebaseConnection();
      if (testResult) {
        console.log('✅ Conexión con Firebase exitosa');
        return true;
      } else {
        console.log('❌ Conexión con Firebase falló');
        return false;
      }
    } catch (error) {
      console.error('❌ Error probando Firebase:', error);
      return false;
    }
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
    resetForm,
    addProduct,
    removeProduct,
    updateProduct,
    testFirebaseConnection, // Función adicional para debugging
    documentNumber // Exponer el número actual para debugging
  };
};