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

$active_tab_color = $attributes['activeTabColor'] ?? '#333333';
$active_tab_bg = $attributes['activeTabBackgroundColor'] ?? '#ffffff';

$inline_styles = sprintf(
    '--eo-active-tab-color: %s; --eo-active-tab-bg: %s;',
    esc_attr( $active_tab_color ),
    esc_attr( $active_tab_bg )
);

$wrapper_attributes = get_block_wrapper_attributes( array(
    'class' => implode( ' ', $custom_classes ),
    'style' => $inline_styles // AJOUT crucial des variables CSS ici
) );

?>

<div <?php echo wp_kses_data( $wrapper_attributes ); ?>>
    <?php echo wp_kses_post( $content ); ?>
</div>
