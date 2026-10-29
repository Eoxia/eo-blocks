<?php
$wrapper_attributes = get_block_wrapper_attributes();
$rating = isset( $attributes['rating'] ) ? (float) $attributes['rating'] : 5.0;
$maxRating = isset( $attributes['maxRating'] ) ? (int) $attributes['maxRating'] : 5;
$showStars = isset( $attributes['showStars'] ) ? $attributes['showStars'] : true;
$use_api = isset( $attributes['useApi'] ) ? $attributes['useApi'] : true;

$add_link = isset( $attributes['addLink'] ) ? $attributes['addLink'] : false;
$link_url = '';

if ( $use_api && class_exists( '\EoBlocks\Includes\Eoblocks_Reviews_API' ) ) {
	$api_data = \EoBlocks\Includes\Eoblocks_Reviews_API::get_google_data();
	if ( $api_data && isset( $api_data['rating'] ) ) {
		$rating = (float) $api_data['rating'];
	}
	if ( $api_data && isset( $api_data['url'] ) && ! empty( $api_data['url'] ) ) {
		$link_url = esc_url( $api_data['url'] );
	}
}

if ( ! function_exists( 'render_eo_stars' ) ) {
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
}
?>
<div <?php echo $wrapper_attributes; ?>>
	<?php if ( $add_link && $link_url ) : ?>
	<a href="<?php echo $link_url; ?>" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">
	<?php endif; ?>
		<div class="eo-google-reviews-rating-wrapper">
			<span class="eo-grr-score"><?php echo esc_html( number_format_i18n( $rating, 1 ) ); ?></span>
			<?php if ( $showStars ) {
				echo render_eo_stars( $rating, 5 ); // maxRating is always 5 for Google
			} ?>
		</div>
	<?php if ( $add_link && $link_url ) : ?>
	</a>
	<?php endif; ?>
</div>