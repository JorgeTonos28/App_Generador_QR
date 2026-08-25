# INFOTEP QR Generator - Sistema de Generación y Gestión de Códigos QR

> **Aplicación Web institucional desarrollada en Google Apps Script y Google Sheets para la Dirección de Comunicaciones y Departamento de Mercadeo de INFOTEP.**

---

## 1. Propósito y Descripción General
El **Sistema Generador de Códigos QR** es una plataforma institucional interna diseñada para eliminar la dependencia de servicios externos de pago y proporcionar control total sobre los códigos QR generados para campañas, materiales promocionales, eventos y folletos de INFOTEP.

### Novedades v1.4.1
- **Separación de Logotipos (App vs QRs):** Se incorporaron dos slots independientes en la vista de Configuración: uno para el logotipo a color de la interfaz (`LOGO_FILE_ID`) y otro para el logotipo monocromático de los códigos QR (`QR_LOGO_FILE_ID`).
- **Spinner Inicial Ultrarrápido:** Restauración del emblema SVG vectorial embebido en el loader inicial para garantizar una carga instantánea y fluida de la aplicación.
- **Renderizado Dinámico de Logo Monocromático:** El motor de generación de QR en Canvas y exportador SVG utilizan automáticamente el logotipo configurado para códigos QR manteniendo proporciones perfectas.

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
