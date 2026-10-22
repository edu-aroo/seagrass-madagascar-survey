# Enquête nationale — méthodes de suivi des herbiers marins à Madagascar

Online questionnaire (GitHub Pages) → Google Sheets + Google Drive → R project → HTML report.

```
enquete-herbiers/
├── index.html                  ← the questionnaire (GitHub Pages serves this)
├── assets/
│   ├── js/survey-config.js     ← THE file to edit: texts, logos, questions, Apps Script URL
│   ├── js/app.js               ← form engine (no need to edit)
│   ├── css/style.css           ← colours / layout
│   └── img/logos/              ← put partner logos here
├── apps-script/Code.gs         ← receives answers, writes to Google Sheets, saves photos to Drive
├── tools/make_codebook.js      ← regenerates analysis/codebook.csv after editing questions
├── analysis/                   ← R project (open enquete-herbiers.Rproj)
│   ├── R/00_packages.R  01_import.R  02_simulate.R  03_clean.R  functions.R  config.R
│   ├── report/rapport.Rmd
│   ├── codebook.csv            ← variable names, labels, options (generated from the config)
│   ├── run_all.R               ← import + render both reports
│   └── data/                   ← raw data (git-ignored, never published)
└── rapport/index.html          ← rendered public report (currently built from FAKE data)
```

---

## Step 1 — Customise the form (15 min)

Open `assets/js/survey-config.js` and fill the `META` block:

- `organizer`, `contactName`, `contactEmail`, `deadline`, `privacy` (all marked `[...]`).
- `logos`: copy the logo files (PNG with transparent background or SVG, ~60 px high display) into `assets/img/logos/` and list them, e.g.
  `{ src: "assets/img/logos/ihsm.png", alt: "IH.SM", url: "https://..." }`.
  Ask each partner for permission and their official logo file.
- Leave `appsScriptUrl` empty for now (Step 2).

To preview locally: open a terminal in the folder and run `python -m http.server`, then go to <http://localhost:8000>. (Double-clicking `index.html` also works in most browsers.)

> ⚠️ Do not rename question `id`s once data collection starts: they are the column names in Google Sheets and the variable names in R.
> If you add/remove questions or options, run `node tools/make_codebook.js` to update `analysis/codebook.csv`.

## Step 2 — Connect the form to Google Sheets (10 min)

1. Create a new Google Sheet (e.g. *Enquête herbiers — réponses*) with the Google account that will own the data.
2. In the Sheet: **Extensions → Apps Script**. Delete the default code and paste the content of `apps-script/Code.gs`. Save.
3. (Optional) Create a Drive folder for photos, open it, and copy the ID at the end of its URL (`.../folders/<ID>`) into `PHOTO_FOLDER_ID`. If left empty, a folder `Enquete_herbiers_photos` is created automatically.
4. In the function menu select `autoriser` → **Run** → accept the permissions (Google will warn that the app is unverified: *Advanced → Go to project*). This is your own script.
5. **Deploy → New deployment → type: Web app**
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
   - Deploy, and copy the URL ending in `/exec`.
6. Paste that URL into `appsScriptUrl` in `survey-config.js`.
7. Test: open the `/exec` URL in a browser — you should see `{"ok":true,"message":"Service de collecte actif"}`. Then fill the form once locally and check that the `Reponses` and `Methodes` tabs appear in the Sheet, and the photo in Drive.

Notes
- When you modify `Code.gs` later: **Deploy → Manage deployments → ✏️ Edit → Version: New version**. This keeps the same URL. (A "New deployment" creates a new URL.)
- Data structure: `Reponses` = one row per respondent; `Methodes` = one row per method described (up to 3 per respondent), linked by `response_id`. Multiple-choice answers are separated by ` | `; "Autre" details are in `qXX_autre` columns.
- The `Journal` tab logs any server-side errors.
- Duplicate submissions (double click, retry after network loss) are ignored using `response_id`.

## Step 3 — Publish on GitHub Pages (10 min)

1. Create a GitHub repository (e.g. `enquete-herbiers`). Free GitHub Pages requires a **public** repository — this is fine because no data is stored in it (`analysis/data/` is git-ignored).
2. Upload the whole folder (drag-and-drop in *Add file → Upload files*, or with Git):
   ```bash
   git init && git add . && git commit -m "Questionnaire herbiers v1.0"
   git branch -M main
   git remote add origin https://github.com/<user>/enquete-herbiers.git
   git push -u origin main
   ```
3. **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`** → Save.
4. After ~1 min the form is online at `https://<user>.github.io/enquete-herbiers/` and the report at `https://<user>.github.io/enquete-herbiers/rapport/`.
5. Before sending the link: fill it once yourself on a phone and on a computer, then delete your test rows in the Sheet.

## Step 4 — Analyse in R

1. Open `analysis/enquete-herbiers.Rproj` in RStudio. `R/00_packages.R` installs what is missing.
2. **Test now with fake data**: `DATA_SOURCE <- "simulated"` (default in `R/config.R`), then `source("run_all.R")`. This builds `rapport/index.html` (public) and `data/rapport_interne.html` (internal, with open-ended answers).
3. **Real data**: in `R/config.R` set `SHEET_URL` and `DATA_SOURCE <- "sheet"`, then `source("run_all.R")`. The first time, a browser window asks you to authorise *Tidyverse API Packages* to read your Sheets; the token is cached in `analysis/.secrets/` (git-ignored).
   - Each import saves a timestamped copy in `data/raw/` (`.rds` + `.csv`). Use `DATA_SOURCE <- "cache"` to work offline on the last copy.
4. Work interactively:
   ```r
   source("R/01_import.R"); source("R/03_clean.R"); source("R/functions.R")
   CB  <- read_codebook()
   dat <- clean_data(load_raw("cache"), CB)
   plot_choice(dat$reponses, "q07")
   heat_by_method(dat$methodes, "q25")
   ```

## Step 5 — Publish the report

After `run_all.R`, commit and push `rapport/index.html`:
```bash
git add rapport/index.html && git commit -m "Rapport mis à jour" && git push
```
The **public** version contains only aggregated results (no names, e-mails, organisation list or free-text answers). Keep `data/rapport_interne.html` for yourself and your supervisors — never commit it.

> With few respondents, some categories (e.g. a single organisation of one type) can still be identifying. Check the public report before pushing.

---

## Changes made to the questionnaire — please check

The online version follows the spreadsheet; these adjustments were needed to make it work as a form. Revert any you disagree with in `survey-config.js`.

| Q | Change | Why |
|---|---|---|
| 8 | Split into 8 (Oui/Non) + 8b (partners, shown if Oui) | The original combined two questions |
| 10 | Single choice (was multiple); grammar: "sont-elles situées dans une AMP" | Oui/Non cannot both apply |
| 11 | Shown only if Q10 = Oui | Not relevant otherwise |
| 14 | If "Non", sections C–L, I and N are skipped | No methods to describe |
| 15 | Options: 1 / 2 / 3 / 4 / Plus de 4 | Original "1;2;3.;4 : Plus de 4" was ambiguous |
| 17b | New: pick the 3 main methods if more than 3 are ticked | Sections D–M repeat for up to 3 methods |
| 18 | Becomes a per-method multiple choice (no grid) | Its options mix two dimensions (status and origin), so several can apply |
| 18–20, 24–41, 45, 47–61, 64–66 | Repeated for each method (max 3) | They refer to "cette méthode" |
| 23 | Typo fixed (15.000.0000 → 15 000 000); no "Ne sait pas / préfère ne pas répondre" option | **Consider adding one**: a required budget question may block or bias answers |
| 32 | Ranges made non-overlapping (1–2 / 3–4 / 5–6 / 7–10 / >10 days) | "1 à 2" and "2 à 4" overlapped |
| 36, 41, 20 | Conditional (shown if Q35 ≠ Oui, Q40 = Oui, Q19 = "adaptée") | "Si non / si oui" questions |
| 55 | Ranking of the top 3 among constraints ticked in Q54 | |
| 58 | **No options were provided** → free text | It also duplicates Q57 (forces). Suggest removing one, or giving Q58 a list like Q59–61 |
| 63 | Multiple choice, max 3 (was single) | Question asks for "les critères les plus importants" |
| 72 | Made **optional** (was required); Q73 and Q75 required only if a photo is uploaded | A required upload would block respondents without photos |
| 21 vs 39 | Kept both | Close in meaning (org-level vs per method) — check this is intended |

## Limits to be aware of

- **Answers are saved on the respondent's device** (browser storage) while filling; photos are not, and must be re-added if they resume later.
- Photos are resized to 1600 px (JPEG) before upload; max 5 per respondent.
- Google Apps Script has quotas (consumer account: ~20 000 URL calls/day, 6 min per execution) — far above what this survey needs.
- The form is in French only.
- The `/exec` URL is public: anyone with it could submit. A hidden anti-bot field is included; duplicates are filtered by `response_id`. Check the data for test/spam rows before analysis.
