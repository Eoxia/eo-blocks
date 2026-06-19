<?php
/**
 * Render for Google Reviews Count block.
 *
 * @package eo-blocks
 */

$wrapper_attributes = get_block_wrapper_attributes();
$count = isset( $attributes['count'] ) ? $attributes['count'] : 80;
$prefix = isset( $attributes['prefix'] ) ? $attributes['prefix'] : '';
$suffix = isset( $attributes['suffix'] ) ? $attributes['suffix'] : 'Avis Google';
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
