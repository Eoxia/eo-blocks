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
$contentPosition = 'is-position-' . str_replace( ' ', '-', $contentPosition );

$horizontalGapPercent = ! empty( $attributes['horizontalGapPercent'] ) ? $attributes['horizontalGapPercent'] : 0;
$horizontalGapPercent = 'is-gap-horizontal-' . str_replace( ' ', '-', $horizontalGapPercent );
$verticalGapPercent   = ! empty( $attributes['verticalGapPercent'] ) ? $attributes['verticalGapPercent'] : 0;
$verticalGapPercent   = 'is-gap-vertical-' . str_replace( ' ', '-', $verticalGapPercent );

$blockClass = $contentPosition . ' ' . $horizontalGapPercent . ' ' . $verticalGapPercent;

//$blockStyle           = sprintf(
//    'transform: translateX(%s%%); transform: translateY(%s%%);',
//    esc_attr( $horizontalGapPercent ),
//    esc_attr( $verticalGapPercent )
//);
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes( array(
    'class' => esc_attr( $blockClass),
//    'style' => $blockStyle
) ) ); ?>>
	<?php echo wp_kses_post( $content ); ?>
</div>
