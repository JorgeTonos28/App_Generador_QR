/**
 * ============================================================================
 * INFOTEP QR Generator - Cloudflare Worker Redirector (HTTP 302 Nativo)
 * Dirección de Comunicaciones - Departamento de Mercadeo
 * ============================================================================
 * 
 * Ventajas:
 * 1. Redirección HTTP 302 nativa e instantánea (< 20ms).
 * 2. 0 clics: El navegador o celular redirige de inmediato.
 * 3. Abre automáticamente las apps nativas de Facebook, Instagram, YouTube, etc.
 * 4. Cero conflictos de cuentas de Google (no pasa por Google Apps Script).
 * 5. 100% gratuito de por vida (hasta 100,000 escaneos/día).
 */

// CONFIGURACIÓN:
// Pega aquí la URL completa que te dio Google al "Publicar en la web" como CSV
// O simplemente pon el SPREADSHEET_ID
let PUBLISHED_CSV_URL = "";
let SPREADSHEET_ID = "";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Extraer el ID del QR desde parámetro ?r= o desde la ruta /r/ID o /ID
    let qrId = url.searchParams.get("r") || url.searchParams.get("id") || url.searchParams.get("q") || "";
    
    if (!qrId) {
      const pathParts = url.pathname.split("/").filter(Boolean);
      if (pathParts.length > 0) {
        if (pathParts[0] === "r" && pathParts[1]) {
          qrId = pathParts[1];
        } else if (pathParts[0].startsWith("qr_")) {
          qrId = pathParts[0];
        }
      }
    }

    // Si entran a la raíz sin ID, mostrar página de estado
    if (!qrId) {
      return new Response(getWelcomeHtml(), {
        headers: { "Content-Type": "text/html;charset=UTF-8" }
      });
    }

    try {
      let urlsToTry = [];
      
      if (PUBLISHED_CSV_URL && PUBLISHED_CSV_URL.startsWith("http")) {
        urlsToTry.push(PUBLISHED_CSV_URL);
      }
      
      if (SPREADSHEET_ID && SPREADSHEET_ID.length > 10) {
        urlsToTry.push(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=QRs`);
        urlsToTry.push(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&sheet=QRs`);
        urlsToTry.push(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv`);
      }

      let csvText = "";
      let lastStatus = 0;

      for (const targetFetchUrl of urlsToTry) {
        try {
          const res = await fetch(targetFetchUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              "Accept": "text/csv,text/plain,*/*"
            },
            cf: {
              cacheTtl: 5,
              cacheEverything: true
            }
          });
          
          lastStatus = res.status;
          if (res.ok) {
            const txt = await res.text();
            if (txt && !txt.includes("<!DOCTYPE html") && !txt.includes("<html")) {
              csvText = txt;
              break;
            }
          }
        } catch(e) {}
      }

      if (!csvText) {
        return new Response(getNotFoundHtml(
          `No se pudo leer la hoja de cálculo (Estado HTTP: ${lastStatus}).<br><br>` +
          `Asegúrate de haber publicado la pestaña <strong>QRs</strong> como CSV en Google Sheets.`
        ), {
          status: 502,
          headers: { "Content-Type": "text/html;charset=UTF-8" }
        });
      }

      const rows = parseCSV(csvText);

      // Buscar el QR por ID (Columna 0 = ID, Columna 3 = Destino, Columna 9 = Estado)
      let targetUrl = "";
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row && row.length > 0) {
          const rowId = (row[0] || "").trim().replace(/^"|"$/g, '');
          const rowStatus = (row[9] || "").trim().toUpperCase().replace(/^"|"$/g, '');
          
          if (rowId === qrId && rowStatus === "ACTIVO") {
            targetUrl = (row[3] || "").trim().replace(/^"|"$/g, '');
            break;
          }
        }
      }

      if (targetUrl) {
        // Asegurar protocolo https://
        if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
          targetUrl = "https://" + targetUrl;
        }

        // REDIRECCIÓN HTTP 302 NATIVA E INSTANTÁNEA (0 Clics)
        return Response.redirect(targetUrl, 302);
      }

      // Si no existe o está inactivo
      return new Response(getNotFoundHtml(`El código QR <code>${qrId}</code> no existe o se encuentra inactivo.`), {
        status: 404,
        headers: { "Content-Type": "text/html;charset=UTF-8" }
      });

    } catch (err) {
      return new Response(getNotFoundHtml("Error al procesar la redirección: " + err.message), {
        status: 500,
        headers: { "Content-Type": "text/html;charset=UTF-8" }
      });
    }
  }
};

/**
 * Parser de CSV robusto y seguro
 */
function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  const result = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const row = [];
    let insideQuotes = false;
    let currentCell = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        row.push(currentCell.trim());
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    row.push(currentCell.trim());
    result.push(row);
  }
  return result;
}

function getWelcomeHtml() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>INFOTEP QR Service</title>
  <style>
    body { background: #111125; color: #e2e0fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #1e1e32; padding: 40px 32px; border-radius: 24px; border: 1px solid #333348; text-align: center; max-width: 420px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    h2 { color: #ebc246; margin: 0 0 12px; font-size: 20px; }
    p { color: #c7c5d2; font-size: 14px; margin: 0; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <h2>INFOTEP • Servicio de Redirección QR</h2>
    <p>El microservicio de redirección ultra-rápida en Cloudflare se encuentra activo y operando correctamente.</p>
  </div>
</body>
</html>`;
}

function getNotFoundHtml(message) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código no disponible | INFOTEP</title>
  <style>
    body { background: #111125; color: #e2e0fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #1e1e32; padding: 36px 28px; border-radius: 24px; border: 1px solid #464651; text-align: center; max-width: 440px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    h2 { color: #ffb4ab; margin: 0 0 12px; font-size: 20px; }
    p { color: #c7c5d2; font-size: 14px; margin: 0; line-height: 1.6; }
    code { background: #131329; padding: 2px 6px; border-radius: 6px; color: #ebc246; }
    strong { color: #ffffff; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Aviso del Redireccionador</h2>
    <p>${message}</p>
  </div>
</body>
</html>`;
}
