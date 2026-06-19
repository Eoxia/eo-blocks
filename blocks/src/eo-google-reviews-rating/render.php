<?php
$wrapper_attributes = get_block_wrapper_attributes();
$rating = isset( $attributes['rating'] ) ? (float) $attributes['rating'] : 5.0;
$maxRating = isset( $attributes['maxRating'] ) ? (int) $attributes['maxRating'] : 5;
$showStars = isset( $attributes['showStars'] ) ? $attributes['showStars'] : true;
$use_api = isset( $attributes['useApi'] ) ? $attributes['useApi'] : true;

if ( $use_api && class_exists( '\EoBlocks\Includes\Eoblocks_Reviews_API' ) ) {
	$api_data = \EoBlocks\Includes\Eoblocks_Reviews_API::get_google_data();
	if ( $api_data && isset( $api_data['rating'] ) ) {
		$rating = (float) $api_data['rating'];
	}
}

function render_eo_stars( $rating, $maxRating ) {
	$stars = '';
	for ( $i = 1; $i <= $maxRating; $i++ ) {
		if ( $rating >= $i ) {
			$stars .= '<span class="eo-star eo-star-full">★</span>';
		} elseif ( $rating >= $i - 0.5 ) {
			$stars .= '<span class="eo-star eo-star-half">★</span>';
		} else {
			$stars .= '<span class="eo-star eo-star-empty">☆</span>';
		}
	}
	return '<div class="eo-grr-stars">' . $stars . '</div>';
}
?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="eo-google-reviews-rating-wrapper">
		<span class="eo-grr-score"><?php echo esc_html( number_format_i18n( $rating, 1 ) ); ?></span>
		<?php if ( $showStars ) {
			echo render_eo_stars( $rating, $maxRating );
		} ?>
	</div>
</div>