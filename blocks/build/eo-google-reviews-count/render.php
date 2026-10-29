<?php
$wrapper_attributes = get_block_wrapper_attributes();
$count = isset( $attributes['count'] ) ? (int) $attributes['count'] : 80;
$prefix = isset( $attributes['prefix'] ) ? $attributes['prefix'] : '';
$suffix = isset( $attributes['suffix'] ) ? $attributes['suffix'] : __( 'Avis Google', 'eo-blocks' );
if ( $suffix === 'Avis Google' ) $suffix = __( 'Avis Google', 'eo-blocks' );
$use_api = isset( $attributes['useApi'] ) ? $attributes['useApi'] : true;
$add_review_link = isset( $attributes['addReviewLink'] ) ? $attributes['addReviewLink'] : false;
$review_link_text = isset( $attributes['reviewLinkText'] ) ? $attributes['reviewLinkText'] : __( 'Ajouter votre avis', 'eo-blocks' );
if ( $review_link_text === 'Ajouter votre avis' ) $review_link_text = __( 'Ajouter votre avis', 'eo-blocks' );
$review_url = '';

if ( $use_api && class_exists( '\EoBlocks\Includes\Eoblocks_Reviews_API' ) ) {
	$api_data = \EoBlocks\Includes\Eoblocks_Reviews_API::get_google_data();
	if ( $api_data && ! empty( $api_data['count'] ) ) {
		$count = (int) $api_data['count'];
	}
	if ( $api_data && ! empty( $api_data['review_url'] ) ) {
		$review_url = esc_url( $api_data['review_url'] );
	}
}
?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="eo-google-reviews-count-wrapper">
		<?php if ( $prefix ) : ?>
			<span class="eo-grc-prefix"><?php echo esc_html( $prefix ); ?></span>
		<?php endif; ?>
		<span class="eo-grc-count"><?php echo esc_html( $count ); ?></span>
		<?php if ( $suffix ) : ?>
			<span class="eo-grc-suffix"><?php echo esc_html( $suffix ); ?></span>
		<?php endif; ?>
		<?php if ( $add_review_link && $review_url && $review_link_text ) : ?>
			<a href="<?php echo $review_url; ?>" target="_blank" rel="noopener noreferrer" class="eo-grc-review-link" style="margin-left: 10px;">
				<?php echo esc_html( $review_link_text ); ?>
			</a>
		<?php endif; ?>
	</div>
</div>