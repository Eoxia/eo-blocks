(function($) {

	var initializeBlock = function($block) {
	};

	$(document).ready(function() {
		$('.wp-block-eo-blocks-tabs').each(function() {
			initializeBlock($(this));
		});
	});

})(jQuery);
