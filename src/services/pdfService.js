// src/services/pdfService.js
import { jsPDF } from 'jspdf';

export class PDFService {
  /** @type {jsPDF} Instancia del documento PDF */
  doc = null;

  /** @type {string} Ruta del logo de la empresa */
  logoPath = '/images/LOGO INDUGAL(1).png';

  /** @type {string} Ruta del círculo rojo largo */
  largoRojoPath = '/images/cortoRojochico.png';

  /** @type {string} Ruta del círculo rojo corto */
  cortoRojoPath = '/images/largoRojochico.png';

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

  constructor() {
    // Inicializar las fuentes al crear la instancia
    this.normalFont = null;
    this.boldFont = null;
  }

  /**
   * Inicializa un nuevo documento PDF
   * @private
   */
  initDocument() {
    this.doc = new jsPDF(PDFService.DOC_CONFIG);
    this.doc.setLineWidth(0.3);
    this.doc.setDrawColor(0);

    // Usar una fuente estándar disponible en jsPDF
    this.doc.setFont('helvetica', 'normal');
  }

  /**
   * Configura el estilo del texto para los datos del formulario
   * @private
   */
  setFormTextStyle() {
    this.doc.setFont('Times', 'Italic');
    this.doc.setFontSize(12);
    this.doc.setTextColor(0, 0, 255); // Color azul RGB
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
   * Agrega el círculo rojo largo sobre la fecha inferior
   * @private
   * @async
   */
  async addLargoRojo() {
    try {
      const imgUrl = `${window.location.origin}${this.largoRojoPath}`;
      const imgData = await this.urlToBase64(imgUrl);

      // Ajustamos las dimensiones para cubrir la fecha inferior y el texto de compromiso
      this.doc.addImage(imgData, 'PNG', 150, 38, 102, 18);
    } catch (error) {
      console.error('Error al cargar el círculo rojo largo:', error);
    }
  }

  /**
   * Agrega el círculo rojo corto sobre los rectángulos de hora
   * @private
   * @async
   */
  async addCortoRojo() {
    try {
      const imgUrl = `${window.location.origin}${this.cortoRojoPath}`;
      const imgData = await this.urlToBase64(imgUrl);

      // Ajustamos las dimensiones para cubrir los rectángulos de hora
      this.doc.addImage(imgData, 'PNG', 70, 36, 80, 29);
    } catch (error) {
      console.error('Error al cargar el círculo rojo corto:', error);
    }
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
    this.doc.text('Aspectos a considerar Si Aplica:', 195, 5);

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

    // Lista de aspectos que no deben tener cuadros
    const aspectosSinCuadros = ['Perforación de', 'Otros y que tiene a considerar:'];

    let y = 9;
    aspectos.forEach((aspecto) => {
      this.doc.text(aspecto, 195, y);

      // Solo dibuja los cuadros si el aspecto no está en la lista de excepciones
      if (!aspectosSinCuadros.includes(aspecto)) {
        // Establece el color rojo para los bordes de los checkboxes
        this.doc.setDrawColor(255, 0, 0);

        // Dibuja los rectángulos solo con borde rojo
        this.doc.rect(234, y - 2, 4, 3); // SI
        this.doc.rect(239, y - 2, 4, 3); // NO

        // Configura el texto en negro y más pequeño
        this.doc.setFontSize(7);
        this.doc.setTextColor(0);
        this.doc.text('SI', 235, y);
        this.doc.text('NO', 239, y);

        // Restaura el color de borde a negro
        this.doc.setDrawColor(0);
      }

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
    this.doc.text('RECEPCIÓN ENTREGA', 77, 60);
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
    this.doc.line(195, 40, 245, 40);
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

  drawDocumento(formData) {
    this.doc.rect(250, 38, 40, 14);
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DOCUMENTO', 261, 41);
    
    if (formData?.documentNumber) {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(12);
      this.doc.setTextColor(0, 0, 255);
      // Centrar el número en el rectángulo
      const x = 250 + (40/2); // Centro del rectángulo
      this.doc.text(formData.documentNumber.toString(), x, 47, { align: 'center' });
      this.doc.setTextColor(0);
    }
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

  drawRectangulo() {
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

  drawFormData(formData) {
    if (!formData) return;

    // Configurar estilo del texto
    this.setFormTextStyle();

    // Dibujar datos de empresa y responsables
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

    // Dibujar horas con posiciones precisas
    if (formData.horaLlegada) {
      this.doc.text(formData.horaLlegada, 125, 43);
    }

    if (formData.horaInicio) {
      this.doc.text(formData.horaInicio, 125, 49);
    }

    if (formData.horaFinal) {
      this.doc.text(formData.horaFinal, 125, 55);
    }

    // Configuración para los checkboxes
    const aspectosPosition = {
      x: 234,
      xNo: 239,
      yStart: 10,
      yIncrement: 3
    };

    // Marcar checkboxes
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');

    // Lista de aspectos que pueden tener X
    const aspectos = [
      'excesosGrasas',
      'excesosOxidacion',
      'excesosCalamina',
      'pintura',
      'recubrimientoBuque',
      'stickers',
      'soldaduraMalEscoriada',
      null,  // Espacio para 'perforacionDe' que no lleva X
      'drenaje'  // Ahora está una posición más abajo
    ];

    aspectos.forEach((aspecto, index) => {
      // Solo procesar si el aspecto no es null
      if (aspecto) {
        const y = aspectosPosition.yStart + (index * aspectosPosition.yIncrement);

        if (formData[aspecto]) {
          // Si está marcado, poner X en SI
          this.doc.text('X', aspectosPosition.x + 0.5, y);
        } else {
          // Si no está marcado, poner X en NO
          this.doc.text('X', aspectosPosition.xNo + 0.5, y);
        }
      }
    });
    // Marcar R/E según selección
    if (formData.recepcionEntrega) {
      const isRecepcion = formData.recepcionEntrega === 'R';
      this.doc.text('X', isRecepcion ? 125.5 : 136.5, 60);
    }

    // Información del producto
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

    // Descripción del producto con manejo de texto largo
    if (formData.descripcion) {
      const maxWidth = 140;
      const lines = this.doc.splitTextToSize(formData.descripcion, maxWidth);
      this.doc.text(lines, 61, 73);
    }

    // Otros aspectos a considerar
    if (formData.otros) {
      this.doc.text(formData.otros, 230, 36);
    }

    // Agregar manejo de fechas y horas
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    this.doc.setTextColor(0, 0, 255);

    // Fecha y hora superior
    if (formData.fechaSuperior) {
      const fecha = new Date(formData.fechaSuperior);
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const año = fecha.getFullYear();

      // Posicionar día, mes y año en sus respectivas columnas
      this.doc.text(dia, 163, 25);
      this.doc.text(mes, 174, 25);
      this.doc.text(año.toString(), 183, 25);
    }

    if (formData.horaSuperior) {
      this.doc.text(formData.horaSuperior, 173, 31);
    }

    // Fecha y hora inferior (compromiso de entrega)
    if (formData.fechaInferior) {
      const fecha = new Date(formData.fechaInferior);
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const año = fecha.getFullYear();

      // Posicionar día, mes y año en sus respectivas columnas
      this.doc.text(dia, 163, 48);
      this.doc.text(mes, 173, 48);
      this.doc.text(año.toString(), 180, 48);
    }

    if (formData.horaInferior) {
      this.doc.text(formData.horaInferior, 170, 53);
    }


    // Restaurar configuración original
    this.doc.setTextColor(0);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
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
    this.drawDocumento(formData);
    this.drawRectangulo();
    this.drawDetails();
    this.addLargoRojo(); // Agregar círculo rojo largo
    this.addCortoRojo(); // Agregar círculo rojo corto
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