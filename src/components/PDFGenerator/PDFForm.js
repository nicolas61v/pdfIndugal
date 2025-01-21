//src/components/PDFGenerator/PDFForm.js
'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

const PDFForm = ({ formData, onChange, onGenerate, isLoading }) => {
  const aspectos = [
    { name: 'excesosGrasas', label: 'Exceso de Grasas' },
    { name: 'excesosOxidacion', label: 'Exceso de oxidación' },
    { name: 'excesosCalamina', label: 'Exceso de calamina' },
    { name: 'pintura', label: 'Pintura' },
    { name: 'recubrimientoBuque', label: 'Pintura recubrimiento buque' },
    { name: 'stickers', label: 'Con stickers' },
    { name: 'soldaduraMalEscoriada', label: 'Soldadura mal escoriadas' },
    { name: 'perforacionDe', label: 'Perforación de' },
    { name: 'drenaje', label: 'Drenaje y/o para colgado' }
  ];

  const inputBaseClass = "w-full bg-slate-800 border-slate-600 text-slate-100 rounded-md shadow-sm " +
    "focus:border-blue-500 focus:ring focus:ring-blue-500/20 " +
    "placeholder-slate-400 p-3 text-lg";

  return (
    <form className="space-y-8 bg-slate-900 text-slate-100 p-8 rounded-lg shadow-xl max-w-7xl mx-auto"
      onSubmit={(e) => { e.preventDefault(); onGenerate(); }}>

      {/* Sección de empresa y responsables */}
      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-blue-400 border-b border-slate-700 pb-3">
          Información de la Empresa
        </h3>

        <div className="grid gap-8">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-lg font-medium text-slate-300 mb-2">
                Empresa quien trae el producto
              </label>
              <input
                className={inputBaseClass}
                name="empresa"
                value={formData.empresa}
                onChange={onChange}
                placeholder="Nombre de la empresa"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-slate-300 mb-2">
                Responsable quien trae el producto
              </label>
              <input
                className={inputBaseClass}
                name="responsableTrae"
                value={formData.responsableTrae}
                onChange={onChange}
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-slate-300 mb-2">
                Facturar a nombre de
              </label>
              <input
                className={inputBaseClass}
                name="facturarA"
                value={formData.facturarA}
                onChange={onChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-slate-300 mb-2">
              Responsable quien ordenó facturar
            </label>
            <input
              className={inputBaseClass}
              name="responsableFacturar"
              value={formData.responsableFacturar}
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      {/* Sección de tiempos */}
      <div className="space-y-8 bg-slate-800/50 p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-blue-400 border-b border-slate-700 pb-3">
          Información de Tiempos
        </h3>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-lg font-medium text-slate-300 mb-2">
              Hora reporte llegada
            </label>
            <input
              type="time"
              className={inputBaseClass}
              name="horaLlegada"
              value={formData.horaLlegada}
              onChange={onChange}
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-slate-300 mb-2">
              Hora inicio despacho
            </label>
            <input
              type="time"
              className={inputBaseClass}
              name="horaInicio"
              value={formData.horaInicio}
              onChange={onChange}
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-slate-300 mb-2">
              Hora final despacho
            </label>
            <input
              type="time"
              className={inputBaseClass}
              name="horaFinal"
              value={formData.horaFinal}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-lg font-medium text-slate-300">
              Fecha y hora de llegada
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className={inputBaseClass}
                name="fechaSuperior"
                value={formData.fechaSuperior}
                onChange={onChange}
              />
              <input
                type="time"
                className={inputBaseClass}
                name="horaSuperior"
                value={formData.horaSuperior}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-lg font-medium text-slate-300">
              Fecha y hora compromiso de entrega
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className={inputBaseClass}
                name="fechaInferior"
                value={formData.fechaInferior}
                onChange={onChange}
              />
              <input
                type="time"
                className={inputBaseClass}
                name="horaInferior"
                value={formData.horaInferior}
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-slate-300 mb-2">
            Recepción/Entrega
          </label>
          <select
            className={inputBaseClass}
            name="recepcionEntrega"
            value={formData.recepcionEntrega}
            onChange={onChange}
          >
            <option value="">Seleccione...</option>
            <option value="R">Recepción (R)</option>
            <option value="E">Entrega (E)</option>
          </select>
        </div>
      </div>

      {/* Aspectos a considerar */}
      <div className="space-y-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-blue-400 border-b border-slate-700 pb-3">
          Aspectos a Considerar
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {aspectos.map((aspecto) => (
            <label key={aspecto.name}
              className="flex items-center space-x-4 p-4 rounded-lg bg-slate-800/50 
                            hover:bg-slate-700/50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                name={aspecto.name}
                checked={formData[aspecto.name]}
                onChange={onChange}
                className="w-6 h-6 rounded border-slate-600 text-blue-500 
                         focus:ring-offset-slate-800 focus:ring-blue-500"
              />
              <span className="text-lg text-slate-300">{aspecto.label}</span>
            </label>
          ))}
        </div>

        <div>
          <label className="block text-lg font-medium text-slate-300 mb-2">
            Otros aspectos a considerar:
          </label>
          <input
            className={inputBaseClass}
            name="otros"
            value={formData.otros}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Información del producto */}
      <div className="space-y-8 bg-slate-800/30 p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-blue-400 border-b border-slate-700 pb-3">
          Información del Producto
        </h3>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-lg font-medium text-slate-300 mb-2">
              Línea
            </label>
            <input
              className={inputBaseClass}
              name="linea"
              value={formData.linea}
              onChange={onChange}
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-slate-300 mb-2">
              Proceso Ref.
            </label>
            <input
              className={inputBaseClass}
              name="procesoRef"
              value={formData.procesoRef}
              onChange={onChange}
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-slate-300 mb-2">
              Código Ref.
            </label>
            <input
              className={inputBaseClass}
              name="codigoRef"
              value={formData.codigoRef}
              onChange={onChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-slate-300 mb-2">
            Descripción del producto y observaciones
          </label>
          <textarea
            className={`${inputBaseClass} min-h-[150px]`}
            name="descripcion"
            value={formData.descripcion}
            onChange={onChange}
            rows="4"
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end pt-6 border-t border-slate-700">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading}
          className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg shadow-lg 
                   hover:bg-blue-500 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center space-x-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-6 w-6" />
              <span>Generando...</span>
            </>
          ) : (
            <span>Generar PDF</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default PDFForm;