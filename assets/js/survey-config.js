/* =====================================================================
   CONFIGURATION DE L'ENQUÊTE « SUIVI DES HERBIERS MARINS » — fichier unique à modifier
   ---------------------------------------------------------------------
   • META   : titre, textes d'accueil, contact, logos, photos, URL Apps Script
   • PHOTOS : photos du bandeau, de l'accueil et des sections (avec crédits)
   • LOOP   : boucle « par méthode » (les étapes perMethod: true sont répétées
              pour chaque méthode cochée en Q16)
   • STEPS  : étapes du formulaire et questions
   Les identifiants (id) deviennent les noms de colonnes dans Google
   Sheets et les noms de variables dans R : ne pas les modifier une fois
   la collecte lancée.

   Types : text, email, tel, textarea, number, year, datetime, radio, checkbox,
           scale (1–5), rank (classement), file
   Options :
     other: true    → champ texte quand « Autre » ou « (préciser) » est coché (id_autre)
     explain: "…"   → zone de texte « Pourquoi ? » sous la question (id_pourquoi)
     groups: [...]  → options présentées par groupes (choix multiple)
     unit / units   → unité affichée / liste d'unités au choix (id_unite)
     max: 4         → nombre maximal de cases cochées
     showIf         → { q:'q013', eq:'Non' } | { q:'q010', starts:'Oui' } |
                      { q:'q013', in:[...] } | { q:'q071', filled:true } |
                      { all:[cond1, cond2] }
   ===================================================================== */

const SURVEY = {
  META: {
    "version": "1.0",
    "storeKey": "herbiers-enquete",
    "title": "Enquête nationale sur le suivi écologique des herbiers marins à Madagascar",
    "subtitle": "Inventaire des méthodes et protocoles de suivi des herbiers marins, de leurs performances et de leurs contraintes, en vue d'un protocole national harmonisé",
    "organizer": "Fondation pour les Aires Protégées et la Biodiversité de Madagascar (FAPBM), en collaboration avec l’Institut Halieutique et des Sciences Marines (IH.SM) – Université de Toliara",
    "contactName": "Beva Grilante",
    "contactEmail": "grilante.beva@gmail.com",
    "deadline": "15 Novembre 2026",
    "estimatedTime": "30 à 45 min",
    "appsScriptUrl": "https://script.google.com/macros/s/AKfycbyLW5ecyEXqzf626fjiahBC_ehq68AQyjSemcKV9TUqd1CoheH92Qi928fXeR3_HFn5VQ/exec",
    "logos": [
      {
        "src": "assets/img/logos/ihsm.png",
        "alt": "IH.SM — Université de Toliara",
        "url": "https://ihsm.mg/"
      },
      {
        "src": "assets/img/logos/fapbm.png",
        "alt": "FAPBM",
        "url": "https://www.fapbm.org/en/home/"
      }
    ],
    "intro": [
      "Cette enquête vise à dresser un état des lieux des méthodes de suivi écologique des herbiers marins à Madagascar : protocoles utilisés, indicateurs mesurés, moyens nécessaires, performances, contraintes et perspectives d'harmonisation.",
      "Elle s'adresse aux institutions publiques, gestionnaires d'AMP/LMMA, ONG, associations, instituts de recherche, universités et projets impliqués dans le suivi, la recherche ou la conservation des herbiers marins.",
      "Si votre organisation utilise plusieurs méthodes de suivi (ex. Seagrass-Watch, transect–quadrat, drone…), une partie des questions vous sera posée pour chacune d'elles."
    ],
    "draftNote": "Vos réponses sont enregistrées automatiquement sur cet appareil : vous pouvez interrompre la saisie et la reprendre plus tard depuis le même navigateur.",
    "privacy": "Les informations recueillies servent uniquement à cette étude. Vos coordonnées ne serviront qu'à vous recontacter si une réponse doit être précisée ; elles ne seront ni publiées ni transmises. Les résultats seront présentés de manière agrégée. Les photos transmises ne seront diffusées qu'avec le nom du photographe.",
    "consentLabel": "J'accepte que les informations fournies soient utilisées dans le cadre de cette étude, selon les conditions décrites ci-dessus.",
    "heroPhoto": "herbier-plongeur-1",
    "introPhotos": [
      "herbier-nosy-be",
      "herbier-vue-aerienne-1",
      "herbier-tortue"
    ],
    "thanksPhoto": "herbier-tortue",
    "photoCreditNote": "Photographies : Wikimedia Commons (licences CC BY, CC BY-SA ou domaine public) — auteurs indiqués sur chaque photo."
  },

  PHOTOS: [
    {
      "key": "herbier-plongeur-1",
      "src": "assets/img/photos/herbier-plongeur-1.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Scuba_Diver_in_Seagrass_-_53005443057.jpg/1280px-Scuba_Diver_in_Seagrass_-_53005443057.jpg",
      "caption": "",
      "credit": "Symbiosis",
      "license": "CC BY 2.0",
      "page": "https://commons.wikimedia.org/wiki/File:Scuba_Diver_in_Seagrass_-_53005443057.jpg"
    },
    {
      "key": "herbier-nosy-be",
      "src": "assets/img/photos/herbier-nosy-be.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Aguja_de_mar_%28Syngnathoides_biaculeatus%29%2C_Nosy_Be%2C_Madagascar%2C_2025-09-20%2C_DD_84.jpg/1280px-Aguja_de_mar_%28Syngnathoides_biaculeatus%29%2C_Nosy_Be%2C_Madagascar%2C_2025-09-20%2C_DD_84.jpg",
      "caption": "",
      "credit": "Diego Delso",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Aguja_de_mar_(Syngnathoides_biaculeatus),_Nosy_Be,_Madagascar,_2025-09-20,_DD_84.jpg"
    },
    {
      "key": "herbier-vue-aerienne-1",
      "src": "assets/img/photos/herbier-vue-aerienne-1.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/a/af/Herbiers_marins_vus_du_ciel_%28Ifremer_00704-81603_-_34378%29.jpg",
      "caption": "",
      "credit": "Stéphane Lesbats / Ifremer",
      "license": "CC BY 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Herbiers_marins_vus_du_ciel_(Ifremer_00704-81603_-_34378).jpg"
    },
    {
      "key": "herbier-tortue",
      "src": "assets/img/photos/herbier-tortue.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Green_Turtle_%28Chelonia_mydas%29_female_grazing_on_seagrass_..._%2849586243716%29.jpg/1280px-Green_Turtle_%28Chelonia_mydas%29_female_grazing_on_seagrass_..._%2849586243716%29.jpg",
      "caption": "",
      "credit": "Bernard Dupont",
      "license": "CC BY-SA 2.0",
      "page": "https://commons.wikimedia.org/wiki/File:Green_Turtle_(Chelonia_mydas)_female_grazing_on_seagrass_..._(49586243716).jpg"
    },
    {
      "key": "herbier-plongeur-2",
      "src": "assets/img/photos/herbier-plongeur-2.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Scuba_Diver_in_Seagrass_-_53006198744.jpg/1280px-Scuba_Diver_in_Seagrass_-_53006198744.jpg",
      "caption": "",
      "credit": "Symbiosis",
      "license": "CC BY 2.0",
      "page": "https://commons.wikimedia.org/wiki/File:Scuba_Diver_in_Seagrass_-_53006198744.jpg"
    },
    {
      "key": "herbier-vue-aerienne-2",
      "src": "assets/img/photos/herbier-vue-aerienne-2.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Herbiers_marins_vus_du_ciel_%28Ifremer_00704-81603_-_34381%29.jpg",
      "caption": "",
      "credit": "Stéphane Lesbats / Ifremer",
      "license": "CC BY 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Herbiers_marins_vus_du_ciel_(Ifremer_00704-81603_-_34381).jpg"
    },
    {
      "key": "herbier-thalassia",
      "src": "assets/img/photos/herbier-thalassia.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Thalassia-Syringodium_seagrass_bed_%28Graham%27s_Harbour%2C_western_side_of_North_Point_Peninsula%2C_northeastern_San_Salvador_Island%2C_eastern_Bahamas%29_%2815667912398%29.jpg/1280px-thumbnail.jpg",
      "caption": "",
      "credit": "James St. John",
      "license": "CC BY 2.0",
      "page": "https://commons.wikimedia.org/wiki/File:Thalassia-Syringodium_seagrass_bed_(Graham%27s_Harbour,_western_side_of_North_Point_Peninsula,_northeastern_San_Salvador_Island,_eastern_Bahamas)_(15667912398).jpg"
    },
    {
      "key": "herbier-glanage",
      "src": "assets/img/photos/herbier-glanage.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/d/d2/Gleaning_activity_on_seagrass.png",
      "caption": "",
      "credit": "Furkon & L. Cullen-Unsworth",
      "license": "CC BY 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Gleaning_activity_on_seagrass.png"
    },
    {
      "key": "herbier-restauration",
      "src": "assets/img/photos/herbier-restauration.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Sea_Grass_Restoration_Project_%28KSC-20230329-PH-KLS01_0011%29.jpg/1280px-Sea_Grass_Restoration_Project_%28KSC-20230329-PH-KLS01_0011%29.jpg",
      "caption": "",
      "credit": "NASA / Kim Shiflett",
      "license": "Domaine public",
      "page": "https://commons.wikimedia.org/wiki/File:Sea_Grass_Restoration_Project_(KSC-20230329-PH-KLS01_0011).jpg"
    }
  ],

  LOOP: {
    "source": "q016",
    "label": "Méthode",
    "labelPlural": "méthodes",
    "key": "methode",
    "keyPlural": "methodes",
    "sheet": "Methodes",
    "otherName": "Autre méthode",
    "scopeText": "la méthode",
    "active": {
      "q": "q013",
      "in": [
        "Oui",
        "Auparavant, mais plus actuellement"
      ]
    }
  },

  SECTION_TITLES: {
    "C": "C. Pratiques de suivi des herbiers",
    "D": "D. Objectifs du suivi",
    "E": "E. Indicateurs écologiques",
    "F": "F. Protocole d'échantillonnage",
    "G": "G. Fréquence et temporalité",
    "H": "H. Matériel, ressources et compétences",
    "I": "I. Données et gestion",
    "J": "J. Performance de la méthode",
    "K": "K. Contraintes et limites",
    "L": "L. Forces, faiblesses, opportunités et menaces (FFOM)",
    "M": "M. Harmonisation nationale"
  },

  MAX_METHODS: 4,

  STEPS: [
    {
      "key": "A",
      "title": "Identification de l’enquêté",
      "short": "Répondant",
      "questions": [
        {
          "id": "q001",
          "n": 1,
          "label": "Nom et prénom(s) du répondant",
          "type": "text",
          "required": true
        },
        {
          "id": "q002",
          "n": 2,
          "label": "Fonction / poste du répondant",
          "type": "text",
          "required": true
        },
        {
          "id": "q003",
          "n": 3,
          "label": "Organisation / institution",
          "type": "text",
          "required": true
        },
        {
          "id": "q004",
          "n": 4,
          "label": "Adresse e-mail professionnelle",
          "type": "email",
          "required": false
        },
        {
          "id": "q005",
          "n": 5,
          "label": "Numéro de téléphone professionnel",
          "type": "tel",
          "required": false
        }
      ]
    },
    {
      "key": "B",
      "title": "Informations sur l’organisation",
      "short": "Organisation",
      "questions": [
        {
          "id": "q006",
          "n": 6,
          "label": "Type d’organisation / institution",
          "type": "radio",
          "required": true,
          "options": [
            "Institution publique",
            "ONG",
            "Association",
            "Institution de recherche / université",
            "Projet / programme",
            "Entreprise / secteur privé",
            "Gestionnaire d’AMP/LMMA",
            "Autre"
          ],
          "other": true
        },
        {
          "id": "q007",
          "n": 7,
          "label": "Domaine(s) d’intervention de votre organisation",
          "type": "checkbox",
          "required": true,
          "options": [
            "Recherche",
            "Conservation",
            "Gestion d’AMP/LMMA",
            "Suivi écologique",
            "Pêche",
            "Restauration",
            "Sensibilisation",
            "Autre"
          ],
          "other": true,
          "help": "Plusieurs choix possibles."
        },
        {
          "id": "q008",
          "n": 8,
          "label": "Votre organisation bénéficie-t-elle d'un appui technique pour le suivi des herbiers ? Si oui, quels sont les partenaires techniques impliqués ?",
          "type": "checkbox",
          "required": true,
          "options": [
            "Aucun appui technique",
            "IH.SM",
            "CNRO",
            "CNRE",
            "WWF",
            "Conservation International (CI)",
            "Blue Ventures",
            "WCS",
            "Université",
            "Autre"
          ],
          "other": true,
          "help": "Plusieurs partenaires possibles. Cochez « Aucun appui technique » si votre organisation travaille seule."
        },
        {
          "id": "q009",
          "n": 9,
          "label": "Zone(s) géographique(s) d’intervention concernant les herbiers marins",
          "type": "textarea",
          "required": true,
          "help": "Région(s), district(s), commune(s), site(s)…"
        },
        {
          "id": "q010",
          "n": 10,
          "label": "La ou les zone(s) d'intervention se trouvent-elles dans une Aire Marine Protégée (AMP) ?",
          "type": "radio",
          "required": true,
          "options": [
            "Oui, toutes les zones",
            "Oui, une partie des zones",
            "Non",
            "Autre"
          ],
          "other": true
        },
        {
          "id": "q011",
          "n": 11,
          "label": "Quelle est la catégorie de l'Aire Marine Protégée (AMP) concernée ?",
          "type": "checkbox",
          "required": true,
          "options": [
            "Catégorie II (Parc national)",
            "Catégorie IV",
            "Catégorie V",
            "Catégorie VI",
            "LMMA",
            "Autre"
          ],
          "other": true,
          "showIf": {
            "q": "q010",
            "starts": "Oui"
          },
          "help": "Plusieurs choix possibles si vos zones relèvent de plusieurs AMP."
        },
        {
          "id": "q012",
          "n": 12,
          "label": "Depuis quelle année votre organisation intervient-elle dans le suivi, la recherche ou la conservation des herbiers marins ?",
          "type": "year",
          "required": false
        },
        {
          "id": "q013",
          "n": 13,
          "label": "Votre organisation réalise-t-elle actuellement un suivi écologique des herbiers marins à Madagascar ?",
          "type": "radio",
          "required": true,
          "options": [
            "Oui",
            "Non",
            "Auparavant, mais plus actuellement"
          ],
          "other": false,
          "help": "Si vous répondez « Non », le questionnaire passera directement à la section « Harmonisation nationale ». Si « Auparavant », répondez pour le dernier suivi réalisé."
        }
      ]
    },
    {
      "key": "C",
      "showIf": {
        "q": "q013",
        "in": [
          "Oui",
          "Auparavant, mais plus actuellement"
        ]
      },
      "title": "Pratiques de suivi des herbiers",
      "short": "Pratiques de suivi",
      "questions": [
        {
          "id": "q014",
          "n": 14,
          "label": "Quelle est la superficie approximative de la zone de suivi ?",
          "type": "number",
          "required": true,
          "min": 0,
          "unit": "ha",
          "help": "Superficie des herbiers marins suivis, en hectares."
        },
        {
          "id": "q015",
          "n": 15,
          "label": "Combien de campagnes de suivi sont réalisées par an ?",
          "type": "radio",
          "required": true,
          "options": [
            "1",
            "2",
            "3",
            "4",
            "Plus de 4"
          ],
          "other": false
        },
        {
          "id": "q016",
          "n": 16,
          "label": "Quelles méthodes / protocoles de suivi des herbiers marins utilisez-vous ou avez-vous utilisés ?",
          "type": "checkbox",
          "required": true,
          "options": [
            "Seagrass-Watch",
            "SeagrassNet",
            "Transect–quadrat",
            "Quadrat / points d’observation",
            "Cartographie SIG / télédétection",
            "Drone",
            "Méthode institutionnelle ou projet spécifique",
            "Autre"
          ],
          "other": true,
          "help": "Plusieurs choix possibles. Les sections suivantes seront répétées pour chaque méthode cochée (4 méthodes au maximum).",
          "max": 4
        },
        {
          "id": "q017",
          "n": 17,
          "label": "Combien de personnes sont régulièrement impliquées dans la mise en œuvre du suivi écologique au sein de votre organisation ?",
          "type": "number",
          "required": true,
          "min": 0
        },
        {
          "id": "q018",
          "n": 18,
          "label": "Qui réalise principalement le suivi ?",
          "type": "checkbox",
          "required": true,
          "options": [
            "Personnel technique",
            "Chercheurs",
            "Gestionnaires d'AMP",
            "Communautés locales",
            "Bénévoles",
            "Étudiants",
            "Consultants externes",
            "Autre"
          ],
          "other": true
        },
        {
          "id": "q019",
          "n": 19,
          "label": "Quel est le budget annuel approximatif alloué au suivi écologique des herbiers marins ?",
          "type": "radio",
          "required": true,
          "options": [
            "Moins de 1 000 000 Ar",
            "1 000 000 à 5 000 000 Ar",
            "5 000 000 à 15 000 000 Ar",
            "15 000 000 à 30 000 000 Ar",
            "30 000 000 à 50 000 000 Ar",
            "Plus de 50 000 000 Ar"
          ],
          "other": false
        }
      ]
    },
    {
      "key": "M1",
      "perMethod": true,
      "sections": [
        "C"
      ],
      "title": "Statut et origine du protocole",
      "short": "Statut et protocole",
      "questions": [
        {
          "id": "q020",
          "n": 20,
          "label": "Cette méthode est-elle encore utilisée par votre organisation ?",
          "type": "radio",
          "required": true,
          "options": [
            "Actuellement utilisée",
            "Utilisée auparavant"
          ],
          "other": false,
          "section": "C"
        },
        {
          "id": "q021",
          "n": 21,
          "label": "La méthode utilisée est-elle basée sur un protocole standardisé publié ou reconnu ?",
          "type": "radio",
          "required": true,
          "options": [
            "Oui, sans modification",
            "Oui, mais adaptée",
            "Non, protocole interne",
            "Ne sait pas"
          ],
          "other": false,
          "section": "C"
        },
        {
          "id": "q022",
          "n": 22,
          "label": "Quelles parties du protocole ont été modifiées et pourquoi ?",
          "type": "textarea",
          "required": false,
          "showIf": {
            "q": "q021",
            "eq": "Oui, mais adaptée"
          },
          "section": "C"
        }
      ]
    },
    {
      "key": "M2",
      "perMethod": true,
      "sections": [
        "D",
        "E"
      ],
      "title": "Objectifs et indicateurs écologiques",
      "short": "Objectifs et indicateurs",
      "questions": [
        {
          "id": "q023",
          "n": 23,
          "label": "Quels sont les principaux objectifs du suivi réalisé avec cette méthode ?",
          "type": "checkbox",
          "required": true,
          "options": [
            "Évaluer l’état / la santé des herbiers",
            "Suivre les changements dans le temps",
            "Cartographier la distribution / superficie",
            "Suivre les pressions et menaces",
            "Évaluer la biodiversité / faune associée",
            "Suivre la restauration",
            "Évaluer la biomasse / carbone",
            "Recherche scientifique",
            "Gestion d’AMP/LMMA",
            "Autre"
          ],
          "other": true,
          "section": "D"
        },
        {
          "id": "q024",
          "n": 24,
          "label": "Quels indicateurs écologiques sont mesurés avec cette méthode ?",
          "type": "checkbox",
          "required": true,
          "groups": [
            {
              "label": "État de la végétation",
              "options": [
                "Pourcentage de couverture",
                "Composition spécifique",
                "Densité des pousses",
                "Richesse spécifique",
                "Diversité",
                "Hauteur de la canopée",
                "Biomasse",
                "Mortalité / état des plants"
              ]
            },
            {
              "label": "Étendue et distribution",
              "options": [
                "Étendue / superficie des herbiers",
                "Distribution spatiale"
              ]
            },
            {
              "label": "Sédiment et paramètres du milieu",
              "options": [
                "Caractéristiques du substrat",
                "Matière organique",
                "Carbone organique",
                "Turbidité",
                "Température",
                "Salinité",
                "Profondeur"
              ]
            },
            {
              "label": "Pressions et faune",
              "options": [
                "Pressions anthropiques",
                "Faune associée"
              ]
            },
            {
              "label": "",
              "options": [
                "Autre"
              ]
            }
          ],
          "options": [
            "Pourcentage de couverture",
            "Composition spécifique",
            "Densité des pousses",
            "Richesse spécifique",
            "Diversité",
            "Hauteur de la canopée",
            "Biomasse",
            "Mortalité / état des plants",
            "Étendue / superficie des herbiers",
            "Distribution spatiale",
            "Caractéristiques du substrat",
            "Matière organique",
            "Carbone organique",
            "Turbidité",
            "Température",
            "Salinité",
            "Profondeur",
            "Pressions anthropiques",
            "Faune associée",
            "Autre"
          ],
          "other": true,
          "help": "Cochez tous les indicateurs mesurés.",
          "section": "E"
        },
        {
          "id": "q025",
          "n": 25,
          "label": "Parmi les indicateurs sélectionnés, lesquels sont les plus importants pour votre objectif de suivi ? Pourquoi ?",
          "type": "textarea",
          "required": false,
          "section": "E"
        },
        {
          "id": "q026",
          "n": 26,
          "label": "Certains indicateurs sont-ils difficiles ou coûteux à mesurer ? Si oui, lesquels et pourquoi ?",
          "type": "textarea",
          "required": false,
          "section": "E"
        }
      ]
    },
    {
      "key": "M3",
      "perMethod": true,
      "sections": [
        "F"
      ],
      "title": "Protocole d’échantillonnage",
      "short": "Échantillonnage",
      "questions": [
        {
          "id": "q027",
          "n": 27,
          "label": "Quel est le dispositif d’échantillonnage utilisé ?",
          "type": "checkbox",
          "required": true,
          "options": [
            "Transects",
            "Quadrats",
            "Points d’observation",
            "Placettes / stations permanentes",
            "Relevés GPS",
            "Photographies / vidéo",
            "Télédétection satellite",
            "Drone",
            "Prélèvements d'échantillons",
            "Autre"
          ],
          "other": true,
          "section": "F"
        },
        {
          "id": "q028",
          "n": 28,
          "label": "Les sites / stations de suivi sont-ils permanents ?",
          "type": "radio",
          "required": true,
          "options": [
            "Oui",
            "Non",
            "Certains seulement"
          ],
          "other": false,
          "explain": "Pourquoi ? (facultatif)",
          "section": "F"
        },
        {
          "id": "q029",
          "n": 29,
          "label": "Comment les sites sont-ils sélectionnés ?",
          "type": "textarea",
          "required": false,
          "section": "F"
        },
        {
          "id": "q030",
          "n": 30,
          "label": "Combien de stations / sites sont généralement suivis par campagne ?",
          "type": "number",
          "required": false,
          "min": 0,
          "section": "F"
        },
        {
          "id": "q031",
          "n": 31,
          "label": "Quelle est la durée moyenne d’une campagne de suivi sur le terrain pour cette méthode ?",
          "type": "radio",
          "required": false,
          "options": [
            "1 à 2 jours",
            "3 à 4 jours",
            "5 à 6 jours",
            "7 à 10 jours",
            "Plus de 10 jours"
          ],
          "other": false,
          "section": "F"
        },
        {
          "id": "q032",
          "n": 32,
          "label": "Quelle est la durée moyenne nécessaire pour réaliser un relevé sur une station / un site ?",
          "type": "number",
          "required": false,
          "min": 0,
          "units": [
            "minutes",
            "heures"
          ],
          "section": "F"
        }
      ]
    },
    {
      "key": "M4",
      "perMethod": true,
      "sections": [
        "G",
        "H"
      ],
      "title": "Fréquence, matériel et compétences",
      "short": "Fréquence et moyens",
      "questions": [
        {
          "id": "q033",
          "n": 33,
          "label": "À quelle fréquence les données sont-elles collectées ?",
          "type": "radio",
          "required": true,
          "options": [
            "Hebdomadaire",
            "Mensuelle",
            "Trimestrielle",
            "Semestrielle",
            "Annuelle",
            "Tous les 2 à 5 ans",
            "Ponctuelle / selon projet",
            "Autre"
          ],
          "other": true,
          "section": "G"
        },
        {
          "id": "q034",
          "n": 34,
          "label": "La fréquence de suivi est-elle la même toute l’année ?",
          "type": "radio",
          "required": true,
          "options": [
            "Oui",
            "Non",
            "Autre"
          ],
          "other": true,
          "section": "G"
        },
        {
          "id": "q035",
          "n": 35,
          "label": "Quelles périodes / saisons sont privilégiées et pourquoi ?",
          "type": "textarea",
          "required": false,
          "showIf": {
            "q": "q034",
            "eq": "Non"
          },
          "section": "G"
        },
        {
          "id": "q036",
          "n": 36,
          "label": "Quels équipements sont nécessaires ?",
          "type": "checkbox",
          "required": true,
          "options": [
            "GPS",
            "Appareil photo / caméra",
            "Drone",
            "Matériel de plongée",
            "Quadrat",
            "Transect",
            "Réfractomètre",
            "Thermomètre",
            "Disque de Secchi",
            "Matériel de mesure de profondeur",
            "Ordinateur",
            "Logiciel SIG",
            "Matériel de laboratoire",
            "Autre"
          ],
          "other": true,
          "section": "H"
        },
        {
          "id": "q037",
          "n": 37,
          "label": "Quel est le niveau de compétence / formation nécessaire pour appliquer correctement cette méthode ?",
          "type": "radio",
          "required": true,
          "options": [
            "Faible",
            "Moyen",
            "Élevé",
            "Très élevé"
          ],
          "other": false,
          "section": "H"
        },
        {
          "id": "q038",
          "n": 38,
          "label": "Combien de personnes participent généralement au suivi avec cette méthode ?",
          "type": "number",
          "required": false,
          "min": 0,
          "section": "H"
        },
        {
          "id": "q039",
          "n": 39,
          "label": "Une formation spécifique est-elle nécessaire ?",
          "type": "radio",
          "required": true,
          "options": [
            "Oui",
            "Non"
          ],
          "other": false,
          "section": "H"
        },
        {
          "id": "q040",
          "n": 40,
          "label": "Si oui, quel type de formation est nécessaire ?",
          "type": "textarea",
          "required": false,
          "showIf": {
            "q": "q039",
            "eq": "Oui"
          },
          "section": "H"
        }
      ]
    },
    {
      "key": "M5",
      "perMethod": true,
      "sections": [
        "I",
        "J"
      ],
      "title": "Comparabilité et performance de la méthode",
      "short": "Performance",
      "questions": [
        {
          "id": "q041",
          "n": 41,
          "label": "Les données issues de cette méthode sont-elles facilement comparables entre sites et entre années ?",
          "type": "radio",
          "required": true,
          "options": [
            "Oui",
            "Partiellement",
            "Non",
            "Ne sait pas"
          ],
          "other": false,
          "section": "I"
        },
        {
          "id": "q042",
          "n": 42,
          "label": "Comment évaluez-vous la précision des données produites par cette méthode ?",
          "type": "scale",
          "required": true,
          "options": [
            "Très faible",
            "Faible",
            "Moyenne",
            "Élevée",
            "Très élevée"
          ],
          "help": "1 = le plus bas · 5 = le plus haut",
          "section": "J"
        },
        {
          "id": "q043",
          "n": 43,
          "label": "Dans quelle mesure cette méthode permet-elle de détecter les changements à court terme ?",
          "type": "scale",
          "required": true,
          "options": [
            "Très faible",
            "Faible",
            "Moyenne",
            "Élevée",
            "Très élevée"
          ],
          "help": "1 = le plus bas · 5 = le plus haut",
          "section": "J"
        },
        {
          "id": "q044",
          "n": 44,
          "label": "Dans quelle mesure cette méthode permet-elle de détecter les changements à long terme ?",
          "type": "scale",
          "required": true,
          "options": [
            "Très faible",
            "Faible",
            "Moyenne",
            "Élevée",
            "Très élevée"
          ],
          "help": "1 = le plus bas · 5 = le plus haut",
          "section": "J"
        },
        {
          "id": "q045",
          "n": 45,
          "label": "Comment évaluez-vous la facilité de mise en œuvre de cette méthode ?",
          "type": "scale",
          "required": true,
          "options": [
            "Très difficile",
            "Difficile",
            "Moyenne",
            "Facile",
            "Très facile"
          ],
          "help": "1 = le plus bas · 5 = le plus haut",
          "section": "J"
        },
        {
          "id": "q046",
          "n": 46,
          "label": "Comment évaluez-vous le coût global de mise en œuvre ?",
          "type": "scale",
          "required": true,
          "options": [
            "Très faible",
            "Faible",
            "Moyen",
            "Élevé",
            "Très élevé"
          ],
          "help": "1 = le plus bas · 5 = le plus haut",
          "section": "J"
        },
        {
          "id": "q047",
          "n": 47,
          "label": "Dans quelle mesure cette méthode est-elle adaptée aux réalités et capacités locales à Madagascar ?",
          "type": "scale",
          "required": true,
          "options": [
            "Pas du tout adaptée",
            "Peu adaptée",
            "Moyennement adaptée",
            "Bien adaptée",
            "Très bien adaptée"
          ],
          "help": "1 = le plus bas · 5 = le plus haut",
          "section": "J"
        },
        {
          "id": "q048",
          "n": 48,
          "label": "Dans quelle mesure les résultats sont-ils reproductibles entre différents observateurs / équipes ?",
          "type": "scale",
          "required": false,
          "options": [
            "Très faible",
            "Faible",
            "Moyenne",
            "Élevée",
            "Très élevée"
          ],
          "help": "1 = le plus bas · 5 = le plus haut",
          "section": "J"
        }
      ]
    },
    {
      "key": "M6",
      "perMethod": true,
      "sections": [
        "K"
      ],
      "title": "Contraintes et limites",
      "short": "Contraintes et limites",
      "questions": [
        {
          "id": "q049",
          "n": 49,
          "label": "Quelles sont les principales contraintes rencontrées lors de l'application de cette méthode ?",
          "type": "checkbox",
          "required": true,
          "options": [
            "Accès aux sites",
            "Marée / conditions météorologiques",
            "Visibilité sous-marine",
            "Équipement insuffisant",
            "Coût",
            "Manque de personnel",
            "Manque de compétences / formation",
            "Temps nécessaire",
            "Difficulté d’identification des espèces",
            "Difficulté d’analyse des données",
            "Difficulté de stockage / gestion des données",
            "Autre"
          ],
          "other": true,
          "section": "K"
        },
        {
          "id": "q050",
          "n": 50,
          "label": "Parmi ces contraintes, quelles sont les trois plus importantes ?",
          "type": "rank",
          "required": true,
          "rankFrom": "q049",
          "ranks": 3,
          "help": "Classez-les de la plus importante (1) à la moins importante (3).",
          "rankEmpty": "Sélectionnez d'abord des contraintes à la question précédente.",
          "section": "K"
        },
        {
          "id": "q051",
          "n": 51,
          "label": "Quelles sont, selon vous, les principales limites scientifiques ou méthodologiques de cette méthode ?",
          "type": "textarea",
          "required": true,
          "section": "K"
        },
        {
          "id": "q052",
          "n": 52,
          "label": "Quelles sont les principales forces / avantages de cette méthode ?",
          "type": "textarea",
          "required": true,
          "section": "K"
        }
      ]
    },
    {
      "key": "M7",
      "perMethod": true,
      "sections": [
        "L"
      ],
      "title": "Analyse FFOM de la méthode",
      "short": "FFOM",
      "questions": [
        {
          "id": "q053",
          "n": 53,
          "label": "Quelles sont les principales FORCES de cette méthode ?",
          "type": "checkbox",
          "required": true,
          "options": [
            "Coût faible",
            "Équipements simples / disponibles à Madagascar",
            "Facile à mettre en œuvre",
            "Ne nécessite pas de personnel spécialisé",
            "Formation courte",
            "Méthode rapide sur le terrain",
            "Protocole standardisé / reconnu internationalement",
            "Données précises",
            "Bonne reproductibilité entre observateurs",
            "Données comparables entre sites et entre années",
            "Bonne couverture spatiale",
            "Adaptée au suivi à long terme",
            "Implique les communautés locales",
            "Données faciles à traiter / analyser",
            "Autre"
          ],
          "other": true,
          "section": "L"
        },
        {
          "id": "q054",
          "n": 54,
          "label": "Quelles sont les principales FAIBLESSES de cette méthode ?",
          "type": "checkbox",
          "required": true,
          "options": [
            "Coût élevé",
            "Besoin d’équipements spécifiques",
            "Équipements difficiles à obtenir à Madagascar",
            "Besoin de personnel spécialisé",
            "Besoin d’une formation spécifique",
            "Méthode longue à mettre en œuvre",
            "Méthode difficile à standardiser",
            "Méthode difficile à reproduire",
            "Forte dépendance aux conditions météorologiques / marines",
            "Difficultés d’accès aux sites",
            "Faible couverture spatiale",
            "Faible fréquence de suivi",
            "Difficultés d’identification des espèces",
            "Données difficiles à traiter / analyser",
            "Données difficiles à comparer entre sites",
            "Méthode peu adaptée à certains types d’herbiers",
            "Autre"
          ],
          "other": true,
          "section": "L"
        },
        {
          "id": "q055",
          "n": 55,
          "label": "Quelles sont les principales OPPORTUNITÉS pour améliorer ou développer cette méthode à Madagascar ?",
          "type": "checkbox",
          "required": true,
          "options": [
            "Intégration de la méthode dans un protocole national",
            "Harmonisation des méthodes existantes",
            "Formation des acteurs nationaux",
            "Renforcement des capacités des institutions",
            "Partenariats entre institutions",
            "Collaboration avec les ONG et projets",
            "Collaboration avec les communautés locales",
            "Réseau national de suivi des herbiers",
            "Mise en place de stations permanentes",
            "Base de données nationale",
            "Utilisation des outils SIG et de télédétection",
            "Outils numériques de collecte des données",
            "Suivi à long terme",
            "Comparaison des données entre régions",
            "Intégration dans les programmes de conservation",
            "Mobilisation de financements pour le suivi écologique",
            "Autre"
          ],
          "other": true,
          "section": "L"
        },
        {
          "id": "q056",
          "n": 56,
          "label": "Quelles sont les principales MENACES pouvant limiter son utilisation ou sa pérennisation ?",
          "type": "checkbox",
          "required": true,
          "options": [
            "Manque de financement à long terme",
            "Arrêt des projets après leur période de financement",
            "Manque de personnel qualifié",
            "Rotation du personnel formé",
            "Manque de matériel / équipements",
            "Coût élevé des équipements",
            "Difficultés logistiques et d’accès aux sites",
            "Conditions météorologiques ou marines",
            "Absence de coordination entre les institutions",
            "Absence de protocole national harmonisé",
            "Méthodes différentes entre les acteurs",
            "Manque de continuité des séries de données",
            "Perte ou mauvaise gestion des données",
            "Faible appropriation par les acteurs locaux",
            "Difficulté d’intégration des données dans une base nationale",
            "Pressions anthropiques importantes sur les herbiers",
            "Dégradation / disparition des sites de suivi",
            "Autre"
          ],
          "other": true,
          "section": "L"
        }
      ]
    },
    {
      "key": "M8",
      "perMethod": true,
      "sections": [
        "M"
      ],
      "title": "Intégration dans un protocole national",
      "short": "Protocole national",
      "questions": [
        {
          "id": "q057",
          "n": 57,
          "label": "Selon vous, cette méthode pourrait-elle être intégrée dans un protocole national harmonisé de suivi des herbiers marins ?",
          "type": "radio",
          "required": false,
          "options": [
            "Oui",
            "Oui, avec adaptations",
            "Non",
            "Ne sait pas"
          ],
          "other": false,
          "section": "M"
        },
        {
          "id": "q058",
          "n": 58,
          "label": "Quels éléments de cette méthode devraient absolument être conservés dans un futur protocole national ?",
          "type": "textarea",
          "required": false,
          "showIf": {
            "q": "q057",
            "starts": "Oui"
          },
          "section": "M"
        },
        {
          "id": "q059",
          "n": 59,
          "label": "Quelles adaptations seraient nécessaires pour permettre son utilisation à l’échelle nationale ?",
          "type": "textarea",
          "required": true,
          "showIf": {
            "q": "q057",
            "starts": "Oui"
          },
          "section": "M"
        }
      ]
    },
    {
      "key": "I",
      "showIf": {
        "q": "q013",
        "in": [
          "Oui",
          "Auparavant, mais plus actuellement"
        ]
      },
      "title": "Données et gestion",
      "short": "Gestion des données",
      "questions": [
        {
          "id": "q060",
          "n": 60,
          "label": "Quels logiciels ou applications utilisez-vous pour la collecte, la gestion ou l'analyse des données ?",
          "type": "checkbox",
          "required": false,
          "options": [
            "Excel",
            "KoboToolbox",
            "QGIS",
            "ArcGIS",
            "R",
            "SPSS",
            "Access",
            "Power BI",
            "Application mobile dédiée",
            "Autre"
          ],
          "other": true
        },
        {
          "id": "q061",
          "n": 61,
          "label": "Comment les données sont-elles enregistrées sur le terrain ?",
          "type": "checkbox",
          "required": false,
          "options": [
            "Fiches papier",
            "Excel",
            "KoboToolbox",
            "Application mobile",
            "GPS",
            "Photographies / vidéos",
            "Autre"
          ],
          "other": true
        },
        {
          "id": "q062",
          "n": 62,
          "label": "Où les données sont-elles stockées après la collecte ?",
          "type": "checkbox",
          "required": false,
          "options": [
            "Excel",
            "Drive",
            "KoboToolbox",
            "Base de données",
            "Serveur institutionnel",
            "Plateforme en ligne",
            "Documents papier",
            "Autre"
          ],
          "other": true
        },
        {
          "id": "q063",
          "n": 63,
          "label": "Les données sont-elles partagées avec d’autres institutions / partenaires ?",
          "type": "radio",
          "required": false,
          "options": [
            "Oui",
            "Partiellement",
            "Non"
          ],
          "other": false,
          "explain": "Pourquoi ? Avec qui ? (facultatif)"
        }
      ]
    },
    {
      "key": "M",
      "title": "Harmonisation nationale et recommandations",
      "short": "Harmonisation",
      "questions": [
        {
          "id": "q064",
          "n": 64,
          "label": "Pensez-vous qu'une harmonisation nationale des protocoles de suivi des herbiers marins est nécessaire ?",
          "type": "radio",
          "required": true,
          "options": [
            "Oui",
            "Non",
            "Ne sait pas"
          ],
          "other": false
        },
        {
          "id": "q065",
          "n": 65,
          "label": "Quels critères sont les plus importants pour un futur protocole national ?",
          "type": "checkbox",
          "required": true,
          "options": [
            "Simplicité",
            "Coût abordable",
            "Reproductibilité",
            "Adaptabilité locale",
            "Compatibilité internationale",
            "Facilité de mise en œuvre",
            "Autre"
          ],
          "other": true,
          "help": "Plusieurs choix possibles."
        },
        {
          "id": "q066",
          "n": 66,
          "label": "Quels indicateurs devraient, selon vous, être suivis de manière commune par tous les acteurs à Madagascar ?",
          "type": "checkbox",
          "required": true,
          "options": [
            "Couverture",
            "Composition spécifique",
            "Densité",
            "Hauteur de canopée",
            "Biomasse",
            "Superficie / distribution",
            "Pressions",
            "Substrat",
            "Faune associée",
            "Paramètres environnementaux",
            "Autre"
          ],
          "other": true
        },
        {
          "id": "q067",
          "n": 67,
          "label": "Quels sont vos besoins prioritaires pour améliorer le suivi ?",
          "type": "checkbox",
          "required": false,
          "options": [
            "Formation",
            "Matériel",
            "Financement",
            "Protocoles harmonisés",
            "Base de données standardisée",
            "Coordination entre acteurs",
            "Appui technique",
            "Autre"
          ],
          "other": true
        },
        {
          "id": "q068",
          "n": 68,
          "label": "Seriez-vous prêt(e) à adopter un protocole national harmonisé ?",
          "type": "radio",
          "required": false,
          "options": [
            "Oui",
            "Non",
            "Peut-être",
            "Sous certaines conditions (préciser)"
          ],
          "other": true
        },
        {
          "id": "q069",
          "n": 69,
          "label": "Quelles méthodes recommandez-vous pour un futur protocole national ?",
          "type": "checkbox",
          "required": false,
          "options": [
            "LIT",
            "Quadrats",
            "Photo-quadrats",
            "Points intercepts",
            "Suivi participatif",
            "Drone",
            "Télédétection",
            "Autre"
          ],
          "other": true
        },
        {
          "id": "q070",
          "n": 70,
          "label": "Souhaitez-vous participer à l'élaboration d'un protocole national harmonisé ?",
          "type": "radio",
          "required": false,
          "options": [
            "Oui",
            "Non",
            "Peut-être"
          ],
          "other": false
        }
      ]
    },
    {
      "key": "N",
      "showIf": {
        "q": "q013",
        "in": [
          "Oui",
          "Auparavant, mais plus actuellement"
        ]
      },
      "title": "Photos de la méthode de suivi",
      "short": "Photos",
      "questions": [
        {
          "id": "q071",
          "n": 71,
          "label": "Téléchargez des photos illustrant la méthode / le protocole de suivi utilisé",
          "type": "file",
          "required": false,
          "maxFiles": 5,
          "maxMB": 10,
          "accept": [
            "jpg",
            "jpeg",
            "png"
          ],
          "acceptLabel": "JPG ou PNG",
          "help": "Photos du site, du dispositif de suivi, du matériel ou de la réalisation du protocole (facultatif). JPG ou PNG, 5 photos maximum ; elles sont compressées automatiquement."
        },
        {
          "id": "q072",
          "n": 72,
          "label": "Nom et prénom(s) du photographe",
          "type": "text",
          "required": true,
          "showIf": {
            "q": "q071",
            "filled": true
          },
          "help": "Si plusieurs photographes, indiquez-les tous."
        },
        {
          "id": "q073",
          "n": 73,
          "label": "Localisation de la photo",
          "type": "text",
          "required": false,
          "showIf": {
            "q": "q071",
            "filled": true
          },
          "help": "Région / district / commune / site ou station de suivi"
        },
        {
          "id": "q074",
          "n": 74,
          "label": "Date et heure de la prise de vue",
          "type": "datetime",
          "required": true,
          "showIf": {
            "q": "q071",
            "filled": true
          },
          "help": "Si plusieurs photos, indiquez la date de la première."
        }
      ]
    }
  ]
};

if (typeof module !== "undefined") module.exports = SURVEY;
