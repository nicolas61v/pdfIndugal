// src/components/PDFGenerator/PDFForm.js
const PDFForm = ({ formData, onChange, onGenerate }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {/* Sección de empresa y responsables */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Empresa quien trae el producto
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="empresa"
          value={formData.empresa}
          onChange={onChange}
          placeholder="Nombre de la empresa"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Responsable quien trae el producto
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="responsableTrae"
            value={formData.responsableTrae}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Responsable quien ordenó facturar
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="responsableFacturar"
            value={formData.responsableFacturar}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Sección de horas */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Hora reporte llegada
          </label>
          <input
            type="time"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="horaLlegada"
            value={formData.horaLlegada}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Hora inicio despacho
          </label>
          <input
            type="time"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="horaInicio"
            value={formData.horaInicio}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Hora final despacho
          </label>
          <input
            type="time"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="horaFinal"
            value={formData.horaFinal}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Sección de recepción/entrega */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Recepción/Entrega
        </label>
        <select
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="recepcionEntrega"
          value={formData.recepcionEntrega}
          onChange={onChange}
        >
          <option value="">Seleccione...</option>
          <option value="R">Recepción (R)</option>
          <option value="E">Entrega (E)</option>
        </select>
      </div>

      {/* Sección de aspectos a considerar */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Aspectos a considerar
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="excesosGrasas"
              checked={formData.excesosGrasas}
              onChange={onChange}
              className="mr-2"
            />
            Exceso de Grasas
          </label>
          {/* Agregar más checkboxes para cada aspecto */}
        </div>
      </div>

      {/* Sección de información del producto */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Línea
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="linea"
            value={formData.linea}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Proceso Ref.
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="procesoRef"
            value={formData.procesoRef}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Código Ref.
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="codigoRef"
            value={formData.codigoRef}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Descripción del producto y observaciones
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="descripcion"
          value={formData.descripcion}
          onChange={onChange}
          rows="4"
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onGenerate}
        >
          Generar PDF
        </button>
      </div>
    </div>
  );
};

export default PDFForm;