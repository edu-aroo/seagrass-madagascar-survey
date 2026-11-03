# Link to form page
https://edu-aroo.github.io/seagrass-madagascar-survey/

# Link to report page
https://edu-aroo.github.io/seagrass-madagascar-survey/rapport/




# Version 1.1 (30/10/2026) — mise à jour selon « Questionnaire mise à jour.xlsx »

Google Sheet : **aucune modification nécessaire**. Les identifiants de colonnes existants (q001–q074) sont conservés ; les nouvelles questions ont de nouveaux identifiants (q075–q078) que `apps-script/Code.gs` ajoute automatiquement en fin de colonnes à la première réponse. Les 4 réponses déjà reçues (v1.0) restent valides et sont harmonisées dans `analysis/R/03_clean.R`.

Nouvelles questions :
- Q8 `q075` — appui technique Oui/Non ; Q9 `q008` devient « Si oui, partenaires » (option « Aucun appui technique » retirée)
- Q17 `q076` — nombre de méthodes utilisées ; limite le nombre de cases cochables en Q18 `q016` (4 au maximum)
- Q27 `q077_rang1..3` — classement des 3 indicateurs les plus importants parmi ceux cochés en Q26 ; Q28 `q025` = pourquoi
- Q29 `q078` — indicateurs difficiles/coûteux Oui/Non ; Q30 `q026` = lesquels et pourquoi (si Oui)

Autres changements : liste des indicateurs (Q26) regroupée et complétée (Sédimentation, Changement climatique ; 2 modalités renommées), « Méthode institutionnelle ou projet spécifique » retirée de Q18, Q39 (saisons) posée à tous, plusieurs questions rendues obligatoires (dont « Pourquoi ? » de Q32 et Q67), date de la photo (Q78) facultative, lieu de la photo (Q77) obligatoire. Numérotation affichée Q1–Q78 dans l'ordre du formulaire (la numérotation de l'Excel contient des doublons à partir de Q39).
