/**
 * ============================================================================
 * INFOTEP - QR Generator Marketing System
 * Dirección de Comunicaciones - Departamento de Mercadeo
 * ============================================================================
 * Backend Controller & REST-like API for Google Apps Script
 */

const APP_VERSION = "1.3.0";
const DEFAULT_PRIMARY_COLOR = "#131360";
const DEFAULT_SECONDARY_COLOR = "#ebc246";

/**
 * Inclusion helper for Apps Script HTML templates
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Obtains the active Google Spreadsheet or creates/binds one dynamically
 */
function getSpreadsheet_() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}

  const props = PropertiesService.getScriptProperties();
  let sheetId = props.getProperty("SPREADSHEET_ID");
  if (sheetId) {
    try {
      return SpreadsheetApp.openById(sheetId);
    } catch (e) {
      Logger.log("Could not open stored spreadsheet ID, creating new one: " + e.message);
    }
  }

  // Create new dedicated spreadsheet
  const newSs = SpreadsheetApp.create("BD - INFOTEP Generador QR Mercadeo");
  props.setProperty("SPREADSHEET_ID", newSs.getId());
  setupInitialSheets(newSs);
  return newSs;
}

/**
 * Initializes required sheets and seed data
 */
function setupInitialSheets(ss) {
  if (!ss) ss = getSpreadsheet_();

  // 1. Sheet: Config
  let configSheet = ss.getSheetByName("Config");
  if (!configSheet) {
    configSheet = ss.insertSheet("Config");
    const configData = [
      ["Clave", "Valor", "Descripcion"],
      ["APP_NAME", "INFOTEP QR Generator", "Nombre del sistema"],
      ["APP_VERSION", APP_VERSION, "Versión actual"],
      ["PRIMARY_COLOR", "#131360", "Color primario institucional (Azul Marino)"],
      ["SECONDARY_COLOR", "#ebc246", "Color secundario de mercadeo (Amarillo)"],
      ["LOGO_FILE_ID", "", "ID de Google Drive para el logotipo institucional"],
      ["ADMIN_EMAILS", Session.getActiveUser().getEmail() || "admin@infotep.edu.do", "Correos de administradores iniciales"],
      ["WEBAPP_URL", ScriptApp.getService().getUrl() || "", "URL del despliegue de la Web App"],
      ["REDIRECTOR_URL", "", "URL opcional de un Micro-Redirector público externo"]
    ];
    configSheet.getRange(1, 1, configData.length, configData[0].length).setValues(configData);
    configSheet.getRange("A1:C1").setFontWeight("bold").setBackground("#131360").setFontColor("#ffffff");
  }

  // 2. Sheet: Usuarios
  let usersSheet = ss.getSheetByName("Usuarios");
  if (!usersSheet) {
    usersSheet = ss.insertSheet("Usuarios");
    const userEmail = Session.getActiveUser().getEmail() || "admin@infotep.edu.do";
    const usersData = [
      ["correo", "nombre", "departamento", "rol", "estado", "creado_por", "fecha_creacion", "ultimo_acceso"],
      [userEmail, "Administrador Principal", "Mercadeo y Comunicaciones", "ADMIN", "ACTIVO", "SISTEMA", new Date().toISOString(), new Date().toISOString()],
      ["mrodriguez@infotep.edu.do", "María Rodríguez", "Comunicaciones", "USUARIO", "ACTIVO", userEmail, new Date().toISOString(), new Date().toISOString()],
      ["cgomez@infotep.edu.do", "Carlos Gómez", "Relaciones Públicas", "USUARIO", "ACTIVO", userEmail, new Date().toISOString(), new Date().toISOString()]
    ];
    usersSheet.getRange(1, 1, usersData.length, usersData[0].length).setValues(usersData);
    usersSheet.getRange("A1:H1").setFontWeight("bold").setBackground("#131360").setFontColor("#ffffff");
  }

  // 3. Sheet: QRs
  let qrsSheet = ss.getSheetByName("QRs");
  if (!qrsSheet) {
    qrsSheet = ss.insertSheet("QRs");
    const userEmail = Session.getActiveUser().getEmail() || "admin@infotep.edu.do";
    const qrsHeaders = [
      ["id", "nombre", "tipo", "url_destino", "url_corta", "color_hex", "incluye_logo", "estilo_marco", "escaneos_totales", "estado", "creado_por", "fecha_creacion", "ultima_modificacion"],
      ["qr_mkt_v2024", "Campaña Verano 2024", "DINAMICO", "https://infotep.gob.do/oferta-academica", "?r=qr_mkt_v2024", "#131360", "SI", "BASICO", 1248, "ACTIVO", userEmail, new Date(Date.now() - 86400000 * 5).toISOString(), new Date().toISOString()],
      ["qr_mkt_pdf01", "Folleto Institucional PDF", "ESTATICO", "https://infotep.gob.do/folleto.pdf", "https://infotep.gob.do/folleto.pdf", "#111125", "SI", "ESCANAME", 320, "ACTIVO", userEmail, new Date(Date.now() - 86400000 * 10).toISOString(), new Date().toISOString()],
      ["qr_mkt_semi3", "Registro Seminario Tech", "DINAMICO", "https://infotep.gob.do/seminario-tech", "?r=qr_mkt_semi3", "#009c51", "SI", "BASICO", 892, "ACTIVO", userEmail, new Date(Date.now() - 86400000 * 3).toISOString(), new Date().toISOString()],
      ["qr_mkt_promo", "Promo Estudiantes", "DINAMICO", "https://infotep.gob.do/promo-estudiantes", "?r=qr_mkt_promo", "#ebc246", "SI", "ESCANAME", 12450, "ACTIVO", userEmail, new Date(Date.now() - 86400000 * 20).toISOString(), new Date().toISOString()]
    ];
    qrsSheet.getRange(1, 1, qrsHeaders.length, qrsHeaders[0].length).setValues(qrsHeaders);
    qrsSheet.getRange("A1:M1").setFontWeight("bold").setBackground("#131360").setFontColor("#ffffff");
  }

  // 4. Sheet: Scans
  let scansSheet = ss.getSheetByName("Scans");
  if (!scansSheet) {
    scansSheet = ss.insertSheet("Scans");
    const scansData = [
      ["id_scan", "id_qr", "fecha_hora", "user_agent", "ip_hint"],
      ["scan_1001", "qr_mkt_promo", new Date().toISOString(), "Mobile Safari / iOS", "179.53.x.x"],
      ["scan_1002", "qr_mkt_v2024", new Date(Date.now() - 3600000 * 2).toISOString(), "Chrome Mobile / Android", "179.53.x.x"],
      ["scan_1003", "qr_mkt_semi3", new Date(Date.now() - 3600000 * 5).toISOString(), "Mobile Safari / iOS", "179.53.x.x"]
    ];
    scansSheet.getRange(1, 1, scansData.length, scansData[0].length).setValues(scansData);
    scansSheet.getRange("A1:E1").setFontWeight("bold").setBackground("#131360").setFontColor("#ffffff");
  }

  // Remove default "Hoja 1" if other sheets exist
  const defaultSheet = ss.getSheetByName("Hoja 1") || ss.getSheetByName("Sheet1");
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch (e) {}
  }

  return { success: true, message: "Base de datos inicializada correctamente." };
}

/**
 * Retrieves configuration values from Config sheet
 */
function getConfigMap_() {
  const ss = getSpreadsheet_();
  const configSheet = ss.getSheetByName("Config");
  if (!configSheet) return {};

  const rows = configSheet.getDataRange().getValues();
  const map = {};
  for (let i = 1; i < rows.length; i++) {
    const key = String(rows[i][0] || "").trim();
    if (key) {
      map[key] = rows[i][1];
    }
  }
  return map;
}

/**
 * Resolves Base64 Data URL for institutional logo from Drive or Fallback Assets
 */
function getLogoDataUrl_() {
  const config = getConfigMap_();
  const fileId = config["LOGO_FILE_ID"];
  if (fileId) {
    try {
      const file = DriveApp.getFileById(fileId);
      const blob = file.getBlob();
      const contentType = blob.getContentType() || "image/png";
      const base64 = Utilities.base64Encode(blob.getBytes());
      return "data:" + contentType + ";base64," + base64;
    } catch (e) {
      Logger.log("Error reading logo from Drive ID: " + e.message);
    }
  }
  if (typeof APP_INFOTEP_LOGO_COLOR !== "undefined" && APP_INFOTEP_LOGO_COLOR) {
    return APP_INFOTEP_LOGO_COLOR;
  }
  return "";
}

/**
 * Access Control: Checks user privileges from Session and Usuarios sheet
 */
function getCurrentUser_() {
  let email = "";
  try {
    email = (Session.getActiveUser().getEmail() || "").toLowerCase().trim();
  } catch (e) {}

  const config = getConfigMap_();
  const adminEmails = (config["ADMIN_EMAILS"] || "")
    .toLowerCase()
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const ss = getSpreadsheet_();
  const usersSheet = ss.getSheetByName("Usuarios");
  
  if (!email) {
    if (adminEmails.length > 0) {
      email = adminEmails[0];
    } else {
      email = "usuario@infotep.edu.do";
    }
  }

  let userRecord = null;
  if (usersSheet) {
    const rows = usersSheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      const rowEmail = String(rows[i][0] || "").toLowerCase().trim();
      if (rowEmail === email) {
        userRecord = {
          email: rowEmail,
          name: rows[i][1] || "Usuario",
          department: rows[i][2] || "Mercadeo",
          role: String(rows[i][3] || "USUARIO").toUpperCase().trim(),
          status: String(rows[i][4] || "ACTIVO").toUpperCase().trim()
        };
        break;
      }
    }
  }

  if (!userRecord && (adminEmails.includes(email) || adminEmails.length === 0)) {
    userRecord = {
      email: email,
      name: "Administrador Mercadeo",
      department: "Mercadeo y Comunicaciones",
      role: "ADMIN",
      status: "ACTIVO"
    };
    if (usersSheet) {
      usersSheet.appendRow([userRecord.email, userRecord.name, userRecord.department, userRecord.role, userRecord.status, "SISTEMA", new Date().toISOString(), new Date().toISOString()]);
    }
  }

  if (!userRecord) {
    return {
      email: email,
      name: "Invitado",
      department: "General",
      role: "GUEST",
      status: "UNAUTHORIZED"
    };
  }

  return userRecord;
}

/**
 * Handle dynamic QR redirection or Web App presentation
 */
function doGet(e) {
  const qrId = (e && e.parameter && (e.parameter.r || e.parameter.id || e.parameter.q)) || "";
  
  if (qrId) {
    return handleQrRedirect_(qrId.trim(), e);
  }

  const currentUser = getCurrentUser_();

  if (currentUser.status !== "ACTIVO") {
    const deniedTpl = HtmlService.createTemplateFromFile("Denied");
    deniedTpl.userEmail = currentUser.email;
    deniedTpl.userStatus = currentUser.status;
    return deniedTpl.evaluate()
      .setTitle("Acceso Denegado - INFOTEP QR Generator")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag("viewport", "width=device-width, initial-scale=1.0");
  }

  const indexTpl = HtmlService.createTemplateFromFile("Index");
  indexTpl.appVersion = APP_VERSION;
  indexTpl.currentUserJson = JSON.stringify(currentUser);
  indexTpl.logoDataUrl = getLogoDataUrl_();
  indexTpl.webAppUrl = ScriptApp.getService().getUrl() || "";

  return indexTpl.evaluate()
    .setTitle("INFOTEP - Generador de Códigos QR")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0");
}

/**
 * Performs high-speed redirection for dynamic QRs and logs the scan
 */
function handleQrRedirect_(qrId, e) {
  const cache = CacheService.getScriptCache();
  let targetUrl = cache.get("QR_TARGET_" + qrId);

  if (!targetUrl) {
    const ss = getSpreadsheet_();
    const qrsSheet = ss.getSheetByName("QRs");
    if (qrsSheet) {
      const rows = qrsSheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        const id = String(rows[i][0] || "").trim();
        const status = String(rows[i][9] || "").toUpperCase().trim();
        if (id === qrId && status === "ACTIVO") {
          targetUrl = String(rows[i][3] || "").trim();
          if (targetUrl) {
            cache.put("QR_TARGET_" + qrId, targetUrl, 600);
          }
          break;
        }
      }
    }
  }

  if (targetUrl) {
    try {
      recordScan_(qrId, e);
    } catch (err) {
      Logger.log("Error recording scan: " + err.message);
    }

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

  const notFoundHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código QR no disponible | INFOTEP</title>
  <style>
    body { background-color: #111125; color: #e2e0fc; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .box { text-align: center; background: #1e1e32; padding: 40px; border-radius: 20px; border: 1px solid #464651; max-width: 420px; margin: 20px; }
    h1 { color: #ffb4ab; margin-top: 0; }
    p { color: #c7c5d2; font-size: 15px; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Código no encontrado</h1>
    <p>El código QR solicitado no existe o se encuentra inactivo.</p>
  </div>
</body>
</html>`;
  return HtmlService.createHtmlOutput(notFoundHtml)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0");
}

/**
 * Registers a scan record and increments scan counter
 */
function recordScan_(qrId, e) {
  const ss = getSpreadsheet_();
  const userAgent = (e && e.parameter && e.parameter.userAgent) || "Scanner Móvil / Navegador";
  
  const scansSheet = ss.getSheetByName("Scans");
  if (scansSheet) {
    const scanId = "scan_" + Utilities.getUuid().substring(0, 8);
    scansSheet.appendRow([scanId, qrId, new Date().toISOString(), userAgent, "IP_ANON"]);
  }

  const qrsSheet = ss.getSheetByName("QRs");
  if (qrsSheet) {
    const rows = qrsSheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0] || "").trim() === qrId) {
        const currentCount = Number(rows[i][8] || 0);
        qrsSheet.getRange(i + 1, 9).setValue(currentCount + 1);
        break;
      }
    }
  }
}

// ============================================================================
// CLIENT-FACING REST / RPC API METHODS
// ============================================================================

/**
 * Bootstrap call: Returns user, initial dashboard stats, config, and QRs
 */
function apiBootstrap() {
  const currentUser = getCurrentUser_();
  if (currentUser.status !== "ACTIVO") {
    throw new Error("Usuario inactivo o no autorizado.");
  }

  const ss = getSpreadsheet_();
  const dashboard = apiGetDashboard();
  const qrs = apiGetQRs();
  const config = getConfigMap_();
  const users = currentUser.role === "ADMIN" ? apiGetUsers() : [];

  // Effective redirector URL: config.REDIRECTOR_URL (if provided) > config.WEBAPP_URL > script service url
  const effectiveRedirectUrl = config["REDIRECTOR_URL"] || config["WEBAPP_URL"] || ScriptApp.getService().getUrl() || "";

  return {
    version: APP_VERSION,
    user: currentUser,
    config: config,
    dashboard: dashboard,
    qrs: qrs,
    users: users,
    spreadsheetId: ss.getId(),
    webAppUrl: effectiveRedirectUrl,
    logoDataUrl: getLogoDataUrl_()
  };
}

/**
 * Returns summary metrics for the Dashboard
 */
function apiGetDashboard() {
  const currentUser = getCurrentUser_();
  const ss = getSpreadsheet_();
  const qrsSheet = ss.getSheetByName("QRs");
  
  let totalQRs = 0;
  let totalScans = 0;
  let dynamicCount = 0;
  let recentActivity = [];
  let topQR = null;

  if (qrsSheet) {
    const rows = qrsSheet.getDataRange().getValues();
    const list = [];

    for (let i = 1; i < rows.length; i++) {
      const id = String(rows[i][0] || "").trim();
      if (!id) continue;

      const createdBy = String(rows[i][10] || "").toLowerCase().trim();
      const isOwnerOrAdmin = currentUser.role === "ADMIN" || createdBy === currentUser.email.toLowerCase();

      if (!isOwnerOrAdmin) continue;

      const scans = Number(rows[i][8] || 0);
      const isDynamic = String(rows[i][2] || "").toUpperCase() === "DINAMICO";
      const item = {
        id: id,
        name: rows[i][1],
        type: rows[i][2],
        targetUrl: rows[i][3],
        shortUrl: rows[i][4],
        colorHex: rows[i][5] || "#131360",
        hasLogo: rows[i][6] === "SI",
        frameStyle: rows[i][7] || "BASICO",
        scanCount: scans,
        status: rows[i][9],
        createdBy: rows[i][10],
        createdAt: rows[i][11],
        updatedAt: rows[i][12]
      };

      list.push(item);
      totalQRs++;
      totalScans += scans;
      if (isDynamic) dynamicCount++;
    }

    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    recentActivity = list.slice(0, 5);

    if (list.length > 0) {
      const sortedByScans = [...list].sort((a, b) => b.scanCount - a.scanCount);
      topQR = sortedByScans[0];
    }
  }

  return {
    totalQRs: totalQRs,
    totalScans: totalScans,
    dynamicCount: dynamicCount,
    dynamicPercent: totalQRs > 0 ? Math.round((dynamicCount / totalQRs) * 100) : 0,
    recentActivity: recentActivity,
    topQR: topQR
  };
}

/**
 * Returns filtered list of QR codes based on user role and query
 */
function apiGetQRs(searchQuery, filterType) {
  const currentUser = getCurrentUser_();
  const ss = getSpreadsheet_();
  const qrsSheet = ss.getSheetByName("QRs");
  const result = [];

  if (!qrsSheet) return result;

  const rows = qrsSheet.getDataRange().getValues();
  const query = (searchQuery || "").toLowerCase().trim();
  const filter = (filterType || "TODOS").toUpperCase().trim();

  for (let i = 1; i < rows.length; i++) {
    const id = String(rows[i][0] || "").trim();
    if (!id) continue;

    const name = String(rows[i][1] || "");
    const type = String(rows[i][2] || "").toUpperCase().trim();
    const targetUrl = String(rows[i][3] || "");
    const shortUrl = String(rows[i][4] || "");
    const colorHex = String(rows[i][5] || "#131360");
    const hasLogo = String(rows[i][6] || "") === "SI";
    const frameStyle = String(rows[i][7] || "BASICO");
    const scans = Number(rows[i][8] || 0);
    const status = String(rows[i][9] || "ACTIVO").toUpperCase().trim();
    const createdBy = String(rows[i][10] || "").toLowerCase().trim();
    const createdAt = rows[i][11];
    const updatedAt = rows[i][12];

    const isOwner = createdBy === currentUser.email.toLowerCase();
    const isAdmin = currentUser.role === "ADMIN";
    if (!isAdmin && !isOwner) continue;

    if (filter === "DINAMICOS" && type !== "DINAMICO") continue;
    if (filter === "ESTATICOS" && type !== "ESTATICO") continue;

    if (query && !name.toLowerCase().includes(query) && !targetUrl.toLowerCase().includes(query)) {
      continue;
    }

    result.push({
      id: id,
      name: name,
      type: type,
      targetUrl: targetUrl,
      shortUrl: shortUrl,
      colorHex: colorHex,
      hasLogo: hasLogo,
      frameStyle: frameStyle,
      scanCount: scans,
      status: status,
      createdBy: createdBy,
      createdAt: createdAt,
      updatedAt: updatedAt,
      canEdit: isAdmin || isOwner
    });
  }

  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return result;
}

/**
 * Creates a new QR Code record
 */
function apiSaveQR(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const currentUser = getCurrentUser_();
    if (currentUser.status !== "ACTIVO") {
      throw new Error("No tienes permisos para crear códigos QR.");
    }

    if (!payload.name || !payload.targetUrl) {
      throw new Error("El nombre de la campaña y la URL de destino son obligatorios.");
    }

    const ss = getSpreadsheet_();
    const qrsSheet = ss.getSheetByName("QRs");
    if (!qrsSheet) throw new Error("Hoja QRs no encontrada.");

    const id = "qr_mkt_" + Utilities.getUuid().substring(0, 6);
    const type = (payload.type || "dynamic").toUpperCase() === "STATIC" || (payload.type || "").toUpperCase() === "ESTATICO" ? "ESTATICO" : "DINAMICO";
    const now = new Date().toISOString();
    
    const config = getConfigMap_();
    const effectiveBaseUrl = config["REDIRECTOR_URL"] || config["WEBAPP_URL"] || ScriptApp.getService().getUrl() || "";
    const shortUrl = type === "DINAMICO" ? (effectiveBaseUrl ? `${effectiveBaseUrl}?r=${id}` : `?r=${id}`) : payload.targetUrl.trim();

    const rowData = [
      id,
      payload.name.trim(),
      type,
      payload.targetUrl.trim(),
      shortUrl,
      payload.colorHex || "#131360",
      payload.hasLogo !== false ? "SI" : "NO",
      payload.frameStyle || "BASICO",
      0,
      "ACTIVO",
      currentUser.email,
      now,
      now
    ];

    qrsSheet.appendRow(rowData);

    if (type === "DINAMICO") {
      CacheService.getScriptCache().put("QR_TARGET_" + id, payload.targetUrl.trim(), 600);
    }

    return {
      success: true,
      qr: {
        id: id,
        name: payload.name.trim(),
        type: type,
        targetUrl: payload.targetUrl.trim(),
        shortUrl: shortUrl,
        colorHex: payload.colorHex || "#131360",
        hasLogo: payload.hasLogo !== false,
        frameStyle: payload.frameStyle || "BASICO",
        scanCount: 0,
        status: "ACTIVO",
        createdBy: currentUser.email,
        createdAt: now,
        updatedAt: now,
        canEdit: true
      }
    };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Updates destination URL for an existing dynamic QR code
 */
function apiUpdateQRUrl(qrId, newTargetUrl) {
  if (!qrId || !newTargetUrl) {
    throw new Error("ID y nueva URL son obligatorios.");
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const currentUser = getCurrentUser_();
    const ss = getSpreadsheet_();
    const qrsSheet = ss.getSheetByName("QRs");
    if (!qrsSheet) throw new Error("Hoja QRs no encontrada.");

    const rows = qrsSheet.getDataRange().getValues();
    let rowIndex = -1;
    let qrRow = null;

    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0] || "").trim() === qrId) {
        rowIndex = i + 1;
        qrRow = rows[i];
        break;
      }
    }

    if (rowIndex === -1) {
      throw new Error("Código QR no encontrado.");
    }

    const createdBy = String(qrRow[10] || "").toLowerCase().trim();
    if (currentUser.role !== "ADMIN" && createdBy !== currentUser.email.toLowerCase()) {
      throw new Error("No tienes autorización para editar este código QR.");
    }

    const cleanUrl = newTargetUrl.trim();
    const now = new Date().toISOString();

    qrsSheet.getRange(rowIndex, 4).setValue(cleanUrl);
    qrsSheet.getRange(rowIndex, 13).setValue(now);

    CacheService.getScriptCache().put("QR_TARGET_" + qrId, cleanUrl, 600);

    return {
      success: true,
      qrId: qrId,
      newTargetUrl: cleanUrl,
      updatedAt: now
    };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Deletes or archives a QR Code
 */
function apiDeleteQR(qrId) {
  if (!qrId) throw new Error("ID de QR inválido.");

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const currentUser = getCurrentUser_();
    const ss = getSpreadsheet_();
    const qrsSheet = ss.getSheetByName("QRs");
    if (!qrsSheet) throw new Error("Hoja QRs no encontrada.");

    const rows = qrsSheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0] || "").trim() === qrId) {
        const createdBy = String(rows[i][10] || "").toLowerCase().trim();
        if (currentUser.role !== "ADMIN" && createdBy !== currentUser.email.toLowerCase()) {
          throw new Error("No tienes permiso para eliminar este código QR.");
        }
        qrsSheet.deleteRow(i + 1);
        CacheService.getScriptCache().remove("QR_TARGET_" + qrId);
        return { success: true, message: "Código QR eliminado correctamente." };
      }
    }

    throw new Error("Código QR no encontrado.");
  } finally {
    lock.releaseLock();
  }
}

/**
 * User Management: Get list of users (Admin only)
 */
function apiGetUsers() {
  const currentUser = getCurrentUser_();
  if (currentUser.role !== "ADMIN") {
    throw new Error("Solo los administradores pueden gestionar usuarios.");
  }

  const ss = getSpreadsheet_();
  const usersSheet = ss.getSheetByName("Usuarios");
  const list = [];
  if (!usersSheet) return list;

  const rows = usersSheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const email = String(rows[i][0] || "").trim();
    if (!email) continue;

    list.push({
      email: email,
      name: rows[i][1] || "",
      department: rows[i][2] || "",
      role: String(rows[i][3] || "USUARIO").toUpperCase().trim(),
      status: String(rows[i][4] || "ACTIVO").toUpperCase().trim(),
      createdBy: rows[i][5] || "",
      createdAt: rows[i][6] || "",
      lastAccess: rows[i][7] || ""
    });
  }

  return list;
}

/**
 * User Management: Save or update a user (Admin only)
 */
function apiSaveUser(userData) {
  const currentUser = getCurrentUser_();
  if (currentUser.role !== "ADMIN") {
    throw new Error("Solo los administradores pueden registrar usuarios.");
  }

  if (!userData.email || !userData.name) {
    throw new Error("Nombre y correo son requeridos.");
  }

  const cleanEmail = userData.email.toLowerCase().trim();
  const cleanName = userData.name.trim();
  const role = (userData.role || "USUARIO").toUpperCase().trim();
  const department = (userData.department || "Mercadeo").trim();
  const status = (userData.status || "ACTIVO").toUpperCase().trim();

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const ss = getSpreadsheet_();
    const usersSheet = ss.getSheetByName("Usuarios");
    if (!usersSheet) throw new Error("Hoja Usuarios no encontrada.");

    const rows = usersSheet.getDataRange().getValues();
    let rowIndex = -1;

    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0] || "").toLowerCase().trim() === cleanEmail) {
        rowIndex = i + 1;
        break;
      }
    }

    const now = new Date().toISOString();

    if (rowIndex > -1) {
      usersSheet.getRange(rowIndex, 2).setValue(cleanName);
      usersSheet.getRange(rowIndex, 3).setValue(department);
      usersSheet.getRange(rowIndex, 4).setValue(role);
      usersSheet.getRange(rowIndex, 5).setValue(status);
    } else {
      usersSheet.appendRow([cleanEmail, cleanName, department, role, status, currentUser.email, now, now]);
    }

    return {
      success: true,
      user: {
        email: cleanEmail,
        name: cleanName,
        department: department,
        role: role,
        status: status
      }
    };
  } finally {
    lock.releaseLock();
  }
}

/**
 * User Management: Toggle user status between ACTIVO and INACTIVO (Admin only)
 */
function apiToggleUserStatus(userEmail, newStatus) {
  const currentUser = getCurrentUser_();
  if (currentUser.role !== "ADMIN") {
    throw new Error("Permiso denegado.");
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const ss = getSpreadsheet_();
    const usersSheet = ss.getSheetByName("Usuarios");
    const rows = usersSheet.getDataRange().getValues();
    const targetEmail = (userEmail || "").toLowerCase().trim();

    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0] || "").toLowerCase().trim() === targetEmail) {
        const cleanStatus = (newStatus || "ACTIVO").toUpperCase().trim();
        usersSheet.getRange(i + 1, 5).setValue(cleanStatus);
        return { success: true, email: targetEmail, status: cleanStatus };
      }
    }

    throw new Error("Usuario no encontrado.");
  } finally {
    lock.releaseLock();
  }
}

/**
 * Admin: Update configuration values
 */
function apiSaveConfig(configObj) {
  const currentUser = getCurrentUser_();
  if (currentUser.role !== "ADMIN") {
    throw new Error("Solo administradores pueden cambiar la configuración.");
  }

  const ss = getSpreadsheet_();
  const configSheet = ss.getSheetByName("Config");
  if (!configSheet) throw new Error("Hoja Config no encontrada.");

  const rows = configSheet.getDataRange().getValues();
  for (let key in configObj) {
    let found = false;
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0] || "").trim() === key) {
        configSheet.getRange(i + 1, 2).setValue(configObj[key]);
        found = true;
        break;
      }
    }
    if (!found) {
      configSheet.appendRow([key, configObj[key], "Configurado desde interfaz"]);
    }
  }

  return { success: true, message: "Configuración guardada exitosamente." };
}
