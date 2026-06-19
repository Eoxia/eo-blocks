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
});
