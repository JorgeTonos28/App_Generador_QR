# INFOTEP QR Generator - Sistema de Generación y Gestión de Códigos QR

> **Aplicación Web institucional desarrollada en Google Apps Script y Google Sheets para la Dirección de Comunicaciones y Departamento de Mercadeo de INFOTEP.**

---

## 1. Propósito y Descripción General
El **Sistema Generador de Códigos QR** es una plataforma institucional interna diseñada para eliminar la dependencia de servicios externos de pago y proporcionar control total sobre los códigos QR generados para campañas, materiales promocionales, eventos y folletos de INFOTEP.

### Novedades v1.3.1
- **Aislamiento de Scope (`.claspignore`):** Se separó el micro-servicio de redirección a la carpeta `microservicio_redireccionador/` para evitar colisiones de la función `doGet(e)` entre la App Principal y el Redireccionador.
- **Pantalla de Carga Ultrarrápida (0ms):** Reemplazo del asset de imagen en el loader inicial por un isotipo vectorial SVG nativo que se renderiza al instante sin parpadeos ni latencia de decodificación.
- **Arquitectura de Micro-Redirector Público:** Permite mantener la aplicación principal de gestión **100% privada y restringida al dominio institucional de INFOTEP** (Google Workspace), mientras que los enlaces de redirección dinámicos se procesan a través de un micro-servicio público ultraligero que comparte la misma base de datos de Google Sheets.
- **Auto-Ajuste Proporcional del Logotipo en QR:** Corrección de aspect ratio geométrico para evitar que el logotipo oficial se estreche o distorsione en el centro del código QR.
- **Modal de Previsualización Despejado:** El código QR se presenta en un contenedor blanco aislado sin textos ni botones superpuestos. Los botones de descarga y el enlace de destino se ubican de forma limpia debajo del gráfico.

---

## 2. Estructura del Repositorio

| Archivo / Carpeta | Tipo | Descripción |
| :--- | :--- | :--- |
| [`Code.js`](file:///c:/Dev/AppScript/App_Generador_QR/Code.js) | Backend GAS | Controlador principal, enrutamiento `doGet(e)`, autenticación por roles y API REST/RPC de la App Principal. |
| [`microservicio_redireccionador/Redirector.js`](file:///c:/Dev/AppScript/App_Generador_QR/microservicio_redireccionador/Redirector.js) | Micro-Servicio | Script independiente para procesar redirecciones públicas de QRs dinámicos en un proyecto Apps Script separado. |
| [`Assets.js`](file:///c:/Dev/AppScript/App_Generador_QR/Assets.js) | Backend GAS | Recursos gráficos oficiales en base64 para el logotipo institucional de INFOTEP. |
| [`Index.html`](file:///c:/Dev/AppScript/App_Generador_QR/Index.html) | Frontend | Plantilla Single Page Application (SPA) responsive basada en el sistema de diseño Stitch. |
| [`Denied.html`](file:///c:/Dev/AppScript/App_Generador_QR/Denied.html) | Frontend | Pantalla institucional de acceso denegado para usuarios no habilitados. |
| [`css.html`](file:///c:/Dev/AppScript/App_Generador_QR/css.html) | Estilos | Configuración de Tailwind CSS, fuentes tipográficas (Sora, Plus Jakarta Sans) y animaciones. |
| [`js.html`](file:///c:/Dev/AppScript/App_Generador_QR/js.html) | Lógica Cliente | Motor de generación de códigos QR Nivel H con logo proporcional, exportadores (PNG, SVG, PDF) y router. |
| [`appsscript.json`](file:///c:/Dev/AppScript/App_Generador_QR/appsscript.json) | Manifest | Configuración del proyecto Apps Script, zona horaria (`America/Santo_Domingo`) y permisos OAuth. |
| [`AGENTS.md`](file:///c:/Dev/AppScript/App_Generador_QR/AGENTS.md) | Guía | Reglas y estándares obligatorios para agentes de desarrollo y mantenimiento. |
