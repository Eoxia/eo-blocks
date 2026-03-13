(function($) {

	/**
	 * initializeBlock
	 *
	 * Adds custom JavaScript to the block Search.
	 *
	 * @since   1.0.0
	 *
	 * @param   object $block The block jQuery element.
	 * @return  void
	 */
	var initializeBlock = function( $block ) {
		var $trigger = $block.find('.eo-search__trigger');
		var $modal = $block.find('.eo-search__modal');
		var $overlay = $block.find('.eo-search__modal-overlay');
		var $closeBtn = $block.find('.eo-search__close');
		var $searchInput = $block.find('.eo-search__input');
		var $resultsContainer = $block.find('#eo-search-results');
		var postTypesData = $block.data('post-types');
		var postTypes = postTypesData ? postTypesData : [];
		var optionsData = $block.data('options');
		var options = optionsData ? optionsData : {
			showIcon: true,
			showThumbnail: true,
			showTitle: true,
			showDescription: true
		};

		// Open modal on trigger click
		$trigger.on('click', function(e) {
			e.preventDefault();
			$modal.fadeIn(300);
			$searchInput.focus();
		});

		// Close modal on overlay or close button click
		$overlay.on('click', function() {
			$modal.fadeOut(300);
		});

		$closeBtn.on('click', function(e) {
			e.preventDefault();
			$modal.fadeOut(300);
		});

		// Close modal on Escape key
		$(document).on('keydown', function(e) {
			if (e.keyCode === 27 && $modal.is(':visible')) {
				$modal.fadeOut(300);
			}
		});

		// Search functionality
		var searchTimeout;
		$searchInput.on('keyup', function() {
			var searchTerm = $(this).val();

			clearTimeout(searchTimeout);

			if (searchTerm.length === 0) {
				$resultsContainer.html('');
				return;
			}

			// Show loading state
			$resultsContainer.html('<p class="eo-search__loading">Recherche en cours...</p>');

			searchTimeout = setTimeout(function() {
				performSearch(searchTerm, postTypes);
			}, 300);
		});

		// Perform search via AJAX
		function performSearch(term, postTypes) {
			if (postTypes.length === 0) {
				$resultsContainer.html('<p class="eo-search__error">Aucun type de post sélectionné.</p>');
				return;
			}

			var ajaxUrl = (window.eoSearch && window.eoSearch.ajaxUrl) ? window.eoSearch.ajaxUrl : '/wp-admin/admin-ajax.php';

			var data = {
				action: 'eo_search_perform_search',
				search: term,
				post_types: postTypes,
				per_page: 5
			};

			$.post(
				ajaxUrl,
				data,
				function(response) {
					if (!response || !response.data || response.data.length === 0) {
						$resultsContainer.html('<p class="eo-search__no-results">Aucun résultat trouvé.</p>');
						return;
					}

					var resultsHtml = '<ul class="eo-search__results-list">';

					response.data.forEach(function(result) {
						var title = result.title;
						var link = result.url;
						var excerpt = result.excerpt;
						var thumbnail = result.thumbnail;

						resultsHtml += '<li class="eo-search__result-item">';
						resultsHtml += '<a href="' + link + '">';

						// Add thumbnail if enabled
						if (options.showThumbnail && thumbnail) {
							resultsHtml += '<img src="' + thumbnail + '" alt="' + title + '" class="eo-search__result-thumbnail" />';
						}

						resultsHtml += '<div class="eo-search__result-content">';

						// Add title if enabled
						if (options.showTitle) {
							resultsHtml += '<div class="eo-search__result-title">' + title + '</div>';
						}

						// Add description if enabled
						if (options.showDescription && excerpt) {
							resultsHtml += '<p class="eo-search__result-excerpt">' + excerpt + '</p>';
						}

						resultsHtml += '</div>';
						
						resultsHtml += '</a>';
						resultsHtml += '</li>';
					});

					resultsHtml += '</ul>';

					// Build search page URL with post types
					var homeUrl = (window.eoSearch && window.eoSearch.homeUrl) ? window.eoSearch.homeUrl : '/';
					var searchUrl = homeUrl + '?s=' + encodeURIComponent(term);
					if (postTypes.length > 0) {
						searchUrl += '&post_type=' + postTypes.join(',');
					}

					// Add "View all results" link
					resultsHtml += '<div class="eo-search__view-all">';
					resultsHtml += '<a href="' + searchUrl + '" class="eo-search__view-all-link">Voir tous les résultats</a>';
					resultsHtml += '</div>';

					$resultsContainer.html(resultsHtml);
				},
				'json'
			).fail(function(error) {
				console.error('Search error:', error);
				$resultsContainer.html('<p class="eo-search__error">Erreur lors de la recherche.</p>');
			});
		}
	};

	$(document).ready(function(){
		$('.wp-block-eo-search').each(function(){
			initializeBlock( $(this) );
		});
	});

})(jQuery);
