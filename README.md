# INFOTEP QR Generator - Sistema de Generación y Gestión de Códigos QR

> **Aplicación Web institucional desarrollada en Google Apps Script y Google Sheets para la Dirección de Comunicaciones y Departamento de Mercadeo de INFOTEP.**

---

## 1. Propósito y Descripción General
El **Sistema Generador de Códigos QR** es una plataforma institucional interna diseñada para eliminar la dependencia de servicios externos de pago y proporcionar control total sobre los códigos QR generados para campañas, materiales promocionales, eventos y folletos de INFOTEP.

### Características Clave
- **Sin vencimiento:** Códigos permanentes alojados en la infraestructura institucional de Google Workspace.
- **Códigos Dinámicos y Estáticos:** Permite actualizar la URL de destino de cualquier QR dinámico en cualquier momento sin necesidad de reimprimir o redistribuir el arte gráfico.
- **Branding con Logotipo de INFOTEP:** Integración del isotipo institucional en el centro del código QR utilizando **Nivel H de Corrección de Errores (Reed-Solomon 30%)**, garantizando lectura instantánea en cualquier lector móvil (iOS / Android).
- **Personalización de Marca:** Paleta de colores institucionales (Azul Marino `#131360`, Navy Profundo `#111125`, Verde `#009c51`, Amarillo Mercadeo `#ebc246` y selector de color personalizado) y estilos de marco ("Básico" y "Escáname").
- **Formatos de Descarga Múltiples:** Exportación en alta resolución **PNG (1200px)**, vector escalable **SVG** y documento **PDF** listo para impresión y distribución.
- **Métricas y Analíticas en Tiempo Real:** Contador de escaneos automáticos por cada código QR dinámico.
- **Control de Acceso por Roles (RBAC):**
  - **Administrador:** Gestión total, visualización de todos los QRs institucionales, edición de destinos, administración de usuarios (altas, bajas, roles) y configuración.
  - **Usuario:** Creación de nuevos QRs, gestión y edición de destino de sus propios QRs creados, y consulta en modo lectura del catálogo.
  - **Acceso Denegado (`Denied.html`):** Bloqueo y pantalla de solicitud de acceso para cuentas inactivas o no autorizadas.

---

## 2. Arquitectura Técnica

```
┌─────────────────────────────────────────────────────────────┐
│                   Navegador del Usuario                     │
│  (SPA en Tailwind CSS + Google Fonts Sora & Plus Jakarta)   │
└──────────────┬───────────────────────────────▲──────────────┘
               │                               │
       google.script.run               JSON Data & HTML
               │                               │
┌──────────────▼───────────────────────────────┴──────────────┐
│           Google Apps Script Web App (Code.js)              │
│    - Router doGet(e) [Redirección Rápida vs Web App]        │
│    - Endpoints CRUD granulares con LockService              │
│    - CacheService para destinos de redirección              │
└──────────────┬───────────────────────────────▲──────────────┘
               │                               │
       Operaciones en Bloque           Lecturas Optimizadas
               │                               │
┌──────────────▼───────────────────────────────┴──────────────┐
│           Base de Datos Google Sheets (BD QRs)              │
│    - Hoja 'Config'     : Parámetros del sistema             │
│    - Hoja 'Usuarios'   : Control de acceso institucional    │
│    - Hoja 'QRs'        : Repositorio de códigos generados   │
│    - Hoja 'Scans'      : Registro de escaneos y métricas    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Estructura del Repositorio

| Archivo | Tipo | Descripción |
| :--- | :--- | :--- |
| [`Code.js`](file:///c:/Dev/AppScript/App_Generador_QR/Code.js) | Backend GAS | Controlador principal, enrutamiento `doGet(e)`, redirección dinámica, autenticación y API REST/RPC. |
| [`Index.html`](file:///c:/Dev/AppScript/App_Generador_QR/Index.html) | Frontend | Plantilla Single Page Application (SPA) basada en el sistema de diseño Stitch. |
| [`Denied.html`](file:///c:/Dev/AppScript/App_Generador_QR/Denied.html) | Frontend | Pantalla institucional de acceso denegado para usuarios no habilitados. |
| [`css.html`](file:///c:/Dev/AppScript/App_Generador_QR/css.html) | Estilos | Configuración de Tailwind CSS, fuentes tipográficas (Sora, Plus Jakarta Sans), variables y animaciones. |
| [`js.html`](file:///c:/Dev/AppScript/App_Generador_QR/js.html) | Lógica Cliente | Motor de generación de códigos QR Nivel H con logo de INFOTEP, exportadores (PNG, SVG, PDF) y router. |
| [`appsscript.json`](file:///c:/Dev/AppScript/App_Generador_QR/appsscript.json) | Manifest | Configuración del proyecto Apps Script, zona horaria (`America/Santo_Domingo`) y permisos OAuth. |
| [`AGENTS.md`](file:///c:/Dev/AppScript/App_Generador_QR/AGENTS.md) | Guía | Reglas y estándares obligatorios para agentes de desarrollo y mantenimiento. |
| [`assets/`](file:///c:/Dev/AppScript/App_Generador_QR/assets) | Recursos | Logotipos institucionales de INFOTEP en color y negativo vectorial. |

---

## 4. Modelo de Datos (Google Sheets)

### Hoja `Config`
Almacena las variables globales del sistema:
- `APP_NAME`: `INFOTEP QR Generator`
- `APP_VERSION`: `1.0.0`
- `PRIMARY_COLOR`: `#131360`
- `SECONDARY_COLOR`: `#ebc246`
- `LOGO_FILE_ID`: ID del archivo en Google Drive para el logotipo (opcional).
- `ADMIN_EMAILS`: Correos iniciales de administradores separados por coma.
- `WEBAPP_URL`: URL del despliegue Web App para enlaces dinámicos.

### Hoja `Usuarios`
Controla el acceso y privilegios:
- `correo`: Correo institucional (`@infotep.edu.do` / `@infotep.gob.do`).
- `nombre`: Nombre completo del colaborador.
- `departamento`: Área o departamento (ej. `Mercadeo y Comunicaciones`).
- `rol`: `ADMIN` o `USUARIO`.
- `estado`: `ACTIVO` o `INACTIVO`.
- `creado_por`, `fecha_creacion`, `ultimo_acceso`.

### Hoja `QRs`
Repositorio principal de códigos generados:
- `id`: Identificador único (ej. `qr_mkt_v2024`).
- `nombre`: Nombre descriptivo de la campaña o producto.
- `tipo`: `DINAMICO` o `ESTATICO`.
- `url_destino`: URL final a la que se dirige el usuario.
- `url_corta`: Enlace de redirección dinámico (`?r=ID`).
- `color_hex`: Código de color hexadecimal del QR.
- `incluye_logo`: `SI` / `NO`.
- `estilo_marco`: `BASICO` / `ESCANAME`.
- `escaneos_totales`: Contador acumulado de escaneos.
- `estado`: `ACTIVO` / `INACTIVO`.
- `creado_por`, `fecha_creacion`, `ultima_modificacion`.

### Hoja `Scans`
Registro de auditoría y analítica de escaneos:
- `id_scan`, `id_qr`, `fecha_hora`, `user_agent`, `ip_hint`.

---

## 5. Guía de Configuración y Despliegue

### Requisitos Previos
1. Cuenta de **Google Workspace** institucional con permisos para crear y desplegar Apps Script.
2. Repositorio sincronizado mediante Git o Clasp.

### Pasos de Despliegue
1. **Abrir el Editor de Apps Script:**
   - Si se usa Clasp: ejecutar `clasp push`.
   - O vincular los archivos directamente en [script.google.com](https://script.google.com).
2. **Inicializar la Base de Datos:**
   - En el editor de Apps Script, ejecutar la función `setupInitialSheets()`.
   - Esto creará automáticamente el archivo de Google Sheets `"BD - INFOTEP Generador QR Mercadeo"` con las cuatro hojas y registros iniciales.
3. **Publicar como Web App:**
   - Hacer clic en **Deploy > New deployment** (Implementar > Nueva implementación).
   - Tipo de implementación: **Web app** (Aplicación web).
   - Descripción: `INFOTEP QR Generator v1.0.0`.
   - **Execute as (Ejecutar como):** `Me` (tu cuenta institucional / desarrollador).
   - **Who has access (Quién tiene acceso):** `Anyone` (Cualquier persona) para permitir que los QRs dinámicos redirijan a cualquier usuario que los escanee en la vía pública o eventos.
4. **Registrar la URL en Configuración:**
   - Copiar la URL web proporcionada tras la implementación y actualizar la clave `WEBAPP_URL` en la hoja `Config` o desde la vista de Configuración.

---

## 6. Mantenimiento y Versionado
- Antes de cada modificación, incrementar la constante `APP_VERSION` en `Code.js`.
- Seguir estrictamente las directrices indicadas en [`AGENTS.md`](file:///c:/Dev/AppScript/App_Generador_QR/AGENTS.md).
- Repositorio oficial en GitHub: [https://github.com/JorgeTonos28/App_Generador_QR](https://github.com/JorgeTonos28/App_Generador_QR).
