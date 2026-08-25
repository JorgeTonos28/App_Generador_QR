# INFOTEP QR Generator - Sistema de Generación y Gestión de Códigos QR

> **Aplicación Web institucional desarrollada en Google Apps Script y Google Sheets para la Dirección de Comunicaciones y Departamento de Mercadeo de INFOTEP.**

---

## 1. Propósito y Descripción General
El **Sistema Generador de Códigos QR** es una plataforma institucional interna diseñada para eliminar la dependencia de servicios externos de pago y proporcionar control total sobre los códigos QR generados para campañas, materiales promocionales, eventos y folletos de INFOTEP.

### Novedades v1.4.0
- **Micro-Redirector Nativo en Cloudflare Workers (`microservicio_cloudflare/worker.js`):** Solución de nivel empresarial que procesa las redirecciones de códigos QR dinámicos mediante respuestas HTTP 302 nativas con tiempos de respuesta inferiores a 20 ms.
- **Eliminación Total de Conflictos de Sesión:** Los códigos QR dinámicos ya no dependen de las restricciones de dominio de Google Workspace ni sufren por múltiples cuentas iniciadas en el navegador, funcionando de manera transparente y sin clics en el 100% de dispositivos móviles y de escritorio.
- **Apertura Directa en Apps Nativas:** Los enlaces de Instagram, YouTube, Facebook y WhatsApp abren directamente las aplicaciones oficiales instaladas en el dispositivo móvil sin pantallas intermedias ni bloqueos de iframes.
- **Sincronización en Tiempo Real con Google Sheets:** Los cambios de URL de destino realizados en el panel administrativo de la aplicación se reflejan de inmediato en los códigos QR impresos o distribuidos.

---

## 2. Estructura del Repositorio

| Archivo / Carpeta | Tipo | Descripción |
| :--- | :--- | :--- |
| [`Code.js`](file:///c:/Dev/AppScript/App_Generador_QR/Code.js) | Backend GAS | Controlador principal, enrutamiento `doGet(e)`, autenticación por roles y API REST/RPC de la App Principal. |
| [`microservicio_cloudflare/worker.js`](file:///c:/Dev/AppScript/App_Generador_QR/microservicio_cloudflare/worker.js) | Edge Service | Micro-servicio en Cloudflare Worker para redirecciones instantáneas HTTP 302 de QRs dinámicos con 0 clics. |
| [`microservicio_redireccionador/Redirector.js`](file:///c:/Dev/AppScript/App_Generador_QR/microservicio_redireccionador/Redirector.js) | Micro-Servicio | Script complementario alternativo para despliegues de redirección en Google Apps Script. |
| [`Assets.js`](file:///c:/Dev/AppScript/App_Generador_QR/Assets.js) | Backend GAS | Recursos gráficos oficiales en base64 para el logotipo institucional de INFOTEP. |
| [`Index.html`](file:///c:/Dev/AppScript/App_Generador_QR/Index.html) | Frontend | Plantilla Single Page Application (SPA) responsive basada en el sistema de diseño Stitch. |
| [`Denied.html`](file:///c:/Dev/AppScript/App_Generador_QR/Denied.html) | Frontend | Pantalla institucional de acceso denegado para usuarios no habilitados. |
| [`css.html`](file:///c:/Dev/AppScript/App_Generador_QR/css.html) | Estilos | Configuración de Tailwind CSS, fuentes tipográficas (Sora, Plus Jakarta Sans) y animaciones. |
| [`js.html`](file:///c:/Dev/AppScript/App_Generador_QR/js.html) | Lógica Cliente | Motor de generación de códigos QR Nivel H con logo proporcional, exportadores (PNG, SVG, PDF) y router. |
| [`appsscript.json`](file:///c:/Dev/AppScript/App_Generador_QR/appsscript.json) | Manifest | Configuración del proyecto Apps Script, zona horaria (`America/Santo_Domingo`) y permisos OAuth. |
| [`AGENTS.md`](file:///c:/Dev/AppScript/App_Generador_QR/AGENTS.md) | Guía | Reglas y estándares obligatorios para agentes de desarrollo y mantenimiento. |
