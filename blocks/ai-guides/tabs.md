Onglets. Structure obligatoire, dans cet ordre :

eo-blocks/tabs
├─ eo-blocks/tabs-buttons            (la rangée de boutons)
│  ├─ eo-blocks/tabs-buttons-inner   {"tabKey": "tab-1"} → enfant : core/paragraph avec le libellé de l'onglet
│  └─ eo-blocks/tabs-buttons-inner   {"tabKey": "tab-2"}
└─ eo-blocks/tabs-contents           (les contenus)
   ├─ eo-blocks/tabs-contents-inner  {"tabKey": "tab-1"} → enfants : le contenu de l'onglet
   └─ eo-blocks/tabs-contents-inner  {"tabKey": "tab-2"}

- Chaque bouton et son contenu partagent le même "tabKey" (texte unique, par exemple "tab-1", "tab-2") et sont dans le même ordre.
- Autant de boutons que de contenus.
- "defaultActiveTabIndex" sur eo-blocks/tabs : position (à partir de 0) de l'onglet ouvert au chargement.
- Le style des boutons se règle sur eo-blocks/tabs-buttons ("activeTabColor", "activeTabBackgroundColor", "tabColor", "justification", "orientation").
