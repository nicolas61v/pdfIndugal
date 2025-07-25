// src/services/templatePdfService.js
// VERSIÓN OPTIMIZADA PARA PESO LIGERO
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
   * Optimiza imagen aprovechando el margen disponible para mejor calidad
   * @private
   * @async
   * @param {string} url - URL de la imagen
   * @returns {Promise<string>} Imagen optimizada en base64
   */
  async optimizeImageForSize(url) {
    try {
      console.log('🔄 Aprovechando margen disponible para MÁXIMA calidad:', url);
      
      const response = await fetch(url);
      const blob = await response.blob();
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          // Como solo pesa 700KB, podemos aumentar MUCHO la calidad
          const targetWidth = 1600;   // Resolución alta para calidad premium
          const targetHeight = 1131;  // Proporcional A4 landscape
          
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          
          // Fondo blanco para mejor contraste
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          
          // Configuración PREMIUM para máxima calidad
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Dibujar imagen en alta resolución
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          
          // JPEG con calidad muy alta ya que tenemos margen de peso
          const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.92); // 92% calidad muy alta
          
          const sizeKB = Math.round((optimizedBase64.length * 0.75) / 1024);
          console.log(`📦 CALIDAD PREMIUM: ${targetWidth}x${targetHeight}px, ~${sizeKB}KB (92% calidad máxima)`);
          
          resolve(optimizedBase64);
        };
        
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
      });
    } catch (error) {
      console.error('❌ Error optimizando imagen:', error);
      throw new Error(`Error al optimizar imagen: ${error.message}`);
    }
  }

  /**
   * Agrega una plantilla optimizada como imagen de fondo
   * @private
   * @async
   * @param {string} templateFile - Nombre del archivo de plantilla
   */
  async addTemplateBackground(templateFile) {
    try {
      const templateUrl = `${window.location.origin}/${templateFile}`;
      console.log(`🎨 Cargando plantilla ligera: ${templateFile}`);
      
      const imgData = await this.optimizeImageForSize(templateUrl);
      
      // Agregar imagen con configuración de compresión máxima
      this.doc.addImage(
        imgData, 
        'JPEG',     // Formato comprimido
        0, 0,       // Posición
        297, 210,   // Tamaño A4 landscape
        undefined,  // alias
        'FAST'      // Compresión rápida
      );
      
      console.log(`✅ Plantilla ${templateFile} agregada (optimizada)`);
      
    } catch (error) {
      console.error('❌ Error al cargar template optimizado:', error);
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
      { field: 'drenaje', y: 34 }
    ];

    aspectosPositions.forEach(({ field, y }) => {
      if (formData[field]) {
        this.doc.text('X', 234.5, y);
      } else {
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
   * Genera el PDF principal con las 4 copias (versión ligera)
   * @async
   * @param {Object} formData - Datos del formulario
   * @returns {Promise<jsPDF>} Documento PDF ligero con las 4 copias
   */
  async generateMainPDF(formData = {}) {
    try {
      console.log('🚀 Generando PDF principal (versión ligera)...');
      this.initDocument();

      for (let i = 0; i < TemplatePdfService.MAIN_TEMPLATES.length; i++) {
        if (i > 0) this.doc.addPage();

        const template = TemplatePdfService.MAIN_TEMPLATES[i];
        console.log(`📄 Procesando ${template.name} (optimizado)...`);
        
        // Agregar fondo optimizado para peso
        await this.addTemplateBackground(template.file);
        
        // Agregar datos del formulario
        this.drawFormData(formData);
      }

      console.log('✅ PDF principal ligero generado exitosamente');
      return this.doc;
    } catch (error) {
      console.error('❌ Error generando PDF ligero:', error);
      throw error;
    }
  }

  /**
   * Genera el PDF de la guía manual (versión ligera)
   * @async
   * @returns {Promise<jsPDF>} Documento PDF ligero de la guía
   */
  async generateGuidePDF() {
    try {
      console.log('📋 Generando PDF de guía (versión ligera)...');
      this.initDocument();
      
      // Solo agregar la plantilla de texto optimizada
      await this.addTemplateBackground(TemplatePdfService.GUIDE_TEMPLATE);
      
      console.log('✅ PDF de guía ligero generado exitosamente');
      return this.doc;
    } catch (error) {
      console.error('❌ Error generando PDF de guía ligero:', error);
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
    console.log(`💾 Guardando PDF ligero: ${filename}`);
    this.doc.save(filename);
  }
}

// Instancia única del servicio
export const templatePdfService = new TemplatePdfService();