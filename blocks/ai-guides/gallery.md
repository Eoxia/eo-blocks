Galerie d'images et de vidéos en grille, mosaïque ou carrousel, avec visionneuse.

- "items" : tableau de médias, chacun {"id": <identifiant du média>, "type": "image"} (ou "video"). Importez d'abord les images avec eo-tools/import-image et utilisez les identifiants renvoyés. "caption" et "alt" optionnels par élément.
- "layout" : "grid" (défaut), "masonry" (mosaïque) ou "carousel".
- "columns" (défaut 3), "mobileColumns" (défaut 2), "gap" (espace en px, défaut 16), "radius" (arrondi en px).
- "crop" et "aspectRatio" (ex. "4/3", "1/1", "16/9") pour des vignettes de même format.
- "linkTo" : "lightbox" (défaut), "media", "attachment" ou "none".
