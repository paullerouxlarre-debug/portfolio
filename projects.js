// Catalogue du bac. Chaque disque = un projet.
// art : motif de pochette (stripes, sun, grid, waves, rings, type) ; c : trois couleurs.
// links : { label, url, private? } — private = artefact Claude (accès réservé à Paul).
window.PROJECTS = [
  // ── FACE A · SITES EN LIGNE ─────────────────────────────
  {
    id: "cartonnages-larre", cat: "sites", year: 2026, title: "Cartonnages Larré",
    tagline: "Vitrine immersive d'un fabricant d'emballages à Bayonne",
    desc: "Dans l'atelier à Bayonne, on suit la fabrication d'une boîte, de la première impression jusqu'à son ouverture chez le client. Conçu, codé et mis en ligne avec Claude.",
    tracks: ["Visite de l'atelier", "Fabrication d'une boîte, étape par étape", "Version mobile", "Hébergé sur GitHub Pages"],
    tech: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    art: "stripes", c: ["#b5793f", "#2a1d14", "#efe6d5"],
    links: [
      { label: "Ouvrir le site", url: "https://paullerouxlarre-debug.github.io/cartonnages-larre/" },
      { label: "Code", url: "https://github.com/paullerouxlarre-debug/cartonnages-larre" }
    ]
  },
  {
    id: "binocles", cat: "sites", year: 2026, title: "Au Monde des Binocles",
    tagline: "Opticien : la boutique en 3D",
    desc: "Une scène 3D de la boutique, sa façade et la place, puis la monture devient le sujet : matière, montage, verres, passage du flou au net. Mis en ligne avec l'accord de la propriétaire.",
    tracks: ["Façade et place en 3D", "Du flou au net", "Collection de montures", "Lien vers le rendez-vous"],
    tech: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    art: "rings", c: ["#1f3a5f", "#e9dcc6", "#c8553d"], img: "assets/covers/aumondedesbinocles.jpg",
    links: [{ label: "Ouvrir le site", url: "https://paullerouxlarre-debug.github.io/aumondedesbinocles/" }]
  },
  {
    id: "fournil", cat: "sites", year: 2026, title: "Fournil des Chaouches",
    tagline: "Boulangerie : la chaleur du four à l'écran",
    desc: "Le site suit le métier à l'aube : arrivée devant la boutique, ingrédients, geste, cuisson, puis les produits et les infos pratiques. Son proposé à l'activation.",
    tracks: ["L'aube devant la boutique", "Ingrédients et geste", "Cuisson", "Infos pratiques"],
    tech: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    art: "sun", c: ["#e09f3e", "#540b0e", "#fff3dc"], img: "assets/covers/fournil-des-chaouches.jpg",
    links: [{ label: "Ouvrir le site", url: "https://paullerouxlarre-debug.github.io/fournil-des-chaouches/" }]
  },
  {
    id: "mes-collections", cat: "sites", year: 2026, title: "Mes Collections",
    tagline: "L'album d'un collectionneur d'Ondres",
    desc: "Cartes postales d'Ondres et du sud des Landes (recto, verso, point de vue sur la carte) et les 662 pièces de 2 € à cocher. Installable sur iPhone, données gardées sur l'appareil.",
    tracks: ["Carte maison IGN / Natural Earth", "Album des pièces de 2 €", "Sauvegarde et restauration", "Installable sur l'écran d'accueil"],
    tech: ["HTML", "JavaScript", "SVG", "PWA", "Python"],
    art: "grid", c: ["#2b5f75", "#f4efe3", "#d9a441"], img: "assets/covers/mes-collections.jpg",
    links: [
      { label: "Ouvrir le site", url: "https://paullerouxlarre-debug.github.io/mes-collections/" },
      { label: "Code", url: "https://github.com/paullerouxlarre-debug/mes-collections" }
    ]
  },

  // ── FACE B · APPLIS ─────────────────────────────────────
  {
    id: "rythme", cat: "applis", year: 2026, title: "Rythme",
    tagline: "Mon tableau de bord de vie, dans la poche",
    desc: "Une app perso installée sur iPhone : heures de travail, sport, nutrition, argent et planning. 100 % locale : pas de compte, pas de serveur.",
    tracks: ["Pointage du boulot", "Séances et âge physiologique", "Nutrition et poids", "Argent et projection d'épargne"],
    tech: ["PWA", "JavaScript", "Stockage local"],
    art: "waves", c: ["#5b3cc4", "#120d2b", "#ff5fa2"], img: "assets/covers/rythme.jpg",
    links: [
      { label: "Ouvrir l'app", url: "https://paullerouxlarre-debug.github.io/rythme/" },
      { label: "Code", url: "https://github.com/paullerouxlarre-debug/rythme" }
    ]
  },
  {
    id: "atlas-1302", cat: "applis", year: 2026, title: "Atlas Coccinelle 1302",
    tagline: "L'atelier numérique d'une VW de 1972",
    desc: "Catalogue de pièces sous-ensemble par sous-ensemble, vues éclatées cliquables, fiches de travail et analyse de photos par l'IA pour restaurer une Coccinelle 1302.",
    tracks: ["108 sous-ensembles", "1 560 références", "Vues éclatées interactives", "Analyse photo par IA"],
    tech: ["HTML", "JavaScript", "Claude", "Gemini"],
    art: "type", c: ["#2f6b4f", "#f2e8cf", "#d1495b"],
    links: [{ label: "Ouvrir l'atlas", url: "https://paullerouxlarre-debug.github.io/mes-collections/atlas-1302/" }]
  },
  {
    id: "palier", cat: "applis", year: 2026, title: "Palier",
    tagline: "Ton âge physique, et le prochain palier à franchir",
    desc: "Prototype d'app iPhone : à partir de tes max (tractions, gainage, 5 km…), elle calcule un âge physique et te montre les paliers qui te rajeunissent.",
    tracks: ["Moteur de calcul par centiles", "Couloirs Cardio et Force", "Carte à partager", "Mode clair et sombre"],
    tech: ["Prototype iPhone", "JavaScript"],
    art: "stripes", c: ["#ff6b35", "#14213d", "#f7f7f2"],
    links: [{ label: "Prototype", url: "https://claude.ai/artifact/83C5SHwfbHJNRCsAtDHz33", private: true }]
  },
  {
    id: "relais", cat: "applis", year: 2026, title: "Relais",
    tagline: "Une fratrie, un parent âgé, une seule appli",
    desc: "Prototype d'app partagée : semaine des visites, rendez-vous à accompagner, traitement du jour et partage équitable des dépenses.",
    tracks: ["Semaine des visites", "Alertes jours sans visite", "Carnet commun", "Équilibre des dépenses"],
    tech: ["Prototype iPhone", "JavaScript"],
    art: "rings", c: ["#3d8c7a", "#fdf6ec", "#e76f51"],
    links: [{ label: "Prototype", url: "https://claude.ai/artifact/B73p63PbptZ58mDKFuiYAm", private: true }]
  },
  {
    id: "temoin", cat: "applis", year: 2026, title: "Témoin",
    tagline: "Récupérer son dépôt de garantie, preuves à l'appui",
    desc: "Prototype pour locataires : photos d'entrée et de sortie par pièce, compte à rebours légal et lettre de contestation pré-remplie.",
    tracks: ["Dossier du logement", "Photos par pièce", "Compte à rebours légal", "Lettre pré-remplie"],
    tech: ["Prototype iPhone", "JavaScript"],
    art: "grid", c: ["#264653", "#e9c46a", "#f4f1de"],
    links: [{ label: "Prototype", url: "https://claude.ai/artifact/RWZhPqDUh5XtDkCpw3QzW9", private: true }]
  },
  {
    id: "check-occaz", cat: "applis", year: 2026, title: "Check-Occaz",
    tagline: "Acheter son occasion comme un ingénieur",
    desc: "Page de lancement d'une méthode d'inspection de voiture d'occasion, avec une animation de « scan » du véhicule.",
    tracks: ["Animation de scan", "Checklist par zone", "Bandeau des défauts cachés"],
    tech: ["Design", "HTML"],
    art: "sun", c: ["#f5c518", "#111111", "#f5f5f5"],
    links: [{ label: "Maquette", url: "https://claude.ai/artifact/9yuXP3q6o5UzgPAYm8JphH", private: true }]
  },

  // ── FACE C · VIDÉO ──────────────────────────────────────
  {
    id: "histoires", cat: "video", year: 2026, title: "Histoires en 30s",
    tagline: "Des histoires vraies en 30 secondes, chaque jour",
    desc: "Une chaîne TikTok de petites histoires vraies (voitures, marques, objets) produites avec l'IA : recherche, script, voix, montage et publication automatisés.",
    tracks: ["Script et voix IA", "Styles animés maison", "Publication automatisée", "Mesure et itération"],
    tech: ["TikTok", "ElevenLabs", "Claude"],
    art: "waves", c: ["#ff0050", "#0b0b0b", "#00f2ea"],
    links: [{ label: "Voir sur TikTok", url: "https://www.tiktok.com/@histoires.en30s" }]
  },

  // ── FACE D · LABO ───────────────────────────────────────
  {
    id: "egurra", cat: "labo", year: 2026, title: "Atelier Egurra",
    tagline: "Charpente et ébénisterie (démo fictive)",
    desc: "Vitrine premium en mouvement pour un atelier imaginaire des Landes : textes fictifs, aucune photo, tout en matière et typographie.",
    tracks: ["Animations premium", "Sans aucune photo"], tech: ["HTML", "CSS", "JavaScript"],
    art: "stripes", c: ["#7a4b2a", "#f1e4cf", "#1d1a16"], img: "assets/covers/egurra.jpg",
    links: [{ label: "Ouvrir la démo", url: "labo/egurra/" }]
  },
  {
    id: "pin-sec", cat: "labo", year: 2026, title: "Atelier Pin Sec",
    tagline: "Menuiserie : comprendre un assemblage au défilement (démo fictive)",
    desc: "Le défilement assemble pièce par pièce un meuble en pin, pour faire comprendre le savoir-faire.",
    tracks: ["Assemblage au scroll", "Version 3"], tech: ["GSAP", "ScrollTrigger"],
    art: "grid", c: ["#c9a227", "#1f2d24", "#f6f1e7"], img: "assets/covers/pinsec.jpg",
    links: [{ label: "Ouvrir la démo", url: "labo/pin-sec/" }]
  },
  {
    id: "gouf", cat: "labo", year: 2026, title: "Gouf Surf Shop",
    tagline: "Surf shop à Capbreton (démo fictive)",
    desc: "Une vitrine de surf shop pleine d'énergie : planches, location et cours. Shop, tarifs et conditions fictifs.",
    tracks: ["Ambiance océan", "Catalogue des planches"], tech: ["HTML", "CSS", "JavaScript"],
    art: "waves", c: ["#0a7ea4", "#fff4e0", "#ff8c42"], img: "assets/covers/gouf.jpg",
    links: [{ label: "Ouvrir la démo", url: "labo/gouf/" }]
  },
  {
    id: "sable-et-sel", cat: "labo", year: 2026, title: "Poterie Sable et Sel",
    tagline: "Céramique : le tour de potier sous le curseur (démo fictive)",
    desc: "Le curseur, le doigt ou l'inclinaison du téléphone font tourner et révèlent les pièces de céramique.",
    tracks: ["Révélation au curseur", "Inclinaison du téléphone"], tech: ["Canvas", "JavaScript"],
    art: "rings", c: ["#2f5d50", "#ece6dc", "#c97b4a"],
    links: [{ label: "Ouvrir la démo", url: "labo/sable-et-sel/" }]
  },
  {
    id: "shape-brume", cat: "labo", year: 2026, title: "Shape Brume",
    tagline: "Shaper de planches en 3D temps réel (démo fictive)",
    desc: "Une planche de surf en 3D qu'on fait tourner dans la brume, pour un shaper imaginaire.",
    tracks: ["3D temps réel", "Rotation libre"], tech: ["Three.js", "WebGL"],
    art: "sun", c: ["#8ecae6", "#023047", "#ffb703"], img: "assets/covers/shapebrume.jpg",
    links: [{ label: "Ouvrir la démo", url: "labo/shape-brume/" }]
  },
  {
    id: "ondres", cat: "labo", year: 2026, title: "Ondres, hier et aujourd'hui",
    tagline: "Comparer le village d'hier et d'aujourd'hui",
    desc: "Une démo pour faire glisser le temps sur un même lieu, entre carte postale ancienne et vue actuelle.",
    tracks: ["Avant / après"], tech: ["HTML", "JavaScript"],
    art: "type", c: ["#a44a3f", "#f5efe0", "#3d5a80"], img: "assets/covers/ondres.jpg",
    links: [{ label: "Ouvrir la démo", url: "labo/ondres/" }]
  },
  {
    id: "qg", cat: "labo", year: 2026, title: "Le QG",
    tagline: "Mon second cerveau, partagé avec l'IA",
    desc: "Le dépôt privé où l'IA et moi rangeons projets, recherches, décisions et apprentissages. C'est de là que sortent tous les disques de ce bac.",
    tracks: ["Notes reliées (Obsidian)", "Méthodes réutilisables", "Mémoire des projets"], tech: ["Markdown", "Git", "Claude Code"],
    art: "type", c: ["#111111", "#efe6d5", "#e4572e"],
    links: []
  }
];

window.CATS = {
  sites:  { face: "A", label: "Sites en ligne" },
  applis: { face: "B", label: "Applis" },
  video:  { face: "C", label: "Vidéo" },
  labo:   { face: "D", label: "Labo" }
};
