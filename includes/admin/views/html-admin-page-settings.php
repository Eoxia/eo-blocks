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
	<h1><?php esc_html_e('EO Blocks Settings', 'eo-blocks'); ?></h1>
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

	<hr style="margin: 2em 0;">

	<div id="eoblocks-migration-section">
		<h2><?php esc_html_e('Migration des blocs', 'eo-blocks'); ?></h2>
		<p><?php esc_html_e('Mettez à jour les anciens noms de blocs (eo/*) vers la nouvelle convention (eo-blocks/*)', 'eo-blocks'); ?></p>

		<button type="button" id="eoblocks-migrate-btn" class="button button-primary">
			<?php esc_html_e('Lancer la migration', 'eo-blocks'); ?>
		</button>

		<div id="eoblocks-migration-result" style="margin-top: 1em; display: none;"></div>
	</div>
</div>

<script type="text/javascript">
document.addEventListener('DOMContentLoaded', function() {
	const migrateBtn = document.getElementById('eoblocks-migrate-btn');
	const resultDiv = document.getElementById('eoblocks-migration-result');

	if (!migrateBtn) return;

	migrateBtn.addEventListener('click', function() {
		migrateBtn.disabled = true;
		migrateBtn.textContent = '<?php esc_attr_e('Migration en cours...', 'eo-blocks'); ?>';
		resultDiv.innerHTML = '';
		resultDiv.style.display = 'none';

		fetch(ajaxurl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				action: 'eoblocks_migrate_blocks',
				nonce: '<?php echo wp_create_nonce('eoblocks_migrate_nonce'); ?>'
			})
		})
		.then(response => response.json())
		.then(data => {
			migrateBtn.disabled = false;
			migrateBtn.textContent = '<?php esc_attr_e('Lancer la migration', 'eo-blocks'); ?>';

			resultDiv.style.display = 'block';

			if (data.success) {
				resultDiv.innerHTML = '<div class="notice notice-success is-dismissible"><p><strong>' + data.data.message + '</strong></p></div>';
			} else {
				resultDiv.innerHTML = '<div class="notice notice-error is-dismissible"><p><strong>' + data.data.message + '</strong></p></div>';
			}
		})
		.catch(error => {
			migrateBtn.disabled = false;
			migrateBtn.textContent = '<?php esc_attr_e('Lancer la migration', 'eo-blocks'); ?>';
			resultDiv.style.display = 'block';
			resultDiv.innerHTML = '<div class="notice notice-error is-dismissible"><p><strong><?php esc_attr_e('Une erreur est survenue lors de la migration.', 'eo-blocks'); ?></strong></p></div>';
			console.error('Migration error:', error);
		});
	});
});
</script>
