/**
 * Réception des réponses de l'enquête « suivi des herbiers marins » → Google Sheets + Google Drive
 * ------------------------------------------------------------------------------
 * À coller dans : Google Sheet > Extensions > Apps Script (script lié à la feuille).
 * Voir README.md, étape 2, pour le déploiement en « Application Web ».
 *
 * Onglets créés automatiquement :
 *   - Reponses : une ligne par organisation répondante (sections A–C, I, M, N)
 *   - Methodes : une ligne par méthode de suivi décrite (Q20–Q59), reliée par response_id
 *   - Journal  : erreurs éventuelles
 * Photos (Q71) : enregistrées dans un dossier Google Drive (créé au besoin),
 * un sous-dossier par réponse ; les liens sont écrits dans la colonne q071_fichiers.
 * Les colonnes manquantes sont ajoutées à la volée : modifier le questionnaire
 * ne nécessite pas de modifier ce script.
 */

const SHEET_RESPONSES = "Reponses";
const SHEET_LOOP_DEFAULT = "Methodes";
const SHEET_LOG = "Journal";
// Dossier Drive des pièces jointes : laisser vide pour le créer automatiquement à côté de la feuille,
// ou coller l'ID d'un dossier existant (la partie après /folders/ dans son URL).
const DRIVE_FOLDER_ID = "";
const DRIVE_FOLDER_NAME = "Enquête herbiers marins — photos";
// Facultatif : adresse e-mail qui reçoit une notification à chaque réponse
const NOTIFY_EMAIL = "";

const ALLOWED_EXT = ["jpg", "jpeg", "png"];

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

    const meta = {
      response_id: data.response_id,
      horodatage_serveur: new Date(),
      survey_version: data.survey_version,
      started_at: data.started_at,
      submitted_at_client: data.submitted_at_client,
      duration_min: data.duration_min
    };

    // Pièces jointes → Drive (avant l'écriture, pour pouvoir noter les liens)
    const general = Object.assign({}, data.general);
    const files = Array.isArray(data.fichiers) ? data.fichiers : [];
    const fileCol = (data.fichiers_question || "q071") + "_fichiers";
    general[fileCol] = files.length ? saveFiles_(data.response_id, general.q003 || "", files).join(" | ") : "";

    appendObject_(ss, SHEET_RESPONSES, Object.assign({}, meta, general));
    const loopSheet = data.boucle_onglet || SHEET_LOOP_DEFAULT;
    (data.boucle || []).forEach(function (r) {
      appendObject_(ss, loopSheet, Object.assign({ response_id: data.response_id }, r));
    });

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, "Enquête herbiers marins — nouvelle réponse",
        "Organisation : " + (general.q003 || "?") + "\nRépondant : " + (general.q001 || "?") +
        "\nMéthodes décrites : " + (general.methodes_decrites || "aucune") +
        "\nPhotos : " + files.length +
        "\nRéférence : " + data.response_id.slice(0, 8).toUpperCase());
    }
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

/* ----------------------------------------------------------------- pièces jointes */

function rootFolder_() {
  if (DRIVE_FOLDER_ID) return DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const it = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(DRIVE_FOLDER_NAME);
}

/** Enregistre les fichiers (base64) dans un sous-dossier par réponse ; renvoie les liens. */
function saveFiles_(id, org, files) {
  const sub = rootFolder_().createFolder(id.slice(0, 8).toUpperCase() + (org ? " — " + String(org).slice(0, 60) : ""));
  const links = [];
  files.slice(0, 5).forEach(function (f) {
    const name = String(f.name || "fichier").replace(/[\\/:*?"<>|]/g, "_").slice(0, 120);
    const ext = (name.split(".").pop() || "").toLowerCase();
    if (ALLOWED_EXT.indexOf(ext) === -1 || !f.data) return;          // format non autorisé : ignoré
    const blob = Utilities.newBlob(Utilities.base64Decode(f.data), f.type || "application/octet-stream", name);
    links.push(sub.createFile(blob).getUrl());
  });
  return links;
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
  // Format texte pour éviter les conversions automatiques (« 2020 », « 1–3 », dates…)
  const range = sh.getRange(sh.getLastRow() + 1, 1, 1, row.length);
  range.setNumberFormat("@");
  const iDate = headers.indexOf("horodatage_serveur");
  if (iDate >= 0) range.getCell(1, iDate + 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");
  range.setValues([row]);
}

/** Évite l'interprétation en formule (=, +, -, @). */
function clean_(v) {
  if (v === undefined || v === null) return "";
  if (v instanceof Date || typeof v === "number" || typeof v === "boolean") return v;
  const s = String(v);
  if (/^[=+\-@]/.test(s)) return "'" + s;
  return s;
}

/** À exécuter une fois depuis l'éditeur pour accorder les autorisations (Sheets, Drive, e-mail). */
function autoriser() {
  SpreadsheetApp.getActiveSpreadsheet().getName();
  Logger.log("Dossier des pièces jointes : " + rootFolder_().getUrl());
  if (NOTIFY_EMAIL) MailApp.getRemainingDailyQuota();
}
