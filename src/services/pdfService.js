// src/services/pdfService.js
import { jsPDF } from 'jspdf';

export class PDFService {
  constructor() {
    this.doc = null;
    this.logoPath = '/images/LOGO INDUGAL(1).png';
  }

  initDocument() {
    this.doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    this.doc.setLineWidth(0.3);
    this.doc.setDrawColor(0);
  }

  async addLogo() {
    try {
      // Construir la URL completa usando el path base de la aplicación
      const logoUrl = `${window.location.origin}${this.logoPath}`;
      
      // Convertir la imagen a base64
      const imgData = await this.urlToBase64(logoUrl);
      
      // Obtener las propiedades de la imagen
      const imgProps = this.doc.getImageProperties(imgData);
      const aspectRatio = imgProps.width / imgProps.height;

      // Dimensiones máximas del rectángulo
      const maxWidth = 40;
      const maxHeight = 20;

      // Calcular dimensiones finales manteniendo proporción
      let width = maxWidth;
      let height = width / aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      // Centrar la imagen en el rectángulo
      const x = 10 + (maxWidth - width) / 2;
      const y = 5 + (maxHeight - height) / 2;

      // Agregar la imagen y el rectángulo
      this.doc.addImage(imgData, 'PNG', x, y, width, height);
      this.doc.rect(10, 5, 40, 20);
    } catch (error) {
      console.error('Error al cargar el logo:', error);
      // Si hay error, solo dibujamos el rectángulo
      this.doc.rect(10, 5, 40, 20);
    }
  }

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

  drawHeader() {
    // Texto del encabezado
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(
      'MEDELLÍN Calle 36 No. 52-50 PBX: 4444-314 Auxiliar 232 59 57 CEL: 321760 81 74',
      55,
      5
    );

    // Título principal
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RECEPCIÓN DE PRODUCTO', 85, 10);

    // Texto adicional en rojo
    this.doc.setTextColor(255, 0, 0);
    this.doc.setFontSize(7);
    this.doc.text(
      'PASADOS 2 DÍAS DE LA PROMESA DE ENTREGA NO SE RESPONDE POR INCONFORMIDAD POR',
      57,
      15
    );
    this.doc.text(
      'DETERIORO EN NUESTROS PROCESOS Y PRODUCTO. SE COBRARÁ BODEGAJE A PARTIR DEL',
      57,
      19
    );
    this.doc.text('3er DÍA DE LA FECHA DE PROMESA DE ENTREGA.',
      57, 23);
    this.doc.setTextColor(0, 0, 0);
  }

  drawChecklist() {
    // Título del checklist
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Aspectos a considerar Si Aplica:', 180, 5);

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

    let y = 10;
    aspectos.forEach((aspecto) => {
      this.doc.text(aspecto, 180, y);

      // Cuadros de opciones SI/NO
      this.doc.rect(230, y - 2, 4, 3); // SI
      this.doc.text('SI', 227, y);
      this.doc.rect(240, y - 2, 4, 3); // NO
      this.doc.text('NO', 235, y);

      y += 4;
    });
  }

  drawClientInfo() {
    //Requisitos del cliente
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Señor Cliente:', 247, 5);

    //texto informativo
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Es un requisito nuestro, que todo', 247, 9);
    this.doc.text('producto para procesos debe venir', 247, 12);
    this.doc.text('documentado, especificando referencia', 247, 15);
    this.doc.text('o nombre de cada producto y proceso', 247, 18);
    this.doc.text('a aplicar unidades y/o kilogramos en lo', 247, 21);
    this.doc.text('posible fecha y hora de requerimiento', 247, 24);
    this.doc.text('de su producto terminado', 247, 27);
  }

  drawMainForm() {
    // Campos principales del formulario
    this.doc.setFontSize(8);
    this.doc.text('EMPRESA QUIEN TRAE EL PRODUCTO SI APLICA', 12, 30);
    this.doc.rect(10, 27, 75, 9); // Línea horizontal

    this.doc.rect(10, 37, 75, 9); // Responsable que trae el producto
    this.doc.text('NOMBRE RESPONSABLE QUIEN TRAE EL PRODUCTO', 11, 40);
    
    this.doc.rect(90, 27, 85, 9); // factura a nombre de
    this.doc.text('FACTURAR A NOMBRE DE', 110, 30);

    this.doc.rect(90, 37, 85, 9); // Responsable que ordenó facturar
    this.doc.text('RESPONSABLE QUIEN ORDENÓ FACTURAR', 100, 40);

    this.doc.setFontSize(7);
    this.doc.rect(10, 47, 75, 15); // Responsable que trae el producto
    this.doc.text('TIEMPO PARA LA ENTREGA DEL PRODUCTO SUGERIDO POR', 10, 50);

    this.doc.text('CLIENTE', 11, 55);
    this.doc.rect(23, 53, 3, 3);

    this.doc.text('INDUSTRIAS Y GALVANIZADOS', 31, 55);
    this.doc.rect(70, 53, 3, 3);

    this.doc.setFont('helvetica', 'bold');
    this.doc.text('NOMBRE:', 11, 60);
    
  }

  drawTimeSection() {
    // Sección de tiempos
    this.doc.setFontSize(8);
    this.doc.rect(90, 47, 85, 30);
    
    // Campos de hora
    this.doc.text('HORA REPORTE LLEGADA', 92, 51);
    this.doc.text('HORA INICIO DESPACHO', 92, 58);
    this.doc.text('HORA FINAL DESPACHO Y SALIDA', 92, 65);

    // Campos de hora (inputw)
    this.doc.rect(141, 48, 33, 5);
    this.doc.rect(141, 55, 33, 5);
    this.doc.rect(141, 62, 33, 5);
    
    // Campos R/E
    this.doc.text('RECEPCIÓN ENTREGA', 92, 72);
    this.doc.rect(150, 69, 4, 4); // R
    this.doc.rect(160, 69, 4, 4); // E
    this.doc.text('R', 147, 72);
    this.doc.text('E', 157, 72);
  }

  drawProductTable() {
    // Tabla de productos
    this.doc.rect(10, 90, 275, 60);
    this.doc.setFontSize(8);
    this.doc.text('DESCRIPCIÓN DEL PRODUCTO Y OBSERVACIONES', 110, 95);

    // Columnas
    this.doc.text('LINEA', 12, 100);
    this.doc.line(40, 90, 40, 150); // Línea vertical
    this.doc.text('PROCESO REF.', 45, 100);
    this.doc.line(80, 90, 80, 150); // Línea vertical
    this.doc.text('CÓDIGO REF.', 85, 100);
  }

  async generatePDF(data = {}) {
    this.initDocument();
    await this.addLogo(); // Ahora addLogo es asíncrono
    this.drawHeader();
    this.drawChecklist();
    this.drawClientInfo();
    this.drawMainForm();
    this.drawTimeSection();
    this.drawProductTable();
    return this.doc;
  }

  savePDF(filename = 'recepcion-producto.pdf') {
    if (!this.doc) {
      throw new Error('Documento no inicializado');
    }
    this.doc.save(filename);
  }
}

export const pdfService = new PDFService();