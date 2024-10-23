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
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<div class="eo-accordion__header">
		<div class="eo-accordion__header-container">
			<?php echo sprintf("<%s class='eo-accordion__title'>%s</%s>",
				esc_attr( $titleTag ),
				esc_html( $title ),
				esc_attr( $titleTag )
			); ?>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="eo-accordion__header-toggle">
				<path
					d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
			</svg>
		</div>
		<?php if ( ! empty( $subtitle ) ) : ?>
			<div class="eo-accordion__subtitle"><?php echo esc_html( $subtitle ); ?></div>
		<?php endif; ?>
	</div>

	<div class="eo-accordion__content">
		<?php echo $content; ?>
	</div>
</div>
