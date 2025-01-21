// components/PDFGenerator/PDFForm.js
const PDFForm = ({ formData, onChange, onGenerate }) => {
  // Lista de aspectos a considerar para generar checkboxes dinámicamente
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
            Facturar a nombre de
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="facturarA"
            value={formData.facturarA}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="mb-4">
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

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Fecha y hora superior */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Fecha de llegada
          </label>
          <input
            type="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="fechaSuperior"
            value={formData.fechaSuperior || ''}
            onChange={onChange}
          />
          <input
            type="time"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
            name="horaSuperior"
            value={formData.horaSuperior || ''}
            onChange={onChange}
          />
        </div>

        {/* Fecha y hora inferior (compromiso de entrega) */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Fecha compromiso de entrega
          </label>
          <input
            type="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="fechaInferior"
            value={formData.fechaInferior || ''}
            onChange={onChange}
          />
          <input
            type="time"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
            name="horaInferior"
            value={formData.horaInferior || ''}
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
          {aspectos.map((aspecto) => (
            <label key={aspecto.name} className="flex items-center">
              <input
                type="checkbox"
                name={aspecto.name}
                checked={formData[aspecto.name]}
                onChange={onChange}
                className="mr-2"
              />
              {aspecto.label}
            </label>
          ))}
          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Otros aspectos a considerar:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="otros"
              value={formData.otros}
              onChange={onChange}
            />
          </div>
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