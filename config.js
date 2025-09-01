// MotoExpress Argentina - Configuration File
// Este archivo contiene todas las configuraciones centralizadas del sitio

// Configuración principal del sitio
const SITE_CONFIG = {
    name: 'MotoExpress Argentina',
    description: 'Servicio de mensajería y cadetería express en Buenos Aires y CABA',
    url: 'https://www.motoexpress-argentina.com',
    email: 'info@motoexpress-argentina.com',
    phone: '+54 11 5571-4614',
    address: 'Buenos Aires, Argentina',
    
    // Horarios de atención
    businessHours: {
        weekdays: { start: 8, end: 20 }, // 8:00 AM - 8:00 PM
        saturday: { start: 9, end: 18 }, // 9:00 AM - 6:00 PM
        sunday: { start: 10, end: 16 }   // 10:00 AM - 4:00 PM
    },
    
    // Zonas de cobertura
    coverageZones: {
        'CABA': {
            name: 'Ciudad Autónoma de Buenos Aires',
            basePrice: 800,
            urgentMultiplier: 1.5
        },
        'GBA_Norte': {
            name: 'Gran Buenos Aires Norte',
            basePrice: 1200,
            urgentMultiplier: 1.8
        },
        'GBA_Sur': {
            name: 'Gran Buenos Aires Sur',
            basePrice: 1200,
            urgentMultiplier: 1.8
        },
        'GBA_Oeste': {
            name: 'Gran Buenos Aires Oeste',
            basePrice: 1400,
            urgentMultiplier: 2.0
        }
    }
};

// Configuración de WhatsApp
const WHATSAPP_CONFIG = {
    number: '1155714614', // Reemplazar con número real
    businessHours: {
        start: 8,
        end: 20
    },
    messages: {
        greeting: '¡Hola! Gracias por contactar a MotoExpress Argentina 🏍️',
        businessHours: 'Nuestro horario de atención es de 8:00 AM a 8:00 PM, de lunes a viernes.',
        afterHours: 'Estamos fuera del horario de atención. Te responderemos a primera hora del día siguiente.',
        quote: 'Solicitud de cotización desde el sitio web:'
    }
};

// Configuración de EmailJS
const EMAILJS_CONFIG = {
    serviceId: 'service_znpehky',
    templateId: 'template_dv9gj4f',
    publicKey: '8kfo3GHzWI6r6O4YF', // Configurado correctamente
    
    // Email de destino
    toEmail: 'lugones.i.1992@gmail.com',
    
    // Templates para diferentes tipos de email
    templates: {
        contact: 'template_contact',
        quote: 'template_cotizacion',
        corporate: 'template_corporate'
    }
};

// Configuración de Google Sheets
const GOOGLE_SHEETS_CONFIG = {
    scriptUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    sheetNames: {
        contacts: 'Contactos',
        quotes: 'Cotizaciones',
        corporate: 'Corporativo'
    }
};

// Configuración de SEO
const SEO_CONFIG = {
    keywords: [
        'moto mensajería en Buenos Aires',
        'cadetería urgente Argentina',
        'mensajería express CABA',
        'envíos rápidos Buenos Aires',
        'cadetería profesional',
        'mensajería en moto',
        'delivery express Argentina'
    ],
    
    pages: {
        home: {
            title: 'MotoExpress Argentina - Mensajería Express en Buenos Aires',
            description: 'Servicio de mensajería y cadetería express en Buenos Aires y CABA. Envíos rápidos, seguros y confiables las 24 horas.'
        },
        servicios: {
            title: 'Servicios de Mensajería - MotoExpress Argentina',
            description: 'Conoce todos nuestros servicios de mensajería express: cadetería urgente, envíos corporativos y más en Buenos Aires.'
        },
        precios: {
            title: 'Precios y Tarifas - MotoExpress Argentina',
            description: 'Consulta nuestras tarifas competitivas para servicios de mensajería express en Buenos Aires y CABA.'
        },
        cobertura: {
            title: 'Cobertura y Zonas - MotoExpress Argentina',
            description: 'Conoce todas las zonas de cobertura de nuestro servicio de mensajería en Buenos Aires y Gran Buenos Aires.'
        },
        contacto: {
            title: 'Contacto - MotoExpress Argentina',
            description: 'Contacta con MotoExpress Argentina para solicitar servicios de mensajería express. WhatsApp, email y formulario disponible.'
        },
        corporativo: {
            title: 'Servicios Corporativos - MotoExpress Argentina',
            description: 'Soluciones de mensajería corporativa para empresas en Buenos Aires. Contratos, facturación y servicios personalizados.'
        }
    }
};

// Configuración de Analytics (Google Analytics, etc.)
const ANALYTICS_CONFIG = {
    googleAnalytics: {
        trackingId: 'GA_TRACKING_ID', // Reemplazar con ID real
        enabled: false // Cambiar a true cuando esté configurado
    },
    
    facebookPixel: {
        pixelId: 'FB_PIXEL_ID', // Reemplazar con ID real
        enabled: false // Cambiar a true cuando esté configurado
    }
};

// Configuración de desarrollo vs producción
const ENV_CONFIG = {
    development: {
        apiUrl: 'http://localhost:3000',
        debug: true,
        simulateAPIs: true
    },
    
    production: {
        apiUrl: 'https://api.motoexpress-argentina.com',
        debug: false,
        simulateAPIs: false
    }
};

// Detectar entorno actual
const getCurrentEnvironment = () => {
    const hostname = window.location.hostname;
    return (hostname === 'localhost' || hostname === '127.0.0.1') ? 'development' : 'production';
};

// Exportar configuraciones (para uso en otros archivos)
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        SITE_CONFIG,
        WHATSAPP_CONFIG,
        EMAILJS_CONFIG,
        GOOGLE_SHEETS_CONFIG,
        SEO_CONFIG,
        ANALYTICS_CONFIG,
        ENV_CONFIG,
        getCurrentEnvironment
    };
} else {
    // Browser environment
    window.SITE_CONFIG = SITE_CONFIG;
    window.WHATSAPP_CONFIG = WHATSAPP_CONFIG;
    window.EMAILJS_CONFIG = EMAILJS_CONFIG;
    window.GOOGLE_SHEETS_CONFIG = GOOGLE_SHEETS_CONFIG;
    window.SEO_CONFIG = SEO_CONFIG;
    window.ANALYTICS_CONFIG = ANALYTICS_CONFIG;
    window.ENV_CONFIG = ENV_CONFIG;
    window.getCurrentEnvironment = getCurrentEnvironment;
}