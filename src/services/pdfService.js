// src/services/pdfService.js
import { jsPDF } from 'jspdf';

export class PDFService {
  constructor() {
    this.doc = null;
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

  drawHeader() {
    // Espacio del logo
    this.doc.rect(10, 5, 40, 20);

    // Texto del encabezado
    this.doc.setFontSize(10);
    this.doc.text(
      'MEDELLÍN Calle 36 No. 52-50 PBX: 4444-314 Auxiliar 232 59 57 CEL: 321760 81 74',
      55,
      10
    );

    // Título principal
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RECEPCIÓN DE PRODUCTO', 90, 20);

    // Texto adicional en rojo
    this.doc.setTextColor(255, 0, 0);
    this.doc.setFontSize(8);
    this.doc.text(
      'PASADOS 3 DÍAS DE LA PROMESA DE ENTREGA NO SE RESPONDE POR INCONFORMIDAD POR',
      55,
      25
    );
    this.doc.text(
      'DETERIORO EN NUESTROS PROCESOS Y PRODUCTO. SE COBRARÁ BODEGAJE A PARTIR DEL',
      55,
      29
    );
    this.doc.text('3er DÍA DE LA FECHA DE PROMESA DE ENTREGA.', 55, 33);
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

  drawMainForm() {
    // Campos principales del formulario
    this.doc.rect(10, 40, 130, 10); // Campo empresa
    this.doc.text('EMPRESA QUIEN TRAE EL PRODUCTO SI APLICA', 12, 45);

    this.doc.rect(10, 52, 70, 10); // Responsable que trae el producto
    this.doc.text('NOMBRE RESPONSABLE QUIEN TRAE EL PRODUCTO', 12, 57);

    this.doc.rect(90, 52, 50, 10); // Responsable que ordenó facturar
    this.doc.text('RESPONSABLE QUIEN ORDENÓ FACTURAR', 92, 57);

    // Fechas y horas
    this.doc.rect(10, 65, 50, 20);
    this.doc.text('HORA REPORTE LLEGADA', 12, 70);
    this.doc.text('HORA INICIO DESPACHO', 12, 75);
    this.doc.text('HORA FINAL DESPACHO Y SALIDA', 12, 80);

    // Recepción entrega
    this.doc.rect(65, 65, 20, 20);
    this.doc.text('RECEPCIÓN ENTREGA', 67, 70);
    this.doc.text('R', 67, 75);
    this.doc.text('E', 72, 75);
    this.doc.rect(66, 76, 4, 4); // Opción R
    this.doc.rect(71, 76, 4, 4); // Opción E
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

  generatePDF(data = {}) {
    this.initDocument();
    this.drawHeader();
    this.drawChecklist();
    this.drawMainForm();
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
