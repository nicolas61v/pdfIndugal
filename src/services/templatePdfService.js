// src/services/templatePdfService.js
import { jsPDF } from 'jspdf';

export class TemplatePdfService {
  /** @type {jsPDF} Instancia del documento PDF */
  doc = null;

  /** @type {Object} Configuración común del documento */
  static DOC_CONFIG = {
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  };

  /** @type {Array} Plantillas de las 4 copias principales */
  static MAIN_TEMPLATES = [
    { file: 'copiaBlanca.png', name: 'ORIGINAL - CLIENTE' },
    { file: 'copiaVerde.png', name: 'COPIA - CONTABILIDAD' },
    { file: 'copiaRosa.png', name: 'COPIA - PRODUCCIÓN' },
    { file: 'copiaAmarilla.png', name: 'COPIA - ARCHIVO' }
  ];

  /** @type {string} Plantilla de la guía manual */
  static GUIDE_TEMPLATE = 'copiaTexto.png';

  constructor() {
    this.doc = null;
  }

  /**
   * Inicializa un nuevo documento PDF
   * @private
   */
  initDocument() {
    this.doc = new jsPDF(TemplatePdfService.DOC_CONFIG);
    this.doc.setLineWidth(0.3);
    this.doc.setDrawColor(0);
  }

  /**
   * Convierte una URL a base64
   * @private
   * @async
   * @param {string} url - URL de la imagen
   * @returns {Promise<string>} Imagen en formato base64
   */
  async urlToBase64(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error(`Error al convertir URL a base64: ${error.message}`);
    }
  }

  /**
   * Agrega una plantilla como imagen de fondo
   * @private
   * @async
   * @param {string} templateFile - Nombre del archivo de plantilla
   */
  async addTemplateBackground(templateFile) {
    try {
      const templateUrl = `${window.location.origin}/${templateFile}`;
      const imgData = await this.urlToBase64(templateUrl);
      
      // Agregar imagen de fondo ocupando toda la página A4 landscape (297x210mm)
      this.doc.addImage(imgData, 'PNG', 0, 0, 297, 210);
    } catch (error) {
      console.error('Error al cargar template:', error);
      throw error;
    }
  }

  /**
   * Configura el estilo del texto para los datos del formulario
   * @private
   */
  setFormTextStyle() {
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(12);
    this.doc.setTextColor(0, 0, 255); // Color azul
  }

  /**
   * Dibuja los datos del formulario sobre la plantilla
   * @private
   * @param {Object} formData - Datos del formulario
   */
  drawFormData(formData) {
    if (!formData) return;

    // Configurar estilo del texto
    this.setFormTextStyle();

    // === INFORMACIÓN DE EMPRESA ===
    if (formData.empresa) {
      this.doc.text(formData.empresa, 6, 26);
    }

    if (formData.responsableTrae) {
      this.doc.text(formData.responsableTrae, 6, 36);
    }

    if (formData.facturarA) {
      this.doc.text(formData.facturarA, 78, 26);
    }

    if (formData.responsableFacturar) {
      this.doc.text(formData.responsableFacturar, 78, 36);
    }

    // === TIEMPO DE ENTREGA ===
    if (formData.tiempoEntregaPor) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(10);
      if (formData.tiempoEntregaPor === 'cliente') {
        this.doc.text('X', 16, 45);
      } else if (formData.tiempoEntregaPor === 'industrias') {
        this.doc.text('X', 61, 45);
      }
    }

    // Nombre de quien sugiere el tiempo
    if (formData.nombreTiempoEntrega) {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(12);
      this.doc.text(formData.nombreTiempoEntrega, 22, 51);
    }

    // === HORARIOS ===
    if (formData.horaLlegada) {
      this.doc.text(formData.horaLlegada, 125, 43);
    }

    if (formData.horaInicio) {
      this.doc.text(formData.horaInicio, 125, 49);
    }

    if (formData.horaFinal) {
      this.doc.text(formData.horaFinal, 125, 55);
    }

    // === CHECKBOXES DE ASPECTOS ===
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');

    const aspectosPositions = [
      { field: 'excesosGrasas', y: 10 },
      { field: 'excesosOxidacion', y: 13 },
      { field: 'excesosCalamina', y: 16 },
      { field: 'pintura', y: 19 },
      { field: 'recubrimientoBuque', y: 22 },
      { field: 'stickers', y: 25 },
      { field: 'soldaduraMalEscoriada', y: 28 },
      { field: 'drenaje', y: 34 } // Perforación + drenaje
    ];

    aspectosPositions.forEach(({ field, y }) => {
      if (formData[field]) {
        // Si está marcado, poner X en SI
        this.doc.text('X', 234.5, y);
      } else {
        // Si no está marcado, poner X en NO
        this.doc.text('X', 239.5, y);
      }
    });

    // === RECEPCIÓN/ENTREGA ===
    if (formData.recepcionEntrega) {
      const isRecepcion = formData.recepcionEntrega === 'R';
      this.doc.text('X', isRecepcion ? 125.5 : 136.5, 60);
    }

    // === INFORMACIÓN DEL PRODUCTO ===
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    
    if (formData.linea) {
      this.doc.text(formData.linea, 6, 73);
    }

    if (formData.procesoRef) {
      this.doc.text(formData.procesoRef, 18, 73);
    }

    if (formData.codigoRef) {
      this.doc.text(formData.codigoRef, 41, 73);
    }

    // Descripción con manejo de texto largo
    if (formData.descripcion) {
      const maxWidth = 140;
      const lines = this.doc.splitTextToSize(formData.descripcion, maxWidth);
      this.doc.text(lines, 61, 73);
    }

    // Otros aspectos
    if (formData.otros) {
      this.doc.text(formData.otros, 230, 36);
    }

    // === FECHAS Y HORAS ===
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);

    // Fecha superior
    if (formData.fechaSuperior) {
      const fecha = new Date(formData.fechaSuperior);
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const año = fecha.getFullYear();

      this.doc.text(dia, 163, 25);
      this.doc.text(mes, 174, 25);
      this.doc.text(año.toString(), 183, 25);
    }

    if (formData.horaSuperior) {
      this.doc.text(formData.horaSuperior, 173, 31);
    }

    // Fecha inferior (compromiso)
    if (formData.fechaInferior) {
      const fecha = new Date(formData.fechaInferior);
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const año = fecha.getFullYear();

      this.doc.text(dia, 163, 48);
      this.doc.text(mes, 173, 48);
      this.doc.text(año.toString(), 180, 48);
    }

    if (formData.horaInferior) {
      this.doc.text(formData.horaInferior, 170, 53);
    }

    // === NÚMERO DE DOCUMENTO ===
    if (formData.documentNumber) {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(12);
      this.doc.text(formData.documentNumber.toString(), 270, 47, { align: 'center' });
    }

    // Restaurar configuración
    this.doc.setTextColor(0);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
  }

  /**
   * Genera el PDF principal con las 4 copias
   * @async
   * @param {Object} formData - Datos del formulario
   * @returns {Promise<jsPDF>} Documento PDF con las 4 copias
   */
  async generateMainPDF(formData = {}) {
    try {
      this.initDocument();

      for (let i = 0; i < TemplatePdfService.MAIN_TEMPLATES.length; i++) {
        if (i > 0) this.doc.addPage(); // Agregar nueva página después de la primera

        const template = TemplatePdfService.MAIN_TEMPLATES[i];
        
        // Agregar fondo de plantilla
        await this.addTemplateBackground(template.file);
        
        // Agregar datos del formulario
        this.drawFormData(formData);
      }

      return this.doc;
    } catch (error) {
      console.error('Error generando PDF principal:', error);
      throw error;
    }
  }

  /**
   * Genera el PDF de la guía manual (sin datos)
   * @async
   * @returns {Promise<jsPDF>} Documento PDF de la guía
   */
  async generateGuidePDF() {
    try {
      this.initDocument();
      
      // Solo agregar la plantilla de texto, sin datos
      await this.addTemplateBackground(TemplatePdfService.GUIDE_TEMPLATE);
      
      return this.doc;
    } catch (error) {
      console.error('Error generando PDF de guía:', error);
      throw error;
    }
  }

  /**
   * Guarda el PDF con el nombre especificado
   * @param {string} filename - Nombre del archivo
   */
  savePDF(filename = 'documento.pdf') {
    if (!this.doc) {
      throw new Error('Documento no inicializado');
    }
    this.doc.save(filename);
  }
}

// Instancia única del servicio
export const templatePdfService = new TemplatePdfService();