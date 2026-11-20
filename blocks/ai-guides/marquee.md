Bandeau de texte (ou de logos) qui défile horizontalement en continu, sur une seule ligne. Le contenu est dupliqué automatiquement pour boucler sans fin.

Structure : un seul bloc enfant.
- Texte : UN SEUL core/paragraph contenant tous les messages séparés par un symbole, par exemple "WordPress ✦ Développement sur mesure ✦ Dolibarr ✦".
- Logos ou images : un core/group en ligne ("layout": {"type": "flex", "flexWrap": "nowrap"}) contenant les core/image.

À éviter : plusieurs paragraphes (chaque paragraphe est un bloc : ils s'empilent verticalement et la pile entière défile), un titre, du texte très long.
Pour un grand texte défilant, mettez la taille sur le paragraphe ("style": {"typography": {"fontSize": "28px"}}). Le bloc n'a pas d'attribut propre : vitesse et sens sont gérés automatiquement (le sens s'inverse quand le visiteur remonte la page).
