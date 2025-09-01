# 📧 Guía de Configuración de EmailJS para MotoExpress

## ❌ Problema Actual
Los formularios no envían emails porque **EmailJS no está configurado** con credenciales reales.

## ✅ Solución: Configurar EmailJS

### Paso 1: Crear Cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Confirma tu email

### Paso 2: Configurar Servicio de Email
1. En el dashboard, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona tu proveedor de email:
   - **Gmail** (recomendado para testing)
   - **Outlook/Hotmail**
   - **Yahoo**
   - Otros proveedores
4. Sigue las instrucciones para conectar tu cuenta
5. **Copia el Service ID** (ejemplo: `service_abc123`)

### Paso 3: Crear Template de Email
1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Configura el template:
   ```
   From Name: MotoExpress Argentina
   From Email: {{from_email}} (o tu email)
   To Email: lugones.i.1992@gmail.com
   Subject: Nueva Solicitud de Envío - {{nombre}}
   
   Content:
   Nueva solicitud de envío recibida:
   
   CLIENTE:
   Nombre: {{nombre}}
   Teléfono: {{telefono}}
   Email: {{email}}
   
   SERVICIO:
   Tipo: {{servicio}}
   Urgencia: {{urgencia}}
   
   DIRECCIONES:
   Retiro: {{retiro}}
   Entrega: {{entrega}}
   
   PAQUETE:
   Descripción: {{descripcion_paquete}}
   Peso: {{peso}}kg
   Valor: ${{valor}}
   
   DETALLES:
   Horario preferido: {{horario_preferido}}
   Comentarios: {{comentarios}}
   
   Origen: {{origen}}
   Fecha: {{timestamp}}
   ```
4. **Copia el Template ID** (ejemplo: `template_xyz789`)

### Paso 4: Obtener Public Key
1. Ve a **"Account"** → **"General"**
2. Encuentra tu **"Public Key"** (ejemplo: `abc123def456`)

### Paso 5: Actualizar config.js
Reemplaza en `config.js`:
```javascript
const EMAILJS_CONFIG = {
    serviceId: 'TU_SERVICE_ID_AQUI',        // Del Paso 2
    templateId: 'TU_TEMPLATE_ID_AQUI',      // Del Paso 3
    publicKey: 'TU_PUBLIC_KEY_AQUI',        // Del Paso 4
    toEmail: 'lugones.i.1992@gmail.com',
    // ... resto de la configuración
};
```

## 🔧 Verificación

### Modo Desarrollo (Actual)
- Usa función simulada `sendToEmailOrSheetsSimulated`
- Solo muestra notificaciones, no envía emails reales
- Para testing de la interfaz

### Modo Producción (Después de configurar)
- Usa función real `sendToEmailOrSheets`
- Envía emails reales a través de EmailJS
- Se activa automáticamente cuando no es localhost

## 🚨 Importante

1. **Límites Gratuitos de EmailJS:**
   - 200 emails/mes gratis
   - Después: planes pagos desde $15/mes

2. **Seguridad:**
   - El Public Key es seguro para usar en frontend
   - No expongas Service ID en repositorios públicos

3. **Testing:**
   - Primero prueba con tu email personal
   - Luego cambia a `lugones.i.1992@gmail.com`

## 📱 WhatsApp como Backup
Si EmailJS falla, el sistema automáticamente:
1. Muestra notificación de error
2. Ofrece abrir WhatsApp como alternativa
3. Pre-llena el mensaje con los datos del formulario

## 🔍 Debug
Para verificar que funciona:
1. Abre la consola del navegador (F12)
2. Envía un formulario
3. Busca mensajes como:
   - `📧 EmailJS inicializado correctamente`
   - `📧 Resultado del envío: {success: true}`

---

**¿Necesitas ayuda?** Contacta al desarrollador con los errores específicos de la consola.