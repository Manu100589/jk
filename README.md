# JK CONSULTING

Site vitrine responsive en HTML, CSS et JavaScript, sans étape de compilation.

La section hero conserve son design dédié dans `hero.css`. Les sections suivantes reprennent une mise en page éditoriale claire et illustrée, définie dans `sections.css`. Les services réutilisent les visuels camerounais documentaires de la mosaïque et l’illustration conceptuelle ; les images sont étiquetées comme illustrations.

## Aperçu local

Ouvrir `index.html` dans un navigateur ou servir ce dossier avec un serveur HTTP statique.

## Réglages de mise en production

Modifier `config.js` avant la publication :

- `phone` : numéro public affiché sur le site.
- `whatsapp` : numéro international WhatsApp, chiffres uniquement.
- `formEndpoint` : URL HTTPS d’un service de réception de formulaire. L’endpoint doit accepter une requête JSON depuis le domaine du site et répondre avec un statut HTTP de succès.
- `listings` : tableau des biens réels validés. Champs utilisés : `title`, `type` (`terrain`, `maison`, `appartement`, `autre`), `location`, `area`, `price`, `image`, `imageAlt`, `description`, `availabilityConfirmed` et `status`. Les champs `price` et `status` sont facultatifs ; `status` ne s’affiche que si `availabilityConfirmed` vaut `true`.
- `testimonials` : réservé aux témoignages authentiques autorisés ; aucune donnée n’est affichée par défaut.

Les données de contact sont volontairement laissées vides. Le formulaire indique qu’il n’est pas activé tant que `formEndpoint` n’est pas configuré. Les mentions légales et la politique de confidentialité doivent être complétées avec les informations réelles de l’entreprise avant publication.

Le logo reçu est placé dans `assets/jk-consulting-logo.jpeg` et utilisé dans l’en-tête, le pied de page et comme favicon. `assets/hero-cameroun-concept.png` est une illustration architecturale conceptuelle créée pour la bannière, et `assets/cta-cameroun-concept.webp` une image de fond conceptuelle pour l’appel à contact : les lieux représentés ne sont pas des annonces ni des réalisations de JK CONSULTING. Les photos documentaires camerounaises sont créditées dans la galerie et ne représentent pas non plus les biens ou réalisations de l’entreprise.

Les polices et animations chargent depuis Google Fonts et jsDelivr. Les photos camerounaises sont servies depuis Wikimedia Commons ; leurs auteurs, pages sources et licences sont indiqués dans la galerie du site. Prévoir une connexion internet, ou remplacer ces ressources par des fichiers locaux avant un déploiement hors ligne.
