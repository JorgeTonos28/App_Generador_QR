/**
 * ============================================================================
 * INFOTEP QR Generator - Micro-Redirector Público Independiente
 * Dirección de Comunicaciones - Departamento de Mercadeo
 * ============================================================================
 * Propósito:
 * Servicio complementario ultraligero que se despliega en un PROYECTO SEPARADO
 * de Apps Script como Web App pública (Acceso: "Anyone / Cualquier persona")
 * exclusivamente para procesar las redirecciones de códigos QR dinámicos
 * y contabilizar escaneos.
 *
 * CONFIGURACIÓN:
 * 1. Pega este código en Código.gs de un proyecto nuevo en Apps Script.
 * 2. Asigna el ID de tu Google Sheet en SPREADSHEET_ID.
 * 3. Implementa como Aplicación Web:
 *    - Ejecutar como: "Yo" (tu cuenta)
 *    - Quién tiene acceso: "Cualquier persona" (Anyone)
 */

// Configura aquí el ID de la hoja de cálculo de Google Sheets compartida
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

  let targetUrl = "";
  let qrName = "Campaña Institucional";
  let logoDataUrl = "";

  // Query shared Google Sheet directly in real-time
  if (SPREADSHEET_ID) {
    try {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const qrsSheet = ss.getSheetByName("QRs");
      if (qrsSheet) {
        const rows = qrsSheet.getDataRange().getValues();
        for (let i = 1; i < rows.length; i++) {
          const id = String(rows[i][0] || "").trim();
          const status = String(rows[i][9] || "").toUpperCase().trim();
          if (id === qrId && status === "ACTIVO") {
            qrName = String(rows[i][1] || "Campaña INFOTEP").trim();
            targetUrl = String(rows[i][3] || "").trim();

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

  // Institutional Branded Landing Portal
  if (targetUrl) {
    let cleanDest = targetUrl;
    if (!cleanDest.startsWith('http://') && !cleanDest.startsWith('https://')) {
      cleanDest = 'https://' + cleanDest;
    }

    let displayDest = cleanDest;
    try {
      const u = new URL(cleanDest);
      displayDest = u.hostname.replace('www.', '') + (u.pathname && u.pathname !== '/' ? u.pathname : '');
    } catch(e) {
      displayDest = cleanDest;
    }

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <base target="_top">
  <title>${qrName} | INFOTEP</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Sora:wght@700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #111125;
      color: #e2e0fc;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #1a1a36;
      border: 1px solid #323258;
      border-radius: 28px;
      padding: 36px 28px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      animation: fadeIn 0.4s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .logo-container {
      width: 80px;
      height: 80px;
      background: #ffffff;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
      border: 2px solid #ebc246;
    }
    .logo-container svg {
      width: 100%;
      height: 100%;
    }
    .title-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .inst-name {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #ebc246;
      text-transform: uppercase;
    }
    .campaign-title {
      font-family: 'Sora', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.3;
    }
    .dest-hint {
      font-size: 12px;
      color: #9d9bb8;
      background: #131329;
      padding: 10px 16px;
      border-radius: 14px;
      border: 1px solid #282846;
      word-break: break-all;
      max-width: 100%;
    }
    .dest-hint strong {
      color: #c0c1ff;
    }
    .btn-continue {
      background: #ebc246;
      color: #131360;
      font-family: 'Sora', sans-serif;
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-decoration: none;
      padding: 16px 28px;
      border-radius: 18px;
      width: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 10px 25px rgba(235, 194, 70, 0.35);
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .btn-continue:hover {
      background: #f7d264;
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(235, 194, 70, 0.45);
    }
    .btn-continue:active {
      transform: scale(0.98);
    }
    .footer-note {
      font-size: 11px;
      color: #6b6985;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo-container">
      <!-- Authentic INFOTEP Emblem -->
      <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Orbit & Gear in institutional INFOTEP colors -->
        <path d="M60 10C35 10 15 24 15 40C15 56 35 60 60 60C85 60 105 46 105 30" stroke="#131360" stroke-width="6" stroke-linecap="round"/>
        <path d="M45 25L60 6L75 25" fill="#009c51"/>
        <circle cx="60" cy="35" r="14" fill="#ebc246" stroke="#131360" stroke-width="4"/>
        <text x="60" y="66" text-anchor="middle" font-family="'Sora', sans-serif" font-weight="900" font-size="14" fill="#131360" letter-spacing="1">INFOTEP</text>
      </svg>
    </div>

    <div class="title-group">
      <span class="inst-name">INFOTEP</span>
      <h1 class="campaign-title">${qrName}</h1>
    </div>

    <div class="dest-hint">
      Destino: <strong>${displayDest}</strong>
    </div>

    <a href="${cleanDest}" target="_top" class="btn-continue" id="btn-go">
      <span>Continuar al enlace</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </a>

    <span class="footer-note">Código QR Oficial • Dirección de Comunicaciones</span>
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
