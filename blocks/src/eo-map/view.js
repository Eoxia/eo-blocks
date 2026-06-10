(function($) {
	/**
	 * initializeBlockMap
	 *
	 * Adds Leaflet JS map rendering on the frontend.
	 */
	var initializeBlockMap = function( $block ) {
		var $container = $block.find('.eo-map-frontend-container');
		if ( $container.length === 0 ) {
			return;
		}

		var settings = $container.data('settings');
		var markers = $container.data('markers');

		if ( ! settings ) {
			return;
		}

		var containerId = $container.attr('id');
		var centerLat = parseFloat(settings.centerLat) || 43.6107;
		var centerLng = parseFloat(settings.centerLng) || 3.8767;
		var zoom = parseInt(settings.zoom) || 12;

		// Initialize Leaflet Map
		var map = L.map(containerId).setView([centerLat, centerLng], zoom);

		// Tile Style URLs
		var tileProviders = {
			'osm': 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
			'carto-light': 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
			'carto-dark': 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
			'opentopo': 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
		};

		var styleKey = settings.tileStyle || 'osm';
		var tileUrl = tileProviders[styleKey] || tileProviders['osm'];
		
		var attrib = '© OpenStreetMap contributors';
		if (styleKey.indexOf('carto') !== -1) {
			attrib = '© OpenStreetMap contributors, © CartoDB';
		} else if (styleKey === 'opentopo') {
			attrib = '© OpenTopoMap contributors';
		}

		L.tileLayer(tileUrl, {
			maxZoom: 19,
			attribution: attrib
		}).addTo(map);

		// Default Leaflet Marker Configuration
		var defaultIcon = L.icon({
			iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
			shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34]
		});

		// Helper to escape HTML safely
		function escapeHtml(str) {
			var entityMap = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;',
				'/': '&#x2F;'
			};
			return String(str).replace(/[&<>"'\/]/g, function(s) {
				return entityMap[s];
			});
		}

		// Draw each Marker
		if ( Array.isArray(markers) ) {
			markers.forEach(function(markerData) {
				var customIcon = defaultIcon;
				if (markerData.icon) {
					customIcon = L.icon({
						iconUrl: markerData.icon,
						iconSize: [32, 32],
						iconAnchor: [16, 32],
						popupAnchor: [0, -32]
					});
				}

				var marker = L.marker([markerData.lat, markerData.lng], {
					icon: customIcon
				}).addTo(map);

				// Prepare popup markup
				var popupHtml = '<div class="eo-map-popup-content" style="min-width: 160px; max-width: 250px;">';
				popupHtml += '<h3 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold; color: #23282d;">' + escapeHtml(markerData.title || 'Marqueur') + '</h3>';
				
				if (markerData.category) {
					popupHtml += '<span style="font-size: 10px; text-transform: uppercase; background: #e1f0ff; color: #0066FF; padding: 2px 6px; border-radius: 3px; font-weight: bold; display: inline-block; margin-bottom: 8px;">' + escapeHtml(markerData.category) + '</span>';
				}

				if (markerData.description) {
					popupHtml += '<p style="margin: 0 0 8px 0; font-size: 12px; line-height: 1.4; color: #555;">' + escapeHtml(markerData.description) + '</p>';
				}

				if (markerData.phone) {
					popupHtml += '<p style="margin: 0 0 8px 0; font-size: 11px; color: #555;"><span class="dashicons dashicons-phone" style="font-size: 12px; width: auto; height: auto; vertical-align: middle; margin-right: 4px;"></span><a href="tel:' + escapeHtml(markerData.phone) + '" style="color: #555; text-decoration: none;">' + escapeHtml(markerData.phone) + '</a></p>';
				}

				if (markerData.url) {
					popupHtml += '<p style="margin: 0 0 8px 0; font-size: 11px;"><a href="' + escapeHtml(markerData.url) + '" target="_blank" style="color: #0066FF; font-weight: 600; text-decoration: none;">Visiter le lien →</a></p>';
				}

				if (markerData.gallery && markerData.gallery.length > 0) {
					popupHtml += '<div class="eo-map-popup-gallery-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-top: 8px;">';
					markerData.gallery.forEach(function(imgUrl) {
						popupHtml += '<a href="' + escapeHtml(imgUrl) + '" target="_blank"><img src="' + escapeHtml(imgUrl) + '" style="width: 100%; height: 45px; object-fit: cover; border-radius: 3px; border: 1px solid #ddd; display: block;" /></a>';
					});
					popupHtml += '</div>';
				}

				popupHtml += '</div>';

				marker.bindPopup(popupHtml);
			});
		}
	}

	$(document).ready(function(){
		$('.wp-block-eo-blocks-map').each(function(){
			initializeBlockMap( $(this) );
		});
	});

})(jQuery);
