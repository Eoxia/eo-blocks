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

$additional_attributes = [];
$additional_attributes['data-tab-key'] = esc_attr( $attributes['tabKey'] ?? '' );

$wrapper_attributes = get_block_wrapper_attributes( $additional_attributes );
?>

<div <?php echo $wrapper_attributes; ?>>
    <?php echo wp_kses_post( $content ); ?>
</div>