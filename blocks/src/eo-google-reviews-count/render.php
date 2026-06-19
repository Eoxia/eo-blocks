<?php
/**
 * Render for Google Reviews Count block.
 *
 * @package eo-blocks
 */

$wrapper_attributes = get_block_wrapper_attributes();
$count = isset( $attributes['count'] ) ? (int) $attributes['count'] : 80;
$prefix = isset( $attributes['prefix'] ) ? $attributes['prefix'] : '';
$suffix = isset( $attributes['suffix'] ) ? $attributes['suffix'] : 'Avis Google';

// Fetch API data if configured
if ( class_exists( '\EoBlocks\Includes\Eoblocks_Reviews_API' ) ) {
	$api_data = \EoBlocks\Includes\Eoblocks_Reviews_API::get_google_data();
	if ( $api_data && ! empty( $api_data['count'] ) ) {
		$count = (int) $api_data['count'];
	}
}
?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="eo-google-reviews-count-wrapper">
		<?php if ( ! empty( $prefix ) ) : ?>
			<span class="eo-grc-prefix"><?php echo esc_html( $prefix ); ?></span>
		<?php endif; ?>
		<span class="eo-grc-count"><?php echo esc_html( $count ); ?></span>
		<?php if ( ! empty( $suffix ) ) : ?>
			<span class="eo-grc-suffix"><?php echo esc_html( $suffix ); ?></span>
		<?php endif; ?>
	</div>
</div>
