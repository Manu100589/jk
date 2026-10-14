# JK CONSULTING

Site vitrine responsive de JK CONSULTING. Le contenu reste servi comme des fichiers statiques ; un runtime React/Vite compilé ajoute les scènes 3D et les animations éditoriales.

La section hero conserve son design dédié dans `hero.css`. Les sections éditoriales sont définies dans `sections.css`. La grille de services et le visuel 3D utilisent des images d’illustration locales ; elles ne représentent pas nécessairement l’équipe, les clients, les biens ou les réalisations de l’entreprise.

## Aperçu local

Pour afficher le site statique, servir le dossier avec un serveur HTTP. Pour développer le runtime React/Three.js :

```sh
npm install
npm run dev
```

Pour recompiler le runtime embarqué par la page statique :

```sh
npm run build
```

La compilation copie les bundles dans `assets/runtime`, utilisés directement par `index.html` sur GitHub Pages.

## Réglages de mise en production

Modifier `config.js` avant la publication :

- `phone` : numéro public affiché sur le site.
- `whatsapp` : numéro international WhatsApp, chiffres uniquement.
- `formEndpoint` : URL HTTPS d’un service de réception de formulaire. L’endpoint doit accepter une requête JSON depuis le domaine du site et répondre avec un statut HTTP de succès.
- `listings` : tableau des biens réels validés. Champs utilisés : `title`, `type` (`terrain`, `maison`, `appartement`, `autre`), `location`, `area`, `price`, `image`, `imageAlt`, `description`, `availabilityConfirmed` et `status`. Les champs `price` et `status` sont facultatifs ; `status` ne s’affiche que si `availabilityConfirmed` vaut `true`.
- `testimonials` : réservé aux témoignages authentiques autorisés ; aucune donnée n’est affichée par défaut.

Les données de contact sont volontairement laissées vides. Le formulaire indique qu’il n’est pas activé tant que `formEndpoint` n’est pas configuré. Les mentions légales et la politique de confidentialité doivent être complétées avec les informations réelles de l’entreprise avant publication.

Le logo reçu est placé dans `assets/jk-consulting-logo.jpeg` et utilisé dans l’en-tête, le pied de page et comme favicon. `assets/hero-cameroun-concept.png` est une illustration architecturale conceptuelle créée pour la bannière, et `assets/cta-cameroun-concept.webp` une image de fond conceptuelle pour l’appel à contact : les lieux représentés ne sont pas des annonces ni des réalisations de JK CONSULTING. Les photos documentaires camerounaises sont créditées dans la galerie et ne représentent pas non plus les biens ou réalisations de l’entreprise.

Les polices et les modules GSAP de l’ancien runtime chargent depuis Google Fonts et jsDelivr. Les scènes React/Three.js, Lenis et les visuels de services sont embarqués dans le runtime compilé et les fichiers locaux du site.
