// src/components/PDFGenerator/PDFForm.js
'use client';

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

  return (
    <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onGenerate(); }}>
      {/* Sección de empresa y responsables */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Información de la Empresa
        </h3>
        
        <div className="grid gap-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa quien trae el producto
              </label>
              <input
                className="form-input block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50
                         transition duration-150 ease-in-out"
                name="empresa"
                value={formData.empresa}
                onChange={onChange}
                placeholder="Nombre de la empresa"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsable quien trae el producto
              </label>
              <input
                className="form-input block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                name="responsableTrae"
                value={formData.responsableTrae}
                onChange={onChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facturar a nombre de
              </label>
              <input
                className="form-input block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                name="facturarA"
                value={formData.facturarA}
                onChange={onChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsable quien ordenó facturar
            </label>
            <input
              className="form-input block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              name="responsableFacturar"
              value={formData.responsableFacturar}
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      {/* Sección de tiempos */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Información de Tiempos
        </h3>
        
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora reporte llegada
            </label>
            <input
              type="time"
              className="form-input block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              name="horaLlegada"
              value={formData.horaLlegada}
              onChange={onChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora inicio despacho
            </label>
            <input
              type="time"
              className="form-input block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              name="horaInicio"
              value={formData.horaInicio}
              onChange={onChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora final despacho
            </label>
            <input
              type="time"
              className="form-input block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              name="horaFinal"
              value={formData.horaFinal}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Fecha y hora de llegada
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className="form-input block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                name="fechaSuperior"
                value={formData.fechaSuperior}
                onChange={onChange}
              />
              <input
                type="time"
                className="form-input block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                name="horaSuperior"
                value={formData.horaSuperior}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Fecha y hora compromiso de entrega
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className="form-input block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                name="fechaInferior"
                value={formData.fechaInferior}
                onChange={onChange}
              />
              <input
                type="time"
                className="form-input block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                name="horaInferior"
                value={formData.horaInferior}
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recepción/Entrega
          </label>
          <select
            className="form-select block w-full rounded-md border-gray-300 shadow-sm 
                     focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
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
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Aspectos a Considerar
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {aspectos.map((aspecto) => (
            <label key={aspecto.name} className="flex items-center space-x-3 p-2 rounded-lg
                                               hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                name={aspecto.name}
                checked={formData[aspecto.name]}
                onChange={onChange}
                className="form-checkbox h-5 w-5 text-primary rounded border-gray-300
                         focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{aspecto.label}</span>
            </label>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Otros aspectos a considerar:
          </label>
          <input
            className="form-input block w-full rounded-md border-gray-300 shadow-sm 
                     focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            name="otros"
            value={formData.otros}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Información del producto */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Información del Producto
        </h3>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Línea
            </label>
            <input
              className="form-input block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              name="linea"
              value={formData.linea}
              onChange={onChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proceso Ref.
            </label>
            <input
              className="form-input block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              name="procesoRef"
              value={formData.procesoRef}
              onChange={onChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código Ref.
            </label>
            <input
              className="form-input block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              name="codigoRef"
              value={formData.codigoRef}
              onChange={onChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del producto y observaciones
          </label>
          <textarea
            className="form-textarea block w-full rounded-md border-gray-300 shadow-sm 
                     focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50
                     min-h-[100px]"
            name="descripcion"
            value={formData.descripcion}
            onChange={onChange}
            rows="4"
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading}
          className="px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90
                   focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
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