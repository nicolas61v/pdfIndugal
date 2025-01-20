// services/pdf/components/PDFTableService.js
import { PDFBaseService } from '../base/PDFBaseService';
import { TABLE_CONFIG } from '../base/PDFConfig';

export class PDFTableService extends PDFBaseService {
  constructor() {
    super();
  }

  drawTable(doc) {
    this.doc = doc;
    this.drawTableHeader();
    this.drawTableBody();
    this.drawTableColumns();
    this.drawDetailsSection();
  }

  drawTableHeader() {
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10);
    this.doc.text('DESCRIPCIÓN DEL PRODUCTO Y OBSERVACIONES', 72, 68);
  }

  drawTableBody() {
    const { startY, rowHeight, numRows } = TABLE_CONFIG;

    // Dibuja las filas alternadas
    for (let i = 0; i < numRows; i++) {
      const y = startY + (i * rowHeight);
      if (i % 2 === 0) {
        this.doc.setFillColor(...TABLE_CONFIG.alternateColor);
        this.doc.rect(5, y, 285, rowHeight, 'F');
      }
    }

    this.drawTableBorders();
  }

  drawTableBorders() {
    this.doc.setLineWidth(0.3);
    this.doc.rect(5, 69, 285, 46);
    this.doc.line(5, 65, 190, 65);
    this.doc.line(5, 65, 5, 69);
  }

  drawTableColumns() {
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);

    TABLE_CONFIG.columns.forEach((column, index) => {
      const x = index === 0 ? 5 : 5 + TABLE_CONFIG.columns
        .slice(0, index)
        .reduce((acc, col) => acc + col.width, 0);
        
      this.doc.line(x, 65, x, 115);
      this.doc.text(column.header, x + 1, 68);
    });
  }

  drawDetailsSection() {
    this.drawDetailsHeader();
    this.drawDetailsColumns();
    this.drawDetailsFooter();
  }

  drawDetailsHeader() {
    this.doc.setFontSize(6);
    this.doc.setLineWidth(0.3);
    this.doc.line(190, 56, 290, 56);
    this.doc.line(190, 56, 190, 115);
  }

  drawDetailsColumns() {
    const columns = [
      { text: 'DOCUMENTO\nCLIENTE', x: 191, y: [59, 62] },
      { text: 'UNIDS', x: 207, y: [61] },
      { text: 'PESO\nBRUTO\nENTRADA', x: 217, y: [59, 62, 65] },
      { text: 'RECIPIENTES', x: 230, y: [60] },
      { text: 'UNID', x: 230, y: [65] },
      { text: 'PESO', x: 237, y: [65] },
      { text: 'PESO\nNETO\nENTRADA', x: 250, y: [59, 62, 65] },
      { text: 'PESO\nBRUTO\nSALIDA', x: 265, y: [59, 62, 65] },
      { text: 'PESO\nNETO\nSALIDA', x: 278, y: [59, 62, 65] }
    ];

    columns.forEach(column => {
      const texts = column.text.split('\n');
      texts.forEach((text, i) => {
        this.doc.text(text, column.x, column.y[i]);
      });
    });

    // Dibuja las líneas verticales
    [206, 215, 229, 235, 245, 260, 275, 290].forEach(x => {
      this.doc.line(x, 56, x, 115);
    });

    // Línea horizontal para recipientes
    this.doc.line(229, 62, 245, 62);
  }

  drawDetailsFooter() {
    this.doc.line(250, 53, 290, 53);
    this.doc.text('Código: F-IG-098 05042024', 255, 55);
    this.doc.line(250, 53, 250, 56);
    this.doc.line(290, 53, 290, 56);
  }

  // Método para dibujar datos de la tabla (usando Courier)
  drawTableData(doc, tableData) {
    if (!tableData?.items?.length) return;
    this.doc = doc;
    
    this.setFormInputStyle(); // Usa Courier para los datos
    
    tableData.items.forEach((item, index) => {
      const y = TABLE_CONFIG.startY + (index * TABLE_CONFIG.rowHeight) + 3;
      
      this.doc.text(item.linea?.toString() || '', 6, y);
      this.doc.text(item.procesoRef || '', 18, y);
      this.doc.text(item.codigoRef || '', 41, y);
      this.doc.text(item.descripcion || '', 61, y);
    });
    
    this.setDefaultStyles(); // Restaura estilos
  }
}