// services/pdf/base/PDFBaseService.js
import { jsPDF } from 'jspdf';
import { 
  DOC_CONFIG, 
  TEXT_STYLES,
  LOGO_CONFIG 
} from './PDFConfig';

export class PDFBaseService {
  constructor() {
    this.doc = null;
  }

  /**
   * Inicializa un nuevo documento PDF con la configuración base
   */
  initDocument() {
    this.doc = new jsPDF({
      orientation: DOC_CONFIG.orientation,
      unit: DOC_CONFIG.unit,
      format: DOC_CONFIG.format
    });
    this.setDefaultStyles();
  }

  /**
   * Configura los estilos predeterminados del documento
   */
  setDefaultStyles() {
    this.doc.setLineWidth(DOC_CONFIG.lineWidth);
    this.doc.setDrawColor(0);
    this.applyTextStyle('base');
  }

  /**
   * Aplica un estilo de texto predefinido
   * @param {string} styleName - Nombre del estilo en TEXT_STYLES
   */
  applyTextStyle(styleName) {
    const style = TEXT_STYLES[styleName];
    if (!style) return;

    this.doc.setFont(style.font, style.style || 'normal');
    this.doc.setFontSize(style.size);
    
    if (Array.isArray(style.color)) {
      this.doc.setTextColor(...style.color);
    } else {
      this.doc.setTextColor(style.color);
    }
  }

  /**
   * Aplica el estilo específico para campos de formulario (Courier)
   */
  setFormInputStyle() {
    this.applyTextStyle('formInput');
  }

  /**
   * Convierte una URL a base64
   * @param {string} url - URL de la imagen
   * @returns {Promise<string>} - Imagen en formato base64
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
      console.error('Error convirtiendo URL a base64:', error);
      throw error;
    }
  }

  /**
   * Dibuja un texto con un estilo específico
   * @param {string} text - Texto a dibujar
   * @param {number} x - Posición X
   * @param {number} y - Posición Y
   * @param {string} styleName - Nombre del estilo a aplicar
   */
  drawStyledText(text, x, y, styleName) {
    this.applyTextStyle(styleName);
    this.doc.text(text, x, y);
    this.setDefaultStyles();
  }

  /**
   * Dibuja una línea horizontal
   * @param {number} startX - Posición inicial X
   * @param {number} endX - Posición final X
   * @param {number} y - Posición Y
   */
  drawHorizontalLine(startX, endX, y) {
    this.doc.line(startX, y, endX, y);
  }

  /**
   * Dibuja un rectángulo
   * @param {number} x - Posición X
   * @param {number} y - Posición Y
   * @param {number} width - Ancho
   * @param {number} height - Alto
   * @param {string} style - Estilo ('F' para relleno, 'S' para contorno)
   */
  drawRect(x, y, width, height, style = 'S') {
    this.doc.rect(x, y, width, height, style);
  }

  /**
   * Valida y limita el texto para evitar desbordamientos
   * @param {string} text - Texto a validar
   * @param {number} maxLength - Longitud máxima permitida
   * @returns {string} - Texto validado
   */
  validateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }

  /**
   * Genera un blob del documento actual
   * @returns {Blob} - Documento en formato blob
   */
  getDocumentBlob() {
    return this.doc.output('blob');
  }

  /**
   * Guarda el documento actual
   * @param {string} filename - Nombre del archivo
   */
  saveDocument(filename) {
    if (!this.doc) {
      throw new Error('Documento no inicializado');
    }
    this.doc.save(filename);
  }
}