// Catalogue du bac. Chaque disque = un projet.
// art : motif de pochette (stripes, sun, grid, waves, rings, type) ; c : trois couleurs.
// links : { label, url, private? } — private = artefact Claude (accès réservé à Paul).
window.PROJECTS = [
  // ── FACE A · SITES EN LIGNE ─────────────────────────────
  {
    id: "cartonnages-larre", song: { id: "1KE9mE3nrYM9ZtUTZpcxSt", title: "Harder, Better, Faster, Stronger", artist: "Daft Punk" }, cat: "sites", year: 2026, title: "Cartonnages Larré",
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
    id: "binocles", song: { id: "2GYHyAoLWpkxLVa4oYTVko", title: "Alors on danse", artist: "Stromae" }, cat: "sites", year: 2026, title: "Au Monde des Binocles",
    tagline: "Opticien : la boutique en 3D",
    desc: "Une scène 3D de la boutique, sa façade et la place, puis la monture devient le sujet : matière, montage, verres, passage du flou au net. Mis en ligne avec l'accord de la propriétaire.",
    tracks: ["Façade et place en 3D", "Du flou au net", "Collection de montures", "Lien vers le rendez-vous"],
    tech: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    art: "rings", c: ["#1f3a5f", "#e9dcc6", "#c8553d"], img: "assets/covers/aumondedesbinocles.jpg",
    links: [{ label: "Ouvrir le site", url: "https://paullerouxlarre-debug.github.io/aumondedesbinocles/" }]
  },
  {
    id: "fournil", song: { id: "7zjkSx1EUums3s1Yg2jPJD", title: "Le Sud", artist: "Nino Ferrer" }, cat: "sites", year: 2026, title: "Fournil des Chaouches",
    tagline: "Boulangerie : la chaleur du four à l'écran",
    desc: "Le site suit le métier à l'aube : arrivée devant la boutique, ingrédients, geste, cuisson, puis les produits et les infos pratiques. Son proposé à l'activation.",
    tracks: ["L'aube devant la boutique", "Ingrédients et geste", "Cuisson", "Infos pratiques"],
    tech: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    art: "sun", c: ["#e09f3e", "#540b0e", "#fff3dc"], img: "assets/covers/fournil-des-chaouches.jpg",
    links: [{ label: "Ouvrir le site", url: "https://paullerouxlarre-debug.github.io/fournil-des-chaouches/" }]
  },
  {
    id: "mes-collections", song: { id: "5JtK4KpwwWQ28v4p92Xjxk", title: "Les lacs du Connemara", artist: "Michel Sardou" }, cat: "sites", year: 2026, title: "Mes Collections",
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
    id: "rythme", song: { id: "60nZcImufyMA1MKQY3dcCH", title: "Happy", artist: "Pharrell Williams" }, cat: "applis", year: 2026, title: "Rythme",
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
    id: "atlas-1302", song: { id: "0VjIjW4GlUZAMYd2vXMi3b", title: "Blinding Lights", artist: "The Weeknd" }, cat: "applis", year: 2026, title: "Atlas Coccinelle 1302",
    tagline: "L'atelier numérique d'une VW de 1972",
    desc: "Catalogue de pièces sous-ensemble par sous-ensemble, vues éclatées cliquables, fiches de travail et analyse de photos par l'IA pour restaurer une Coccinelle 1302.",
    tracks: ["108 sous-ensembles", "1 560 références", "Vues éclatées interactives", "Analyse photo par IA"],
    tech: ["HTML", "JavaScript", "Claude", "Gemini"],
    art: "type", c: ["#2f6b4f", "#f2e8cf", "#d1495b"],
    links: [{ label: "Ouvrir l'atlas", url: "https://paullerouxlarre-debug.github.io/mes-collections/atlas-1302/" }]
  },
  {
    id: "palier", song: { id: "2KH16WveTQWT6KOG9Rg6e2", title: "Eye of the Tiger", artist: "Survivor" }, cat: "applis", year: 2026, title: "Palier",
    tagline: "Ton âge physique, et le prochain palier à franchir",
    desc: "Prototype d'app iPhone : à partir de tes max (tractions, gainage, 5 km…), elle calcule un âge physique et te montre les paliers qui te rajeunissent.",
    tracks: ["Moteur de calcul par centiles", "Couloirs Cardio et Force", "Carte à partager", "Mode clair et sombre"],
    tech: ["Prototype iPhone", "JavaScript"],
    art: "stripes", c: ["#ff6b35", "#14213d", "#f7f7f2"],
    links: [{ label: "Prototype", url: "https://claude.ai/artifact/83C5SHwfbHJNRCsAtDHz33", private: true }]
  },
  {
    id: "relais", song: { id: "3M8FzayQWtkvOhqMn2V4T2", title: "Lean on Me", artist: "Bill Withers" }, cat: "applis", year: 2026, title: "Relais",
    tagline: "Une fratrie, un parent âgé, une seule appli",
    desc: "Prototype d'app partagée : semaine des visites, rendez-vous à accompagner, traitement du jour et partage équitable des dépenses.",
    tracks: ["Semaine des visites", "Alertes jours sans visite", "Carnet commun", "Équilibre des dépenses"],
    tech: ["Prototype iPhone", "JavaScript"],
    art: "rings", c: ["#3d8c7a", "#fdf6ec", "#e76f51"],
    links: [{ label: "Prototype", url: "https://claude.ai/artifact/B73p63PbptZ58mDKFuiYAm", private: true }]
  },
  {
    id: "temoin", song: { id: "3PiJeSd1XkqLAiUiTOEctW", title: "Basique", artist: "Orelsan" }, cat: "applis", year: 2026, title: "Témoin",
    tagline: "Récupérer son dépôt de garantie, preuves à l'appui",
    desc: "Prototype pour locataires : photos d'entrée et de sortie par pièce, compte à rebours légal et lettre de contestation pré-remplie.",
    tracks: ["Dossier du logement", "Photos par pièce", "Compte à rebours légal", "Lettre pré-remplie"],
    tech: ["Prototype iPhone", "JavaScript"],
    art: "grid", c: ["#264653", "#e9c46a", "#f4f1de"],
    links: [{ label: "Prototype", url: "https://claude.ai/artifact/RWZhPqDUh5XtDkCpw3QzW9", private: true }]
  },
  {
    id: "check-occaz", song: { id: "7KXjTSCq5nL1LoYtL7XAwS", title: "HUMBLE.", artist: "Kendrick Lamar" }, cat: "applis", year: 2026, title: "Check-Occaz",
    tagline: "Acheter son occasion comme un ingénieur",
    desc: "Page de lancement d'une méthode d'inspection de voiture d'occasion, avec une animation de « scan » du véhicule.",
    tracks: ["Animation de scan", "Checklist par zone", "Bandeau des défauts cachés"],
    tech: ["Design", "HTML"],
    art: "sun", c: ["#f5c518", "#111111", "#f5f5f5"],
    links: [{ label: "Maquette", url: "https://claude.ai/artifact/9yuXP3q6o5UzgPAYm8JphH", private: true }]
  },

  // ── FACE C · VIDÉO ──────────────────────────────────────
  {
    id: "histoires", song: { id: "32OlwWuMpZ6b0aN2RZOeMS", title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" }, cat: "video", year: 2026, title: "Histoires en 30s",
    tagline: "Des histoires vraies en 30 secondes, chaque jour",
    desc: "Une chaîne TikTok de petites histoires vraies (voitures, marques, objets) produites avec l'IA : recherche, script, voix, montage et publication automatisés.",
    tracks: ["Script et voix IA", "Styles animés maison", "Publication automatisée", "Mesure et itération"],
    tech: ["TikTok", "ElevenLabs", "Claude"],
    art: "waves", c: ["#ff0050", "#0b0b0b", "#00f2ea"],
    links: [{ label: "Voir sur TikTok", url: "https://www.tiktok.com/@histoires.en30s" }]
  },

  // ── FACE D · LABO ───────────────────────────────────────
  {
    id: "egurra", song: { id: "6DCZcSspjsKoFjzjrWoCdn", title: "God's Plan", artist: "Drake" }, cat: "labo", year: 2026, title: "Atelier Egurra",
    tagline: "Charpente et ébénisterie (démo fictive)",
    desc: "Vitrine premium en mouvement pour un atelier imaginaire des Landes : textes fictifs, aucune photo, tout en matière et typographie.",
    tracks: ["Animations premium", "Sans aucune photo"], tech: ["HTML", "CSS", "JavaScript"],
    art: "stripes", c: ["#7a4b2a", "#f1e4cf", "#1d1a16"], img: "assets/covers/egurra.jpg",
    links: [{ label: "Ouvrir la démo", url: "labo/egurra/" }]
  },
  {
    id: "pin-sec", song: { id: "2Foc5Q5nqNiosCNqttzHof", title: "Get Lucky", artist: "Daft Punk" }, cat: "labo", year: 2026, title: "Atelier Pin Sec",
    tagline: "Menuiserie : comprendre un assemblage au défilement (démo fictive)",
    desc: "Le défilement assemble pièce par pièce un meuble en pin, pour faire comprendre le savoir-faire.",
    tracks: ["Assemblage au scroll", "Version 3"], tech: ["GSAP", "ScrollTrigger"],
    art: "grid", c: ["#c9a227", "#1f2d24", "#f6f1e7"], img: "assets/covers/pinsec.jpg",
    links: [{ label: "Ouvrir la démo", url: "labo/pin-sec/" }]
  },
  {
    id: "gouf", song: { id: "463CkQjx2Zk1yXoBuierM9", title: "Levitating", artist: "Dua Lipa" }, cat: "labo", year: 2026, title: "Gouf Surf Shop",
    tagline: "Surf shop à Capbreton (démo fictive)",
    desc: "Une vitrine de surf shop pleine d'énergie : planches, location et cours. Shop, tarifs et conditions fictifs.",
    tracks: ["Ambiance océan", "Catalogue des planches"], tech: ["HTML", "CSS", "JavaScript"],
    art: "waves", c: ["#0a7ea4", "#fff4e0", "#ff8c42"], img: "assets/covers/gouf.jpg",
    links: [{ label: "Ouvrir la démo", url: "labo/gouf/" }]
  },
  {
    id: "sable-et-sel", song: { id: "7zw5tXgp8bk2bWj4xbuO83", title: "Tout oublier", artist: "Angèle" }, cat: "labo", year: 2026, title: "Poterie Sable et Sel",
    tagline: "Céramique : le tour de potier sous le curseur (démo fictive)",
    desc: "Le curseur, le doigt ou l'inclinaison du téléphone font tourner et révèlent les pièces de céramique.",
    tracks: ["Révélation au curseur", "Inclinaison du téléphone"], tech: ["Canvas", "JavaScript"],
    art: "rings", c: ["#2f5d50", "#ece6dc", "#c97b4a"],
    links: [{ label: "Ouvrir la démo", url: "labo/sable-et-sel/" }]
  },
  {
    id: "shape-brume", song: { id: "4Dvkj6JhhA12EX05fT7y2e", title: "As It Was", artist: "Harry Styles" }, cat: "labo", year: 2026, title: "Shape Brume",
    tagline: "Shaper de planches en 3D temps réel (démo fictive)",
    desc: "Une planche de surf en 3D qu'on fait tourner dans la brume, pour un shaper imaginaire.",
    tracks: ["3D temps réel", "Rotation libre"], tech: ["Three.js", "WebGL"],
    art: "sun", c: ["#8ecae6", "#023047", "#ffb703"], img: "assets/covers/shapebrume.jpg",
    links: [{ label: "Ouvrir la démo", url: "labo/shape-brume/" }]
  },
  {
    id: "ondres", song: { id: "1ToSRFInt8OuM7qJU8r1zA", title: "Dernière danse", artist: "Indila" }, cat: "labo", year: 2026, title: "Ondres, hier et aujourd'hui",
    tagline: "Comparer le village d'hier et d'aujourd'hui",
    desc: "Une démo pour faire glisser le temps sur un même lieu, entre carte postale ancienne et vue actuelle.",
    tracks: ["Avant / après"], tech: ["HTML", "JavaScript"],
    art: "type", c: ["#a44a3f", "#f5efe0", "#3d5a80"], img: "assets/covers/ondres.jpg",
    links: [{ label: "Ouvrir la démo", url: "labo/ondres/" }]
  },
  {
    id: "garage-3d", song: { id: "5SAUIWdZ04OxYfJFDchC7S", title: "Smoke on the Water", artist: "Deep Purple" }, cat: "labo", year: 2026, title: "Garage 3D",
    tagline: "Mon garage remis à plat, à partir de photos et d'un croquis",
    desc: "À partir de 20 photos et d'un croquis à la main, l'IA a redessiné le garage à l'échelle (rez-de-chaussée et grenier), puis généré des plans importables dans un planificateur 3D pour tester des aménagements.",
    tracks: ["Plan estimé depuis des photos", "Plans cotés v2 et v3", "Essai de maquette 3D", "Fichiers d'import générés"],
    tech: ["Claude", "Python", "JSON", "3D"],
    art: "grid", c: ["#e76f51", "#22313f", "#f4f1de"], status: "En pause",
    links: []
  },
  {
    id: "visite-en-couches", song: { id: "3cfOd4CMv2snFaKAnMdnvK", title: "All Star", artist: "Smash Mouth" }, cat: "labo", year: 2026, title: "Visite en couches",
    tagline: "Visiter un bien immobilier à partir de quelques photos",
    desc: "Parti d'une idée de clips vidéo IA pour l'immobilier, le projet a pivoté vers un outil de visite immersive construit depuis quelques photos. La version 1 a été refusée : le projet reste au stade d'exploration.",
    tracks: ["Études prix, offre et droits", "Pivot vers la visite immersive", "Prototype v1 (refusé)"],
    tech: ["HTML", "JavaScript", "Couches de profondeur"],
    art: "waves", c: ["#577590", "#f8f4ec", "#f3722c"], status: "Abandonné",
    links: []
  },

  // ── FACE E · IA & AGENTS ───────────────────────────────
  {
    id: "agents", song: { id: "0LSLM0zuWRkEYemF7JcfEE", title: "Technologic", artist: "Daft Punk" }, cat: "ia", year: 2026, title: "L'entreprise IA",
    tagline: "Une équipe d'agents IA qui travaillait pour moi, jour et nuit",
    desc: "Ma première version du QG : 18 agents spécialisés (direction, veille, scripts, voix et montage, prototypage, coûts…) orchestrés par un « CEO » IA. Ils découpaient mes missions, croisaient les idées la nuit, les notaient et me livraient un brief chaque matin. Abandonné le 18/11/2026 au profit d'un second cerveau plus simple.",
    tracks: ["18 agents et leurs pôles", "Un CEO IA qui délègue", "Routine de nuit et brief du matin", "Croisements d'idées notés sur 100", "Commandes /idee /mission /croiser /chiffrer"],
    tech: ["Claude Code", "Sous-agents", "Markdown", "Tâches planifiées"],
    art: "grid", c: ["#ff7a00", "#101418", "#e8eef2"], status: "Abandonné",
    links: [{ label: "Ancien tableau de bord", url: "https://claude.ai/artifact/9mS4oZKHbkKcyf9CamcdjE", private: true }]
  },
  {
    id: "qg", song: { id: "1QFw2xxyQtgKjlrMCEqsNj", title: "Papaoutai", artist: "Stromae" }, cat: "ia", year: 2026, title: "Le QG",
    tagline: "Mon second cerveau, construit et partagé avec l'IA",
    desc: "Le dépôt privé où l'IA et moi rangeons projets, recherches, décisions et apprentissages. Né d'une équipe d'agents, il a été refondu le 18/11/2026 en un second cerveau rangé par sujets, relié en réseau dans Obsidian. C'est de là que sortent tous les disques de ce bac.",
    tracks: ["Notes reliées (Obsidian)", "Réseau des connaissances", "Méthodes réutilisables", "Mémoire des projets partagée avec l'IA"], tech: ["Markdown", "Git", "Claude Code"],
    art: "type", c: ["#111111", "#efe6d5", "#e4572e"],
    links: []
  },
  {
    id: "voicestudio", song: { id: "7sKDftgGirHWTVFMtJoDoh", title: "Djadja", artist: "Aya Nakamura" }, cat: "ia", year: 2026, title: "VoiceStudio",
    tagline: "Ma voix clonée, en local sur mon Mac",
    desc: "Un studio de voix installé sur mon ordinateur : ma propre voix clonée pour narrer, doubler et automatiser des voix off, sans envoyer mes enregistrements dans le cloud.",
    tracks: ["Voix clonée « Paul »", "Narration et doublage", "API et serveur MCP pour les agents"],
    tech: ["Clonage vocal", "Local", "MCP"],
    art: "rings", c: ["#9b5de5", "#14111c", "#f1e9ff"],
    links: []
  },
  {
    id: "explorations", song: { id: "6mY7PiGjZ1Z57GkNPjoncq", title: "On verra", artist: "Nekfeu" }, cat: "ia", year: 2026, title: "Pistes Y Combinator",
    tagline: "Des idées de business repérées par mes agents",
    desc: "Mes agents ont épluché le site public de Y Combinator : 11 thèmes, 8 tendances, 10 modèles de startups reproductibles en petit, puis un top 5 noté pour choisir une piste à tester.",
    tracks: ["Veille des appels à projets", "10 modèles chiffrés", "Top 5 des pistes"],
    tech: ["Agents", "Recherche web", "Analyse"],
    art: "sun", c: ["#f26522", "#1d1d1b", "#fdf5ea"], status: "Exploration",
    links: []
  },
  {
    id: "suivi-larre", song: { id: "69kOkLUCkxIZYexIgSG8rq", title: "Get Lucky", artist: "Daft Punk" }, cat: "ia", year: 2026, title: "Suivi achats",
    tagline: "Mon assistant de travail pour les achats",
    desc: "Un outil interne : Claude classe les mails, lit les devis et documents déposés et propose les rappels à créer, pour suivre achats et projets. Outil privé, données professionnelles non montrées.",
    tracks: ["Tri des mails par l'IA", "Lecture des devis", "Rappels et agenda"],
    tech: ["Claude", "Artefact", "Base de données"],
    art: "stripes", c: ["#4f772d", "#132a13", "#ecf39e"], status: "Privé",
    links: []
  }
];

window.CATS = {
  sites:  { face: "A", label: "Sites en ligne" },
  applis: { face: "B", label: "Applis" },
  video:  { face: "C", label: "Vidéo" },
  labo:   { face: "D", label: "Labo" },
  ia:     { face: "E", label: "IA & agents" }
};
