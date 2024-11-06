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

$contentPosition = ! empty( $attributes['contentPosition'] ) ? $attributes['contentPosition'] : 'top right';
$contentPosition = 'is-position-' . str_replace( ' ', '-', $attributes['contentPosition'] );
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => esc_attr( $contentPosition ) ) ) ); ?>>
	<?php echo wp_kses_post( $content ); ?>
</div>
