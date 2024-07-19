<?php
/**
 * Settings page view.
 *
 * @package Views
 * @author Eoxia
 *
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
	exit;
}

?>
<div class="wrap">
	<h1><?php esc_html_e('EO Blocks Settings', 'mon-plugin'); ?></h1>
	<form method="post" action="options.php">
		<?php
		settings_fields('eoblocks_settings_group');
		do_settings_sections('eoblocks');

		$check_api_connexion = \EoBlocks\Includes\Eoblocks_Helper::digirisk_api_get('setup/company', '');
		if ( ! empty( $check_api_connexion ) ) {
			echo '<p style="color: green;">Votre site est bien connecté au Dolibarr</p>';
		} else {
			echo '<p style="color: red;">Votre site n\'est pas connecté au Dolibarr</p>';
		}

		submit_button();
		?>
	</form>
</div>
