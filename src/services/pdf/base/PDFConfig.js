// services/pdf/base/PDFConfig.js

// Configuración general del documento
export const DOC_CONFIG = {
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    lineWidth: 0.3
  };
  
  // Estilos de texto predefinidos
  export const TEXT_STYLES = {
    base: {
      font: 'helvetica',
      size: 8,
      color: 0  // Negro
    },
    formInput: {
      font: 'courier',
      size: 8,
      color: 0
    },
    header: {
      font: 'helvetica',
      style: 'bold',
      size: 11,
      color: 0
    },
    warning: {
      font: 'helvetica',
      size: 7,
      color: [255, 0, 0]  // Rojo
    }
  };
  
  // Dimensiones y posiciones del logo
  export const LOGO_CONFIG = {
    path: '/images/LOGO INDUGAL(1).png',
    maxWidth: 55,
    maxHeight: 30,
    position: {
      x: 5,
      y: 5
    }
  };
  
  // Configuración de las copias
  export const COPIES_CONFIG = {
    titles: [
      'ORIGINAL - CLIENTE',
      'COPIA - CONTABILIDAD',
      'COPIA - PRODUCCIÓN',
      'COPIA - ARCHIVO'
    ],
    footerPosition: {
      y: 120,
      font: 'helvetica',
      size: 12,
      style: 'bold'
    }
  };
  
  // Configuración de la tabla de productos
  export const TABLE_CONFIG = {
    startY: 69,
    rowHeight: 4.6,
    numRows: 10,
    alternateColor: [220, 220, 220],  // Gris claro para filas alternadas
    columns: [
      { header: 'LINEA', width: 12 },
      { header: 'PROCESO REF.', width: 23 },
      { header: 'CÓDIGO REF.', width: 20 }
    ]
  };
  
  // Textos predefinidos
  export const FIXED_TEXTS = {
    title: 'RECEPCIÓN DE PRODUCTO',
    address: 'MEDELLÍN Calle 36 No. 52-50 PBX: 4444-314 Auxiliar 232 59 57 CEL: 321760 81 74',
    warnings: [
      'PASADOS 2 DÍAS DE LA PROMESA DE ENTREGA NO SE RESPONDE POR INCONFORMIDAD POR',
      'DETERIORO EN NUESTROS PROCESOS Y PRODUCTO. SE COBRARÁ BODEGAJE A PARTIR DEL',
      '3er DÍA DE LA FECHA DE PROMESA DE ENTREGA.'
    ]
  };
  
  // Coordenadas para elementos del formulario
  export const FORM_POSITIONS = {
    empresa: { x: 6, y: 25 },
    responsableTrae: { x: 6, y: 35 },
    facturarA: { x: 78, y: 25 },
    responsableFacturar: { x: 78, y: 35 },
    horas: {
      llegada: { x: 119, y: 42 },
      inicio: { x: 119, y: 48 },
      final: { x: 119, y: 54 }
    },
    recepcionEntrega: {
      R: { x: 125.5, y: 60 },
      E: { x: 136.5, y: 60 }
    }
  };