(function($) {

	var initializeBlock = function($block) {
	};

	$(document).ready(function() {
		$('.wp-block-eo-tabs').each(function() {
			initializeBlock($(this));
		});
	});

})(jQuery);
