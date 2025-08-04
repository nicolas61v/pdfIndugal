//src/components/PDFGenerator/PDFForm.js
'use client';

import React, { useState } from 'react';
import { Loader2, FileText, BookOpen, Plus, Trash2 } from 'lucide-react';

const PDFForm = ({ 
  formData, 
  onChange, 
  onGenerateMain,
  onGenerateGuide, 
  isLoading, 
  isLoadingGuide,
  onAddProduct,
  onRemoveProduct,
  onUpdateProduct 
}) => {
  const [validationInput, setValidationInput] = useState('');
  
  const aspectos = [
    { name: 'excesosGrasas', label: 'Exceso de Grasas' },
    { name: 'excesosOxidacion', label: 'Exceso de oxidación' },
    { name: 'excesosCalamina', label: 'Exceso de calamina' },
    { name: 'pintura', label: 'Pintura' },
    { name: 'recubrimientoBuque', label: 'Pintura recubrimiento buque' },
    { name: 'stickers', label: 'Con stickers' },
    { name: 'soldaduraMalEscoriada', label: 'Soldadura mal escoriadas' },
    { name: 'drenaje', label: 'Perforación de Drenaje y/o para colgado' }
  ];

  const inputBaseClass = "w-full bg-slate-800 border-slate-600 text-slate-100 rounded-md shadow-sm " +
    "focus:border-blue-500 focus:ring focus:ring-blue-500/20 " +
    "placeholder-slate-400 p-3 text-lg";

  const handleMainSubmit = (e) => {
    e.preventDefault();
    if (validationInput.toLowerCase() === 'frio') {
      onGenerateMain();
      setValidationInput('');
    } else {
      alert('Por favor escribe "FRIO" para confirmar que eres consciente del formulario que estás llenando');
    }
  };

  const handleGuideSubmit = (e) => {
    e.preventDefault();
    onGenerateGuide();
  };

  return (
    <div className="space-y-8 bg-slate-900 text-slate-100 p-8 rounded-lg shadow-xl max-w-7xl mx-auto">
      
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
          <label className="block text-lg font-medium text-slate-300 mb-4">
            Tipo de Operación
          </label>
          <div className="flex gap-8">
            <label className="flex items-center space-x-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="esRecepcion"
                checked={formData.esRecepcion || false}
                onChange={onChange}
                className="w-6 h-6 rounded border-slate-600 text-blue-500 focus:ring-offset-slate-800 focus:ring-blue-500"
              />
              <span className="text-lg text-slate-300">Recepción (R)</span>
            </label>
            <label className="flex items-center space-x-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                name="esEntrega"
                checked={formData.esEntrega || false}
                onChange={onChange}
                className="w-6 h-6 rounded border-slate-600 text-blue-500 focus:ring-offset-slate-800 focus:ring-blue-500"
              />
              <span className="text-lg text-slate-300">Entrega (E)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Tiempo de entrega */}
      <div className="space-y-4 mt-6">
        <label className="block text-lg font-medium text-slate-300">
          Tiempo para la entrega del producto sugerido por:
        </label>
        <div className="flex gap-8">
          <label className="flex items-center space-x-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
            <input
              type="radio"
              name="tiempoEntregaPor"
              value="cliente"
              checked={formData.tiempoEntregaPor === 'cliente'}
              onChange={onChange}
              className="w-6 h-6 border-slate-600 text-blue-500 focus:ring-offset-slate-800 focus:ring-blue-500"
            />
            <span className="text-lg text-slate-300">Cliente</span>
          </label>
          <label className="flex items-center space-x-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
            <input
              type="radio"
              name="tiempoEntregaPor"
              value="industrias"
              checked={formData.tiempoEntregaPor === 'industrias'}
              onChange={onChange}
              className="w-6 h-6 border-slate-600 text-blue-500 focus:ring-offset-slate-800 focus:ring-blue-500"
            />
            <span className="text-lg text-slate-300">Industrias y Galvanizados</span>
          </label>
        </div>
        <div className="mt-4">
          <label className="block text-lg font-medium text-slate-300 mb-2">
            Nombre de quien sugiere:
          </label>
          <input
            className={inputBaseClass}
            name="nombreTiempoEntrega"
            value={formData.nombreTiempoEntrega}
            onChange={onChange}
            placeholder="Nombre completo"
          />
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

      {/* Información de Productos */}
      <div className="space-y-8 bg-slate-800/30 p-8 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-blue-400 border-b border-slate-700 pb-3">
            Información de Productos ({formData.productos ? formData.productos.length : 0})
          </h3>
          <button
            type="button"
            onClick={onAddProduct}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Agregar Producto</span>
          </button>
        </div>

        {formData.productos && formData.productos.length > 0 ? (
          <div className="space-y-6">
            {formData.productos.map((producto, index) => (
              <div key={index} className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-slate-200">
                    Producto #{index + 1}
                  </h4>
                  {formData.productos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveProduct(index)}
                      className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Línea
                    </label>
                    <input
                      className={inputBaseClass}
                      value={producto.linea || ''}
                      onChange={(e) => onUpdateProduct(index, 'linea', e.target.value)}
                      placeholder="Línea del producto"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Proceso Ref.
                    </label>
                    <input
                      className={inputBaseClass}
                      value={producto.procesoRef || ''}
                      onChange={(e) => onUpdateProduct(index, 'procesoRef', e.target.value)}
                      placeholder="Proceso de referencia"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Código Ref.
                    </label>
                    <input
                      className={inputBaseClass}
                      value={producto.codigoRef || ''}
                      onChange={(e) => onUpdateProduct(index, 'codigoRef', e.target.value)}
                      placeholder="Código de referencia"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Descripción del producto y observaciones
                  </label>
                  <input
                    className={inputBaseClass}
                    value={producto.descripcion || ''}
                    onChange={(e) => onUpdateProduct(index, 'descripcion', e.target.value)}
                    placeholder="Describe el producto, características, observaciones..."
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No hay productos agregados</p>
            <p className="text-sm">Haz clic en "Agregar Producto" para comenzar</p>
          </div>
        )}
      </div>

      {/* Sección de validación para PDF principal */}
      <div className="space-y-8 bg-slate-800/30 p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-blue-400 border-b border-slate-700 pb-3">
          Validación de Confirmación
        </h3>

        <div>
          <label className="block text-lg font-medium text-slate-300 mb-2">
            Escribe "FRIO" para confirmar generación del PDF principal:
          </label>
          <input
            className={inputBaseClass}
            value={validationInput}
            onChange={(e) => setValidationInput(e.target.value)}
            placeholder="Escribe la palabra clave aquí..."
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="space-y-6 pt-6 border-t border-slate-700">
        
        {/* Botón PDF Principal */}
        <form onSubmit={handleMainSubmit}>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-8 py-4 bg-blue-600 text-white text-lg rounded-lg shadow-lg 
                     hover:bg-blue-500 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center space-x-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-6 w-6" />
                <span>Generando PDF Principal...</span>
              </>
            ) : (
              <>
                <FileText className="h-6 w-6" />
                <span>Generar PDF Principal (4 Copias con Datos)</span>
              </>
            )}
          </button>
        </form>

        {/* Separador visual */}
        <div className="flex items-center">
          <div className="flex-1 border-t border-slate-600"></div>
          <div className="px-4 text-slate-400 text-sm">O</div>
          <div className="flex-1 border-t border-slate-600"></div>
        </div>

        {/* Botón Guía Manual */}
        <form onSubmit={handleGuideSubmit}>
          <button
            type="submit"
            disabled={isLoadingGuide}
            className="w-full px-8 py-4 bg-green-600 text-white text-lg rounded-lg shadow-lg 
                     hover:bg-green-500 focus:outline-none focus:ring-2 
                     focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center space-x-3"
          >
            {isLoadingGuide ? (
              <>
                <Loader2 className="animate-spin h-6 w-6" />
                <span>Generando Guía...</span>
              </>
            ) : (
              <>
                <BookOpen className="h-6 w-6" />
                <span>Generar Guía Manual (Para Reverso)</span>
              </>
            )}
          </button>
        </form>

        {/* Instrucciones de uso */}
        <div className="bg-slate-800/50 p-6 rounded-lg border-l-4 border-yellow-500">
          <h4 className="text-lg font-semibold text-yellow-400 mb-3">
            📋 Instrucciones de Impresión:
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Genera y imprime el <strong>PDF Principal</strong> → Obtienes 4 hojas con datos</li>
            <li>Toma cualquiera de las 4 hojas impresas</li>
            <li>Voltea la hoja y ponla de nuevo en la impresora</li>
            <li>Genera e imprime la <strong>Guía Manual</strong> → Se imprime en el reverso</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PDFForm;