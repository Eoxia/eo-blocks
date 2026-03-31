(function($) {

	/**
	 * Initialise la logique d'interaction pour un bloc d'onglets spécifique.
	 * @param {jQuery} $block - L'objet jQuery représentant le conteneur .wp-block-eo-blocks-tabs.
	 */
	var initializeBlock = function($block) {

		// Sélecteurs jQuery : utilisation de .find() pour cibler les conteneurs enfants
		const $buttonsContainer = $block.find('.wp-block-eo-blocks-tabs-buttons');
		const $contentsContainer = $block.find('.wp-block-eo-blocks-tabs-contents');

		// Vérification de l'existence des conteneurs
		if ($buttonsContainer.length === 0 || $contentsContainer.length === 0) {
			return;
		}

		$block.find('.is-active').removeClass('is-active');
		const defaultActiveTabKey = $block.attr('default-active-tab');
		$buttonsContainer.find(`[data-tab-key]`)[defaultActiveTabKey].classList.add( 'is-active' );
		$contentsContainer.find(`[data-tab-key]`)[defaultActiveTabKey].classList.add( 'is-active' );

		/**
		 * Active l'onglet correspondant à la clé donnée.
		 * @param {string} tabKey - La clé unique de l'onglet (data-tab-key).
		 */
		const activateTab = (tabKey) => {

			$block.find('.is-active').removeClass('is-active');
			$buttonsContainer.find(`[data-tab-key="${tabKey}"]`).addClass('is-active');
			$contentsContainer.find(`[data-tab-key="${tabKey}"]`).addClass('is-active');
			$block.attr('data-active-tab-key', tabKey);
		};

		// Gérer les clics sur les boutons (délégation d'événements jQuery)
		// La délégation est plus stable pour les éléments qui pourraient être mis à jour.
		$buttonsContainer.on('click', '[data-tab-key]', function(event) {
			event.preventDefault(); // Optionnel : si les boutons sont des liens <a>

			// Récupérer la clé de l'onglet à partir du bouton cliqué
			const tabKey = $(this).data('tab-key');

			if (tabKey) {
				activateTab(tabKey);
			}
		});

		// Activer l'onglet par défaut au chargement
		// Récupérer la clé par défaut de l'attribut du conteneur
		const defaultTabKey = $block.attr('data-active-tab-key');

		if (defaultTabKey) {
			activateTab(defaultTabKey);
		}
	};

	/**
	 * Initialisation globale après le chargement du DOM.
	 * Utilisation de l'événement 'ready' standard.
	 */
	$(document).ready(function() {
		// Parcours de chaque instance du bloc d'onglets sur la page
		$('.wp-block-eo-blocks-tabs').each(function() {
			initializeBlock($(this));
		});
	});

})(jQuery);