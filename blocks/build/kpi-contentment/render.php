<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$contentment_label_color_class = 'bar__quater-1';

if ( ! empty( $attributes['contentmentLabel'] )  ) {
	if ( $attributes['contentmentLabel'] < 25 ) {
		$contentment_label_color_class = 'bar__quarter-1';
	} else if ( $attributes['contentmentLabel'] >= 25 && $attributes['contentmentLabel'] < 50 ) {
		$contentment_label_color_class = 'bar__quarter-2';
	} else if ( $attributes['contentmentLabel'] >= 50 && $attributes['contentmentLabel'] < 75 ) {
		$contentment_label_color_class = 'bar__quarter-3';
	} else {
		$contentment_label_color_class = 'bar__quarter-4';
	}
}

?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<img class="eo-kpi-contentment__icon-frown" src="<?php echo esc_url( EO_BLOCKS_URL . '/assets/images/icon-frown.svg' ); ?>" />
	<img class="eo-kpi-contentment__icon-smile" src="<?php echo esc_url( EO_BLOCKS_URL . '/assets/images/icon-smile.svg' ); ?>" />
	<div class="eo-kpi-contentment__container">
		<div class="eo-kpi-contentment__bar-container">
			<img class="eo-kpi-contentment__icon-pin" src=<?php echo esc_url( EO_BLOCKS_URL . '/assets/images/icon-pin.svg' ); ?> style="left: <?php echo ! empty( $attributes['contentmentLabel'] ) ? esc_attr( $attributes['contentmentLabel'] ) : '0'; ?>%;" />
			<div class='eo-kpi-contentment__bar'>
				<span class='eo-kpi-contentment__bar-quarter bar__1'></span>
				<span class='eo-kpi-contentment__bar-quarter bar__2'></span>
				<span class='eo-kpi-contentment__bar-quarter bar__3'></span>
				<span class='eo-kpi-contentment__bar-quarter bar__4'></span>
			</div>
		</div>
		<div class='eo-kpi-contentment__content'>
			<div class='eo-kpi-contentment__block-label'><?php echo ! empty( $attributes['blockLabel'] ) ? esc_html( $attributes['blockLabel'] ) : ''; ?></div>
			<div class='eo-kpi-contentment__block-contentment <?php echo esc_attr( $contentment_label_color_class ); ?>'><?php echo ! empty( $attributes['contentmentLabel'] ) ? esc_attr( $attributes['contentmentLabel'] ) . '%' : ''; ?></div>
		</div>
	</div>
</div>
