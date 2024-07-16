<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php $response = wp_remote_get('http://localhost/dolibarr-17.0.2/htdocs/api/index.php/digiriskdolibarr/risk/getRisksByCotation?DOLAPIKEY=EfvH46ntG4zdnTYHP1q39jE56bkSN6M2&DOLENTITY=1');
	echo '<pre>'; print_r( $response ); echo '</pre>'; exit;
	if (is_wp_error($response)) {
		return [];
	}
	$body = wp_remote_retrieve_body($response);
	echo '<pre>'; print_r( $body ); echo '</pre>'; exit; ?>
</div>
