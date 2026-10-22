/* =====================================================================
   CONFIGURATION DE L'ENQUÊTE — fichier unique à modifier
   ---------------------------------------------------------------------
   • META      : titre, textes d'accueil, contact, logos, URL Apps Script
   • STEPS     : étapes du formulaire et questions
   Les identifiants (id) deviennent les noms de colonnes dans Google
   Sheets et les noms de variables dans R : ne pas les modifier une fois
   la collecte lancée.

   Types : text, email, tel, textarea, number, year, radio, checkbox,
           scale (1–5), rank (classement top 3), methodpick, file, datetime
   Options :
     other: true      → ajoute un champ texte quand « Autre » est coché (id_autre)
     explain: '...'   → ajoute un champ « Pourquoi ? » (id_pourquoi)
     max: n           → nombre maximal de cases à cocher
     showIf           → { q:'q10', eq:'Oui' } | { q:'q14', ne:'Non' } |
                        { q:'q19', in:[...] } | { q:'q72', filled:true }
   ===================================================================== */

const SURVEY = {
  META: {
    version: "1.0",
    title: "Enquête nationale sur les méthodes de suivi des herbiers marins à Madagascar",
    subtitle: "Inventaire des pratiques, des indicateurs et des besoins en vue d'un protocole national harmonisé",
    organizer: "Fondation pour les aires protégées et la biodiversité de Madagascar en collaboration avec l'Institut Halieutique et des Sciences Marines",
    contactName: "Beva Grilante",
    contactEmail: "bevgrilante@gmail.com ",
    deadline: "15 Novembre 2026",
    estimatedTime: "25 à 45 min",
    // Coller ici l'URL du déploiement Google Apps Script (voir README, étape 2)
    appsScriptUrl: "https://script.google.com/macros/s/AKfycbxiCzCJz4RBM2_abqx2tPsvFvDKJ7yl6M3qW2UPO4G3hVk12P3n8KOaC8y8Xd5Zysoy/exec",
    // Logos : déposer les fichiers dans assets/img/logos/ puis adapter la liste
    logos: [
      { src: "assets/img/logos/fapbm_2.png", alt: "FAPBM", url: "https://www.fapbm.org/en/home/" },
      { src: "assets/img/logos/Logo_ihsm.png", alt: "IH.SM", url: "https://ihsm.mg/" }
    ],
    intro: [
      "Cette enquête vise à recenser les méthodes et protocoles utilisés à Madagascar pour le suivi écologique des herbiers marins, afin d'évaluer leurs forces, leurs limites et leur potentiel d'intégration dans un futur protocole national harmonisé.",
      "Elle s'adresse aux institutions publiques, ONG, associations, instituts de recherche, projets et gestionnaires d'AMP/LMMA impliqués dans le suivi, la recherche ou la conservation des herbiers marins.",
      "Vous pourrez décrire en détail jusqu'à trois méthodes. Vos réponses sont enregistrées automatiquement sur cet appareil : vous pouvez interrompre la saisie et la reprendre plus tard depuis le même navigateur."
    ],
    privacy: "Les informations personnelles (nom, e-mail, téléphone) servent uniquement au suivi de l'enquête et ne seront pas diffusées. Les résultats seront présentés de manière agrégée. [Adapter selon vos engagements de confidentialité.]",
    consentLabel: "J'accepte que les informations fournies soient utilisées dans le cadre de cette étude, selon les conditions décrites ci-dessus."
  },

  /* Méthodes proposées en Q17 (réutilisées pour nommer les blocs répétés) */
  METHOD_OPTIONS: [
    "Seagrass-Watch", "SeagrassNet", "Transect–quadrat", "Quadrat / points d'observation",
    "Cartographie SIG / télédétection", "Drone", "Méthode institutionnelle ou projet spécifique", "Autre"
  ],
  MAX_METHODS: 3,

  STEPS: [
    /* ---------------------------------------------------------------- A */
    {
      key: "A", title: "Identification de l'enquêté", short: "Identification",
      questions: [
        { id: "q01", n: 1, label: "Nom et prénom(s) du répondant", type: "text", required: true },
        { id: "q02", n: 2, label: "Fonction / poste du répondant", type: "text", required: true },
        { id: "q03", n: 3, label: "Organisation / institution", type: "text", required: true },
        { id: "q04", n: 4, label: "Adresse e-mail professionnelle", type: "email", required: false },
        { id: "q05", n: 5, label: "Numéro de téléphone professionnel", type: "tel", required: false }
      ]
    },
    /* ---------------------------------------------------------------- B */
    {
      key: "B", title: "Informations sur l'organisation", short: "Organisation",
      questions: [
        { id: "q06", n: 6, label: "Type d'organisation / institution", type: "radio", required: true, other: true,
          options: ["Institution publique", "ONG", "Association", "Institution de recherche / université", "Projet / programme", "Entreprise / secteur privé", "Gestionnaire d'AMP/LMMA", "Autre"] },
        { id: "q07", n: 7, label: "Domaine(s) d'intervention de votre organisation", type: "checkbox", required: true, other: true,
          options: ["Recherche", "Conservation", "Gestion d'AMP/LMMA", "Suivi écologique", "Pêche", "Restauration", "Sensibilisation", "Autre"] },
        { id: "q08", n: 8, label: "Votre organisation bénéficie-t-elle d'un appui technique pour la réalisation du suivi ?", type: "radio", required: true,
          options: ["Oui", "Non"] },
        { id: "q08b", n: "8b", label: "Si oui : qui sont les partenaires techniques impliqués ?", type: "checkbox", required: true, other: true,
          showIf: { q: "q08", eq: "Oui" },
          options: ["IH.SM", "CNRO", "CNRE", "WWF", "Conservation International (CI)", "Blue Ventures", "WCS", "Université", "Autre"] },
        { id: "q09", n: 9, label: "Zone(s) géographique(s) d'intervention concernant les herbiers marins", type: "textarea", required: true,
          help: "Région, district, commune, site…" },
        { id: "q10", n: 10, label: "La ou les zone(s) d'intervention sont-elles situées dans une Aire Marine Protégée (AMP) ?", type: "radio", required: true, other: true,
          options: ["Oui", "Non", "Autre"] },
        { id: "q11", n: 11, label: "Quelle est la catégorie de l'Aire Marine Protégée (AMP) concernée ?", type: "radio", required: true, other: true,
          showIf: { q: "q10", eq: "Oui" },
          options: ["Catégorie II (Parc national)", "Catégorie IV", "Catégorie V", "Catégorie VI", "LMMA", "Autre"] },
        { id: "q12", n: 12, label: "Quelle est la superficie approximative de la zone de suivi (en hectares) ?", type: "number", required: true,
          help: "Superficie des herbiers marins (ha)", min: 0, unit: "ha" },
        { id: "q13", n: 13, label: "Depuis quelle année votre organisation intervient-elle dans le suivi, la recherche ou la conservation des herbiers marins ?", type: "year", required: false },
        { id: "q14", n: 14, label: "Votre organisation réalise-t-elle actuellement un suivi écologique des herbiers marins à Madagascar ?", type: "radio", required: true,
          options: ["Oui", "Non", "Auparavant, mais plus actuellement"],
          help: "Si vous répondez « Non », les sections sur les pratiques et méthodes de suivi seront ignorées." }
      ]
    },
    /* ---------------------------------------------------------------- C */
    {
      key: "C", title: "Pratiques de suivi des herbiers", short: "Pratiques de suivi",
      showIf: { q: "q14", ne: "Non" },
      questions: [
        { id: "q15", n: 15, label: "Combien de campagnes de suivi sont réalisées par an ?", type: "radio", required: true,
          options: ["1", "2", "3", "4", "Plus de 4"] },
        { id: "q16", n: 16, label: "Combien de méthodes ou protocoles de suivi des herbiers marins utilisez-vous ou avez-vous utilisés ?", type: "number", required: true, min: 0, max: 20 },
        { id: "q17", n: 17, label: "Quels sont les noms exacts des méthodes / protocoles utilisés ?", type: "checkbox", required: true, other: true,
          optionsFrom: "METHOD_OPTIONS",
          help: "Chaque méthode cochée fera l'objet d'une série de questions détaillées (3 au maximum)." },
        { id: "q17_principales", n: "17b", label: "Vous avez coché plus de 3 méthodes : sélectionnez les 3 principales à décrire en détail", type: "methodpick", required: true },
        { id: "q21", n: 21, label: "Combien de personnes sont régulièrement impliquées dans la mise en œuvre du suivi écologique au sein de votre organisation ?", type: "number", required: true, min: 0 },
        { id: "q22", n: 22, label: "Qui réalise principalement le suivi ?", type: "checkbox", required: true, other: true,
          options: ["Personnel technique", "Chercheurs", "Gestionnaires d'AMP", "Communautés locales", "Bénévoles", "Étudiants", "Consultants externes", "Autre"] },
        { id: "q23", n: 23, label: "Quel est le budget annuel approximatif alloué au suivi écologique des herbiers marins ?", type: "radio", required: true,
          options: ["Moins de 1 000 000 Ar", "1 000 000 à 5 000 000 Ar", "5 000 000 à 15 000 000 Ar", "15 000 000 à 30 000 000 Ar", "30 000 000 à 50 000 000 Ar", "Plus de 50 000 000 Ar"] }
      ]
    },

    /* ============ BLOC RÉPÉTÉ POUR CHAQUE MÉTHODE (jusqu'à 3) ============ */
    {
      key: "M1", perMethod: true, title: "Protocole, objectifs et indicateurs", short: "Protocole & indicateurs",
      showIf: { q: "q14", ne: "Non" },
      sections: ["C", "D", "E"],
      questions: [
        { id: "q18", n: 18, label: "Statut de cette méthode", type: "checkbox", required: true,
          help: "Plusieurs réponses possibles (ex. : actuellement utilisée ET protocole adapté).",
          options: ["Actuellement utilisée", "Utilisée auparavant", "Protocole adapté", "Protocole interne"] },
        { id: "q19", n: 19, label: "La méthode utilisée est-elle basée sur un protocole standardisé publié ou reconnu ?", type: "radio", required: true,
          options: ["Oui, sans modification", "Oui, mais adaptée", "Non, protocole interne", "Ne sait pas"] },
        { id: "q20", n: 20, label: "Si la méthode a été adaptée, quelles parties du protocole ont été modifiées et pourquoi ?", type: "textarea", required: false,
          showIf: { q: "q19", eq: "Oui, mais adaptée" } },
        { id: "q24", n: 24, section: "D", label: "Quels sont les principaux objectifs du suivi réalisé avec cette méthode ?", type: "checkbox", required: true, other: true,
          options: ["Évaluer l'état / la santé des herbiers", "Suivre les changements dans le temps", "Cartographier la distribution / superficie", "Suivre les pressions et menaces", "Évaluer la biodiversité / faune associée", "Suivre la restauration", "Évaluer la biomasse / carbone", "Recherche scientifique", "Gestion d'AMP/LMMA", "Autre"] },
        { id: "q25", n: 25, section: "E", label: "Quels indicateurs écologiques sont mesurés avec cette méthode ?", type: "checkbox", required: true, other: true,
          options: ["Pourcentage de couverture", "Composition spécifique", "Densité des pousses", "Richesse spécifique", "Diversité", "Hauteur de la canopée", "Biomasse", "Mortalité / état des plants", "Étendue / superficie des herbiers", "Distribution spatiale", "Caractéristiques du substrat", "Matière organique", "Carbone organique", "Turbidité", "Température", "Salinité", "Profondeur", "Pressions anthropiques", "Faune associée", "Autre"] },
        { id: "q26", n: 26, section: "E", label: "Parmi les indicateurs sélectionnés, lesquels sont considérés comme les plus importants pour votre objectif de suivi ? Expliquez pourquoi.", type: "textarea", required: false },
        { id: "q27", n: 27, section: "E", label: "Certains indicateurs sont-ils difficiles ou coûteux à mesurer ? Si oui, lesquels et pourquoi ?", type: "textarea", required: false }
      ]
    },
    {
      key: "M2", perMethod: true, title: "Échantillonnage et fréquence", short: "Échantillonnage & fréquence",
      showIf: { q: "q14", ne: "Non" },
      sections: ["F", "G"],
      questions: [
        { id: "q28", n: 28, section: "F", label: "Quel est le dispositif d'échantillonnage utilisé ?", type: "checkbox", required: true, other: true,
          options: ["Transects", "Quadrats", "Points d'observation", "Placettes / stations permanentes", "Relevés GPS", "Photographies / vidéo", "Télédétection satellite", "Drone", "Prélèvements d'échantillons", "Autre"] },
        { id: "q29", n: 29, section: "F", label: "Les sites / stations de suivi sont-ils permanents ?", type: "radio", required: true,
          options: ["Oui", "Non", "Certains seulement"], explain: "Pourquoi ?" },
        { id: "q30", n: 30, section: "F", label: "Comment les sites sont-ils sélectionnés ?", type: "textarea", required: false },
        { id: "q31", n: 31, section: "F", label: "Combien de stations / sites sont généralement suivis par campagne ?", type: "number", required: false, min: 0 },
        { id: "q32", n: 32, section: "F", label: "Quelle est la durée moyenne d'une campagne de suivi sur le terrain pour cette méthode ?", type: "radio", required: false,
          options: ["1 à 2 jours", "3 à 4 jours", "5 à 6 jours", "7 à 10 jours", "Plus de 10 jours"] },
        { id: "q33", n: 33, section: "F", label: "Quelle est la durée moyenne nécessaire pour réaliser un relevé sur une station / un site ?", type: "text", required: false,
          help: "Préciser en minutes ou en heures (ex. : 45 min)" },
        { id: "q34", n: 34, section: "G", label: "À quelle fréquence les données sont-elles collectées ?", type: "radio", required: true, other: true,
          options: ["Hebdomadaire", "Mensuelle", "Trimestrielle", "Semestrielle", "Annuelle", "Tous les 2 à 5 ans", "Ponctuelle / selon projet", "Autre"] },
        { id: "q35", n: 35, section: "G", label: "La fréquence de suivi est-elle la même toute l'année ?", type: "radio", required: true, other: true,
          options: ["Oui", "Non", "Autre"] },
        { id: "q36", n: 36, section: "G", label: "Si non, quelles périodes / saisons sont privilégiées et pourquoi ?", type: "textarea", required: false,
          showIf: { q: "q35", in: ["Non", "Autre"] } }
      ]
    },
    {
      key: "M3", perMethod: true, title: "Matériel, compétences et données", short: "Matériel & compétences",
      showIf: { q: "q14", ne: "Non" },
      sections: ["H", "I"],
      questions: [
        { id: "q37", n: 37, section: "H", label: "Quels équipements sont nécessaires ?", type: "checkbox", required: true, other: true,
          options: ["GPS", "Appareil photo / caméra", "Drone", "Matériel de plongée", "Quadrat", "Transect", "Réfractomètre", "Thermomètre", "Disque de Secchi", "Matériel de mesure de profondeur", "Ordinateur", "Logiciel SIG", "Matériel de laboratoire", "Autre"] },
        { id: "q38", n: 38, section: "H", label: "Quel est le niveau de compétence / formation nécessaire pour appliquer correctement cette méthode ?", type: "radio", required: true,
          options: ["Faible", "Moyen", "Élevé", "Très élevé"] },
        { id: "q39", n: 39, section: "H", label: "Combien de personnes participent généralement au suivi avec cette méthode ?", type: "number", required: false, min: 0 },
        { id: "q40", n: 40, section: "H", label: "Une formation spécifique est-elle nécessaire ?", type: "radio", required: true,
          options: ["Oui", "Non"] },
        { id: "q41", n: 41, section: "H", label: "Si oui, quel type de formation est nécessaire ?", type: "textarea", required: false,
          showIf: { q: "q40", eq: "Oui" } },
        { id: "q45", n: 45, section: "I", label: "Les données issues de cette méthode sont-elles facilement comparables entre sites et entre années ?", type: "radio", required: true,
          options: ["Oui", "Partiellement", "Non", "Ne sait pas"] }
      ]
    },
    {
      key: "M4", perMethod: true, title: "Performance, contraintes et limites", short: "Performance & contraintes",
      showIf: { q: "q14", ne: "Non" },
      sections: ["J", "K"],
      questions: [
        { id: "q47", n: 47, section: "J", label: "Comment évaluez-vous la précision des données produites par cette méthode ?", type: "scale", required: true,
          options: ["Très faible", "Faible", "Moyenne", "Élevée", "Très élevée"] },
        { id: "q48", n: 48, section: "J", label: "Dans quelle mesure cette méthode permet-elle de détecter les changements à court terme ?", type: "scale", required: true,
          options: ["Très faible", "Faible", "Moyenne", "Élevée", "Très élevée"] },
        { id: "q49", n: 49, section: "J", label: "Dans quelle mesure cette méthode permet-elle de détecter les changements à long terme ?", type: "scale", required: true,
          options: ["Très faible", "Faible", "Moyenne", "Élevée", "Très élevée"] },
        { id: "q50", n: 50, section: "J", label: "Comment évaluez-vous la facilité de mise en œuvre de cette méthode ?", type: "scale", required: true,
          options: ["Très difficile", "Difficile", "Moyenne", "Facile", "Très facile"] },
        { id: "q51", n: 51, section: "J", label: "Comment évaluez-vous le coût global de mise en œuvre ?", type: "scale", required: true,
          options: ["Très faible", "Faible", "Moyen", "Élevé", "Très élevé"] },
        { id: "q52", n: 52, section: "J", label: "Dans quelle mesure cette méthode est-elle adaptée aux réalités et capacités locales à Madagascar ?", type: "scale", required: true,
          options: ["Pas du tout adaptée", "Peu adaptée", "Moyennement adaptée", "Bien adaptée", "Très bien adaptée"] },
        { id: "q53", n: 53, section: "J", label: "Dans quelle mesure les résultats sont-ils reproductibles entre différents observateurs / équipes ?", type: "scale", required: false,
          options: ["Très faible", "Faible", "Moyenne", "Élevée", "Très élevée"] },
        { id: "q54", n: 54, section: "K", label: "Quelles sont les principales contraintes rencontrées lors de l'application de cette méthode ?", type: "checkbox", required: true, other: true,
          options: ["Accès aux sites", "Marée / conditions météorologiques", "Visibilité sous-marine", "Équipement insuffisant", "Coût", "Manque de personnel", "Manque de compétences / formation", "Temps nécessaire", "Difficulté d'identification des espèces", "Difficulté d'analyse des données", "Difficulté de stockage / gestion des données", "Autre"] },
        { id: "q55", n: 55, section: "K", label: "Parmi ces contraintes, quelles sont les trois plus importantes ?", type: "rank", required: true, rankFrom: "q54", ranks: 3,
          help: "Classez de la plus importante (1) à la moins importante (3)." },
        { id: "q56", n: 56, section: "K", label: "Quelles sont, selon vous, les principales limites scientifiques ou méthodologiques de cette méthode ?", type: "textarea", required: true },
        { id: "q57", n: 57, section: "K", label: "Quelles sont les principales forces / avantages de cette méthode ?", type: "textarea", required: true }
      ]
    },
    {
      key: "M5", perMethod: true, title: "Analyse FFOM et intégration nationale", short: "FFOM & intégration",
      showIf: { q: "q14", ne: "Non" },
      sections: ["L", "M"],
      questions: [
        // Q58 : aucune liste d'options n'était fournie → réponse libre (voir README, « Points à vérifier »)
        { id: "q58", n: 58, section: "L", label: "Quelles sont les principales FORCES de cette méthode ?", type: "textarea", required: true },
        { id: "q59", n: 59, section: "L", label: "Quelles sont les principales FAIBLESSES de cette méthode ?", type: "checkbox", required: true, other: true,
          options: ["Coût élevé", "Besoin d'équipements spécifiques", "Équipements difficiles à obtenir à Madagascar", "Besoin de personnel spécialisé", "Besoin d'une formation spécifique", "Méthode longue à mettre en œuvre", "Méthode difficile à standardiser", "Méthode difficile à reproduire", "Forte dépendance aux conditions météorologiques / marines", "Difficultés d'accès aux sites", "Faible couverture spatiale", "Faible fréquence de suivi", "Difficultés d'identification des espèces", "Données difficiles à traiter / analyser", "Données difficiles à comparer entre sites", "Méthode peu adaptée à certains types d'herbiers", "Autre"] },
        { id: "q60", n: 60, section: "L", label: "Quelles sont les principales OPPORTUNITÉS pour améliorer ou développer cette méthode à Madagascar ?", type: "checkbox", required: true, other: true,
          options: ["Possibilité d'intégrer la méthode dans un protocole national", "Possibilité d'harmoniser les méthodes existantes", "Possibilité de former davantage les acteurs nationaux", "Possibilité de renforcer les capacités des institutions", "Développement de partenariats entre institutions", "Collaboration avec les ONG et projets", "Collaboration avec les communautés locales", "Développement d'un réseau national de suivi des herbiers", "Mise en place de stations permanentes", "Développement d'une base de données nationale", "Utilisation des outils SIG et de télédétection", "Développement d'outils numériques de collecte des données", "Possibilité de suivi à long terme", "Possibilité de comparaison des données entre régions", "Possibilité d'intégration dans les programmes de conservation", "Possibilité de mobiliser des financements pour le suivi écologique", "Autre"] },
        { id: "q61", n: 61, section: "L", label: "Quelles sont les principales MENACES pouvant limiter son utilisation ou sa pérennisation ?", type: "checkbox", required: true, other: true,
          options: ["Manque de financement à long terme", "Arrêt des projets après leur période de financement", "Manque de personnel qualifié", "Rotation du personnel formé", "Manque de matériel / équipements", "Coût élevé des équipements", "Difficultés logistiques et d'accès aux sites", "Difficultés liées aux conditions météorologiques ou marines", "Absence de coordination entre les institutions", "Absence de protocole national harmonisé", "Utilisation de méthodes différentes entre les acteurs", "Manque de continuité des séries de données", "Perte ou mauvaise gestion des données", "Faible appropriation par les acteurs locaux", "Difficulté d'intégration des données dans une base nationale", "Pressions anthropiques importantes sur les herbiers", "Dégradation / disparition des sites de suivi", "Autre"] },
        { id: "q64", n: 64, section: "M", label: "Selon vous, cette méthode pourrait-elle être intégrée dans un protocole national harmonisé de suivi des herbiers marins ?", type: "radio", required: false,
          options: ["Oui", "Oui, avec adaptations", "Non", "Ne sait pas"] },
        { id: "q65", n: 65, section: "M", label: "Quels éléments de cette méthode devraient absolument être conservés dans un futur protocole national ?", type: "textarea", required: false },
        { id: "q66", n: 66, section: "M", label: "Quelles adaptations seraient nécessaires pour permettre son utilisation à l'échelle nationale ?", type: "textarea", required: true }
      ]
    },
    /* ===================== FIN DU BLOC RÉPÉTÉ ===================== */

    /* ---------------------------------------------------------------- I */
    {
      key: "I", title: "Données et gestion", short: "Données & gestion",
      showIf: { q: "q14", ne: "Non" },
      questions: [
        { id: "q42", n: 42, label: "Quels logiciels ou applications utilisez-vous pour la collecte, la gestion ou l'analyse des données ?", type: "checkbox", required: false, other: true,
          options: ["Excel", "KoboToolbox", "QGIS", "ArcGIS", "R", "SPSS", "Access", "Power BI", "Application mobile dédiée", "Autre"] },
        { id: "q43", n: 43, label: "Comment les données sont-elles enregistrées sur le terrain ?", type: "checkbox", required: false, other: true,
          options: ["Fiches papier", "Excel", "KoboToolbox", "Application mobile", "GPS", "Photographies / vidéos", "Autre"] },
        { id: "q44", n: 44, label: "Où les données sont-elles stockées après la collecte ?", type: "checkbox", required: false, other: true,
          options: ["Excel", "Drive", "KoboToolbox", "Base de données", "Serveur institutionnel", "Plateforme en ligne", "Documents papier", "Autre"] },
        { id: "q46", n: 46, label: "Les données sont-elles partagées avec d'autres institutions / partenaires ?", type: "radio", required: false,
          options: ["Oui", "Partiellement", "Non"], explain: "Pourquoi ?" }
      ]
    },
    /* ---------------------------------------------------------------- M */
    {
      key: "M", title: "Harmonisation nationale et recommandations", short: "Harmonisation nationale",
      questions: [
        { id: "q62", n: 62, label: "Pensez-vous qu'une harmonisation nationale des protocoles de suivi des herbiers marins est nécessaire ?", type: "radio", required: true,
          options: ["Oui", "Non", "Ne sait pas"] },
        { id: "q63", n: 63, label: "Quels critères sont les plus importants pour un futur protocole national ?", type: "checkbox", required: true, other: true, max: 3,
          help: "3 réponses maximum.",
          options: ["Simplicité", "Coût abordable", "Reproductibilité", "Adaptabilité locale", "Compatibilité internationale", "Facilité de mise en œuvre", "Autre"] },
        { id: "q67", n: 67, label: "Quels indicateurs devraient, selon vous, être suivis de manière commune par tous les acteurs à Madagascar ?", type: "checkbox", required: true, other: true,
          options: ["Couverture", "Composition spécifique", "Densité", "Hauteur de canopée", "Biomasse", "Superficie / distribution", "Pressions", "Substrat", "Faune associée", "Paramètres environnementaux", "Autre"] },
        { id: "q68", n: 68, label: "Quels sont vos besoins prioritaires pour améliorer le suivi ?", type: "checkbox", required: false, other: true,
          options: ["Formation", "Matériel", "Financement", "Protocoles harmonisés", "Base de données standardisée", "Coordination entre acteurs", "Appui technique", "Autre"] },
        { id: "q69", n: 69, label: "Seriez-vous prêt(e) à adopter un protocole national harmonisé ?", type: "radio", required: false,
          options: ["Oui", "Non", "Peut-être", "Sous certaines conditions"] },
        { id: "q70", n: 70, label: "Quelles méthodes recommandez-vous pour un futur protocole national ?", type: "checkbox", required: false, other: true,
          options: ["LIT", "Quadrats", "Photo-quadrats", "Points intercepts", "Suivi participatif", "Drone", "Télédétection", "Autre"] },
        { id: "q71", n: 71, label: "Souhaitez-vous participer à l'élaboration d'un protocole national harmonisé ?", type: "radio", required: false,
          options: ["Oui", "Non", "Peut-être"] }
      ]
    },
    /* ---------------------------------------------------------------- N */
    {
      key: "N", title: "Photos illustrant la méthode", short: "Photos",
      showIf: { q: "q14", ne: "Non" },
      questions: [
        { id: "q72", n: 72, label: "Téléchargez des photos illustrant la méthode / le protocole de suivi utilisé", type: "file", required: false,
          maxFiles: 5, help: "JPG/JPEG ou PNG — photos du site, du dispositif de suivi, du matériel ou de la réalisation du protocole. 5 photos maximum ; elles sont automatiquement redimensionnées avant l'envoi." },
        { id: "q73", n: 73, label: "Nom et prénom(s) du photographe", type: "text", required: true, showIf: { q: "q72", filled: true } },
        { id: "q74", n: 74, label: "Localisation de la photo", type: "text", required: false, showIf: { q: "q72", filled: true },
          help: "Région / district / commune / site ou station de suivi" },
        { id: "q75", n: 75, label: "Date et heure de la prise de vue", type: "datetime", required: false, showIf: { q: "q72", filled: true } }
      ]
    }
  ]
};

if (typeof module !== "undefined") module.exports = SURVEY;
