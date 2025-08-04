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
        { 
            file: 'copiaCliente.jpg', 
            name: 'ORIGINAL - CLIENTE',
            sideText: 'ORIGINAL CLIENTE',
            color: [255, 0, 0] // ROJO
        },
        { 
            file: 'copiaUno.jpg', 
            name: 'COPIA - PRODUCCIÓN',
            sideText: 'COPIA VERDE - PRODUCCION',
            color: [255, 0, 0] // ROJO (todos en rojo)
        },
        { 
            file: 'copiaDos.jpg', 
            name: 'COPIA - FACTURACIÓN',
            sideText: 'COPIA AMARILLA - FACTURACION',
            color: [255, 0, 0] // ROJO (todos en rojo)
        },
        { 
            file: 'copiaTres.jpg', 
            name: 'COPIA - CONSECUTIVA',
            sideText: 'COPIA ROSA - CONSECUTIVA',
            color: [255, 0, 0] // ROJO (todos en rojo)
        }
    ];

    /** @type {string} Plantilla de la guía manual */
    static GUIDE_TEMPLATE = 'copiaGuia.jpg';

    /** @type {Object} Coordenadas configurables - AQUÍ AJUSTAS LAS POSICIONES */
    static COORDINATES = {
        // === INFORMACIÓN DE EMPRESA ===
        empresa: { x: 17, y: 32 },
        responsableTrae: { x: 17, y: 40 },
        facturarA: { x: 86, y: 32 },
        responsableFacturar: { x: 89, y: 40 },

        // === TIEMPO DE ENTREGA ===
        checkboxCliente: { x: 33.5, y: 53 },
        checkboxIndustrias: { x: 33.5, y: 58 },
        nombreTiempoEntrega: { x: 50, y: 56 },

        // === HORARIOS ===
        horaLlegada: { x: 132, y: 46 },
        horaInicio: { x: 132, y: 51 },
        horaFinal: { x: 132, y: 56 },

        // === ASPECTOS (CHECKBOXES) ===
        aspectos: {
            excesosGrasas: { x: 240, y: 15 },
            excesosOxidacion: { x: 240, y: 18 },
            excesosCalamina: { x: 240, y: 21 },
            pintura: { x: 240, y: 24 },
            recubrimientoBuque: { x: 240, y: 27 },
            stickers: { x: 240, y: 30 },
            soldaduraMalEscoriada: { x: 240, y: 32.5 },
            drenaje: { x: 240, y: 38.5 }
        },
        aspectosNo: {
            x: 246 // X para NO (todas usan la misma X)
        },
        otros: { x: 197, y: 46 },

        // === RECEPCIÓN/ENTREGA ===
        recepcionR: { x: 131, y: 60 },
        recepcionE: { x: 143, y: 60 },

        // === INFORMACIÓN DEL PRODUCTO ===
        linea: { x: 21, y: 71 },
        procesoRef: { x: 33, y: 71 },
        codigoRef: { x: 54, y: 71 },
        descripcion: { x: 65, y: 71 },
        

        // === FECHAS ===
        fechaSuperior: {
            dia: { x: 171, y: 33 },
            mes: { x: 180, y: 33 },
            año: { x: 188, y: 33 }
        },
        horaSuperior: { x: 177, y: 38 },
        fechaInferior: {
            dia: { x: 173.5, y: 51 },
            mes: { x: 181, y: 51 },
            año: { x: 187, y: 51 }
        },
        horaInferior: { x: 179, y: 55 },

        // === NÚMERO DE DOCUMENTO ===
        documentNumber: { x: 270, y: 52 },
        
        // === NÚMEROS DE DOCUMENTO ADICIONALES (3 POR CADA COPIA) ===
        // Altura del medio aproximada (y: 105)
        numerosAdicionales: {
            izquierda: { x: 85, y: 155 },    // Posición izquierda
            centro: { x: 175, y: 155 },      // Posición centro  
            derecha: { x: 265, y: 155 }      // Posición derecha
        },

        // === TEXTO LATERAL ROTADO ===
        textoLateral: {
            x: 7,       // Posición X 
            y: 125,     // Posición Y centrada verticalmente
            fontSize: 12,   // Tamaño de fuente
            rotation: 90    // ⚠️ EN GRADOS: 90° para texto vertical (según documentación oficial)
        }
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
     * 🎯 DIBUJA TEXTO ROTADO VERTICALMENTE EN EL LADO IZQUIERDO
     * @private
     * @param {string} text - Texto a mostrar
     * @param {Array} color - Color RGB [r, g, b]
     */
    drawSideText(text, color) {
        const coords = TemplatePdfService.COORDINATES.textoLateral;
        
        // Configurar estilo para texto lateral
        this.doc.setFont('times', 'bold');
        this.doc.setFontSize(coords.fontSize);
        this.doc.setTextColor(color[0], color[1], color[2]);
        
        // ✅ SINTAXIS OFICIAL DE jsPDF (según documentación)
        this.doc.text(text, coords.x, coords.y, { angle: coords.rotation });
        console.log(`✅ Texto rotado agregado con sintaxis oficial de jsPDF`);
        
        console.log(`📝 Texto lateral agregado: "${text}" en color RGB(${color.join(', ')}) en posición (${coords.x}, ${coords.y})`);
    }

    /**
     * Dibuja los datos del formulario sobre la plantilla
     * @private
     * @param {Object} formData - Datos del formulario
     * @param {number} copyIndex - Índice de la copia (0=cliente, 1=contabilidad, 2=producción, 3=archivo)
     */
    drawFormData(formData, copyIndex = 0) {
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

        // === RECEPCIÓN/ENTREGA (CHECKBOXES MÁS PEQUEÑOS) ===
        this.setCheckboxStyle(); // 🎯 Usar estilo pequeño para checkboxes
        
        // Marcar Recepción si está seleccionada
        if (formData.esRecepcion) {
            this.doc.text('X', coords.recepcionR.x, coords.recepcionR.y);
        }
        
        // Marcar Entrega si está seleccionada
        if (formData.esEntrega) {
            this.doc.text('X', coords.recepcionE.x, coords.recepcionE.y);
        }
        
        // Volver al estilo normal
        this.setUnifiedStyle(12);

        // === INFORMACIÓN DE PRODUCTOS MÚLTIPLES EN FILAS ===
        if (formData.productos && formData.productos.length > 0) {
            const espaciadoEntreProductos = 5; // 5px entre cada producto para salto de línea
            const maxProductosVisibles = 10; // Máximo de productos que caben en el PDF
            const maxWidthDescripcion = 32; // Ancho máximo para descripción en mm
            
            // Limitar productos mostrados para evitar sobreescritura
            const productosAMostrar = formData.productos.slice(0, maxProductosVisibles);
            
            productosAMostrar.forEach((producto, index) => {
                const offsetY = index * espaciadoEntreProductos; // Desplazamiento vertical para cada producto
                
                // Campo LÍNEA
                if (producto.linea) {
                    this.setUnifiedStyle(11); // 🔧 TAMAÑO LÍNEA: Cambia este número (9=pequeño, 12=normal, 14=grande)
                    this.doc.text(producto.linea, coords.linea.x, coords.linea.y + offsetY);
                }

                // Campo PROCESO
                if (producto.procesoRef) {
                    this.setUnifiedStyle(10); // 🔧 TAMAÑO PROCESO: Cambia este número 
                    this.doc.text(producto.procesoRef, coords.procesoRef.x, coords.procesoRef.y + offsetY);
                }

                // Campo CÓDIGO
                if (producto.codigoRef) {
                    this.setUnifiedStyle(10); // 🔧 TAMAÑO CÓDIGO: Cambia este número
                    this.doc.text(producto.codigoRef, coords.codigoRef.x, coords.codigoRef.y + offsetY);
                }

                // Descripción con manejo de texto controlado y truncamiento inteligente
                if (producto.descripcion) {
                    // 🔧 LIMPIAR saltos de línea para mantener orden
                    const descripcionLimpia = producto.descripcion
                        .replace(/\n/g, ' ')  // Reemplazar saltos de línea con espacios
                        .replace(/\r/g, ' ')  // Reemplazar retornos de carro con espacios
                        .replace(/\s+/g, ' ') // Reemplazar múltiples espacios con uno solo
                        .trim();              // Quitar espacios al inicio y final
                    
                    // 📏 CALCULAR LÍMITE REAL basado en el ancho disponible
                    const anchoDisponible = maxWidthDescripcion; // mm disponibles
                    const caracteresPorMM = 2.5; // Aproximado: caracteres que caben por mm
                    const maxCaracteres = Math.floor(anchoDisponible * caracteresPorMM);
                    
                    // Truncar si excede el límite
                    const textoFinal = descripcionLimpia.length > maxCaracteres 
                        ? descripcionLimpia.substring(0, maxCaracteres - 3) + '...' 
                        : descripcionLimpia;
                    
                    this.doc.text(textoFinal, coords.descripcion.x, coords.descripcion.y + offsetY);
                }
            });
            
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
            
            // === NÚMEROS ADICIONALES PARA COPIAS 1, 2 Y 3 (3 NÚMEROS POR COPIA) ===
            if (copyIndex >= 1 && copyIndex <= 3) {
                const numerosCoords = coords.numerosAdicionales;
                
                // Agregar número en posición izquierda
                this.doc.text(
                    formData.documentNumber.toString(),
                    numerosCoords.izquierda.x,
                    numerosCoords.izquierda.y,
                    { align: 'center' }
                );
                
                // Agregar número en posición centro
                this.doc.text(
                    formData.documentNumber.toString(),
                    numerosCoords.centro.x,
                    numerosCoords.centro.y,
                    { align: 'center' }
                );
                
                // Agregar número en posición derecha
                this.doc.text(
                    formData.documentNumber.toString(),
                    numerosCoords.derecha.x,
                    numerosCoords.derecha.y,
                    { align: 'center' }
                );
                
                console.log(`📄 3 números adicionales agregados en copia ${copyIndex}: izq(${numerosCoords.izquierda.x},${numerosCoords.izquierda.y}), centro(${numerosCoords.centro.x},${numerosCoords.centro.y}), der(${numerosCoords.derecha.x},${numerosCoords.derecha.y})`);
            }
            
            // Volver al tamaño estándar
            this.setUnifiedStyle(12);
        }

        // 🎯 AGREGAR TEXTO LATERAL ROTADO SEGÚN EL TIPO DE COPIA
        const template = TemplatePdfService.MAIN_TEMPLATES[copyIndex];
        console.log(`🔍 DEBUG: copyIndex=${copyIndex}, template=`, template);
        if (template) {
            console.log(`🎯 Agregando texto lateral: "${template.sideText}"`);
            this.drawSideText(template.sideText, template.color);
        } else {
            console.log('❌ No se encontró template para copyIndex:', copyIndex);
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

                // Agregar datos del formulario con estilo unificado y pasar índice de copia
                this.drawFormData(formData, i);
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