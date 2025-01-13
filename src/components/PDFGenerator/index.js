// src/components/PDFGenerator/index.js
'use client';
import React, { useState } from 'react';
import PDFForm from './PDFForm';
import { pdfService } from '@/services/pdfService';

const PDFGenerator = () => {
  const [formData, setFormData] = useState({
    empresa: '',
    responsableTrae: '',
    responsableFacturar: '',
    horaLlegada: '',
    horaInicio: '',
    horaFinal: '',
    recepcionEntrega: '', // R o E
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

  const handleGeneratePDF = async () => {
    try {
      const doc = await pdfService.generatePDF(formData);
      pdfService.savePDF('recepcion-producto.pdf');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recepción de Producto</h1>
      <PDFForm 
        formData={formData} 
        onChange={handleFormChange} 
        onGenerate={handleGeneratePDF} 
      />
    </div>
  );
};

export default PDFGenerator;
