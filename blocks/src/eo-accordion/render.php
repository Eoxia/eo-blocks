<?php
/**
 * Dynamic Block Template.
 * @param   array $attributes - A clean associative array of block attributes.
 * @param   array $block - All the block settings and attributes.
 * @param   string $content - The block inner HTML (usually empty unless using inner blocks).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$titleTag = ! empty( $attributes['titleTag'] ) ? $attributes['titleTag'] : 'h2';
$title    = ! empty( $attributes['title'] ) ? $attributes['title'] : '';
$subtitle = ! empty( $attributes['subtitle'] ) ? $attributes['subtitle'] : '';
$is_active = ! empty( $attributes['isOpened'] ) ? 'eo-accordion__active' : '';
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<div class="eo-accordion__main-container <?php echo esc_attr( $is_active ); ?>">
		<div class="eo-accordion__header">
			<div class="eo-accordion__header-container">
				<?php echo sprintf("<%s class='eo-accordion__title'>%s</%s>",
					esc_attr( $titleTag ),
                    wp_kses_post( $title ),
					esc_attr( $titleTag )
				); ?>
				<svg class="eo-accordion__header-toggle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
			</div>
			<?php if ( ! empty( $subtitle ) ) : ?>
				<div class="eo-accordion__subtitle"><?php echo esc_html( $subtitle ); ?></div>
			<?php endif; ?>
		</div>

		<div class="eo-accordion__inner">
			<?php echo wp_kses_post( $content ); ?>
		</div>
	</div>
</div>
