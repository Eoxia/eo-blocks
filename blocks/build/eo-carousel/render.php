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

$carousel_attr = array(
    'slidesPerView' => esc_attr( $attributes['slidesPerView'] ),
    'loop' => esc_attr( $attributes['loop'] ),
    'speed' => esc_attr( $attributes['speed'] )
);

if ( $attributes['autoplay'] ) {
    $carousel_attr['autoplay'] = array( 'delay' => $attributes['autoplayDelay'] * 10 );
} else {
    $carousel_attr['autoplay'] = false;
}
if ( ! $attributes['pagination'] ) {
    $carousel_attr['pagination'] = false;
}
if ( ! $attributes['navigation'] ) {
    $carousel_attr['navigation'] = false;
}
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes( [ 'class' => 'swiper' ] ) ); ?> data-carousel=<?php echo wp_json_encode( $carousel_attr ); ?>>
    <!-- Additional required wrapper -->
    <div class="swiper-wrapper">
        <?php echo wp_kses_post( $content ); ?>
    </div>

    <?php if ( $attributes['pagination'] ) : ?>
        <div class="swiper-pagination"></div>
    <?php endif; ?>

    <?php if ( $attributes['navigation'] ) : ?>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    <?php endif; ?>
</div>