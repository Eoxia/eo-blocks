<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

/**
 * Call API.
 * @todo Déplacer dans une fonction externe pour optimisation du code
 */

$url_api = wp_remote_get(
	'http://127.0.0.1/dolibarr/htdocs/api/index.php/digiriskdolibarr/risk/getRisksByCotation?DOLAPIKEY=V9OCyHx4y5XA1ye511GbKymLz661tZCu&DOLENTITY=1'
);
if (is_wp_error($url_api)) {
	return [];
}

$body_api = wp_remote_retrieve_body($url_api);
$data_api = json_decode($body_api, true);

if ($data_api['error']) {
	return [];
}
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php echo 'Risques gris: ' . $data_api[1] . '. Risques orange: ' . $data_api[2] . '. Risques rouge: ' . $data_api[3] . '. Risques noirs: ' . $data_api[4]; ?>
</div>
