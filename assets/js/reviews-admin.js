jQuery(document).ready(function($) {
    // Toggle active state styling on card
    $('.eo-switch input[type="checkbox"]').on('change', function() {
        var $card = $(this).closest('.eo-card');
        var $label = $(this).closest('.eo-card-toggle').find('.eo-toggle-label');
        
        if ($(this).is(':checked')) {
            $card.addClass('is-active');
            $label.text('ACTIF');
        } else {
            $card.removeClass('is-active');
            $label.text('INACTIF');
        }
    });

    // Toggle API credentials visibility based on Auto Sync checkbox
    $('.eo-auto-sync-checkbox').on('change', function() {
        var $credentials = $(this).closest('.eo-card-body').find('.eo-api-credentials');
        if ($(this).is(':checked')) {
            $credentials.slideDown();
        } else {
            $credentials.slideUp();
        }
    });

    // Handle "Test Connection" button
    $('.eo-test-connection-btn').on('click', function(e) {
        e.preventDefault();
        var $btn = $(this);
        var provider = $btn.data('provider');
        var $card = $btn.closest('.eo-card-body');
        var $result = $btn.siblings('.eo-test-result');
        
        $btn.prop('disabled', true).text('Test en cours...');
        $result.html('<span class="dashicons dashicons-update spin"></span>').removeClass('success error');

        var data = {
            action: 'eo_test_api_connection',
            provider: provider,
            security: window.eoReviewsAdmin ? window.eoReviewsAdmin.nonce : ''
        };

        // Collect API input values (e.g., api_key, place_id)
        $card.find('.eo-api-input').each(function() {
            data[$(this).data('key')] = $(this).val();
        });

        $.post(ajaxurl, data, function(response) {
            $btn.prop('disabled', false).text('Tester la connexion');
            if (response.success) {
                var info = response.data;
                $result.html('<span style="color: green;" class="dashicons dashicons-yes-alt"></span> Connecté ! (Avis: ' + info.count + ', Note: ' + info.rating + ')').addClass('success');
            } else {
                var errMsg = response.data && response.data.message ? response.data.message : 'Erreur de connexion.';
                $result.html('<span style="color: red;" class="dashicons dashicons-warning"></span> ' + errMsg).addClass('error');
            }
        }).fail(function() {
            $btn.prop('disabled', false).text('Tester la connexion');
            $result.html('<span style="color: red;" class="dashicons dashicons-warning"></span> Erreur serveur.').addClass('error');
        });
    });
});
