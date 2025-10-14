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

$custom_classes = array();
$custom_classes[] = 'is-orientation-' . sanitize_html_class( $attributes['orientation'] ?? 'horizontal' );
if ( ! empty( $attributes['justification'] ) ) {
    $custom_classes[] = 'is-justify-' . sanitize_html_class( $attributes['justification'] );
}
if ( ! empty( $attributes['gap'] ) ) {
    $custom_classes[] = 'gap-' . sanitize_html_class( $attributes['gap'] );
}
if ( ! empty( $attributes['mobileWrap'] ) ) {
    $custom_classes[] = 'is-mobile-wrap';
}

$styles = [];

if ( ! empty( $attributes['tabColor'] ) ) $styles[] = sprintf( '--eo-tab-color: %s;', esc_attr( $attributes['tabColor'] ) );
if ( ! empty( $attributes['tabBackgroundColor'] ) ) $styles[] = sprintf( '--eo-tab-bg: %s;', esc_attr( $attributes['tabBackgroundColor'] ) );
if ( ! empty( $attributes['activeTabColor'] ) ) $styles[] = sprintf( '--eo-active-tab-color: %s;', esc_attr( $attributes['activeTabColor'] ) );
if ( ! empty( $attributes['activeTabBackgroundColor'] ) ) $styles[] = sprintf( '--eo-active-tab-bg: %s;', esc_attr( $attributes['activeTabBackgroundColor'] ) );
if ( ! empty( $attributes['hoverTabColor'] ) ) $styles[] = sprintf( '--eo-hover-tab-color: %s;', esc_attr( $attributes['hoverTabColor'] ) );
if ( ! empty( $attributes['hoverTabBackgroundColor'] ) ) $styles[] = sprintf( '--eo-hover-tab-bg: %s;', esc_attr( $attributes['hoverTabBackgroundColor'] ) );
if ( ! empty( $attributes['tabRadius'] ) ) $styles[] = sprintf( '--eo-tab-border-radius: %s;', esc_attr( $attributes['tabRadius'] ) );

// Padding
$tabPadding = $attributes['tabPadding'] ?? [];
if ( ! empty( $tabPadding['top'] ) ) $styles[] = sprintf( '--eo-tab-padding-top: %s;', esc_attr( $tabPadding['top'] ) );
if ( ! empty( $tabPadding['right'] ) ) $styles[] = sprintf( '--eo-tab-padding-right: %s;', esc_attr( $tabPadding['right'] ) );
if ( ! empty( $tabPadding['bottom'] ) ) $styles[] = sprintf( '--eo-tab-padding-bottom: %s;', esc_attr( $tabPadding['bottom'] ) );
if ( ! empty( $tabPadding['left'] ) ) $styles[] = sprintf( '--eo-tab-padding-left: %s;', esc_attr( $tabPadding['left'] ) );

$inline_styles = implode( ' ', $styles );

$wrapper_attributes = get_block_wrapper_attributes( array(
    'class' => implode( ' ', $custom_classes ),
    'style' => $inline_styles
) );
?>

<div <?php echo wp_kses_data( $wrapper_attributes ); ?>>
    <?php echo wp_kses_post( $content ); ?>
</div>
