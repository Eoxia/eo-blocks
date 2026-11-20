Carrousel (diaporama) : n'accepte que des eo-blocks/slide comme enfants ; chaque slide contient ses propres blocs (image, titre, texte, bouton…).

Attributs utiles :
- "slidesPerView" : nombre de slides visibles sur ordinateur (défaut 1), "mobileSlidesPerView" sur mobile (défaut 1).
- "autoplay": true + "autoplayDelay" (en centièmes de seconde : 500 = 5 s), "loop" (défaut true).
- "navigation" (flèches, défaut true), "pagination" (points, défaut true), "spaceBetween" (espace en px entre slides).
- "mainColor" : couleur des flèches et des points.
- "marquee": true avec "autoplay": true pour un défilement continu de logos.

Prévoyez au moins 3 slides. Pour une simple galerie de photos, préférez eo-blocks/gallery avec "layout": "carousel".
