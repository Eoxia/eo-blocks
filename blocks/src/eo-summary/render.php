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

$orientation = ! empty( $attributes['orientation'] ) ? 'is-orientation-' . $attributes['orientation'] : 'is-orientation-horizontal';
$justification = ! empty( $attributes['justification'] ) ? 'is-justification-' . $attributes['justification'] : 'is-justification-left';

$blockClass = $orientation . ' ' . $justification;
?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => esc_attr( $blockClass) ) ) ); ?>>

</div>
