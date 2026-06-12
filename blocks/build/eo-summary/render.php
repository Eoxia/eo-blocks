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

$showInMobile = ! empty( $attributes['displayMobile'] ) ? 'is-display-mobile' : '';
if ( ! empty( $showInMobile ) ) :
    $styleMobile = ! empty( $attributes['styleMobile'] ) ? $attributes['styleMobile'] : 'standard';
    $showInMobile .= ' is-style-mobile-' . $styleMobile;
endif;

$blockClass = $orientation . ' ' . $justification . ' ' . $showInMobile;

?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => esc_attr( $blockClass) ) ) ); ?>>
    <div class="eo-summary__menu">
        <svg class="eo-summary__menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
        <div class='eo-summary__menu-label'><?php echo ! empty( $attributes['labelMenuMobile'] ) ? esc_html( $attributes['labelMenuMobile'] ) : ''; ?></div>
    </div>
    <div class="eo-summary__container">
        <svg class="eo-summary__menu-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
        <?php echo wp_kses_post( $content ); ?>
    </div>
</div>
