jQuery(document).ready(function($) {
    // Toggle active state styling on card
    $('.eo-switch input[type="checkbox"]').on('change', function() {
        var $card = $(this).closest('.eo-card');
        var $label = $(this).closest('.eo-card-toggle').find('.eo-toggle-label');
        
        if ($(this).is(':checked')) {
            $card.addClass('is-active');
            $label.text(eoReviewsAdmin.i18n.active);
        } else {
            $card.removeClass('is-active');
            $label.text(eoReviewsAdmin.i18n.inactive);
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
        
        $btn.prop('disabled', true).text(eoReviewsAdmin.i18n.testInProgress);
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
            $btn.prop('disabled', false).text(eoReviewsAdmin.i18n.testConnection);
            if (response.success) {
                var info = response.data;
                $result.html('<span style="color: green;" class="dashicons dashicons-yes-alt"></span> ' + eoReviewsAdmin.i18n.connected + ' (' + eoReviewsAdmin.i18n.reviewsLabel + ': ' + info.count + ', ' + eoReviewsAdmin.i18n.ratingLabel + ': ' + info.rating + ')').addClass('success');
            } else {
                var errMsg = response.data && response.data.message ? response.data.message : eoReviewsAdmin.i18n.connectionError;
                $result.html('<span style="color: red;" class="dashicons dashicons-warning"></span> ' + errMsg).addClass('error');
            }
        }).fail(function() {
            $btn.prop('disabled', false).text(eoReviewsAdmin.i18n.testConnection);
            $result.html('<span style="color: red;" class="dashicons dashicons-warning"></span> ' + eoReviewsAdmin.i18n.serverErrorTest).addClass('error');
        });
    });

    // Auto-fill Google URLs when Place ID changes
    $('.eo-card-body').on('input', '.eo-api-input[data-key="place_id"]', function() {
        var placeId = $(this).val().trim();
        var $card = $(this).closest('.eo-card-body');
        
        var $urlInput = $card.find('input[name="eoblocks_reviews_settings[google_url]"]');
        var $reviewUrlInput = $card.find('input[name="eoblocks_reviews_settings[google_review_url]"]');
        
        if (placeId) {
            // Only auto-fill if empty or previously auto-filled to avoid overwriting custom URLs
            if (!$urlInput.val() || $urlInput.val().startsWith('https://www.google.com/maps/place/?q=place_id:')) {
                $urlInput.val('https://www.google.com/maps/place/?q=place_id:' + placeId);
            }
            if (!$reviewUrlInput.val() || $reviewUrlInput.val().startsWith('https://search.google.com/local/writereview?placeid=')) {
                $reviewUrlInput.val('https://search.google.com/local/writereview?placeid=' + placeId);
            }
        }
    });

    // Google OAuth: Load locations
    $('#eo-google-oauth-load-locations').on('click', function(e) {
        e.preventDefault();
        var $btn = $(this);
        var $select = $('#eo-google-oauth-location-select');
        
        $btn.prop('disabled', true).text(eoReviewsAdmin.i18n.loading);
        
        var data = {
            action: 'eo_google_oauth_get_locations',
            nonce: window.eoReviewsAdmin ? window.eoReviewsAdmin.nonce : ''
        };

        $.post(ajaxurl, data, function(response) {
            $btn.prop('disabled', false).text(eoReviewsAdmin.i18n.refreshList);
            $('#eo-google-oauth-locations-error').hide();
            if (response.success) {
                var locations = response.data;
                $select.empty();
                if (locations.length === 0) {
                    $select.append('<option value="">' + eoReviewsAdmin.i18n.noLocationFound + '</option>');
                } else {
                    $select.append('<option value="">' + eoReviewsAdmin.i18n.selectLocation + '</option>');
                    $.each(locations, function(i, loc) {
                        var name = loc.title || loc.name;
                        var accountName = loc.account_name ? ' (' + loc.account_name + ')' : '';
                        $select.append('<option value="' + loc.name + '">' + name + accountName + '</option>');
                    });
                }
            } else {
                var errorMsg = (typeof response.data === 'string') ? response.data : eoReviewsAdmin.i18n.unknownError;
                
                // Simplify the "API not enabled" error message
                if (errorMsg.indexOf('has not been used in project') !== -1 || errorMsg.indexOf('is disabled') !== -1) {
                    errorMsg = eoReviewsAdmin.i18n.apiNotEnabled;
                }

                $('#eo-google-oauth-locations-error').html('<strong>' + eoReviewsAdmin.i18n.apiErrorPrefix + '</strong> ' + errorMsg + '<br><br>' + eoReviewsAdmin.i18n.apiCheckReminder).slideDown();
            }
        }).fail(function() {
            $btn.prop('disabled', false).text(eoReviewsAdmin.i18n.refreshList);
            $('#eo-google-oauth-locations-error').html(eoReviewsAdmin.i18n.serverError).slideDown();
        });
    });

    // Google OAuth: Disconnect
    $('#eo-google-oauth-disconnect').on('click', function(e) {
        e.preventDefault();
        if (!confirm(eoReviewsAdmin.i18n.confirmDisconnect)) return;
        
        var $btn = $(this);
        $btn.prop('disabled', true).text(eoReviewsAdmin.i18n.disconnecting);
        
        var data = {
            action: 'eo_google_oauth_disconnect',
            nonce: window.eoReviewsAdmin ? window.eoReviewsAdmin.nonce : ''
        };

        $.post(ajaxurl, data, function(response) {
            if (response.success) {
                window.location.reload();
            } else {
                $btn.prop('disabled', false).text(eoReviewsAdmin.i18n.disconnectAccount);
                alert(eoReviewsAdmin.i18n.disconnectError);
            }
        }).fail(function() {
            $btn.prop('disabled', false).text(eoReviewsAdmin.i18n.disconnectAccount);
            alert(eoReviewsAdmin.i18n.disconnectServer);
        });
    });

    // Google OAuth: Ensure saved before connect
    $('.eo-oauth-actions .eo-oauth-disabled-btn').on('click', function(e) {
        e.preventDefault();
        alert(eoReviewsAdmin.i18n.saveCredentialsAlert);
    });

    // Toggle active auth method UI
    $('.eo-google-auth-method').on('change', function() {
        var method = $(this).val();
        if (method === 'oauth') {
            $('.eo-google-method-oauth').css({ 'opacity': '1', 'pointer-events': 'auto' });
            $('.eo-google-method-api_key').css({ 'opacity': '0.5', 'pointer-events': 'none' });
        } else {
            $('.eo-google-method-oauth').css({ 'opacity': '0.5', 'pointer-events': 'none' });
            $('.eo-google-method-api_key').css({ 'opacity': '1', 'pointer-events': 'auto' });
        }
    });

    // Auto-load locations if connected
    if ($('#eo-google-oauth-load-locations').length > 0) {
        $('#eo-google-oauth-load-locations').trigger('click');
    }
});
