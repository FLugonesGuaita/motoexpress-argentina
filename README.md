# MotoExpress Argentina - Website

Sitio web profesional para servicios de mensajería y cadetería en Buenos Aires y CABA.

## 🚀 Características

### Funcionalidades Principales
- **Sitio Multi-página**: Navegación completa entre diferentes secciones
- **Integración WhatsApp**: Botón flotante y generación automática de mensajes
- **Chatbot Automático**: Atención 24/7 con respuestas predefinidas
- **Cotizador Instantáneo**: Cálculo de precios por zona y distancia
- **Formularios Inteligentes**: Envío a email y Google Sheets
- **SEO Optimizado**: Meta tags y structured data
- **Responsive Design**: Optimizado para móviles y desktop

### Tecnologías Utilizadas
- HTML5 semántico
- CSS3 con Flexbox y Grid
- JavaScript ES6+ (Vanilla)
- EmailJS para envío de emails
- Google Sheets API para almacenamiento
- Schema.org para SEO

## 📁 Estructura del Proyecto

```
├── index.html          # Página principal
├── servicios.html      # Página de servicios
├── precios.html        # Página de precios
├── cobertura.html      # Página de cobertura
├── contacto.html       # Página de contacto
├── corporativo.html    # Página corporativa
├── styles.css          # Estilos principales
├── script.js           # Funcionalidades JavaScript
└── README.md           # Documentación
```

## 🛠️ Configuración

### WhatsApp Integration
Editar en `script.js`:
```javascript
const WHATSAPP_CONFIG = {
    number: '1155714614', // Número de WhatsApp
    businessHours: {
        start: 8,  // 8:00 AM
        end: 20    // 8:00 PM
    }
};
```

### Email Integration (EmailJS)
1. Crear cuenta en [EmailJS](https://www.emailjs.com/)
2. Configurar servicio y template
3. Actualizar en `script.js`:
```javascript
const EMAIL_SHEETS_CONFIG = {
    emailjs: {
        serviceId: 'YOUR_SERVICE_ID',
        templateId: 'YOUR_TEMPLATE_ID',
        publicKey: 'YOUR_PUBLIC_KEY'
    }
};
```

### Google Sheets Integration
1. Crear Google Apps Script
2. Configurar permisos para recibir POST requests
3. Actualizar URL en `script.js`:
```javascript
googleSheets: {
    scriptUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
}
```

## 🚀 Despliegue

### Desarrollo Local
```bash
# Servidor Python (recomendado)
python -m http.server 8000

# O usar Live Server en VS Code
```

### Producción
- Subir archivos a hosting web
- Configurar dominio personalizado
- Activar HTTPS
- Configurar APIs de EmailJS y Google Sheets

## 📱 Funcionalidades Móviles

- **Responsive Design**: Adaptación automática a diferentes tamaños
- **Touch Optimized**: Botones y elementos táctiles optimizados
- **Fast Loading**: Imágenes lazy loading y código optimizado
- **PWA Ready**: Preparado para Progressive Web App

## 🔧 Personalización

### Colores y Branding
Editar variables CSS en `styles.css`:
```css
:root {
    --primary-color: #ff6b35;
    --secondary-color: #2c3e50;
    --accent-color: #f39c12;
}
```

### Contenido
- Textos: Editar directamente en archivos HTML
- Precios: Actualizar en `precios.html` y función `updatePricing()` en `script.js`
- Zonas de cobertura: Modificar en `cobertura.html`

## 📊 SEO y Analytics

### Keywords Principales
- "moto mensajería en Buenos Aires"
- "cadetería urgente Argentina"
- "mensajería express CABA"
- "envíos rápidos Buenos Aires"

### Structured Data
- LocalBusiness schema implementado
- Open Graph tags para redes sociales
- Twitter Cards configuradas

## 🔒 Seguridad

- Validación de formularios client-side y server-side
- Sanitización de datos de entrada
- HTTPS requerido para producción
- Rate limiting recomendado para APIs

## 📈 Performance

- Lazy loading de imágenes
- CSS y JS minificados para producción
- Caché de recursos estáticos
- Optimización de imágenes

## 🐛 Debugging

### Modo Desarrollo
El código detecta automáticamente si está en localhost y usa versiones simuladas de las APIs.

### Logs
Todos los errores se registran en la consola del navegador.

## 📞 Soporte

Para soporte técnico o modificaciones:
- Email: desarrollo@motoexpress-argentina.com
- WhatsApp: +54 11 5571-4614

## 📄 Licencia

© 2024 MotoExpress Argentina. Todos los derechos reservados.

---

**Última actualización**: Enero 2024
**Versión**: 2.0.0
**Desarrollado por**: Equipo de Desarrollo MotoExpress