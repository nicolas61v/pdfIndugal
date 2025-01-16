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
      const maxWidth = 55;  // Aumentado 10mm (de 45 a 55)
      const maxHeight = 30; // Aumentado 5mm (de 25 a 30)
  
      // Calcular dimensiones finales manteniendo proporción
      let width = maxWidth;
      let height = width / aspectRatio;
  
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
  
      // Nueva posición del logo: 5mm a la izquierda y 5mm arriba
      const x = 5;
      const y = 5;
  
      // Agregar solo la imagen, sin el rectángulo
      this.doc.addImage(imgData, 'PNG', x, y, width, height);
    } catch (error) {
      console.error('Error al cargar el logo:', error);
      // En caso de error, no hacemos nada ya que eliminamos el rectángulo
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
    this.doc.text('producto para procesos debe venir', 247, 12);
    this.doc.text('documentado, especificando referencia', 247, 15);
    this.doc.text('o nombre de cada producto y proceso', 247, 18);
    this.doc.text('a aplicar unidades y/o kilogramos en lo', 247, 21);
    this.doc.text('posible fecha y hora de requerimiento', 247, 24);
    this.doc.text('de su producto terminado', 247, 27);
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
    this.doc.setFontSize(6);
    this.doc.text('FECHA :', 150, 21);
    this.doc.rect(160, 18, 32, 15);
    this.doc.text('HORA :', 150, 31);
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
    await this.addLogo();
    this.drawHeader();
    this.drawChecklist();
    this.drawClientInfo();
    this.drawMainForm();
    this.drawTimeSection();
    this.drawProductTable();
    this.drawFecha();
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