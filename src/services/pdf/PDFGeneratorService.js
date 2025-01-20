// services/pdf/PDFGeneratorService.js
import { PDFBaseService } from './base/PDFBaseService';
import { PDFHeaderService } from './components/PDFHeaderService';
import { PDFFormService } from './components/PDFFormService';
import { PDFTableService } from './components/PDFTableService';
import { PDFFooterService } from './components/PDFFooterService';

export class PDFGeneratorService extends PDFBaseService {
  constructor() {
    super();
    this.headerService = new PDFHeaderService();
    this.formService = new PDFFormService();
    this.tableService = new PDFTableService();
    this.footerService = new PDFFooterService();
  }

  async generatePDF(formData = {}) {
    try {
      const copies = await this.generateMultipleCopies(formData);
      const finalDoc = this.createFinalDocument();
      
      for (let i = 0; i < copies.length; i++) {
        if (i > 0) finalDoc.addPage();
        const pageContent = await this.loadPDFBlob(copies[i]);
        if (i === 0) {
          finalDoc.setPage(1);
          finalDoc.putTotalPages(pageContent);
        } else {
          finalDoc.putTotalPages(pageContent);
        }
      }

      return finalDoc;
    } catch (error) {
      console.error('Error generando PDF:', error);
      throw error;
    }
  }

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
      await this.generateSingleCopy(formData, title);
      copies.push(this.doc.output('blob'));
    }

    return copies;
  }

  async generateSingleCopy(formData, footerTitle) {
    // Generar estructura base
    await this.headerService.addLogo(this.doc);
    this.headerService.drawHeader(this.doc);
    
    // Dibujar componentes del formulario
    this.formService.drawForm(this.doc);
    this.formService.drawFormData(this.doc, formData); // Este usa Courier
    
    // Dibujar tabla y detalles
    this.tableService.drawTable(this.doc);
    
    // Agregar pie de página específico
    this.footerService.drawFooter(this.doc, footerTitle);
  }

  createFinalDocument() {
    return new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
  }
}

export const pdfService = new PDFGeneratorService();