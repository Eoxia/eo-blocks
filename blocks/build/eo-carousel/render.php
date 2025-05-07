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
    'loop'          => esc_attr( $attributes['loop'] ),
    'speed'         => esc_attr( $attributes['speed'] ),
    'effect'        => esc_attr( $attributes['effect'] ),
    'spaceBetween'  => esc_attr( $attributes['spaceBetween'] ),
    'slidesPerView' => esc_attr( $attributes['mobileSlidesPerView'] ),
    'breakpoints'   => array(
        esc_attr( $attributes['mobileBreakpoint'] ) => array(
            'slidesPerView' => esc_attr( $attributes['slidesPerView'] )
        ),
    ),
);

if ( $attributes['autoplay'] ) :
    $carousel_attr['autoplay'] = array( 'delay' => $attributes['autoplayDelay'] * 10 );
else :
    $carousel_attr['autoplay'] = false;
endif;
if ( ! $attributes['pagination'] ) :
    $carousel_attr['pagination'] = false;
endif;
if ( ! $attributes['navigation'] ) :
    $carousel_attr['navigation'] = false;
endif;
if ( $attributes['autoplay'] && $attributes['marquee'] ) :
    $carousel_attr['allowTouchMove'] = false;
endif;
?>
<style>
    :root {
        --swiper-theme-color: <?php echo esc_attr( $attributes['mainColor'] ); ?>;
    }
    <?php if ( $attributes['autoplay'] && $attributes['marquee'] ) : ?>
        :root {
            --swiper-wrapper-transition-timing-function: linear !important;
        }
    <?php endif; ?>
</style>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
    <div class="swiper eo-carousel__main-carousel" data-carousel=<?php echo wp_json_encode( $carousel_attr ); ?>>
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
    <?php if ( $attributes['thumbs'] ) : ?>
        <div class="swiper eo-carousel__thumbs-carousel">
            <div class="swiper-wrapper">
                <?php echo wp_kses_post( $content ); ?>
            </div>
        </div>
    <?php endif; ?>
</div>
