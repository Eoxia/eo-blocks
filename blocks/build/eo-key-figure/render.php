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

global $wp_locale;

$number    = isset( $attributes['number'] ) ? (float) $attributes['number'] : 0;
$decimals  = isset( $attributes['decimals'] ) ? max( 0, min( 3, (int) $attributes['decimals'] ) ) : 0;
$separator = ! isset( $attributes['separator'] ) || ! empty( $attributes['separator'] );
$duration  = isset( $attributes['duration'] ) ? max( 300, min( 6000, (int) $attributes['duration'] ) ) : 2000;
$prefix    = isset( $attributes['prefix'] ) ? $attributes['prefix'] : '';
$suffix    = isset( $attributes['suffix'] ) ? $attributes['suffix'] : '';
$label     = isset( $attributes['label'] ) ? $attributes['label'] : '';

// Locale separators, decoded so the JS can reuse them as plain characters.
$decimal_point = isset( $wp_locale ) ? html_entity_decode( $wp_locale->number_format['decimal_point'], ENT_QUOTES, 'UTF-8' ) : '.';
$thousands_sep = ( $separator && isset( $wp_locale ) ) ? html_entity_decode( $wp_locale->number_format['thousands_sep'], ENT_QUOTES, 'UTF-8' ) : '';

$formatted_number = number_format( $number, $decimals, $decimal_point, $thousands_sep );
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<div class="eo-key-figure__value">
		<?php if ( '' !== $prefix ) : ?>
			<span class="eo-key-figure__prefix"><?php echo esc_html( $prefix ); ?></span>
		<?php endif; ?>
		<span
			class="eo-key-figure__number"
			data-target="<?php echo esc_attr( $number ); ?>"
			data-decimals="<?php echo esc_attr( $decimals ); ?>"
			data-duration="<?php echo esc_attr( $duration ); ?>"
			data-decimal-point="<?php echo esc_attr( $decimal_point ); ?>"
			data-thousands="<?php echo esc_attr( $thousands_sep ); ?>"
		><?php echo esc_html( $formatted_number ); ?></span>
		<?php if ( '' !== $suffix ) : ?>
			<span class="eo-key-figure__suffix"><?php echo esc_html( $suffix ); ?></span>
		<?php endif; ?>
	</div>
	<?php if ( '' !== $label ) : ?>
		<div class="eo-key-figure__label"><?php echo wp_kses_post( $label ); ?></div>
	<?php endif; ?>
</div>
