<?php
$wrapper_attributes = get_block_wrapper_attributes();
$message = isset( $attributes['message'] ) ? $attributes['message'] : 'Laissez-nous votre avis sur Google';
$buttonText = isset( $attributes['buttonText'] ) ? $attributes['buttonText'] : 'Évaluer';
$use_api = isset( $attributes['useApi'] ) ? $attributes['useApi'] : true;

$review_url = '#';

if ( $use_api && class_exists( '\EoBlocks\Includes\Eoblocks_Reviews_API' ) ) {
	$api_data = \EoBlocks\Includes\Eoblocks_Reviews_API::get_google_data();
	if ( $api_data && ! empty( $api_data['review_url'] ) ) {
		$review_url = esc_url( $api_data['review_url'] );
	}
}
?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="eo-review-prompt-wrapper">
		<h3 class="eo-rp-message"><?php echo esc_html( $message ); ?></h3>
		<div class="eo-rp-stars">
			<span class="star-empty">☆</span>
			<span class="star-empty">☆</span>
			<span class="star-empty">☆</span>
			<span class="star-empty">☆</span>
			<span class="star-empty">☆</span>
		</div>
		<a href="<?php echo $review_url; ?>" target="_blank" rel="noopener noreferrer" class="eo-rp-button">
			<?php echo esc_html( $buttonText ); ?>
		</a>
	</div>
</div>