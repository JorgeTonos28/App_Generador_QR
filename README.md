# INFOTEP QR Generator - Sistema de Generación y Gestión de Códigos QR

> **Aplicación Web institucional desarrollada en Google Apps Script y Google Sheets para la Dirección de Comunicaciones y Departamento de Mercadeo de INFOTEP.**

---

## 1. Propósito y Descripción General
El **Sistema Generador de Códigos QR** es una plataforma institucional interna diseñada para eliminar la dependencia de servicios externos de pago y proporcionar control total sobre los códigos QR generados para campañas, materiales promocionales, eventos y folletos de INFOTEP.

### Novedades v1.2.0
- **Pantalla de Carga Inicial Unificada:** Muestra un loader con el logotipo de INFOTEP y spinner de estado hasta que todos los recursos de sesión, permisos y datos de campañas estén 100% listos.
- **Auto-Ajuste Proporcional del Logotipo en QR:** Corrección matemática de aspect ratio para evitar que el logotipo institucional se estreche o distorsione en el centro del código QR.
- **Modal de Previsualización Despejado:** El código QR se presenta en un contenedor blanco aislado sin textos ni botones superpuestos. Los botones de descarga y el enlace de destino se ubican de forma limpia debajo del gráfico.
- **Modalidad de Enlace Directo (Estático):** Permite generar QRs que van directo a la URL de destino (Instagram, web externa, folletos), sin pasar por Apps Script ni requerir autenticación.
- **Diseño 100% Responsivo:** Menú lateral tipo *drawer* deslizable con botón hamburguesa para smartphones y tablets.

### Características Clave
- **Sin vencimiento:** Códigos permanentes alojados en la infraestructura institucional de Google Workspace.
- **Códigos Dinámicos y Estáticos:**
  - **Estáticos:** Codifican directamente la URL de destino física (ideal para redes sociales, Instagram, WhatsApp o sitios públicos).
  - **Dinámicos:** Permiten actualizar la URL de destino en cualquier momento desde la plataforma sin reimprimir el arte gráfico y contabilizan escaneos.
- **Branding con Logotipo de INFOTEP:** Integración del isotipo institucional en el centro del código QR utilizando **Nivel H de Corrección de Errores (Reed-Solomon 30%)**, garantizando lectura instantánea en cualquier lector móvil (iOS / Android).
- **Personalización de Marca:** Paleta de colores institucionales (Azul Marino `#131360`, Navy Profundo `#111125`, Verde `#009c51`, Amarillo Mercadeo `#ebc246` y selector de color personalizado) y estilos de marco ("Básico" y "Escáname").
- **Formatos de Descarga Múltiples:** Exportación en alta resolución **PNG (1200px)**, vector escalable **SVG** y documento **PDF** listo para impresión y distribución.
- **Control de Acceso por Roles (RBAC):**
  - **Administrador:** Gestión total, visualización de todos los QRs institucionales, edición de destinos, administración de usuarios (altas, bajas, roles) y configuración.
  - **Usuario:** Creación de nuevos QRs, gestión y edición de destino de sus propios QRs creados, y consulta en modo lectura del catálogo.
  - **Acceso Denegado (`Denied.html`):** Bloqueo y pantalla de solicitud de acceso para cuentas inactivas o no autorizadas.

---

## 2. Estructura del Repositorio

| Archivo | Tipo | Descripción |
| :--- | :--- | :--- |
| [`Code.js`](file:///c:/Dev/AppScript/App_Generador_QR/Code.js) | Backend GAS | Controlador principal, enrutamiento `doGet(e)`, redirección dinámica, autenticación y API REST/RPC. |
| [`Assets.js`](file:///c:/Dev/AppScript/App_Generador_QR/Assets.js) | Backend GAS | Recursos gráficos oficiales en base64 para el logotipo institucional de INFOTEP. |
| [`Index.html`](file:///c:/Dev/AppScript/App_Generador_QR/Index.html) | Frontend | Plantilla Single Page Application (SPA) responsive basada en el sistema de diseño Stitch. |
| [`Denied.html`](file:///c:/Dev/AppScript/App_Generador_QR/Denied.html) | Frontend | Pantalla institucional de acceso denegado para usuarios no habilitados. |
| [`css.html`](file:///c:/Dev/AppScript/App_Generador_QR/css.html) | Estilos | Configuración de Tailwind CSS, fuentes tipográficas (Sora, Plus Jakarta Sans), variables y animaciones. |
| [`js.html`](file:///c:/Dev/AppScript/App_Generador_QR/js.html) | Lógica Cliente | Motor de generación de códigos QR Nivel H con logo proporcional, exportadores (PNG, SVG, PDF) y router. |
| [`appsscript.json`](file:///c:/Dev/AppScript/App_Generador_QR/appsscript.json) | Manifest | Configuración del proyecto Apps Script, zona horaria (`America/Santo_Domingo`) y permisos OAuth. |
| [`AGENTS.md`](file:///c:/Dev/AppScript/App_Generador_QR/AGENTS.md) | Guía | Reglas y estándares obligatorios para agentes de desarrollo y mantenimiento. |
| [`assets/`](file:///c:/Dev/AppScript/App_Generador_QR/assets) | Recursos | Logotipos institucionales de INFOTEP en color y negativo vectorial. |

---

## 3. Guía de Despliegue en Apps Script

1. **Subir archivos a Apps Script:** Ejecutar `clasp push` o copiar los archivos al editor de Apps Script.
2. **Inicializar Base de Datos:** Ejecutar la función `setupInitialSheets()`.
3. **Publicar:**
   - Ir a **Deploy > New deployment** (Implementar > Nueva implementación).
   - Seleccionar tipo: **Web app** (Aplicación web).
   - **Execute as:** `Me` (tu cuenta institucional).
   - **Who has access:**
     - Si deseas que los **QRs dinámicos** puedan ser escaneados por cualquier persona externa en eventos o vía pública: selecciona **Anyone** (Cualquier persona). El acceso a la interfaz web de gestión seguirá estando protegido y autenticado por rol.
     - Si generas **QRs estáticos directos**, estos van directamente al link (ej. Instagram) y no requieren acceso al Web App.
