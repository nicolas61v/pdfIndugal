// src/components/PDFGenerator/index.js
'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import PDFForm from './PDFForm';
import { usePDFForm } from './hooks/usePDFForm';

const PDFGenerator = () => {
  const {
    formData,
    isLoading,
    error,
    handleFormChange,
    generatePDF,
    resetForm
  } = usePDFForm();

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-50 p-6 border-b border-blue-100">
          <h1 className="text-2xl font-bold text-blue-700 mb-2">
            Recepción de Producto
          </h1>
          <p className="text-blue-600 text-sm">
            Complete el formulario para generar el documento de recepción
          </p>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Form */}
          <PDFForm 
            formData={formData} 
            onChange={handleFormChange}
            onGenerate={async () => {
              const success = await generatePDF();
              if (success) resetForm();
            }}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFGenerator;