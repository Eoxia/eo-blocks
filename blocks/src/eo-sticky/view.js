(function($) {

	/**
	 * initializeBlock
	 *
	 * Adds custom JavaScript to the block Accordion.
	 *
	 * @since   1.0.0
	 *
	 * @param   object $block The block jQuery element.
	 * @return  void
	 */
	var initializeBlock = function( $block ) {
	}

	$(document).ready(function(){
		$('.wp-block-eo-sticky').each(function(){
			initializeBlock( $(this) );
		});
	});

})(jQuery);
