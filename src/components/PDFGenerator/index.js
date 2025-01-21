//src/components/PDFGenerator/index.js
'use client';

import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import PDFForm from './PDFForm';
import { usePDFForm } from './hooks/usePDFForm';
import Image from 'next/image';

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
    // Contenedor principal con altura mínima del viewport y fondo
    <div className="min-h-screen w-full bg-slate-900">
      {/* Gradiente de fondo que cubre toda la página */}
      <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 to-slate-900 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header con Logo */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-xl mb-8 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative w-48 h-20">
                  <Image
                    src="/images/LOGO INDUGAL(1).png"
                    alt="Logo Indugal"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="border-l border-slate-600 pl-6">
                  <h1 className="text-3xl font-bold text-blue-400">
                    Recepción de Producto
                  </h1>
                  <p className="text-slate-400 mt-2 text-lg">
                    Sistema de Control y Registro de Productos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-900/30 border-l-4 border-red-500 rounded-lg overflow-hidden">
              <div className="p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-red-400">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Form Container */}
          <div className="bg-slate-800/20 backdrop-blur-sm rounded-lg p-1">
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
    </div>
  );
};

export default PDFGenerator;