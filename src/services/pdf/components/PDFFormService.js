// services/pdf/components/PDFFormService.js
import { PDFBaseService } from '../base/PDFBaseService';
import { FORM_POSITIONS } from '../base/PDFConfig';

export class PDFFormService extends PDFBaseService {
  constructor() {
    super();
  }

  // Método principal que dibuja todo el formulario
  drawForm(doc) {
    this.doc = doc;
    this.drawMainForm();
    this.drawTimeSection();
    this.drawFecha();
  }

  // Dibuja la sección principal del formulario con campos de empresa y responsables
  drawMainForm() {
    this.doc.setFontSize(6);
    this.drawCompanySection();
    this.drawResponsibleSection();
    this.drawDeliveryTimeSection();
  }

  // Dibuja la sección de empresa
  drawCompanySection() {
    this.drawDownArrow(34, 23);
    this.doc.text('EMPRESA QUIEN TRAE EL PRODUCTO SI APLICA', 10, 21);
    this.doc.line(5, 27, 70, 27);

    this.doc.text('FACTURAR A NOMBRE DE', 100, 21);
    this.doc.line(77, 27, 150, 27);
    this.drawDownArrow(114, 23);
  }

  // Dibuja la sección de responsables
  drawResponsibleSection() {
    this.doc.text('NOMBRE RESPONSABLE QUIEN TRAE EL PRODUCTO', 8, 31);
    this.doc.line(5, 37, 70, 37);
    this.drawDownArrow(34, 33);

    this.doc.text('RESPONSABLE QUIEN ORDENÓ FACTURAR', 91, 31);
    this.doc.line(77, 37, 150, 37);
    this.drawDownArrow(114, 33);
  }

  // Dibuja la sección de tiempo de entrega
  drawDeliveryTimeSection() {
    this.doc.text('TIEMPO PARA LA ENTREGA DEL PRODUCTO SUGERIDO POR', 5, 41);
    this.doc.text('CLIENTE', 5, 45);
    this.doc.rect(15, 43, 3, 3);
    this.doc.text('INDUSTRIAS Y GALVANIZADOS', 27, 45);
    this.doc.rect(60, 43, 3, 3);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('NOMBRE:', 6, 52);
    this.doc.line(20, 52, 65, 52);
  }

  // Dibuja la sección de tiempo
  drawTimeSection() {
    this.doc.setFontSize(6);
    this.drawTimeFields();
    this.drawReceptionDeliverySection();
  }

  // Dibuja los campos de hora
  drawTimeFields() {
    const timeFields = [
      { label: 'HORA REPORTE LLEGADA', y: 42, rectY: 39 },
      { label: 'HORA INICIO DESPACHO', y: 48, rectY: 45 },
      { label: 'HORA FINAL DESPACHO Y SALIDA', y: 54, rectY: 51 }
    ];

    timeFields.forEach(field => {
      this.doc.text(field.label, 77, field.y);
      this.doc.rect(118, field.rectY, 28, 5);
    });
  }

  // Dibuja la sección de Recepción/Entrega
  drawReceptionDeliverySection() {
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

  // Dibuja los campos de fecha
  drawFecha() {
    this.drawDateSection(150, 22, 31, 160, 18, 33, 15);
    this.drawDateSection(150, 45, 53, 160, 41, 29.7, 13.5, true);
    this.drawCommitmentText();
  }

  // Método helper para dibujar secciones de fecha
  drawDateSection(labelX, dateY, timeY, rectX, rectY, width, height, isLower = false) {
    this.doc.setFontSize(6);
    this.doc.text('FECHA :', labelX, dateY);
    this.doc.text('HORA :', labelX, timeY);

    if (!isLower) {
      this.doc.text('DIA', 162, 20);
      this.doc.text('MES', 173, 20);
      this.doc.text('AÑO', 184, 20);
    } else {
      this.doc.text('DIA', 162, 43);
      this.doc.text('MES', 173, 43);
      this.doc.text('AÑO', 184, 43);
    }

    this.drawDateBox(rectX, rectY, width, height, isLower);
  }

  // Helper para dibujar la caja de fecha
  drawDateBox(x, y, width, height, isLower) {
    this.doc.rect(x, y, width, height);
    const yOffset = isLower ? 3 : 3;
    this.doc.line(x, y + yOffset, x + width, y + yOffset);

    if (!isLower) {
      this.doc.line(x, y, x, y + 9);
      this.doc.line(x + 11, y, x + 11, y + 9);
      this.doc.line(x + 22, y, x + 22, y + 9);
    } else {
      const divWidth = width / 3;
      this.doc.line(x, y, x, y + 8.5);
      this.doc.line(x + divWidth, y, x + divWidth, y + 8.5);
      this.doc.line(x + (divWidth * 2), y, x + (divWidth * 2), y + 8.5);
    }
  }

  // Dibuja el texto de compromiso
  drawCommitmentText() {
    this.doc.line(195, 40, 245, 40);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('compromiso    de    entrega', 200, 45);
    this.doc.text('del producto ya procesado', 200, 49);
    this.doc.text('y facturado', 200, 53);

    this.drawLeftArrow(192, 46);
  }

  // Helper para dibujar flechas
  drawDownArrow(x, y) {
    this.doc.setFillColor(128, 128, 128);
    this.doc.triangle(x, y, x - 1, y - 1, x + 1, y - 1);
    this.doc.setFillColor(0, 0, 0);
  }

  drawLeftArrow(x, y) {
    this.doc.setDrawColor(0, 0, 0);
    this.doc.setLineWidth(0.5);
    this.doc.line(x, y, x + 8, y);
    this.doc.line(x, y, x + 3, y - 2);
    this.doc.line(x, y, x + 3, y + 2);
  }

  // Dibuja los datos del formulario (usando Courier)
  drawFormData(doc, formData) {
    if (!formData) return;
    this.doc = doc;
    
    this.setFormInputStyle(); // Cambia a Courier para los datos del form
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value && FORM_POSITIONS[key]) {
        const pos = FORM_POSITIONS[key];
        this.doc.text(this.validateText(value, 40), pos.x, pos.y);
      }
    });
    
    this.setDefaultStyles(); // Restaura estilos por defecto
  }
}