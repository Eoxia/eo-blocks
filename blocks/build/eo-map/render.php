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

$map_id = isset( $attributes['mapId'] ) ? intval( $attributes['mapId'] ) : 0;
if ( ! $map_id ) {
	return;
}

$settings = get_post_meta( $map_id, '_eo_map_settings', true );
$markers  = get_post_meta( $map_id, '_eo_map_markers', true );

if ( ! is_array( $settings ) ) {
	return;
}

if ( ! is_array( $markers ) ) {
	$markers = array();
}

$width  = esc_attr( $settings['width'] ?? '100%' );
$height = esc_attr( $settings['height'] ?? '600px' );

$wrapper_attributes = get_block_wrapper_attributes( array(
	'class' => 'eo-map-block-wrapper',
) );
?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="eo-map-frontend-container"
		id="eo-map-frontend-<?php echo esc_attr( $map_id ); ?>"
		style="width: <?php echo $width; ?>; height: <?php echo $height; ?>;"
		data-settings="<?php echo esc_attr( json_encode( $settings ) ); ?>"
		data-markers="<?php echo esc_attr( json_encode( $markers ) ); ?>">
	</div>
</div>
