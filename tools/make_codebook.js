// Génère analysis/codebook.csv à partir de assets/js/survey-config.js
// Usage : node tools/make_codebook.js
const path = require("path"), fs = require("fs");
const S = require(path.join(__dirname, "../assets/js/survey-config.js"));
const rows = [];
const q = v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
const add = (r) => rows.push(r);
for (const st of S.STEPS) {
  const sheet = st.perMethod ? "Methodes" : "Reponses";
  for (const x of st.questions) {
    const sec = x.section || st.key;
    const opts = x.optionsFrom ? S[x.optionsFrom] : (x.options || []);
    const cond = x.showIf ? JSON.stringify(x.showIf) : "";
    const base = { sheet, section: sec, step: st.title, n: x.n, required: x.required ? "Oui" : "Non", condition: cond };
    if (x.type === "file") { add({ ...base, variable: x.id + "_nb_photos", label: "Nombre de photos envoyées", type: "number", options: "" }); continue; }
    if (x.type === "rank") {
      for (let r = 1; r <= x.ranks; r++) add({ ...base, variable: `${x.id}_rang${r}`, label: `${x.label} — rang ${r}`, type: "rank", options: "" });
      continue;
    }
    add({ ...base, variable: x.id, label: x.label, type: x.type, options: opts.join(" | ") });
    if (x.other) add({ ...base, variable: x.id + "_autre", label: x.label + " — Autre (précision)", type: "text", options: "", required: "Non" });
    if (x.explain) add({ ...base, variable: x.id + "_pourquoi", label: x.label + " — " + x.explain, type: "textarea", options: "", required: "Non" });
  }
}
const cols = ["sheet", "variable", "n", "section", "step", "label", "type", "options", "required", "condition"];
const csv = [cols.join(",")].concat(rows.map(r => cols.map(c => q(r[c])).join(","))).join("\n");
fs.writeFileSync(path.join(__dirname, "../analysis/codebook.csv"), csv + "\n", "utf8");
console.log(rows.length + " variables écrites dans analysis/codebook.csv");
