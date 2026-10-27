// Génère analysis/codebook.csv à partir de assets/js/survey-config.js
// Usage : node tools/make_codebook.js
// Colonne « sheet » : Reponses (une ligne par organisation) ou Methodes (une ligne par méthode décrite)
const path = require("path"), fs = require("fs");
const S = require(path.join(__dirname, "../assets/js/survey-config.js"));
const rows = [];
const q = v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
for (const st of S.STEPS) {
  const sheet = st.perMethod ? ((S.LOOP && S.LOOP.sheet) || "Boucle") : "Reponses";
  for (const x of st.questions) {
    const opts = x.options || [];
    const conds = [st.showIf, x.showIf].filter(Boolean);
    const cond = conds.length === 0 ? "" : JSON.stringify(conds.length === 1 ? conds[0] : { all: conds });
    const base = { sheet, section: st.sections ? x.section : st.key, step: st.title, n: x.n, required: x.required ? "Oui" : "Non", condition: cond };
    if (x.type === "rank") {
      for (let r = 1; r <= x.ranks; r++) rows.push({ ...base, variable: x.id + "_rang" + r, label: x.label + " — rang " + r, type: "rank", options: "" });
      continue;
    }
    if (x.type === "file") {
      rows.push({ ...base, variable: x.id + "_nb_fichiers", label: x.label + " — nombre de fichiers", type: "number", options: "" });
      rows.push({ ...base, variable: x.id + "_fichiers", label: x.label + " — liens Google Drive", type: "text", options: "" });
      continue;
    }
    const groups = x.groups ? x.groups.map(g => g.options.map(() => g.label || "Autre")).flat().join(" | ") : "";
    rows.push({ ...base, variable: x.id, label: x.label, type: x.type, options: opts.join(" | "), groups });
    if (x.explain) rows.push({ ...base, variable: x.id + "_pourquoi", label: x.label + " — " + x.explain, type: "textarea", options: "", groups: "", required: "Non" });
    if (x.units) rows.push({ ...base, variable: x.id + "_unite", label: x.label + " — unité", type: "radio", options: x.units.join(" | "), groups: "", required: "Non" });
    if (x.other) rows.push({ ...base, variable: x.id + "_autre", label: x.label + " — précision (Autre / préciser)", type: "text", options: "", required: "Non" });
  }
}
const cols = ["sheet", "variable", "n", "section", "step", "label", "type", "options", "groups", "required", "condition"];
const csv = [cols.join(",")].concat(rows.map(r => cols.map(c => q(r[c])).join(","))).join("\n");
fs.writeFileSync(path.join(__dirname, "../analysis/codebook.csv"), csv + "\n", "utf8");
console.log(rows.length + " variables écrites dans analysis/codebook.csv");
