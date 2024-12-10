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
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes( [ 'class' => 'swiper-slide' ] ) ); ?>>
    <?php echo wp_kses_post( $content ); ?>
</div>
