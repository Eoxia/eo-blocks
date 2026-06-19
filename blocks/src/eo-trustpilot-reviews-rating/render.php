<?php
/**
 * Render for Trustpilot Reviews Rating block.
 *
 * @package eo-blocks
 */

$wrapper_attributes = get_block_wrapper_attributes();
$rating = isset( $attributes['rating'] ) ? (float) $attributes['rating'] : 5.0;
$maxRating = isset( $attributes['maxRating'] ) ? (int) $attributes['maxRating'] : 5;
$showStars = isset( $attributes['showStars'] ) ? (bool) $attributes['showStars'] : true;

// Fetch API data if configured
if ( class_exists( '\EoBlocks\Includes\Eoblocks_Reviews_API' ) ) {
	$api_data = \EoBlocks\Includes\Eoblocks_Reviews_API::get_trustpilot_data();
	if ( $api_data && ! empty( $api_data['rating'] ) ) {
		$rating = (float) $api_data['rating'];
	}
}

// Output formatting
$formatted_rating = number_format( $rating, 1, ',', '' );
?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="eo-trustpilot-reviews-rating-wrapper">
		<span class="eo-grr-score"><?php echo esc_html( $formatted_rating ); ?></span>
		
		<?php if ( $showStars ) : ?>
			<div class="eo-grr-stars">
				<?php
				for ( $i = 1; $i <= $maxRating; $i++ ) {
					if ( $rating >= $i ) {
						echo '<span class="eo-star eo-star-full">&#9733;</span>';
					} elseif ( $rating >= $i - 0.5 ) {
						// CSS will handle half star look or we can use a specific character, for simplicity let's output a star and use css
						echo '<span class="eo-star eo-star-half">&#9733;</span>';
					} else {
						echo '<span class="eo-star eo-star-empty">&#9734;</span>';
					}
				}
				?>
			</div>
		<?php endif; ?>
	</div>
</div>

