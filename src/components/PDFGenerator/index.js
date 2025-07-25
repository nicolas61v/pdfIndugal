// src/components/PDFGenerator/index.js
'use client';

import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import PDFForm from './PDFForm';
import { usePDFForm } from './hooks/usePDFForm';
import Image from 'next/image';

const PDFGenerator = () => {
  const {
    formData,
    isLoading,
    isLoadingGuide,
    error,
    savedId,
    handleFormChange,
    generateMainPDF,
    generateGuidePDF,
    resetForm
  } = usePDFForm();

  return (
    <div className="min-h-screen w-full bg-slate-900">
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
              
              {/* Número de documento */}
              {formData.documentNumber && (
                <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-blue-400 text-sm font-medium">Número de Documento</p>
                    <p className="text-white text-2xl font-bold">
                      {formData.documentNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Success Message */}
          {savedId && (
            <div className="mb-6 bg-green-900/30 border-l-4 border-green-500 rounded-lg overflow-hidden">
              <div className="p-4 flex items-start">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-green-400 font-medium">
                    ✅ Datos guardados exitosamente
                  </p>
                  <p className="text-xs text-green-300 mt-1">
                    ID: {savedId} • Documento: {formData.documentNumber}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-900/30 border-l-4 border-red-500 rounded-lg overflow-hidden">
              <div className="p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-red-400 font-medium">
                    ❌ Error en el proceso
                  </p>
                  <p className="text-xs text-red-300 mt-1">
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
              onGenerateMain={async () => {
                const success = await generateMainPDF();
                if (success) {
                  setTimeout(resetForm, 3000);
                }
              }}
              onGenerateGuide={async () => {
                await generateGuidePDF();
              }}
              isLoading={isLoading}
              isLoadingGuide={isLoadingGuide}
            />
          </div>

          {/* Template Preview Info */}
          <div className="mt-8 bg-slate-800/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              🎨 Plantillas Disponibles
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
              <div className="bg-white/10 p-3 rounded border-l-4 border-white">
                <p className="font-medium">Copia Blanca</p>
                <p className="text-slate-400">Original - Cliente</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded border-l-4 border-green-500">
                <p className="font-medium">Copia Verde</p>
                <p className="text-slate-400">Contabilidad</p>
              </div>
              <div className="bg-pink-500/10 p-3 rounded border-l-4 border-pink-500">
                <p className="font-medium">Copia Rosa</p>
                <p className="text-slate-400">Producción</p>
              </div>
              <div className="bg-yellow-500/10 p-3 rounded border-l-4 border-yellow-500">
                <p className="font-medium">Copia Amarilla</p>
                <p className="text-slate-400">Archivo</p>
              </div>
              <div className="bg-gray-500/10 p-3 rounded border-l-4 border-gray-500">
                <p className="font-medium">Guía Manual</p>
                <p className="text-slate-400">Para Reverso</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFGenerator;