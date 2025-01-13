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
    this.doc.text('RECEPCIÓN DE PRODUCTO', 80, 10);

    // Texto adicional en rojo
    this.doc.setTextColor(255, 0, 0);
    this.doc.setFontSize(7);
    this.doc.text(
      'PASADOS 2 DÍAS DE LA PROMESA DE ENTREGA NO SE RESPONDE POR INCONFORMIDAD POR',
      55,
      15
    );
    this.doc.text(
      'DETERIORO EN NUESTROS PROCESOS Y PRODUCTO. SE COBRARÁ BODEGAJE A PARTIR DEL',
      55,
      19
    );
    this.doc.text('3er DÍA DE LA FECHA DE PROMESA DE ENTREGA.',
      55, 23);
    this.doc.setTextColor(0, 0, 0);
  }

  drawChecklist() {
    // Título del checklist
    this.doc.setFontSize(8);
    this.doc.text('Aspectos a considerar Si Aplica:', 200, 15);

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

    let y = 20;
    aspectos.forEach((aspecto) => {
      this.doc.text(aspecto, 200, y);

      // Cuadros de opciones SI/NO
      this.doc.rect(260, y - 3, 4, 4); // SI
      this.doc.text('SI', 265, y);
      this.doc.rect(270, y - 3, 4, 4); // NO
      this.doc.text('NO', 275, y);

      y += 5;
    });
  }

  drawTimeSection() {
    // Sección de tiempos
    this.doc.setFontSize(8);
    this.doc.rect(10, 60, 90, 30);
    
    // Campos de hora
    this.doc.text('HORA REPORTE LLEGADA', 12, 65);
    this.doc.text('HORA INICIO DESPACHO', 12, 72);
    this.doc.text('HORA FINAL DESPACHO Y SALIDA', 12, 79);
    
    // Líneas para las horas
    this.doc.line(60, 64, 80, 64);
    this.doc.line(60, 71, 80, 71);
    this.doc.line(60, 78, 80, 78);
    
    // Campos R/E
    this.doc.text('RECEPCIÓN ENTREGA', 12, 85);
    this.doc.rect(60, 82, 4, 4); // R
    this.doc.rect(70, 82, 4, 4); // E
    this.doc.text('R', 61, 85);
    this.doc.text('E', 71, 85);
  }

  drawMainForm() {
    // Campos principales del formulario
    this.doc.rect(10, 40, 130, 10); // Campo empresa
    this.doc.text('EMPRESA QUIEN TRAE EL PRODUCTO SI APLICA', 12, 45);

    this.doc.rect(10, 52, 70, 10); // Responsable que trae el producto
    this.doc.text('NOMBRE RESPONSABLE QUIEN TRAE EL PRODUCTO', 12, 57);

    this.doc.rect(90, 52, 50, 10); // Responsable que ordenó facturar
    this.doc.text('RESPONSABLE QUIEN ORDENÓ FACTURAR', 92, 57);
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