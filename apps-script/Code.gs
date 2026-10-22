/**
 * Réception des réponses de l'enquête « herbiers marins » → Google Sheets + Google Drive
 * ------------------------------------------------------------------------------
 * À coller dans : Google Sheet > Extensions > Apps Script (script lié à la feuille).
 * Voir README.md, étape 2, pour le déploiement en « Application Web ».
 *
 * Onglets créés automatiquement :
 *   - Reponses : une ligne par répondant (sections A, B, C, I, M, N)
 *   - Methodes : une ligne par méthode décrite (sections C18–20, D à M ; lien via response_id)
 *   - Journal  : erreurs éventuelles
 * Les photos sont enregistrées dans un dossier Drive (un sous-dossier par réponse).
 */

// ID du dossier Google Drive pour les photos (la partie après /folders/ dans l'URL du dossier).
// Laisser vide pour créer automatiquement un dossier « Enquete_herbiers_photos » à la racine du Drive.
const PHOTO_FOLDER_ID = "";

const SHEET_RESPONSES = "Reponses";
const SHEET_METHODS = "Methodes";
const SHEET_LOG = "Journal";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const data = JSON.parse(e.postData.contents);

    // Champ piège anti-robots : rempli = soumission ignorée
    if (data.website) return json_({ ok: true });
    if (!data.response_id || !data.general) throw new Error("Données incomplètes");

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Doublon (double-clic, renvoi après coupure réseau) : on ne réenregistre pas
    if (alreadyStored_(ss, data.response_id)) return json_({ ok: true, duplicate: true, id: data.response_id });

    const links = savePhotos_(data.photos || [], data.response_id, data.general.q03);
    const now = new Date();

    const meta = {
      response_id: data.response_id,
      horodatage_serveur: now,
      survey_version: data.survey_version,
      started_at: data.started_at,
      submitted_at_client: data.submitted_at_client,
      duration_min: data.duration_min
    };

    appendObject_(ss, SHEET_RESPONSES, Object.assign({}, meta, data.general, {
      photos_liens: links.join(" | ")
    }));

    (data.methods || []).forEach(function (m) {
      appendObject_(ss, SHEET_METHODS, Object.assign({
        response_id: data.response_id,
        horodatage_serveur: now,
        q03: data.general.q03
      }, m));
    });

    return json_({ ok: true, id: data.response_id });
  } catch (err) {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const log = ss.getSheetByName(SHEET_LOG) || ss.insertSheet(SHEET_LOG);
      log.appendRow([new Date(), String(err), (e && e.postData) ? e.postData.contents.slice(0, 2000) : ""]);
    } catch (ignored) {}
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Test rapide : ouvrir l'URL /exec dans le navigateur doit afficher {"ok":true,...}
function doGet() {
  return json_({ ok: true, message: "Service de collecte actif" });
}

/* ----------------------------------------------------------------- utilitaires */

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function alreadyStored_(ss, id) {
  const sh = ss.getSheetByName(SHEET_RESPONSES);
  if (!sh || sh.getLastRow() < 2) return false;
  const found = sh.getRange(2, 1, sh.getLastRow() - 1, 1).createTextFinder(id).matchEntireCell(true).findNext();
  return !!found;
}

/** Ajoute une ligne ; crée les colonnes manquantes à la volée (l'ordre des colonnes reste stable). */
function appendObject_(ss, name, obj) {
  const sh = ss.getSheetByName(name) || ss.insertSheet(name);
  const lastCol = sh.getLastColumn();
  let headers = lastCol > 0 ? sh.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  const missing = Object.keys(obj).filter(function (k) { return headers.indexOf(k) === -1; });
  if (missing.length) {
    headers = headers.concat(missing);
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  const row = headers.map(function (h) { return clean_(obj[h]); });
  sh.getRange(sh.getLastRow() + 1, 1, 1, row.length).setValues([row]);
}

/** Évite l'interprétation en formule (=, +, -, @) et la conversion automatique en date. */
function clean_(v) {
  if (v === undefined || v === null) return "";
  if (v instanceof Date || typeof v === "number" || typeof v === "boolean") return v;
  const s = String(v);
  if (/^[=+\-@]/.test(s)) return "'" + s;
  return s;
}

function photoRoot_() {
  if (PHOTO_FOLDER_ID) return DriveApp.getFolderById(PHOTO_FOLDER_ID);
  const it = DriveApp.getFoldersByName("Enquete_herbiers_photos");
  return it.hasNext() ? it.next() : DriveApp.createFolder("Enquete_herbiers_photos");
}

function savePhotos_(photos, id, org) {
  if (!photos.length) return [];
  const safeOrg = String(org || "organisation").replace(/[^\wÀ-ÿ -]/g, "").slice(0, 40).trim();
  const folder = photoRoot_().createFolder(Utilities.formatDate(new Date(), "Indian/Antananarivo", "yyyy-MM-dd") + "_" + safeOrg + "_" + id.slice(0, 8));
  return photos.slice(0, 5).map(function (p, i) {
    const blob = Utilities.newBlob(Utilities.base64Decode(p.data), p.type || "image/jpeg", (i + 1) + "_" + p.name);
    return folder.createFile(blob).getUrl();
  });
}

/** À exécuter une fois depuis l'éditeur pour accorder les autorisations (Drive + Sheets). */
function autoriser() {
  photoRoot_();
  SpreadsheetApp.getActiveSpreadsheet().getName();
}
