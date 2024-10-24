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
					$title,
					esc_attr( $titleTag )
				); ?>
				<span class="eo-accordion__header-toggle dashicons dashicons-plus-alt2"></span>
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
