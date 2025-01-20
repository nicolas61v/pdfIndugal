// services/pdf/components/PDFFooterService.js
import { PDFBaseService } from '../base/PDFBaseService';
import { COPIES_CONFIG } from '../base/PDFConfig';

export class PDFFooterService extends PDFBaseService {
  constructor() {
    super();
  }

  /**
   * Dibuja el pie de página específico para cada tipo de copia
   * @param {Object} doc - Instancia del documento PDF
   * @param {string} title - Título específico para esta copia
   * @param {Object} options - Opciones adicionales para el pie de página
   */
  drawFooter(doc, title, options = {}) {
    this.doc = doc;
    
    // Configura el estilo del pie de página
    const footerConfig = {
      ...COPIES_CONFIG.footerPosition,
      ...options
    };

    // Aplica el estilo específico para el pie de página
    this.doc.setFont(footerConfig.font, footerConfig.style);
    this.doc.setFontSize(footerConfig.size);

    // Dibuja el título centrado
    this.doc.text(title, 150, footerConfig.y, { 
      align: 'center'
    });

    // Dibuja elementos adicionales del pie de página si existen
    if (options.additionalElements) {
      this.drawAdditionalElements(options.additionalElements);
    }

    // Restaura los estilos por defecto
    this.setDefaultStyles();
  }

  /**
   * Dibuja elementos adicionales en el pie de página
   * @param {Array} elements - Array de elementos adicionales a dibujar
   */
  drawAdditionalElements(elements) {
    elements.forEach(element => {
      switch (element.type) {
        case 'text':
          this.drawFooterText(element);
          break;
        case 'line':
          this.drawFooterLine(element);
          break;
        case 'box':
          this.drawFooterBox(element);
          break;
        // Puedes añadir más tipos según necesites
      }
    });
  }

  /**
   * Dibuja texto adicional en el pie de página
   * @param {Object} textConfig - Configuración del texto
   */
  drawFooterText({ text, x, y, font, size, align }) {
    if (font) this.doc.setFont(font);
    if (size) this.doc.setFontSize(size);
    
    this.doc.text(text, x, y, { 
      align: align || 'left'
    });
  }

  /**
   * Dibuja una línea en el pie de página
   * @param {Object} lineConfig - Configuración de la línea
   */
  drawFooterLine({ startX, startY, endX, endY, width, color }) {
    if (width) this.doc.setLineWidth(width);
    if (color) this.doc.setDrawColor(...color);
    
    this.doc.line(startX, startY, endX, endY);
    
    // Restaura valores por defecto
    this.doc.setLineWidth(0.3);
    this.doc.setDrawColor(0);
  }

  /**
   * Dibuja un cuadro en el pie de página
   * @param {Object} boxConfig - Configuración del cuadro
   */
  drawFooterBox({ x, y, width, height, style, color }) {
    if (color) {
      if (style === 'fill') {
        this.doc.setFillColor(...color);
      } else {
        this.doc.setDrawColor(...color);
      }
    }
    
    this.doc.rect(x, y, width, height, style);
    
    // Restaura valores por defecto
    this.doc.setFillColor(0);
    this.doc.setDrawColor(0);
  }

  /**
   * Obtiene el título del pie de página según el índice
   * @param {number} index - Índice de la copia
   * @returns {string} Título correspondiente
   */
  getFooterTitle(index) {
    return COPIES_CONFIG.titles[index] || 'COPIA';
  }

  /**
   * Dibuja un pie de página personalizado con firma
   * @param {Object} doc - Instancia del documento PDF
   * @param {string} title - Título del pie de página
   * @param {Object} signatureInfo - Información de la firma
   */
  drawFooterWithSignature(doc, title, signatureInfo) {
    this.doc = doc;
    
    // Dibuja el título principal
    this.drawFooter(doc, title);
    
    // Dibuja la sección de firma
    if (signatureInfo) {
      const signY = COPIES_CONFIG.footerPosition.y + 10;
      
      // Línea para la firma
      this.drawFooterLine({
        startX: 100,
        startY: signY,
        endX: 200,
        endY: signY
      });
      
      // Texto debajo de la línea
      this.drawFooterText({
        text: signatureInfo.title || 'Firma Autorizada',
        x: 150,
        y: signY + 5,
        size: 8,
        align: 'center'
      });
      
      if (signatureInfo.name) {
        this.drawFooterText({
          text: signatureInfo.name,
          x: 150,
          y: signY + 10,
          size: 8,
          align: 'center'
        });
      }
    }
  }
}