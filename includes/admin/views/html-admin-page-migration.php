<?php
/**
 * Migration page view.
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
	<h1><?php esc_html_e('EO Blocks - Migration des blocs', 'eo-blocks'); ?></h1>

	<div class="notice notice-info">
		<p><?php esc_html_e('EO Blocks a détecté des blocs utilisant l\'ancienne convention de nommage. Cette page vous permet de migrer votre contenu vers la nouvelle convention.', 'eo-blocks'); ?></p>
	</div>

	<div id="eoblocks-migration-section" style="margin-top: 2em;">
		<h2><?php esc_html_e('Migrer les blocs', 'eo-blocks'); ?></h2>
		<p><?php esc_html_e('Cliquez sur le bouton ci-dessous pour mettre à jour automatiquement tous les anciens blocs (eo/*) vers la nouvelle convention (eo-blocks/*)' , 'eo-blocks'); ?></p>

		<button type="button" id="eoblocks-migrate-btn" class="button button-primary button-lg" style="padding: 10px 20px; font-size: 16px;">
			<?php esc_html_e('Lancer la migration', 'eo-blocks'); ?>
		</button>

		<div id="eoblocks-migration-result" style="margin-top: 2em; display: none;"></div>
	</div>

	<hr style="margin: 2em 0;">

	<div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #0066cc;">
		<h3><?php esc_html_e('À propos de cette migration', 'eo-blocks'); ?></h3>
		<ul style="margin-left: 20px;">
			<li><?php esc_html_e('Tous vos blocs existants seront automatiquement renommés', 'eo-blocks'); ?></li>
			<li><?php esc_html_e('Aucun contenu ne sera supprimé ou modifié', 'eo-blocks'); ?></li>
			<li><?php esc_html_e('Vous pouvez relancer la migration si nécessaire', 'eo-blocks'); ?></li>
			<li><?php esc_html_e('La migration peut prendre quelques secondes selon le nombre de blocs', 'eo-blocks'); ?></li>
		</ul>
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
