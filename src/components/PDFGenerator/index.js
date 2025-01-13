// src/components/PDFGenerator/index.js
'use client';
import React, { useState } from 'react';
import PDFForm from './PDFForm';
import { pdfService } from '@/services/pdfService';

const PDFGenerator = () => {
  const [formData, setFormData] = useState({
    number: '',
    date: '',
    description: '',
    // Agregar más campos según necesidad
  });

  const handleGeneratePDF = () => {
    try {
      const doc = pdfService.generatePDF(formData);
      pdfService.savePDF('factura.pdf');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      // Aquí puedes manejar el error como prefieras
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Generador de Documentos</h1>
      <PDFForm 
        formData={formData} 
        onChange={handleFormChange} 
        onGenerate={handleGeneratePDF} 
      />
    </div>
  );
};

export default PDFGenerator;