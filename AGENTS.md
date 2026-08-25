# AGENTS.md - Estándar Operativo para Agentes y Desarrolladores

## Propósito
Este proyecto debe ser trabajado con criterio de ingeniería, foco en mantenibilidad, integridad de datos, seguridad, rendimiento y consistencia visual. Todo cambio debe ser robusto, evaluar impactos colaterales y mantener la documentación técnica y operativa al día.

---

## Principios Generales
- **Entender antes de modificar:** Analizar la arquitectura, dependencias y flujo antes de realizar cambios.
- **Rendimiento desde el diseño:** Minimizar roundtrips cliente-servidor, reducir lecturas/escrituras a Google Sheets y evitar recargas globales innecesarias.
- **Cero cambios improvisados:** Evitar duplicación de código, lógica frágil o soluciones temporales sin documentar.
- **Respeto a la arquitectura existente:** Mantener la coherencia de nombres, contratos de API y diseño.

---

## Regla de Versionado Obligatoria
En cada interacción que implique cambios en código, estructura, assets, configuración, documentación técnica o comportamiento funcional:
1. Incrementar la constante `APP_VERSION` ubicada al inicio de `Code.js`.
2. Sincronizar la versión mostrada en el footer o cabecera visual de la aplicación.
3. Mencionar la versión actualizada en el mensaje de commit (`git commit -m "vX.Y.Z: Descripción del cambio"`).
4. Reflejar los cambios relevantes en `README.md`.

---

## Reglas Obligatorias de Arquitectura en Google Apps Script
1. **Un solo bootstrap inicial:** La aplicación web debe cargar con un único `apiBootstrap()`. Ninguna acción CRUD (crear, editar, eliminar) debe forzar un bootstrap completo.
2. **Endpoints específicos y livianos:** Crear funciones de servidor dedicadas por cada módulo (`apiGetDashboard`, `apiGetQRs`, `apiSaveQR`, `apiUpdateQRUrl`, `apiDeleteQR`, `apiGetUsers`, `apiSaveUser`, `apiToggleUserStatus`, `apiGetConfig`).
3. **Lecturas y escrituras en bloque (Batching):** 
   - Leer hojas completas con `getDataRange().getValues()` y procesar en memoria.
   - Prohibido llamar a `SpreadsheetApp`, `DriveApp` o `getRange()` dentro de bucles (`for`/`forEach`/`while`).
4. **Uso de LockService:** Aplicar `LockService` únicamente en el tramo crítico de escritura concurrente, no durante toda la ejecución.
5. **Caché inteligente:** Utilizar `CacheService` o almacenamiento en memoria cliente para consultas frecuentes que no comprometan integridad.
6. **Validación dual:** Validar en cliente para dar feedback inmediato sin viajes innecesarios al servidor, y re-validar siempre en servidor por seguridad.

---

## Reglas Obligatorias de UX y Diseño
1. **Fidelidad al Prototipo Stitch:** Respetar los colores y tokens de diseño:
   - Fondo: `#111125` / `#0c0c1f`
   - Primario institucional: `#131360` / `#c0c1ff`
   - Acento Marketing: `#ebc246` (Vibrant Yellow)
   - Éxito / Dinámico: `#61de8a` / `#009c51`
   - Tipografías: `Sora` (títulos) y `Plus Jakarta Sans` (cuerpo y etiquetas).
2. **Generación de QR y Legibilidad:**
   - Todo código QR debe generarse con **Nivel H (30% de corrección de errores)** para garantizar legibilidad inmediata cuando se incluye el logo institucional de INFOTEP en el centro.
   - El logo centrado debe contar con un contenedor protector (badge blanco) de tamaño no mayor al 22% del ancho del QR.
3. **Modales estándar vs Alerts:** Prohibido el uso de `window.alert()` o `window.confirm()`. Usar siempre los modales estilizados del sistema.
4. **Indicador de Carga Unificado (`Busy`):** Utilizar el controlador `Busy` con conteo para gestionar estados de carga asíncronos y evitar bloqueos en operaciones silenciosas.
5. **Diseño Responsivo:** Verificar adaptabilidad en móvil, tablet y escritorio, asegurando viewport adecuado y scroll independiente en tablas y modales.

---

## Checklist Pre-Entrega
Antes de dar por concluida cualquier tarea o actualización, verificar:
- [ ] ¿Se incrementó la constante `APP_VERSION` en `Code.js`?
- [ ] ¿El archivo `README.md` está actualizado con los cambios realizados?
- [ ] ¿Se respetó el control de acceso por roles (Admin vs Usuario)?
- [ ] ¿Se preservó la integridad de datos en Google Sheets?
- [ ] ¿Se evitaron llamadas repetitivas o roundtrips innecesarios?
- [ ] ¿La interfaz responde correctamente y los modales cierran limpiamente?
- [ ] ¿Se validó la sintaxis de todos los archivos (`.js`, `.html`, `.json`)?
