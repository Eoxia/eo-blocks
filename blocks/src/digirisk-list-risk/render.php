<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$risk_data = \EoBlocks\Includes\Eoblocks_Helper::digirisk_api_get('digiriskdolibarr/risk/getRisksByCotation', '');

$risk_label = [
    1 => __( 'faible', 'eo-blocks' ),
    2 => __( 'à planifier', 'eo-blocks' ),
    3 => __( 'à traiter', 'eo-blocks' ),
    4 => __( 'inacceptable', 'eo-blocks' ),
];
$risk_render = [
	1 => $attributes['displayRisk1'],
	2 => $attributes['displayRisk2'],
	3 => $attributes['displayRisk3'],
	4 => $attributes['displayRisk4'],
];
$blockGrid = $attributes['blockGrid'] ?: '2';

if ( ! empty( $risk_data ) ) :
	?>
	<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
		<div class="eo-digirisk-list-risk__list eo-grid eo-grid__col-<?php echo esc_attr( $blockGrid ); ?>">
			<?php foreach ( $risk_data as $key => $value ) : ?>
				<?php if ( $risk_render[ $key ] ) : ?>
					<div class="eo-digirisk-list-risk__element --risk-<?php echo esc_attr( $key ); ?>">
						<div class="eo-digirisk-list-risk__content">
							<div class="eo-digirisk-list-risk__content-label-group">
								<svg class="eo-digirisk-list-risk__icon-risk" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>
								<div class="eo-digirisk-list-risk__content-label"><?php esc_html_e( 'Risque', 'eo-blocks' ); ?></div>
							</div>
							<div class="eo-digirisk-list-risk__content-risk"><?php echo esc_html( $value ); ?></div>
						</div>
						<div class="eo-digirisk-list-risk__label"><?php echo esc_html( $risk_label[ $key ] ); ?></div>
					</div>
				<?php endif; ?>
			<?php endforeach; ?>
		</div>
	</div>
	<?php
endif;
