/**
 * ============================================================================
 * INFOTEP QR Generator - Micro-Redirector Público Independiente
 * Dirección de Comunicaciones - Departamento de Mercadeo
 * ============================================================================
 * Propósito:
 * Servicio complementario ultraligero que se despliega como Web App pública
 * (Acceso: "Anyone / Cualquier persona") exclusivamente para procesar las
 * redirecciones de códigos QR dinámicos y contabilizar escaneos.
 *
 * Esto permite mantener la aplicación principal de gestión 100% RESTRINGIDA
 * a usuarios autorizados de Google Workspace en el dominio de INFOTEP.
 */

// NOTA: Configura aquí el ID de la hoja de cálculo de Google Sheets compartida
const SPREADSHEET_ID = ""; // Ejemplo: "1AbCdEfGhIjKlMnOpQrStUvWxYz..."

function doGet(e) {
  const qrId = (e && e.parameter && (e.parameter.r || e.parameter.id || e.parameter.q)) || "";
  
  if (!qrId) {
    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>INFOTEP QR Redirector</title></head>
      <body style="background:#111125;color:#e2e0fc;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;">
        <div>
          <h2 style="color:#c0c1ff;margin:0 0 8px;">INFOTEP - Servicio de Redirección QR</h2>
          <p style="color:#c7c5d2;font-size:14px;">Servicio activo y operativo.</p>
        </div>
      </body>
      </html>
    `).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // 1. Check ultra-fast cache first
  const cache = CacheService.getScriptCache();
  let targetUrl = cache.get("QR_TARGET_" + qrId);

  // 2. If not in cache, query shared Google Sheet
  if (!targetUrl && SPREADSHEET_ID) {
    try {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const qrsSheet = ss.getSheetByName("QRs");
      if (qrsSheet) {
        const rows = qrsSheet.getDataRange().getValues();
        for (let i = 1; i < rows.length; i++) {
          const id = String(rows[i][0] || "").trim();
          const status = String(rows[i][9] || "").toUpperCase().trim();
          if (id === qrId && status === "ACTIVO") {
            targetUrl = String(rows[i][3] || "").trim();
            if (targetUrl) {
              cache.put("QR_TARGET_" + qrId, targetUrl, 600); // 10 minutes cache
            }

            // Register scan metric
            try {
              const scansSheet = ss.getSheetByName("Scans");
              if (scansSheet) {
                scansSheet.appendRow([
                  "scan_" + Utilities.getUuid().substring(0, 8),
                  qrId,
                  new Date().toISOString(),
                  (e && e.parameter && e.parameter.userAgent) || "Mobile Scanner",
                  "IP_ANON"
                ]);
              }
              const currentCount = Number(rows[i][8] || 0);
              qrsSheet.getRange(i + 1, 9).setValue(currentCount + 1);
            } catch (errMetric) {
              Logger.log("Metric log error: " + errMetric.message);
            }
            break;
          }
        }
      }
    } catch (err) {
      Logger.log("Database lookup error: " + err.message);
    }
  }

  // 3. Return high-speed instant redirect
  if (targetUrl) {
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="0;url=${targetUrl}">
  <title>Redirigiendo... | INFOTEP</title>
  <style>
    body { background-color: #111125; color: #e2e0fc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .loader-card { text-align: center; background: #1e1e32; padding: 32px 48px; border-radius: 24px; border: 1px solid #333348; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .spinner { width: 44px; height: 44px; border: 4px solid #28283d; border-top-color: #ebc246; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { font-size: 20px; margin: 0 0 8px; color: #c0c1ff; font-weight: 600; }
    p { font-size: 14px; margin: 0; color: #c7c5d2; }
    a { color: #ebc246; text-decoration: none; word-break: break-all; }
  </style>
  <script>
    window.location.replace(${JSON.stringify(targetUrl)});
  </script>
</head>
<body>
  <div class="loader-card">
    <div class="spinner"></div>
    <h2>Redirigiendo...</h2>
    <p>Si no eres redirigido automáticamente, <a href="${targetUrl}">haz clic aquí</a>.</p>
  </div>
</body>
</html>`;
    return HtmlService.createHtmlOutput(html)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag("viewport", "width=device-width, initial-scale=1.0");
  }

  // Not found fallback
  return HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Código no disponible | INFOTEP</title></head>
    <body style="background:#111125;color:#e2e0fc;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;">
      <div style="background:#1e1e32;padding:36px;border-radius:20px;border:1px solid #464651;max-width:400px;margin:20px;">
        <h2 style="color:#ffb4ab;margin:0 0 8px;">Código no encontrado</h2>
        <p style="color:#c7c5d2;font-size:14px;margin:0;">El código QR solicitado no existe o se encuentra inactivo.</p>
      </div>
    </body>
    </html>
  `).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
