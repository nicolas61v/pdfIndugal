// services/pdf/components/PDFHeaderService.js
import { PDFBaseService } from '../base/PDFBaseService';

export class PDFHeaderService extends PDFBaseService {
  constructor() {
    super();
    this.logoPath = '/images/LOGO INDUGAL(1).png';
  }

  async addLogo(doc) {
    this.doc = doc;
    try {
      const logoUrl = `${window.location.origin}${this.logoPath}`;
      const imgData = await this.urlToBase64(logoUrl);
      const imgProps = this.doc.getImageProperties(imgData);
      const aspectRatio = imgProps.width / imgProps.height;
      
      const maxWidth = 55;
      const maxHeight = 30;
      let width = maxWidth;
      let height = width / aspectRatio;
      
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
      
      this.doc.addImage(imgData, 'PNG', 5, 5, width, height);
    } catch (error) {
      console.error('Error al cargar el logo:', error);
    }
  }

  drawHeader(doc) {
    this.doc = doc;
    this.setDefaultStyles();

    // Dirección
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(
      'MEDELLÍN Calle 36 No. 52-50 PBX: 4444-314 Auxiliar 232 59 57 CEL: 321760 81 74',
      67,
      5
    );

    // Título
    this.doc.setFontSize(11);
    this.doc.text('RECEPCIÓN DE PRODUCTO', 99, 9);

    // Advertencias en rojo
    this.doc.setTextColor(255, 0, 0);
    this.doc.setFontSize(7);
    this.drawWarningTexts();
    
    this.doc.setTextColor(0);
  }

  drawWarningTexts() {
    const warnings = [
      'PASADOS 2 DÍAS DE LA PROMESA DE ENTREGA NO SE RESPONDE POR INCONFORMIDAD POR',
      'DETERIORO EN NUESTROS PROCESOS Y PRODUCTO. SE COBRARÁ BODEGAJE A PARTIR DEL',
      '3er DÍA DE LA FECHA DE PROMESA DE ENTREGA.'
    ];
    
    let y = 12;
    warnings.forEach(text => {
      this.doc.text(text, 71, y);
      y += 3;
    });
  }
}