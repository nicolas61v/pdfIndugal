// src/services/templatePdfService.js
// VERSIÓN CON COLOR AZUL MARINO UNIFICADO Y FUENTE CONSISTENTE
import { jsPDF } from 'jspdf';

export class TemplatePdfService {
    /** @type {jsPDF} Instancia del documento PDF */
    doc = null;

    /** @type {Object} Configuración común del documento */
    static DOC_CONFIG = {
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    };

    /** @type {Array} Plantillas de las 4 copias principales */
    static MAIN_TEMPLATES = [
        { file: 'copiaCliente.jpg', name: 'ORIGINAL - CLIENTE' },
        { file: 'copiaUno.jpg', name: 'COPIA - CONTABILIDAD' },
        { file: 'copiaDos.jpg', name: 'COPIA - PRODUCCIÓN' },
        { file: 'copiaTres.jpg', name: 'COPIA - ARCHIVO' }
    ];

    /** @type {string} Plantilla de la guía manual */
    static GUIDE_TEMPLATE = 'copiaGuia.jpg';

    /** @type {Object} Coordenadas configurables - AQUÍ AJUSTAS LAS POSICIONES */
    static COORDINATES = {
        // === INFORMACIÓN DE EMPRESA ===
        empresa: { x: 25, y: 29 },
        responsableTrae: { x: 25, y: 36 },
        facturarA: { x: 93, y: 29 },
        responsableFacturar: { x: 98, y: 36 },

        // === TIEMPO DE ENTREGA ===
        checkboxCliente: { x: 39, y: 49 },
        checkboxIndustrias: { x: 39, y: 53 },
        nombreTiempoEntrega: { x: 55, y: 51 },

        // === HORARIOS ===
        horaLlegada: { x: 134, y: 42 },
        horaInicio: { x: 134, y: 47 },
        horaFinal: { x: 134, y: 52 },

        // === ASPECTOS (CHECKBOXES) ===
        aspectos: {
            excesosGrasas: { x: 239.5, y: 13 },
            excesosOxidacion: { x: 239.5, y: 16 },
            excesosCalamina: { x: 239.5, y: 19 },
            pintura: { x: 239.5, y: 22 },
            recubrimientoBuque: { x: 239.5, y: 25 },
            stickers: { x: 239.5, y: 28 },
            soldaduraMalEscoriada: { x: 239.5, y: 30.5 },
            drenaje: { x: 239.5, y: 35 }
        },
        aspectosNo: {
            x: 245.5 // X para NO (todas usan la misma X)
        },
        otros: { x: 200, y: 41 },

        // === RECEPCIÓN/ENTREGA ===
        recepcionR: { x: 134, y: 55 },
        recepcionE: { x: 144, y: 55 },

        // === INFORMACIÓN DEL PRODUCTO ===
        linea: { x: 24, y: 64 },
        procesoRef: { x: 35, y: 64 },
        codigoRef: { x: 54, y: 64 },
        descripcion: { x: 71, y: 64 },
        

        // === FECHAS ===
        fechaSuperior: {
            dia: { x: 173, y: 30 },
            mes: { x: 181, y: 30 },
            año: { x: 188, y: 30 }
        },
        horaSuperior: { x: 178, y: 35 },
        fechaInferior: {
            dia: { x: 174, y: 47 },
            mes: { x: 181, y: 47 },
            año: { x: 188, y: 47 }
        },
        horaInferior: { x: 179, y: 51 },

        // === NÚMERO DE DOCUMENTO ===
        documentNumber: { x: 270, y: 47 }
    };

    constructor() {
        this.doc = null;
    }

    /**
     * Inicializa un nuevo documento PDF
     * @private
     */
    initDocument() {
        this.doc = new jsPDF(TemplatePdfService.DOC_CONFIG);
        this.doc.setLineWidth(0.3);
        this.doc.setDrawColor(0);
    }

    /**
     * Optimiza imagen aprovechando el margen disponible para mejor calidad
     * @private
     * @async
     * @param {string} url - URL de la imagen
     * @returns {Promise<string>} Imagen optimizada en base64
     */
    async optimizeImageForSize(url) {
        try {
            console.log('🔄 Aprovechando margen disponible para MÁXIMA calidad:', url);

            const response = await fetch(url);
            const blob = await response.blob();

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            return new Promise((resolve, reject) => {
                img.onload = () => {
                    // Como solo pesa 700KB, podemos aumentar MUCHO la calidad
                    const targetWidth = 1600;   // Resolución alta para calidad premium
                    const targetHeight = 1131;  // Proporcional A4 landscape

                    canvas.width = targetWidth;
                    canvas.height = targetHeight;

                    // Fondo blanco para mejor contraste
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, targetWidth, targetHeight);

                    // Configuración PREMIUM para máxima calidad
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';

                    // Dibujar imagen en alta resolución
                    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                    // JPEG con calidad muy alta ya que tenemos margen de peso
                    const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.92); // 92% calidad muy alta

                    const sizeKB = Math.round((optimizedBase64.length * 0.75) / 1024);
                    console.log(`📦 CALIDAD PREMIUM: ${targetWidth}x${targetHeight}px, ~${sizeKB}KB (92% calidad máxima)`);

                    resolve(optimizedBase64);
                };

                img.onerror = reject;
                img.src = URL.createObjectURL(blob);
            });
        } catch (error) {
            console.error('❌ Error optimizando imagen:', error);
            throw new Error(`Error al optimizar imagen: ${error.message}`);
        }
    }

    /**
     * Agrega una plantilla optimizada como imagen de fondo
     * @private
     * @async
     * @param {string} templateFile - Nombre del archivo de plantilla
     */
    async addTemplateBackground(templateFile) {
        try {
            const templateUrl = `${window.location.origin}/${templateFile}`;
            console.log(`🎨 Cargando plantilla ligera: ${templateFile}`);

            const imgData = await this.optimizeImageForSize(templateUrl);

            // Agregar imagen con configuración de compresión máxima
            this.doc.addImage(
                imgData,
                'JPEG',     // Formato comprimido
                0, 0,       // Posición
                297, 210,   // Tamaño A4 landscape
                undefined,  // alias
                'FAST'      // Compresión rápida
            );

            console.log(`✅ Plantilla ${templateFile} agregada (optimizada)`);

        } catch (error) {
            console.error('❌ Error al cargar template optimizado:', error);
            throw error;
        }
    }

    /**
     * 🎯 ESTILO UNIFICADO - TODO EN AZUL MARINO CON TIMES BOLD
     * @private
     * @param {number} fontSize - Tamaño de fuente (por defecto 12)
     */
    setUnifiedStyle(fontSize = 12) {
        // FUENTE Y COLOR UNIFICADO PARA TODO
        this.doc.setFont('times', 'bold');           // Times Bold para todo
        this.doc.setFontSize(fontSize);              // Tamaño configurable
        this.doc.setTextColor(25, 25, 112);          // AZUL MARINO para todo
    }

    /**
     * 🎯 ESTILO PARA CHECKBOXES - MÁS PEQUEÑO PARA QUE QUEPA
     * @private
     */
    setCheckboxStyle() {
        // CHECKBOXES MÁS PEQUEÑOS PERO MISMO COLOR Y FUENTE
        this.doc.setFont('times', 'bold');           // Times Bold consistente
        this.doc.setFontSize(9);                     // 🔧 TAMAÑO REDUCIDO para checkboxes
        this.doc.setTextColor(25, 25, 112);          // AZUL MARINO consistente
    }

    /**
     * Dibuja los datos del formulario sobre la plantilla
     * @private
     * @param {Object} formData - Datos del formulario
     */
    drawFormData(formData) {
        if (!formData) return;

        console.log('✍️ Dibujando datos con estilo UNIFICADO azul marino');

        const coords = TemplatePdfService.COORDINATES;

        // 🎯 CONFIGURAR ESTILO UNIFICADO AL INICIO
        this.setUnifiedStyle(12); // Tamaño estándar

        // === INFORMACIÓN DE EMPRESA ===
        if (formData.empresa) {
            this.doc.text(formData.empresa, coords.empresa.x, coords.empresa.y);
        }

        if (formData.responsableTrae) {
            this.doc.text(formData.responsableTrae, coords.responsableTrae.x, coords.responsableTrae.y);
        }

        if (formData.facturarA) {
            this.doc.text(formData.facturarA, coords.facturarA.x, coords.facturarA.y);
        }

        if (formData.responsableFacturar) {
            this.doc.text(formData.responsableFacturar, coords.responsableFacturar.x, coords.responsableFacturar.y);
        }

        // === TIEMPO DE ENTREGA (CHECKBOXES MÁS PEQUEÑOS) ===
        if (formData.tiempoEntregaPor) {
            // 🎯 Usar estilo específico para checkboxes (más pequeño)
            this.setCheckboxStyle();
            if (formData.tiempoEntregaPor === 'cliente') {
                this.doc.text('X', coords.checkboxCliente.x, coords.checkboxCliente.y);
            } else if (formData.tiempoEntregaPor === 'industrias') {
                this.doc.text('X', coords.checkboxIndustrias.x, coords.checkboxIndustrias.y);
            }
            // Volver al estilo normal
            this.setUnifiedStyle(12);
        }

        // Nombre de quien sugiere el tiempo
        if (formData.nombreTiempoEntrega) {
            this.doc.text(formData.nombreTiempoEntrega, coords.nombreTiempoEntrega.x, coords.nombreTiempoEntrega.y);
        }

        // === HORARIOS (TODOS EN AZUL MARINO) ===
        if (formData.horaLlegada) {
            this.doc.text(formData.horaLlegada, coords.horaLlegada.x, coords.horaLlegada.y);
        }

        if (formData.horaInicio) {
            this.doc.text(formData.horaInicio, coords.horaInicio.x, coords.horaInicio.y);
        }

        if (formData.horaFinal) {
            this.doc.text(formData.horaFinal, coords.horaFinal.x, coords.horaFinal.y);
        }

        // === CHECKBOXES DE ASPECTOS (MÁS PEQUEÑOS PARA QUE QUEPAN) ===
        this.setCheckboxStyle(); // 🎯 Activar estilo pequeño para checkboxes
        
        const aspectosFields = [
            'excesosGrasas', 'excesosOxidacion', 'excesosCalamina', 'pintura',
            'recubrimientoBuque', 'stickers', 'soldaduraMalEscoriada', 'drenaje'
        ];

        aspectosFields.forEach((field) => {
            const aspectCoord = coords.aspectos[field];
            if (aspectCoord) {
                if (formData[field]) {
                    // Si está marcado, poner X en SI
                    this.doc.text('X', aspectCoord.x, aspectCoord.y);
                } else {
                    // Si no está marcado, poner X en NO
                    this.doc.text('X', coords.aspectosNo.x, aspectCoord.y);
                }
            }
        });
        
        // Volver al estilo normal después de los checkboxes
        this.setUnifiedStyle(12);

        // === RECEPCIÓN/ENTREGA (CHECKBOX MÁS PEQUEÑO) ===
        if (formData.recepcionEntrega) {
            this.setCheckboxStyle(); // 🎯 Usar estilo pequeño para checkbox
            const isRecepcion = formData.recepcionEntrega === 'R';
            const coordToUse = isRecepcion ? coords.recepcionR : coords.recepcionE;
            this.doc.text('X', coordToUse.x, coordToUse.y);
            // Volver al estilo normal
            this.setUnifiedStyle(12);
        }

        // === INFORMACIÓN DEL PRODUCTO ===
        // Campo LÍNEA con letra más pequeña
        if (formData.linea) {
            this.setUnifiedStyle(9); // 🔧 TAMAÑO REDUCIDO solo para línea
            this.doc.text(formData.linea, coords.linea.x, coords.linea.y);
            this.setUnifiedStyle(12); // Volver al tamaño normal
        }

        // Resto de campos con tamaño normal
        if (formData.procesoRef) {
            this.doc.text(formData.procesoRef, coords.procesoRef.x, coords.procesoRef.y);
        }

        if (formData.codigoRef) {
            this.doc.text(formData.codigoRef, coords.codigoRef.x, coords.codigoRef.y);
        }

        // Descripción con manejo de texto largo
        if (formData.descripcion) {
            const maxWidth = 140;
            const lines = this.doc.splitTextToSize(formData.descripcion, maxWidth);
            this.doc.text(lines, coords.descripcion.x, coords.descripcion.y);
        }

        // Otros aspectos
        if (formData.otros) {
            this.doc.text(formData.otros, coords.otros.x, coords.otros.y);
        }

        // === FECHAS Y HORAS (TODAS EN AZUL MARINO) ===
        // Fecha superior
        if (formData.fechaSuperior) {
            const fecha = new Date(formData.fechaSuperior);
            const dia = fecha.getDate().toString().padStart(2, '0');
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
            const año = fecha.getFullYear();

            this.doc.text(dia, coords.fechaSuperior.dia.x, coords.fechaSuperior.dia.y);
            this.doc.text(mes, coords.fechaSuperior.mes.x, coords.fechaSuperior.mes.y);
            this.doc.text(año.toString(), coords.fechaSuperior.año.x, coords.fechaSuperior.año.y);
        }

        if (formData.horaSuperior) {
            this.doc.text(formData.horaSuperior, coords.horaSuperior.x, coords.horaSuperior.y);
        }

        // Fecha inferior (compromiso)
        if (formData.fechaInferior) {
            const fecha = new Date(formData.fechaInferior);
            const dia = fecha.getDate().toString().padStart(2, '0');
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
            const año = fecha.getFullYear();

            this.doc.text(dia, coords.fechaInferior.dia.x, coords.fechaInferior.dia.y);
            this.doc.text(mes, coords.fechaInferior.mes.x, coords.fechaInferior.mes.y);
            this.doc.text(año.toString(), coords.fechaInferior.año.x, coords.fechaInferior.año.y);
        }

        if (formData.horaInferior) {
            this.doc.text(formData.horaInferior, coords.horaInferior.x, coords.horaInferior.y);
        }

        // === NÚMERO DE DOCUMENTO (EN AZUL MARINO PERO MÁS GRANDE) ===
        if (formData.documentNumber) {
            // 🎯 Usar el mismo estilo pero con tamaño más grande
            this.setUnifiedStyle(16); // Tamaño más grande para el número
            this.doc.text(
                formData.documentNumber.toString(),
                coords.documentNumber.x,
                coords.documentNumber.y,
                { align: 'center' }
            );
            // Volver al tamaño estándar
            this.setUnifiedStyle(12);
        }

        console.log('✅ Todos los elementos dibujados en AZUL MARINO unificado');
    }

    /**
     * Genera el PDF principal con las 4 copias optimizadas
     * @async
     * @param {Object} formData - Datos del formulario
     * @returns {Promise<jsPDF>} Documento PDF con las 4 copias
     */
    async generateMainPDF(formData = {}) {
        try {
            console.log('🚀 Iniciando generación de PDF con estilo UNIFICADO azul marino...');
            this.initDocument();

            for (let i = 0; i < TemplatePdfService.MAIN_TEMPLATES.length; i++) {
                if (i > 0) this.doc.addPage();

                const template = TemplatePdfService.MAIN_TEMPLATES[i];
                console.log(`🎨 Procesando ${template.name} con estilo unificado...`);

                // Agregar fondo de plantilla optimizada
                await this.addTemplateBackground(template.file);

                // Agregar datos del formulario con estilo unificado
                this.drawFormData(formData);
            }

            console.log('✅ PDF con estilo UNIFICADO generado exitosamente');
            return this.doc;
        } catch (error) {
            console.error('❌ Error generando PDF con estilo unificado:', error);
            throw error;
        }
    }

    /**
     * Genera el PDF de la guía manual optimizado
     * @async
     * @returns {Promise<jsPDF>} Documento PDF de la guía
     */
    async generateGuidePDF() {
        try {
            console.log('📋 Generando PDF de guía con estilo unificado...');
            this.initDocument();

            // Solo agregar la plantilla de texto optimizada
            await this.addTemplateBackground(TemplatePdfService.GUIDE_TEMPLATE);

            console.log('✅ PDF de guía con estilo unificado generado exitosamente');
            return this.doc;
        } catch (error) {
            console.error('❌ Error generando PDF de guía:', error);
            throw error;
        }
    }

    /**
     * Guarda el PDF con el nombre especificado
     * @param {string} filename - Nombre del archivo
     */
    savePDF(filename = 'documento.pdf') {
        if (!this.doc) {
            throw new Error('Documento no inicializado');
        }
        console.log(`💾 Guardando PDF con estilo unificado: ${filename}`);
        this.doc.save(filename);
    }
}

// Instancia única del servicio
export const templatePdfService = new TemplatePdfService();