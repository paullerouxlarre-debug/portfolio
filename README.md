# Le bac de Paul — portfolio

Portfolio « bac à vinyles » : chaque projet (site, appli, vidéo, démo du labo) est une pochette qu'on feuillette, puis un disque qu'on pose sur la platine.

- `index.html`, `style.css`, `app.js` : la page (aucune dépendance, aucun build).
- `projects.js` : **le catalogue**. Ajouter un projet = ajouter un objet dans la liste (catégorie, textes, couleurs, liens).
- `assets/covers/` : captures des sites utilisées en pochette et en aperçu.
- `labo/` : copies des démos **fictives** du QG, pour qu'elles soient accessibles en ligne.
- Lien direct vers un disque : `…/#disque=<id>` (ex. `#disque=fournil`).

Commandes : ← → / molette / glisser pour feuilleter, Entrée pour écouter, Échap pour ranger.

Bande-son : chaque disque a un titre Spotify (champ `song` dans `projects.js`), joué par le lecteur officiel de Spotify (API d'intégration). Morceau entier si on est connecté à Spotify dans le navigateur, extrait de 30 s sinon. Le bouton « Musique auto » coupe le lancement automatique. Aucun fichier audio n'est hébergé ici.

Faces : A sites, B applis, C vidéo, D labo, E IA & agents. Champ `status` facultatif (Abandonné, En pause…) affiché en autocollant.

Hébergement prévu : GitHub Pages (branche `main`, dossier racine).
