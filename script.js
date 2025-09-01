// Funcionalidad del menú hamburguesa moderno
class MobileMenu {
    constructor() {
        this.hamburgerBtn = document.querySelector('.hamburger-btn');
        this.navMobile = document.querySelector('.nav-mobile');
        this.mobileOverlay = document.querySelector('.mobile-overlay');
        this.closeMenuBtn = document.querySelector('.close-menu');
        this.header = document.querySelector('.header');
        this.body = document.body;
        
        this.isOpen = false;
        this.init();
    }
    
    init() {
        if (!this.hamburgerBtn || !this.navMobile || !this.mobileOverlay) {
            console.warn('Elementos del menú móvil no encontrados');
            return;
        }
        
        // Event listeners
        this.hamburgerBtn.addEventListener('click', () => this.toggleMenu());
        this.closeMenuBtn?.addEventListener('click', () => this.closeMenu());
        this.mobileOverlay.addEventListener('click', () => this.closeMenu());
        
        // Cerrar menú al hacer click en enlaces
        document.querySelectorAll('.nav-menu-mobile a').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Prevenir scroll del body cuando el menú está abierto
        this.navMobile.addEventListener('touchmove', (e) => {
            if (this.isOpen) {
                e.stopPropagation();
            }
        });
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isOpen = true;
        this.hamburgerBtn.classList.add('active');
        this.hamburgerBtn.setAttribute('aria-expanded', 'true');
        this.navMobile.classList.add('active');
        this.mobileOverlay.classList.add('active');
        this.body.style.overflow = 'hidden';
        
        // Focus en el primer enlace del menú para accesibilidad
        setTimeout(() => {
            const firstLink = this.navMobile.querySelector('a');
            if (firstLink) firstLink.focus();
        }, 300);
    }
    
    closeMenu() {
        this.isOpen = false;
        this.hamburgerBtn.classList.remove('active');
        this.hamburgerBtn.setAttribute('aria-expanded', 'false');
        this.navMobile.classList.remove('active');
        this.mobileOverlay.classList.remove('active');
        this.body.style.overflow = '';
    }
}

// Inicializar menú móvil cuando el DOM esté listo
let mobileMenu;
document.addEventListener('DOMContentLoaded', () => {
    mobileMenu = new MobileMenu();
});

// Funcionalidad para botones "Solicitar un Mensajero"
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-primary') || e.target.closest('.btn-primary')) {
        e.preventDefault();
        // Cerrar menú móvil si está abierto
        if (mobileMenu && mobileMenu.isOpen) {
            mobileMenu.closeMenu();
        }
        // Redirigir a la página de contacto o abrir WhatsApp
        window.location.href = 'contacto.html';
    }
});

// Scroll suave para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Efecto de scroll en el header
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--white)';
        header.style.backdropFilter = 'none';
    }
});

// Animaciones al hacer scroll (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animaciones
document.querySelectorAll('.service-card, .benefit-item, .testimonial, .pricing-card').forEach(el => {
    observer.observe(el);
});

// Validación y envío del formulario
const orderForm = document.getElementById('orderForm');
if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(this);
        const data = {
            nombre: formData.get('nombre'),
            telefono: formData.get('telefono'),
            retiro: formData.get('retiro'),
            entrega: formData.get('entrega'),
            servicio: formData.get('servicio')
        };
        
        // Validación básica
        if (!data.nombre || !data.telefono || !data.retiro || !data.entrega || !data.servicio) {
            showNotification('Por favor, complete todos los campos', 'error');
            return;
        }
        
        // Validar teléfono (formato argentino básico)
        const phoneRegex = /^[+]?[0-9\s\-\(\)]{8,}$/;
        if (!phoneRegex.test(data.telefono)) {
            showNotification('Por favor, ingrese un número de teléfono válido', 'error');
            return;
        }
        
        // Enviar formulario
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        
        // Mostrar notificación de procesamiento
        showNotification('📤 Enviando solicitud...', 'info');
        
        // Send form data
        // Use simulated version for development, switch to real version when APIs are configured
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        
        const sendPromise = isProduction ? 
            sendToEmailOrSheets(data) : 
            sendToEmailOrSheetsSimulated(data);
            
        sendPromise.then(result => {
            console.log('📧 Resultado del envío:', result);
            
            if (result.success) {
                showNotification('✅ ¡Solicitud enviada correctamente! Te contactaremos pronto.', 'success');
                this.reset();
                
                // Generate WhatsApp message and offer to open
                setTimeout(() => {
                    const whatsappUrl = generateWhatsAppMessage(data);
                    if (confirm('¿Deseas abrir WhatsApp para confirmar tu pedido?')) {
                        window.open(whatsappUrl, '_blank');
                    }
                }, 2000);
            } else {
                showNotification('❌ ' + (result.message || 'Error al enviar la solicitud. Por favor, intenta nuevamente.'), 'error');
                
                // Offer WhatsApp as backup
                setTimeout(() => {
                    if (confirm('Hubo un problema al enviar el formulario. ¿Deseas contactarnos directamente por WhatsApp?')) {
                        const whatsappUrl = generateWhatsAppMessage(data);
                        window.open(whatsappUrl, '_blank');
                    }
                }, 3000);
            }
        }).catch(error => {
            console.error('❌ Error al enviar formulario:', error);
            showNotification('❌ Error al enviar la solicitud. Por favor, intenta nuevamente.', 'error');
            
            // Offer WhatsApp as backup
            setTimeout(() => {
                if (confirm('Hubo un problema al enviar el formulario. ¿Deseas contactarnos directamente por WhatsApp?')) {
                    const whatsappUrl = generateWhatsAppMessage(data);
                    window.open(whatsappUrl, '_blank');
                }
            }, 2000);
        }).finally(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        });
    });
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: auto;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Cerrar notificación
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto cerrar después de 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// WHATSAPP_CONFIG se importa desde config.js

// Inicializar EmailJS cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Verificando configuración de EmailJS...');
    console.log('📧 EmailJS disponible:', typeof emailjs !== 'undefined');
    console.log('🔑 Public Key configurado:', EMAILJS_CONFIG.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY');
    
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('✅ EmailJS inicializado correctamente');
        console.log('📨 Los emails se enviarán a:', EMAILJS_CONFIG.toEmail);
    } else {
        console.warn('⚠️ EmailJS NO CONFIGURADO - usando modo simulado');
        console.log('📖 Lee CONFIGURACION_EMAIL.md para configurar EmailJS');
        console.log('🎭 Modo actual: SIMULADO (no se envían emails reales)');
    }
    
    // Mostrar estado del entorno
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    console.log('🌍 Entorno:', isProduction ? 'PRODUCCIÓN' : 'DESARROLLO');
});

// Email/Google Sheets Integration Configuration
const EMAIL_SHEETS_CONFIG = {
    // EmailJS Configuration (replace with your actual keys)
    emailjs: {
        serviceId: 'YOUR_EMAILJS_SERVICE_ID',
        templateId: 'YOUR_EMAILJS_TEMPLATE_ID',
        publicKey: 'YOUR_EMAILJS_PUBLIC_KEY'
    },
    // Google Sheets Configuration (replace with your actual endpoint)
    googleSheets: {
        scriptUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
        sheetName: 'MotoExpress_Pedidos'
    },
    // Backup email configuration
    backupEmail: 'lugones.i.1992@gmail.com'
};

// Email/Google Sheets Integration Functions
async function sendToEmail(formData) {
    try {
        // Check if EmailJS is loaded
        if (typeof emailjs !== 'undefined') {
            const templateParams = {
                to_email: EMAILJS_CONFIG.toEmail,
                from_name: formData.nombre || 'Cliente',
                from_email: formData.email || 'No proporcionado',
                phone: formData.telefono || 'No proporcionado',
                company: formData.empresa || 'No especificada',
                pickup_address: formData.retiro || 'No especificada',
                pickup_contact: formData.contacto_retiro || 'No especificado',
                delivery_address: formData.entrega || 'No especificada',
                delivery_contact: formData.contacto_entrega || 'No especificado',
                service_type: formData.servicio || 'No especificado',
                urgency: formData.urgencia || 'Normal',
                package_description: formData.descripcion_paquete || 'No especificado',
                package_weight: formData.peso || '0',
                package_value: formData.valor || '0',
                preferred_time: formData.horario_preferido || 'Sin preferencia',
                message: formData.comentarios || 'Sin comentarios adicionales',
                origin: formData.origen || 'Sitio web',
                timestamp: new Date().toLocaleString('es-AR')
            };
            
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                templateParams,
                EMAILJS_CONFIG.publicKey
            );
            
            return {
                success: true,
                message: 'Email enviado correctamente',
                data: response
            };
        } else {
            throw new Error('EmailJS no está cargado');
        }
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            message: 'Error al enviar email: ' + error.message
        };
    }
}

async function sendToGoogleSheets(formData) {
    try {
        const payload = {
            timestamp: new Date().toISOString(),
            nombre: formData.nombre || '',
            telefono: formData.telefono || '',
            retiro: formData.retiro || '',
            entrega: formData.entrega || '',
            servicio: formData.servicio || '',
            mensaje: formData.mensaje || '',
            estado: 'Nuevo',
            origen: 'Website'
        };
        
        const response = await fetch(EMAIL_SHEETS_CONFIG.googleSheets.scriptUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        return {
            success: true,
            message: 'Datos guardados en Google Sheets',
            data: result
        };
    } catch (error) {
        console.error('Error sending to Google Sheets:', error);
        return {
            success: false,
            message: 'Error al guardar en Google Sheets: ' + error.message
        };
    }
}

// Main integration function
async function sendToEmailOrSheets(formData) {
    const results = {
        email: null,
        sheets: null,
        success: false,
        message: ''
    };
    
    // Try to send to both email and Google Sheets
    const promises = [
        sendToEmail(formData),
        sendToGoogleSheets(formData)
    ];
    
    try {
        const [emailResult, sheetsResult] = await Promise.allSettled(promises);
        
        results.email = emailResult.status === 'fulfilled' ? emailResult.value : { success: false, message: emailResult.reason };
        results.sheets = sheetsResult.status === 'fulfilled' ? sheetsResult.value : { success: false, message: sheetsResult.reason };
        
        // Consider successful if at least one method works
        results.success = results.email.success || results.sheets.success;
        
        if (results.success) {
            results.message = 'Solicitud enviada correctamente';
            if (results.email.success && results.sheets.success) {
                results.message += ' (Email y Google Sheets)';
            } else if (results.email.success) {
                results.message += ' (Email)';
            } else {
                results.message += ' (Google Sheets)';
            }
        } else {
            results.message = 'Error al enviar la solicitud. Por favor, contacte directamente por WhatsApp.';
        }
        
        return results;
    } catch (error) {
        console.error('Error in sendToEmailOrSheets:', error);
        return {
            success: false,
            message: 'Error al procesar la solicitud. Por favor, contacte directamente por WhatsApp.',
            error: error.message
        };
    }
}

// Simulated version for development/testing
function sendToEmailOrSheetsSimulated(formData) {
    console.log('🎭 MODO SIMULADO ACTIVADO');
    console.log('❌ NO SE ENVÍAN EMAILS REALES');
    console.log('📋 Datos del formulario:', formData);
    
    // Mostrar notificación de procesamiento
    showNotification('⚠️ MODO SIMULADO: Procesando (no se envían emails reales)...', 'info');
    
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate random success/failure for testing
            const success = Math.random() > 0.1; // 90% success rate
            const timestamp = new Date().toLocaleString('es-AR');
            
            console.log('📊 Resultado simulado:', {
                success,
                timestamp,
                formData,
                note: 'ESTO ES UNA SIMULACIÓN - NO SE ENVIÓ EMAIL REAL'
            });
            
            const result = {
                success: success,
                message: success ? 
                    `🎭 SIMULACIÓN EXITOSA (NO se envió email real)\n\n⚠️ Para recibir emails reales:\n1. Lee el archivo CONFIGURACION_EMAIL.md\n2. Configura EmailJS con credenciales reales\n\n🕒 Simulado el: ${timestamp}` : 
                    `🎭 ERROR SIMULADO (esto es solo una prueba)\n\n⚠️ Para recibir emails reales:\n1. Lee el archivo CONFIGURACION_EMAIL.md\n2. Configura EmailJS\n\n🕒 ${timestamp}`,
                email: { success: success },
                sheets: { success: success },
                timestamp: new Date().toISOString()
            };
            
            console.log('📧 Resultado simulado:', result);
            resolve(result);
        }, 1500);
    });
}

// Make functions available globally
window.sendToEmailOrSheets = sendToEmailOrSheets;
window.sendToEmailOrSheetsSimulated = sendToEmailOrSheetsSimulated;

// Generar mensaje de WhatsApp
function generateWhatsAppMessage(data) {
    const message = `¡Hola! Quiero solicitar un servicio de mensajería:

` +
        `👤 Nombre: ${data.nombre}\n` +
        `📞 Teléfono: ${data.telefono}\n` +
        `📍 Retiro: ${data.retiro}\n` +
        `📍 Entrega: ${data.entrega}\n` +
        `⚡ Servicio: ${data.servicio}\n\n` +
        `¡Gracias!`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(message)}`;
    return whatsappUrl;
}

// Función para abrir WhatsApp directamente
function openWhatsApp(message = '') {
    const defaultMessage = message || '¡Hola! Me interesa conocer más sobre sus servicios de mensajería.';
    const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappUrl, '_blank');
}

// Crear botón flotante de WhatsApp
function createWhatsAppButton() {
    const whatsappBtn = document.createElement('div');
    whatsappBtn.id = 'whatsapp-float';
    whatsappBtn.innerHTML = `
        <div class="whatsapp-icon">
            <i class="fab fa-whatsapp"></i>
        </div>
        <div class="whatsapp-tooltip">¡Chatea con nosotros!</div>
    `;
    
    whatsappBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: #25d366;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
    `;
    
    whatsappBtn.addEventListener('click', () => {
        if (isBusinessHours()) {
            openWhatsApp();
        } else {
            showChatbot();
        }
    });
    
    whatsappBtn.addEventListener('mouseenter', () => {
        whatsappBtn.style.transform = 'scale(1.1)';
        whatsappBtn.querySelector('.whatsapp-tooltip').style.opacity = '1';
    });
    
    whatsappBtn.addEventListener('mouseleave', () => {
        whatsappBtn.style.transform = 'scale(1)';
        whatsappBtn.querySelector('.whatsapp-tooltip').style.opacity = '0';
    });
    
    document.body.appendChild(whatsappBtn);
}

// Verificar horario comercial
function isBusinessHours() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = domingo, 6 = sábado
    
    // Lunes a viernes
    if (day >= 1 && day <= 5) {
        return hour >= WHATSAPP_CONFIG.businessHours.start && hour < WHATSAPP_CONFIG.businessHours.end;
    }
    // Sábados (horario reducido)
    if (day === 6) {
        return hour >= 9 && hour < 14;
    }
    // Domingos cerrado
    return false;
}

// Funcionalidad para botones "Solicitar un Mensajero" y "Pedir ahora"
document.querySelectorAll('.btn-primary, .btn-hero').forEach(button => {
    if (button.textContent.includes('Solicitar') || button.textContent.includes('Pedir')) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const contactSection = document.getElementById('contacto');
            if (contactSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = contactSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Enfocar el primer campo del formulario
                setTimeout(() => {
                    const firstInput = contactSection.querySelector('input');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 500);
            }
        });
    }
});

// Efecto parallax sutil en el hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Contador animado para estadísticas (si se agregan en el futuro)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Lazy loading para imágenes (si se agregan)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Funcionalidad para cambiar precios según la zona (futuro)
function updatePricing(zone) {
    const pricingCards = document.querySelectorAll('.pricing-card .price');
    const multipliers = {
        'caba': 1,
        'gba': 1.2,
        'nacional': 2
    };
    
    const basePrices = [2500, 4200, 0]; // Precios base
    
    pricingCards.forEach((priceElement, index) => {
        if (basePrices[index] > 0) {
            const newPrice = Math.round(basePrices[index] * multipliers[zone]);
            priceElement.textContent = `$${newPrice.toLocaleString()}`;
        }
    });
}

// Chatbot automático
function showChatbot() {
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    chatbotContainer.innerHTML = `
        <div class="chatbot-header">
            <h3>🤖 Asistente Virtual MotoExpress</h3>
            <button class="chatbot-close">&times;</button>
        </div>
        <div class="chatbot-messages" id="chatbot-messages">
            <div class="bot-message">
                ¡Hola! Soy el asistente virtual de MotoExpress. Estamos fuera del horario de atención, pero puedo ayudarte con:
            </div>
            <div class="chatbot-options">
                <button class="chatbot-option" data-action="quote">💰 Cotizar envío</button>
                <button class="chatbot-option" data-action="services">📦 Ver servicios</button>
                <button class="chatbot-option" data-action="hours">🕐 Horarios de atención</button>
                <button class="chatbot-option" data-action="contact">📞 Dejar mensaje</button>
            </div>
        </div>
        <div class="chatbot-input">
            <input type="text" placeholder="Escribe tu mensaje..." id="chatbot-input">
            <button id="chatbot-send">Enviar</button>
        </div>
    `;
    
    chatbotContainer.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 350px;
        height: 450px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 1001;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(chatbotContainer);
    
    // Event listeners del chatbot
    setupChatbotEvents(chatbotContainer);
}

// Configurar eventos del chatbot
function setupChatbotEvents(container) {
    const closeBtn = container.querySelector('.chatbot-close');
    const options = container.querySelectorAll('.chatbot-option');
    const input = container.querySelector('#chatbot-input');
    const sendBtn = container.querySelector('#chatbot-send');
    const messagesContainer = container.querySelector('#chatbot-messages');
    
    closeBtn.addEventListener('click', () => {
        container.remove();
    });
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            const action = option.dataset.action;
            handleChatbotAction(action, messagesContainer);
        });
    });
    
    sendBtn.addEventListener('click', () => {
        const message = input.value.trim();
        if (message) {
            addUserMessage(message, messagesContainer);
            input.value = '';
            setTimeout(() => {
                handleUserMessage(message, messagesContainer);
            }, 500);
        }
    });
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });
}

// Manejar acciones del chatbot
function handleChatbotAction(action, container) {
    let response = '';
    
    switch(action) {
        case 'quote':
            showQuoteCalculator();
            response = 'He abierto la calculadora de cotización para ti. Ingresa los datos y obtendrás un precio estimado.';
            break;
        case 'services':
            response = `Nuestros servicios principales son:

🏃‍♂️ Express (1-2 horas): $2,500
📅 Programado (mismo día): $4,200
🏢 Corporativo: Planes personalizados
📦 Paquetería: Según peso y distancia
📄 Documentos: Servicio especializado
🍕 Gastronómico: Delivery de comida`;
            break;
        case 'hours':
            response = `Nuestros horarios de atención son:

📅 Lunes a Viernes: 8:00 AM - 8:00 PM
📅 Sábados: 9:00 AM - 2:00 PM
📅 Domingos: Cerrado

¡Fuera de estos horarios puedes dejar tu mensaje y te contactaremos!`;
            break;
        case 'contact':
            response = 'Puedes dejar tu mensaje aquí y nos contactaremos contigo en horario comercial. También puedes escribirnos directamente a WhatsApp.';
            setTimeout(() => {
                const whatsappBtn = document.createElement('button');
                whatsappBtn.textContent = '📱 Abrir WhatsApp';
                whatsappBtn.style.cssText = 'background: #25d366; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-top: 10px;';
                whatsappBtn.addEventListener('click', () => {
                    openWhatsApp('Hola, me gustaría dejar un mensaje fuera del horario de atención.');
                });
                container.appendChild(whatsappBtn);
            }, 1000);
            break;
    }
    
    if (response) {
        addBotMessage(response, container);
    }
}

// Agregar mensaje del bot
function addBotMessage(message, container) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message';
    messageDiv.style.cssText = `
        background: #f1f1f1;
        padding: 10px;
        margin: 10px;
        border-radius: 10px;
        max-width: 80%;
        white-space: pre-line;
    `;
    messageDiv.textContent = message;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// Agregar mensaje del usuario
function addUserMessage(message, container) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';
    messageDiv.style.cssText = `
        background: #007bff;
        color: white;
        padding: 10px;
        margin: 10px;
        border-radius: 10px;
        max-width: 80%;
        margin-left: auto;
    `;
    messageDiv.textContent = message;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// Manejar mensajes del usuario
function handleUserMessage(message, container) {
    const lowerMessage = message.toLowerCase();
    let response = '';
    
    if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cotiz')) {
        response = '💰 Para cotizar tu envío, usa nuestra calculadora. ¿Te gustaría que la abra?';
        setTimeout(() => {
            const quoteBtn = document.createElement('button');
            quoteBtn.textContent = '📊 Abrir Calculadora';
            quoteBtn.style.cssText = 'background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; margin-top: 5px;';
            quoteBtn.addEventListener('click', showQuoteCalculator);
            container.appendChild(quoteBtn);
        }, 500);
    } else if (lowerMessage.includes('horario') || lowerMessage.includes('hora')) {
        response = `Nuestros horarios son:
📅 Lunes a Viernes: 8:00 AM - 8:00 PM
📅 Sábados: 9:00 AM - 2:00 PM
📅 Domingos: Cerrado`;
    } else if (lowerMessage.includes('servicio') || lowerMessage.includes('que hacen')) {
        response = 'Somos una empresa de mensajería y cadetería. Ofrecemos servicios express, programados, corporativos y más. ¿Te interesa algún servicio en particular?';
    } else {
        response = 'Gracias por tu mensaje. Un representante se contactará contigo en horario comercial. ¿Hay algo más en lo que pueda ayudarte?';
    }
    
    addBotMessage(response, container);
}

// Calculadora de cotización instantánea
function showQuoteCalculator() {
    const calculatorContainer = document.createElement('div');
    calculatorContainer.id = 'quote-calculator';
    calculatorContainer.innerHTML = `
        <div class="calculator-header">
            <h3>💰 Calculadora de Cotización</h3>
            <button class="calculator-close">&times;</button>
        </div>
        <div class="calculator-content">
            <div class="form-group">
                <label>Origen:</label>
                <input type="text" id="calc-origin" placeholder="Ej: Palermo, CABA">
            </div>
            <div class="form-group">
                <label>Destino:</label>
                <input type="text" id="calc-destination" placeholder="Ej: Belgrano, CABA">
            </div>
            <div class="form-group">
                <label>Tipo de servicio:</label>
                <select id="calc-service">
                    <option value="express">Express (1-2 horas)</option>
                    <option value="scheduled">Programado (mismo día)</option>
                    <option value="document">Solo documentos</option>
                    <option value="package">Paquete pequeño</option>
                    <option value="large">Paquete grande</option>
                </select>
            </div>
            <div class="form-group">
                <label>Urgencia:</label>
                <select id="calc-urgency">
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgente (+50%)</option>
                    <option value="immediate">Inmediato (+100%)</option>
                </select>
            </div>
            <button id="calculate-price" class="btn-calculate">Calcular Precio</button>
            <div id="price-result" class="price-result"></div>
        </div>
    `;
    
    calculatorContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        z-index: 1002;
        max-height: 90vh;
        overflow-y: auto;
    `;
    
    document.body.appendChild(calculatorContainer);
    
    // Event listeners de la calculadora
    setupCalculatorEvents(calculatorContainer);
}

// Configurar eventos de la calculadora
function setupCalculatorEvents(container) {
    const closeBtn = container.querySelector('.calculator-close');
    const calculateBtn = container.querySelector('#calculate-price');
    
    closeBtn.addEventListener('click', () => {
        container.remove();
    });
    
    calculateBtn.addEventListener('click', () => {
        calculateShippingPrice(container);
    });
}

// Calcular precio de envío
function calculateShippingPrice(container) {
    const origin = container.querySelector('#calc-origin').value;
    const destination = container.querySelector('#calc-destination').value;
    const service = container.querySelector('#calc-service').value;
    const urgency = container.querySelector('#calc-urgency').value;
    const resultDiv = container.querySelector('#price-result');
    
    if (!origin || !destination) {
        resultDiv.innerHTML = '<p style="color: red;">Por favor, completa origen y destino</p>';
        return;
    }
    
    // Precios base
    const basePrices = {
        express: 2500,
        scheduled: 4200,
        document: 1800,
        package: 3000,
        large: 4500
    };
    
    // Multiplicadores por urgencia
    const urgencyMultipliers = {
        normal: 1,
        urgent: 1.5,
        immediate: 2
    };
    
    // Calcular distancia aproximada (simulado)
    const distance = calculateDistance(origin, destination);
    let basePrice = basePrices[service];
    
    // Ajustar por distancia
    if (distance > 20) {
        basePrice *= 1.3;
    } else if (distance > 10) {
        basePrice *= 1.15;
    }
    
    // Aplicar multiplicador de urgencia
    const finalPrice = Math.round(basePrice * urgencyMultipliers[urgency]);
    
    // Mostrar resultado
    resultDiv.innerHTML = `
        <div class="price-breakdown">
            <h4>💰 Cotización Estimada</h4>
            <p><strong>Precio: $${finalPrice.toLocaleString()}</strong></p>
            <p>Distancia aproximada: ${distance} km</p>
            <p>Tiempo estimado: ${getEstimatedTime(service, urgency)}</p>
            <button class="btn-whatsapp" onclick="requestQuoteViaWhatsApp('${origin}', '${destination}', '${service}', ${finalPrice})">📱 Solicitar por WhatsApp</button>
        </div>
    `;
}

// Calcular distancia (simulado)
function calculateDistance(origin, destination) {
    // Simulación simple de cálculo de distancia
    const zones = {
        'caba': ['palermo', 'belgrano', 'recoleta', 'san telmo', 'puerto madero', 'barracas'],
        'zona norte': ['vicente lopez', 'olivos', 'martinez', 'san isidro', 'tigre'],
        'zona oeste': ['moron', 'castelar', 'ituzaingo', 'merlo', 'moreno'],
        'zona sur': ['avellaneda', 'quilmes', 'berazategui', 'florencio varela']
    };
    
    const originLower = origin.toLowerCase();
    const destLower = destination.toLowerCase();
    
    let originZone = 'other';
    let destZone = 'other';
    
    for (const [zone, areas] of Object.entries(zones)) {
        if (areas.some(area => originLower.includes(area))) originZone = zone;
        if (areas.some(area => destLower.includes(area))) destZone = zone;
    }
    
    if (originZone === destZone && originZone === 'caba') return Math.floor(Math.random() * 10) + 5;
    if (originZone === destZone) return Math.floor(Math.random() * 15) + 10;
    return Math.floor(Math.random() * 25) + 15;
}

// Obtener tiempo estimado
function getEstimatedTime(service, urgency) {
    const baseTimes = {
        express: urgency === 'immediate' ? '30-60 min' : '1-2 horas',
        scheduled: '2-6 horas',
        document: '1-3 horas',
        package: '2-4 horas',
        large: '3-6 horas'
    };
    
    return baseTimes[service] || '2-4 horas';
}

// Solicitar cotización por WhatsApp
function requestQuoteViaWhatsApp(origin, destination, service, price) {
    const message = `¡Hola! Me interesa solicitar una cotización:

📍 Origen: ${origin}
📍 Destino: ${destination}
⚡ Servicio: ${service}
💰 Precio estimado: $${price.toLocaleString()}

¿Podrían confirmar el precio y disponibilidad?`;
    
    openWhatsApp(message);
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Agregar clase para animaciones CSS
    document.body.classList.add('loaded');
    
    // Crear botón flotante de WhatsApp
    createWhatsAppButton();
    
    // Inicializar tooltips si es necesario
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
    
    // Precargar imágenes importantes
    const importantImages = [
        // Agregar URLs de imágenes importantes aquí
    ];
    
    importantImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Funciones para tooltips
function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.dataset.tooltip;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--black);
        color: var(--white);
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 10000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 100);
    
    e.target._tooltip = tooltip;
}

function hideTooltip(e) {
    if (e.target._tooltip) {
        e.target._tooltip.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(e.target._tooltip)) {
                document.body.removeChild(e.target._tooltip);
            }
        }, 300);
    }
}

// Manejo de errores globales
window.addEventListener('error', function(e) {
    console.error('Error en la página:', e.error);
});

// Performance monitoring básico
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Tiempo de carga: ${loadTime}ms`);
        }, 0);
    });
}