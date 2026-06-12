/**
 * JavaScript for EO Blocks - Landing Pages admin interface
 */

jQuery(document).ready(function($) {
	// Reference to global config config object
	var config = window.eoLandingPagesConfig || {};
	var activeType = '';

	// Sync color picker with text inputs
	function bindColorPicker(pickerId, textId) {
		$(pickerId).on('input', function() {
			$(textId).val($(this).val().toUpperCase());
			showFormDirty();
		});
		$(textId).on('input', function() {
			var val = $(this).val();
			if (val.match(/^#[0-9A-F]{6}$/i)) {
				$(pickerId).val(val);
				showFormDirty();
			}
		});
	}

	bindColorPicker('#eo-lp-form-bg-color', '#eo-lp-form-bg-color-text');
	bindColorPicker('#eo-lp-form-text-color', '#eo-lp-form-text-color-text');
	bindColorPicker('#eo-lp-form-accent-color', '#eo-lp-form-accent-color-text');

	// Mark form as dirty when inputs change
	$('#eo-lp-editor-form input, #eo-lp-editor-form textarea, #eo-lp-editor-form select').on('input change', function() {
		showFormDirty();
	});

	function showFormDirty() {
		$('.eo-lp-editor-status-text')
			.text('Changements non enregistrés')
			.css('color', '#2271b1');
		$('#eo-lp-save-btn')
			.removeClass('button-disabled')
			.css('background-color', '#2271b1');
	}

	function showFormSaving() {
		$('.eo-lp-editor-status-text')
			.text('Enregistrement...')
			.css('color', '#64748b');
	}

	function showFormSaved(msg) {
		$('.eo-lp-editor-status-text')
			.text(msg || 'Enregistré avec succès')
			.css('color', '#10b981');
		$('#eo-lp-save-btn').css('background-color', '#cbd5e1'); // grey-out button
	}

	function showFormError(msg) {
		$('.eo-lp-editor-status-text')
			.text(msg || 'Une erreur est survenue')
			.css('color', '#d63638');
	}

	// Toggle active switches
	$('.eo-lp-toggle-checkbox').on('change', function() {
		var $checkbox = $(this);
		var $card = $checkbox.closest('.eo-lp-card');
		var type = $card.data('type');
		var active = $checkbox.is(':checked');
		var $label = $checkbox.siblings('.eo-lp-toggle-label');

		// Visual loading state
		$checkbox.prop('disabled', true);
		$label.text('MAJ...');

		$.ajax({
			url: eoLandingPagesAdmin.ajaxUrl,
			type: 'POST',
			data: {
				action: 'eo_save_landing_page_settings',
				nonce: eoLandingPagesAdmin.nonce,
				type: type,
				active: active ? 'true' : 'false',
				active_toggle: '1'
			},
			success: function(response) {
				$checkbox.prop('disabled', false);
				if (response.success) {
					// Update global config object
					config = response.data.settings;
					window.eoLandingPagesConfig = config;

					// Visual state updates
					if (active) {
						$card.addClass('active');
						$label.text('ACTIF').addClass('active');

						// Handle mutual exclusion of Coming Soon and Maintenance
						if (type === 'coming_soon') {
							var $mCard = $('.eo-lp-card[data-type="maintenance"]');
							$mCard.removeClass('active');
							$mCard.find('.eo-lp-toggle-checkbox').prop('checked', false);
							$mCard.find('.eo-lp-toggle-label').text('INACTIF').removeClass('active');
						} else if (type === 'maintenance') {
							var $csCard = $('.eo-lp-card[data-type="coming_soon"]');
							$csCard.removeClass('active');
							$csCard.find('.eo-lp-toggle-checkbox').prop('checked', false);
							$csCard.find('.eo-lp-toggle-label').text('INACTIF').removeClass('active');
						}
					} else {
						$card.removeClass('active');
						$label.text('INACTIF').removeClass('active');
					}
					
					// If currently editing this page, update form active state
					if (activeType === type) {
						showFormSaved('État mis à jour');
					}
				} else {
					$checkbox.prop('checked', !active); // revert
					$label.text(active ? 'INACTIF' : 'ACTIF');
					alert(response.data.message || 'Erreur lors de la modification de l\'état.');
				}
			},
			error: function() {
				$checkbox.prop('disabled', false);
				$checkbox.prop('checked', !active); // revert
				$label.text(active ? 'INACTIF' : 'ACTIF');
				alert('Impossible de contacter le serveur.');
			}
		});
	});

	// Click Edit Button
	$('.eo-lp-edit-btn').on('click', function() {
		var type = $(this).data('type');
		openEditor(type);
	});

	// Change labels dynamically based on selected style and type
	function adjustFieldLabels() {
		var style = $('#eo-lp-form-style').val();
		var type = $('#eo-lp-form-type').val();
		
		var $accentGroup = $('#eo-lp-form-accent-color').closest('.eo-lp-form-group');
		var $accentLabel = $accentGroup.find('label');

		if (style === 'minimalist') {
			// Minimalist style uses accent color for buttons (Login and 404 only)
			if (type === 'coming_soon' || type === 'maintenance') {
				// No buttons on Coming Soon / Maintenance in minimalist style
				$accentGroup.hide();
			} else {
				$accentGroup.show();
				$accentLabel.text('Couleur du bouton');
			}
		} else if (style === 'gradient') {
			$accentGroup.show();
			$accentLabel.text('Couleur de fin du dégradé');
		} else if (style === 'glassmorphism') {
			$accentGroup.show();
			$accentLabel.text('Couleur secondaire (Effet verre)');
		}
	}

	$('#eo-lp-form-style').on('change', function() {
		adjustFieldLabels();
	});

	function openEditor(type) {
		activeType = type;
		var pageConfig = config[type] || {};
		
		// Fill form fields
		$('#eo-lp-form-type').val(type);
		$('#eo-lp-form-title').val(pageConfig.title || '');
		$('#eo-lp-form-description').val(pageConfig.description || '');
		$('#eo-lp-form-style').val(pageConfig.style || 'minimalist');

		// Set color pickers and text values
		$('#eo-lp-form-bg-color').val(pageConfig.bg_color || '#000000');
		$('#eo-lp-form-bg-color-text').val((pageConfig.bg_color || '#000000').toUpperCase());

		$('#eo-lp-form-text-color').val(pageConfig.text_color || '#ffffff');
		$('#eo-lp-form-text-color-text').val((pageConfig.text_color || '#ffffff').toUpperCase());

		$('#eo-lp-form-accent-color').val(pageConfig.accent_color || '#0066FF');
		$('#eo-lp-form-accent-color-text').val((pageConfig.accent_color || '#0066FF').toUpperCase());

		// Adjust fields display and labels
		adjustFieldLabels();

		// Toggle custom hints depending on type
		$('.eo-lp-form-login-hint').toggle(type === 'login');
		$('.eo-lp-form-404-hint').toggle(type === '404');

		// Update panel title icon and text
		var card = $('.eo-lp-card[data-type="' + type + '"]');
		var cardIconClass = card.find('.eo-lp-card-icon').attr('class').replace('eo-lp-card-icon', '').trim();
		var cardTitle = card.find('.eo-lp-card-title').text();

		$('.eo-lp-editor-icon').attr('class', 'dashicons eo-lp-editor-icon ' + cardIconClass);
		$('.eo-lp-editor-title-text').text('Configuration - ' + cardTitle);

		// Style edit button preview
		var previewUrl = config.homeUrl + '?eo_preview_landing_page=' + type;
		$('.eo-lp-form-preview-btn').attr('href', previewUrl);

		// Clear status text
		$('.eo-lp-editor-status-text').text('');
		$('#eo-lp-save-btn').css('background-color', '#2271b1'); // reset color

		// Scroll to panel and display it
		$('.eo-lp-editor-panel').slideDown(300, function() {
			$('html, body').animate({
				scrollTop: $('.eo-lp-editor-panel').offset().top - 50
			}, 400);
		});
	}

	// Close Panel Button
	$('.eo-lp-editor-close-btn').on('click', function() {
		$('.eo-lp-editor-panel').slideUp(300);
		activeType = '';
	});

	// Form Submission (Save Settings)
	$('#eo-lp-editor-form').on('submit', function(e) {
		e.preventDefault();
		if (!activeType) return;

		showFormSaving();

		var formData = {
			action: 'eo_save_landing_page_settings',
			nonce: eoLandingPagesAdmin.nonce,
			type: activeType,
			title: $('#eo-lp-form-title').val(),
			description: $('#eo-lp-form-description').val(),
			style: $('#eo-lp-form-style').val(),
			bg_color: $('#eo-lp-form-bg-color').val(),
			text_color: $('#eo-lp-form-text-color').val(),
			accent_color: $('#eo-lp-form-accent-color').val(),
			active: $('.eo-lp-card[data-type="' + activeType + '"] .eo-lp-toggle-checkbox').is(':checked') ? 'true' : 'false'
		};

		$.ajax({
			url: eoLandingPagesAdmin.ajaxUrl,
			type: 'POST',
			data: formData,
			success: function(response) {
				if (response.success) {
					// Update global config object
					config = response.data.settings;
					window.eoLandingPagesConfig = config;

					// Visual state updates
					showFormSaved('Paramètres enregistrés avec succès !');

					// Check if Coming Soon or Maintenance was turned off because of mutual exclusion
					if (formData.active === 'true') {
						if (activeType === 'coming_soon') {
							var $mCard = $('.eo-lp-card[data-type="maintenance"]');
							$mCard.removeClass('active');
							$mCard.find('.eo-lp-toggle-checkbox').prop('checked', false);
							$mCard.find('.eo-lp-toggle-label').text('INACTIF').removeClass('active');
						} else if (activeType === 'maintenance') {
							var $csCard = $('.eo-lp-card[data-type="coming_soon"]');
							$csCard.removeClass('active');
							$csCard.find('.eo-lp-toggle-checkbox').prop('checked', false);
							$csCard.find('.eo-lp-toggle-label').text('INACTIF').removeClass('active');
						}
					}
				} else {
					showFormError(response.data.message || 'Erreur lors de l\'enregistrement.');
				}
			},
			error: function() {
				showFormError('Impossible de contacter le serveur.');
			}
		});
	});
});
