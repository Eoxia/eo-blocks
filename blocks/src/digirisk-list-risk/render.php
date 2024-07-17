<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$risk_data = \EoBlocks\Includes\Eoblocks_Helper::digirisk_api_get('digiriskdolibarr/risk/getRisksByCotation', '');

if ( ! empty( $risk_data ) ) :
	?>
	<div <?php echo get_block_wrapper_attributes(); ?>>
		<?php echo 'Risques gris: ' . $risk_data[1] . '. Risques orange: ' . $risk_data[2] . '. Risques rouge: ' . $risk_data[3] . '. Risques noirs: ' . $risk_data[4]; ?>
	</div>
	<?php
endif;
