// src/services/pdfService.js
import { jsPDF } from 'jspdf';

/**
 * Servicio para la generación de PDFs de recepción de productos
 * @class PDFService
 */
export class PDFService {
  /** @type {jsPDF} Instancia del documento PDF */
  doc = null;
  
  /** @type {string} Ruta del logo de la empresa */
  logoPath = '/images/LOGO INDUGAL(1).png';
  
  /** @type {Object} Configuración común del documento */
  static DOC_CONFIG = {
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  };

  /** @type {Object} Configuración de fuentes y colores */
  static STYLES = {
    fontSize: {
      small: 6,
      regular: 8,
      medium: 9,
      large: 10,
      xlarge: 11
    },
    colors: {
      red: [255, 0, 0],
      black: [0, 0, 0],
      gray: [128, 128, 128]
    }
  };

  /**
   * Inicializa un nuevo documento PDF
   * @private
   */
  initDocument() {
    this.doc = new jsPDF(PDFService.DOC_CONFIG);
    this.doc.setLineWidth(0.3);
    this.doc.setDrawColor(0);
    this.doc.setFont('courier');
  }

  /**
   * Agrega el logo de la empresa al documento
   * @private
   * @async
   */
  async addLogo() {
    try {
      const logoUrl = `${window.location.origin}${this.logoPath}`;
      const imgData = await this.urlToBase64(logoUrl);
      const imgProps = this.doc.getImageProperties(imgData);
      
      const dimensions = this.calculateImageDimensions(imgProps, {
        maxWidth: 55,
        maxHeight: 30
      });

      this.doc.addImage(imgData, 'PNG', 5, 5, dimensions.width, dimensions.height);
    } catch (error) {
      console.error('Error al cargar el logo:', error);
    }
  }

  /**
   * Calcula las dimensiones óptimas de una imagen manteniendo su proporción
   * @private
   * @param {Object} imgProps - Propiedades de la imagen
   * @param {Object} maxDimensions - Dimensiones máximas permitidas
   * @returns {Object} Dimensiones calculadas
   */
  calculateImageDimensions(imgProps, maxDimensions) {
    const aspectRatio = imgProps.width / imgProps.height;
    let width = maxDimensions.maxWidth;
    let height = width / aspectRatio;

    if (height > maxDimensions.maxHeight) {
      height = maxDimensions.maxHeight;
      width = height * aspectRatio;
    }

    return { width, height };
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
      throw new Error('Error al convertir URL a base64');
    }
  }

  /**
   * Dibuja una flecha hacia abajo
   * @private
   * @param {number} x - Posición X
   * @param {number} y - Posición Y
   */
  drawDownArrow(x, y) {
    this.doc.setFillColor(...PDFService.STYLES.colors.gray);
    this.doc.triangle(x, y, x - 1, y - 1, x + 1, y - 1);
    this.doc.setFillColor(...PDFService.STYLES.colors.black);
  }

  drawHeader() {
    // Texto del encabezado
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(
      'MEDELLÍN Calle 36 No. 52-50 PBX: 4444-314 Auxiliar 232 59 57 CEL: 321760 81 74',
      67,
      5
    );

    // Título principal
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RECEPCIÓN DE PRODUCTO', 99, 9);

    // Texto adicional en rojo
    this.doc.setTextColor(255, 0, 0);
    this.doc.setFontSize(7);
    this.doc.text(
      'PASADOS 2 DÍAS DE LA PROMESA DE ENTREGA NO SE RESPONDE POR INCONFORMIDAD POR',
      71,
      12
    );
    this.doc.text(
      'DETERIORO EN NUESTROS PROCESOS Y PRODUCTO. SE COBRARÁ BODEGAJE A PARTIR DEL',
      71,
      15
    );
    this.doc.text('3er DÍA DE LA FECHA DE PROMESA DE ENTREGA.',
      71,
      18
    );
    this.doc.setTextColor(0, 0, 0);
  }

  drawChecklist() {
    // Título del checklist
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Aspectos a considerar Si Aplica:', 195, 5); // +5mm

    const aspectos = [
      'Exceso de Grasas',
      'Exceso de oxidación',
      'Exceso de calamina',
      'Pintura',
      'Pintura recubrimiento buque',
      'Con stickers',
      'Soldadura mal escoriadas',
      'Perforación de',
      'Drenaje y/o para colgado',
      'Otros y que tiene a considerar:'
    ];

    let y = 9;
    aspectos.forEach((aspecto) => {
      this.doc.text(aspecto, 195, y); // +5mm del original

      // Establece el color rojo para los bordes de los checkboxes
      this.doc.setDrawColor(255, 0, 0); // Color de borde rojo
      
      // Dibuja los rectángulos solo con borde rojo (+5mm)
      this.doc.rect(234, y - 2, 4, 3); // SI (229 + 5)
      this.doc.rect(239, y - 2, 4, 3); // NO (234 + 5)

      // Configura el texto en negro y más pequeño (+10mm)
      this.doc.setFontSize(7);
      this.doc.setTextColor(0); // Texto en negro
      this.doc.text('SI', 235, y)
      this.doc.text('NO', 239, y); 

      // Restaura el color de borde a negro para el resto del documento
      this.doc.setDrawColor(0);

      y += 3;
    });
}
  

  drawClientInfo() {
    //Requisitos del cliente
    this.doc.setFontSize(10);
    this.doc.setTextColor("black"); // SI
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Señor Cliente:', 247, 5);

    //texto informativo
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Es un requisito nuestro, que todo', 247, 9);
    this.doc.text('producto para procesos debe venir', 247, 13);
    this.doc.text('documentado, especificando referencia', 247, 17);
    this.doc.text('o nombre de cada producto y proceso', 247, 21);
    this.doc.text('a aplicar unidades y/o kilogramos en lo', 247, 25);
    this.doc.text('posible fecha y hora de requerimiento', 247, 29);
    this.doc.text('de su producto terminado', 247, 33);
  }

  drawMainForm() {
    this.doc.setFontSize(6);
    
    // Función helper para dibujar triángulo
    const drawDownArrow = (x, y) => {
        this.doc.setFillColor(128, 128, 128); // Color gris
        this.doc.triangle(
            x, y,           // Punto superior
            x - 1, y - 1,   // Punto inferior izquierdo
            x + 1, y - 1    // Punto inferior derecho
        );
        this.doc.setFillColor(0, 0, 0); // Restablecer color a negro
    };
    
    // Empresa
    this.doc.text('EMPRESA QUIEN TRAE EL PRODUCTO SI APLICA', 10, 21);
    this.doc.line(5, 27, 70, 27);
    drawDownArrow(34, 23); // Triángulo para empresa
    
    // Responsable
    this.doc.text('NOMBRE RESPONSABLE QUIEN TRAE EL PRODUCTO', 8, 31);
    this.doc.line(5, 37, 70, 37);
    drawDownArrow(34, 33); // Triángulo para responsable
    
    // Facturar
    this.doc.text('FACTURAR A NOMBRE DE', 100, 21);
    this.doc.line(77, 27, 150, 27);
    drawDownArrow(114, 23); // Triángulo para facturar
    
    // Responsable facturación
    this.doc.text('RESPONSABLE QUIEN ORDENÓ FACTURAR', 91, 31);
    this.doc.line(77, 37, 150, 37);
    drawDownArrow(114, 33); // Triángulo para responsable facturación

    // Sección de tiempo de entrega
    this.doc.text('TIEMPO PARA LA ENTREGA DEL PRODUCTO SUGERIDO POR', 5, 41);
    
    this.doc.text('CLIENTE', 5, 45);
    this.doc.rect(15, 43, 3, 3); // Línea para checkbox cliente
    
    this.doc.text('INDUSTRIAS Y GALVANIZADOS', 27, 45);
    this.doc.rect(60, 43, 3, 3); // Línea para checkbox industrias
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('NOMBRE:', 6, 52);
    this.doc.line(20, 52, 65, 52);
  }

  drawTimeSection() {
    this.doc.setFontSize(6);
    
    // Campos de hora con líneas
    this.doc.text('HORA REPORTE LLEGADA', 77, 42);
    this.doc.rect(118, 39, 28, 5);
    
    this.doc.text('HORA INICIO DESPACHO', 77, 48);
    this.doc.rect(118, 45, 28, 5);
    
    this.doc.text('HORA FINAL DESPACHO Y SALIDA', 77, 54);
    this.doc.rect(118, 51, 28, 5);
    
    // R/E con líneas pequeñas
    this.doc.text('RECEPCIÓN ENTREGA', 77,60);
    this.doc.rect(118, 57, 28, 5);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10);
    this.doc.text('R', 122, 61);
    this.doc.rect(125, 58, 3, 3);
    this.doc.text('E', 133, 61);
    this.doc.rect(136, 58, 3, 3);
    this.doc.setFont('helvetica', 'normal');
  }

  drawFecha() {
    // Fecha superior
    this.doc.setFontSize(6);
    this.doc.text('FECHA :', 150, 22);
    this.doc.text('HORA :', 150, 31);

    this.doc.text('DIA', 162, 20);
    this.doc.text('MES', 173, 20);
    this.doc.text('AÑO', 184, 20);

    this.doc.rect(160, 18, 33, 15);
    this.doc.line(160, 21, 193, 21);
    // Líneas verticales
    this.doc.line(160, 18, 160, 27);
    this.doc.line(171, 18, 171, 27);
    this.doc.line(182, 18, 182, 27);
    // Separador hora
    this.doc.line(160, 27, 193, 27);    

    // Fecha inferior (10mm más abajo)
    this.doc.text('FECHA :', 150, 45); // 5mm a la izquierda
    this.doc.text('HORA :', 150, 53); // 5mm a la izquierda

    this.doc.text('DIA', 162, 43); // 5mm a la izquierda
    this.doc.text('MES', 173, 43); // 5mm a la izquierda
    this.doc.text('AÑO', 184, 43); // 5mm a la izquierda

    this.doc.rect(160, 41, 29.7, 13.5); // 5mm a la izquierda
    this.doc.line(160, 44, 189.7, 44); // 5mm a la izquierda
    // Líneas verticales
    this.doc.line(160, 41, 160, 49.5); // 5mm a la izquierda
    this.doc.line(169.7, 41, 169.7, 49.5); // 5mm a la izquierda
    this.doc.line(179.4, 41, 179.4, 49.5); // 5mm a la izquierda
    // Separador hora
    this.doc.line(160, 49.5, 189.7, 49.5); // 5mm a la izquierda

    //texto de compromiso
    this.doc.line(195,40,245,40);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('compromiso    de    entrega', 200, 45);
    this.doc.text('del producto ya procesado', 200, 49);
    this.doc.text('y facturado', 200, 53);

    // Dibujar flecha hacia la izquierda
    this.doc.setDrawColor(0, 0, 0); // Color negro
    this.doc.setLineWidth(0.5);
    this.doc.line(192, 46, 200, 46); // Línea horizontal
    this.doc.line(192, 46, 195, 44); // Línea diagonal hacia arriba
    this.doc.line(192, 46, 195, 48); // Línea diagonal hacia abajo
  }

  drawDocumento(){
    this.doc.rect(250,38,40,14);
    this.doc.text('DOCUMENTO', 261, 41);
  }

  drawProductTable() {
    // Tabla de productos
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10);
    this.doc.text('DESCRIPCIÓN DEL PRODUCTO Y OBSERVACIONES', 72, 68);

    // Dibujar renglones alternados
    const startY = 69;
    const rowHeight = 4.6; // Altura de cada renglón
    const numRows = 10;

    for (let i = 0; i < numRows; i++) {
      const y = startY + (i * rowHeight);
      if (i % 2 === 0) {
        // Renglón gris
        this.doc.setFillColor(220, 220, 220); // Gris claro
        this.doc.rect(5, y, 285, rowHeight, 'F');
      }
    }

    // Dibujar líneas verticales
    this.doc.setDrawColor(0, 0, 0)
  

    // Columnas
    //linea horizontal superior
    this.doc.line(5, 65, 190, 65); // Línea horizontal
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);
    this.doc.line(5, 65, 5, 69); // Línea vertical
    this.doc.text('LINEA', 6, 68);
    this.doc.line(17, 65, 17, 115); // Línea vertical
    this.doc.text('PROCESO REF.', 18, 68);
    this.doc.line(40, 65, 40, 115); // Línea vertical
    this.doc.text('CÓDIGO REF.', 41, 68);
    this.doc.line(60, 65, 60, 115); // Línea vertical
  }

  drawRectangulo(){
    this.doc.setLineWidth(0.3);
    this.doc.rect(5, 69, 285, 46);
    this.doc.line(5, 65, 190, 65); // Línea horizontal
    this.doc.line(5, 65, 5, 69); // Línea vertical
    
  }

  drawDetails() {
    this.doc.setFontSize(6);
    this.doc.setLineWidth(0.3);
    this.doc.setFont('helvetica', 'normal');
    this.doc.line(190, 56, 290, 56); // Línea horizontal


    this.doc.line(190, 56, 190, 115); // Línea vertical
    this.doc.text('DOCUMENTO', 191, 59);
    this.doc.text('CLIENTE', 193, 62);

    this.doc.line(206, 56, 206, 115);
    this.doc.text('UNIDS', 207, 61);

    this.doc.line(215, 56, 215, 115); // Línea vertical
    this.doc.text('PESO', 217, 59);
    this.doc.text('BRUTO', 217, 62);
    this.doc.text('ENTRADA', 216, 65);

    this.doc.line(229, 56, 229, 115); // Línea vertical
    this.doc.text('RECIPIENTES', 230, 60);
    this.doc.line(229, 62, 245, 62); // Línea horizontal
    this.doc.text('UNID', 230, 65);
    this.doc.line(235, 62, 235, 115); // Línea vertical
    this.doc.text('PESO', 237, 65);

    this.doc.line(245, 56, 245, 115); // Línea vertical
    this.doc.text('PESO', 250, 59);
    this.doc.text('NETO', 250, 62);
    this.doc.text('ENTRADA', 248, 65);

    this.doc.line(260, 56, 260, 115); // Línea vertical
    this.doc.text('PESO', 265, 59);
    this.doc.text('BRUTO', 264, 62);
    this.doc.text('SALIDA', 264, 65);

    this.doc.line(275, 56, 275, 115); // Línea vertical
    this.doc.text('PESO', 278, 59);
    this.doc.text('NETO', 278, 62);
    this.doc.text('SALIDA', 277, 65);
    this.doc.line(290, 56, 290, 115);

    this.doc.line(250, 53, 290, 53); // Línea horizontal
    this.doc.text('Código: F-IG-098 05042024', 255, 55);
    this.doc.line(250, 53, 250, 56); // Línea vertical
    this.doc.line(290, 53, 290, 56); // Línea vertical
  }

  // Nuevo método para dibujar el contenido del formulario
  drawFormData(formData) {
    if (!formData) return;

    this.doc.setFontSize(8);
    
    // Dibujar datos de empresa y responsables
    if (formData.empresa) {
      this.doc.text(formData.empresa, 6, 25);
    }

    if (formData.responsableTrae) {
      this.doc.text(formData.responsableTrae, 6, 35);
    }

    if (formData.facturarA) {
      this.doc.text(formData.facturarA, 78, 25);
    }

    if (formData.responsableFacturar) {
      this.doc.text(formData.responsableFacturar, 78, 35);
    }

    // Dibujar horas
    if (formData.horaLlegada) {
      this.doc.text(formData.horaLlegada, 119, 42);
    }

    if (formData.horaInicio) {
      this.doc.text(formData.horaInicio, 119, 48);
    }

    if (formData.horaFinal) {
      this.doc.text(formData.horaFinal, 119, 54);
    }

    // Marcar R/E según selección
    if (formData.recepcionEntrega) {
      const isRecepcion = formData.recepcionEntrega === 'R';
      this.doc.text('X', isRecepcion ? 125.5 : 136.5, 60);
    }

    // Dibujar datos de producto si existen
    if (formData.descripcion) {
      this.doc.setFontSize(7);
      // Dividir la descripción en líneas si es necesario
      const lines = this.doc.splitTextToSize(formData.descripcion, 150);
      this.doc.text(lines, 42, 75);
    }
  }

  drawFooter(title) {
    this.doc.setFont('courier', 'bold');
    this.doc.setFontSize(12);
    this.doc.text(title, 150, 120, { align: 'center' });
  }

  /**
   * Genera múltiples copias del documento
   * @async
   * @param {Object} formData - Datos del formulario
   * @returns {Promise<Blob[]>} Array de blobs de PDF
   */
  async generateMultipleCopies(formData) {
    const copies = [];
    const footerTitles = [
      'ORIGINAL - CLIENTE',
      'COPIA - CONTABILIDAD',
      'COPIA - PRODUCCIÓN',
      'COPIA - ARCHIVO'
    ];

    for (const title of footerTitles) {
      this.initDocument();
      await this.drawCompletePage(formData, title);
      copies.push(this.doc.output('blob'));
    }

    return copies;
  }

  /**
   * Dibuja una página completa del documento
   * @private
   * @async
   * @param {Object} formData - Datos del formulario
   * @param {string} footerTitle - Título del pie de página
   */
  async drawCompletePage(formData, footerTitle) {
    await this.addLogo();
    this.drawHeader();
    this.drawChecklist();
    this.drawClientInfo();
    this.drawMainForm();
    this.drawTimeSection();
    this.drawFecha();
    this.drawProductTable();
    this.drawDocumento();
    this.drawRectangulo();
    this.drawDetails();
    this.drawFormData(formData);
    this.drawFooter(footerTitle);
  }

  /**
   * Genera el PDF final con todas las copias
   * @async
   * @param {Object} formData - Datos del formulario
   * @returns {Promise<jsPDF>} Documento PDF final
   */
  /**
   * Convierte un Blob de PDF a ArrayBuffer
   * @private
   * @async
   * @param {Blob} blob - Blob del PDF
   * @returns {Promise<ArrayBuffer>} Contenido del PDF como ArrayBuffer
   */
  async loadPDFBlob(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  /**
   * Genera el PDF final con todas las copias
   * @async
   * @param {Object} formData - Datos del formulario
   * @returns {Promise<jsPDF>} Documento PDF final
   */
  async generatePDF(formData = {}) {
    try {
      const copies = await this.generateMultipleCopies(formData);
      const finalDoc = new jsPDF(PDFService.DOC_CONFIG);

      for (let i = 0; i < copies.length; i++) {
        if (i > 0) finalDoc.addPage();
        const pageContent = await this.loadPDFBlob(copies[i]);
        finalDoc.addPage(pageContent);
      }

      return finalDoc;
    } catch (error) {
      console.error('Error generando PDF:', error);
      throw error;
    }
  }

  /**
   * Guarda el PDF con el nombre especificado
   * @param {string} filename - Nombre del archivo
   * @throws {Error} Si el documento no está inicializado
   */
  savePDF(filename = 'recepcion-producto.pdf') {
    if (!this.doc) {
      throw new Error('Documento no inicializado');
    }
    this.doc.save(filename);
  }
}

export const pdfService = new PDFService();