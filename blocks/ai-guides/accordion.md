Un élément d'accordéon : un titre cliquable qui déplie un contenu. Idéal pour une FAQ : un bloc eo-blocks/accordion par question, à la suite.

- "title" : la question ou le titre (obligatoire), "subtitle" : sous-titre optionnel.
- "titleTag" : niveau du titre (défaut "h2" ; utilisez "h3" si l'accordéon est sous un titre H2 de section).
- "isOpened": true pour l'afficher déplié au chargement (en général seulement le premier, ou aucun).
- "displaySchema": true sur chaque question d'une FAQ pour générer les données structurées FAQ (SEO).
- Blocs enfants : la réponse (core/paragraph, core/list, core/image…).

À éviter : mettre la question dans un paragraphe enfant au lieu de "title", ou plusieurs questions dans un même accordéon.
