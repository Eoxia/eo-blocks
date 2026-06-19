<?php
/**
 * Reviews settings page view.
 *
 * @package eo-blocks
 */

if (!defined('ABSPATH')) {
	exit;
}

$options = get_option('eoblocks_reviews_settings', array());

$providers = array(
	'google' => array(
		'title' => 'Google',
		'desc' => 'Récupérez automatiquement les avis depuis Google Places API.',
		'icon' => 'dashicons-google',
		'fields' => array(
			'api_key' => 'Clé API Google Places',
			'place_id' => 'Place ID par défaut',
			'url' => 'Lien vers la fiche',
			'review_url' => 'Lien vers déposer un avis',
		),
	),
	'trustpilot' => array(
		'title' => 'Trustpilot',
		'desc' => 'Affichez votre score Trustpilot.',
		'icon' => 'dashicons-star-filled',
		'fields' => array(
			'business_unit_id' => 'Business Unit ID',
			'api_key' => 'Clé API Trustpilot',
			'url' => 'Lien vers la fiche',
			'review_url' => 'Lien vers déposer un avis',
		),
	),
	'tripadvisor' => array(
		'title' => 'TripAdvisor',
		'desc' => 'Vos notes de TripAdvisor.',
		'icon' => 'dashicons-palmtree',
		'fields' => array(
			'api_key' => 'Clé API TripAdvisor',
			'location_id' => 'Location ID',
			'url' => 'Lien vers la fiche',
			'review_url' => 'Lien vers déposer un avis',
		),
	),
	'thefork' => array(
		'title' => 'TheFork',
		'desc' => 'Récupérez vos avis TheFork.',
		'icon' => 'dashicons-food',
		'fields' => array(
			'restaurant_id' => 'Restaurant ID',
			'api_key' => 'Clé API TheFork',
			'url' => 'Lien vers la fiche',
			'review_url' => 'Lien vers déposer un avis',
		),
	),
);
?>
<div class="wrap eo-admin-wrap">
	<h1><?php esc_html_e('EO Blocks - Avis Clients', 'eo-blocks'); ?></h1>
	<p class="eo-admin-description">
		Configurez les accès aux API de vos prestataires d'avis pour récupérer automatiquement les données dans les blocs Gutenberg.
	</p>

	<?php settings_errors(); ?>

	<form method="post" action="options.php">
		<?php
		settings_fields('eoblocks_reviews_group');
		?>
		
		<div class="eo-cards-container">
			<?php foreach ( $providers as $provider_key => $provider_data ) : 
				$is_active = isset( $options[ $provider_key . '_active' ] ) ? $options[ $provider_key . '_active' ] : false;
			?>
				<div class="eo-card <?php echo $is_active ? 'is-active' : ''; ?>">
					<div class="eo-card-header">
						<div class="eo-card-icon">
							<span class="dashicons <?php echo esc_attr( $provider_data['icon'] ); ?>"></span>
						</div>
						<div class="eo-card-toggle">
							<label class="eo-switch">
								<input type="checkbox" name="eoblocks_reviews_settings[<?php echo esc_attr( $provider_key ); ?>_active]" value="1" <?php checked( 1, $is_active ); ?>>
								<span class="eo-slider round"></span>
							</label>
							<span class="eo-toggle-label"><?php echo $is_active ? 'ACTIF' : 'INACTIF'; ?></span>
						</div>
					</div>
					<div class="eo-card-body">
						<h2><?php echo esc_html( $provider_data['title'] ); ?></h2>
						<p><?php echo esc_html( $provider_data['desc'] ); ?></p>

						<?php 
							$auto_sync_name = $provider_key . '_auto_sync';
							$auto_sync_value = isset( $options[ $auto_sync_name ] ) ? $options[ $auto_sync_name ] : false;
						?>
						<div class="eo-auto-sync-wrapper">
							<label>
								<input type="checkbox" name="eoblocks_reviews_settings[<?php echo esc_attr( $auto_sync_name ); ?>]" value="1" <?php checked( 1, $auto_sync_value ); ?>>
								<strong>Activer la connexion automatique</strong>
							</label>
						</div>

						<div class="eo-card-settings">
							<?php foreach ( $provider_data['fields'] as $field_key => $field_label ) : 
								$field_name = $provider_key . '_' . $field_key;
								$field_value = isset( $options[ $field_name ] ) ? $options[ $field_name ] : '';
							?>
								<div class="eo-setting-field">
									<label><?php echo esc_html( $field_label ); ?></label>
									<input type="text" name="eoblocks_reviews_settings[<?php echo esc_attr( $field_name ); ?>]" value="<?php echo esc_attr( $field_value ); ?>" />
								</div>
							<?php endforeach; ?>
						</div>
					</div>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="eo-submit-wrapper">
			<?php submit_button('Enregistrer les modifications', 'primary', 'submit', false); ?>
		</div>
	</form>
</div>
