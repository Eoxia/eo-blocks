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
		'api_fields' => array(
			'api_key' => 'Clé API Google Places',
			'place_id' => 'Place ID par défaut',
		),
		'manual_fields' => array(
			'url' => 'Lien vers la fiche',
			'review_url' => 'Lien vers déposer un avis',
		),
		'place_id_link' => 'https://developers.google.com/maps/documentation/places/web-service/place-id',
		'help_text' => "<strong>Pour récupérer de simples avis publics, Google utilise un système beaucoup plus basique : une Clé API.</strong><br><br>Voici la marche à suivre exacte pas-à-pas pour la générer (ça prend 1 minute) :<br><br><strong>1. Créer la Clé API</strong><br>Sur Google Cloud, regarde le menu de navigation à gauche (les 3 traits horizontaux) et va dans <em>API et services > Identifiants</em> (Credentials en anglais).<br>En haut de l'écran, clique sur le bouton <strong>+ CRÉER DES IDENTIFIANTS</strong> (+ CREATE CREDENTIALS).<br>Dans le menu déroulant qui s'ouvre, choisis le tout premier choix : <strong>Clé API</strong> (API key).<br>Une petite fenêtre va s'ouvrir avec ta nouvelle clé API. Elle ressemble à une longue suite de lettres et de chiffres qui commence généralement par <code>AIzaSy...</code> (et il n'y a pas de \"code secret\").<br>Copie cette clé, c'est celle-ci qu'il faut coller dans la case Clé API Google Places de notre plugin !<br><br><strong>2. Activer l'API (Très important !)</strong><br>Pour que cette clé ait le droit de lire les avis, il faut lui en donner la permission :<br><br>Toujours dans le menu de gauche, va dans <em>API et services > Bibliothèque</em> (Library).<br>Dans la barre de recherche, tape <strong>Places API</strong> (ou Places API (New)).<br>Clique dessus, et clique sur le bouton bleu <strong>Activer</strong> (Enable).<br><br>Et voilà ! Tu as maintenant la bonne Clé API. Pour le Place ID, tu peux utiliser le petit lien \"Trouver mon Place ID\" que je t'ai ajouté juste en dessous du champ dans tes réglages WordPress.",
	),
	'trustpilot' => array(
		'title' => 'Trustpilot',
		'desc' => 'Affichez votre score Trustpilot.',
		'icon' => 'dashicons-star-filled',
		'api_fields' => array(
			'business_unit_id' => 'Business Unit ID',
			'api_key' => 'Clé API Trustpilot',
		),
		'manual_fields' => array(
			'url' => 'Lien vers la fiche',
			'review_url' => 'Lien vers déposer un avis',
		),
	),
	'tripadvisor' => array(
		'title' => 'TripAdvisor',
		'desc' => 'Vos notes de TripAdvisor.',
		'icon' => 'dashicons-palmtree',
		'api_fields' => array(
			'api_key' => 'Clé API TripAdvisor',
			'location_id' => 'Location ID',
		),
		'manual_fields' => array(
			'url' => 'Lien vers la fiche',
			'review_url' => 'Lien vers déposer un avis',
		),
	),
	'thefork' => array(
		'title' => 'TheFork',
		'desc' => 'Récupérez vos avis TheFork.',
		'icon' => 'dashicons-food',
		'api_fields' => array(
			'restaurant_id' => 'Restaurant ID',
			'api_key' => 'Clé API TheFork',
		),
		'manual_fields' => array(
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
							<?php if ( ! empty( $provider_data['help_text'] ) ) : ?>
								<div class="eo-help-tooltip-container">
									<span class="dashicons dashicons-editor-help eo-help-icon"></span>
									<div class="eo-help-tooltip">
										<?php echo wp_kses_post( $provider_data['help_text'] ); ?>
									</div>
								</div>
							<?php endif; ?>
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
								<input type="checkbox" class="eo-auto-sync-checkbox" name="eoblocks_reviews_settings[<?php echo esc_attr( $auto_sync_name ); ?>]" value="1" <?php checked( 1, $auto_sync_value ); ?>>
								<strong>Activer la connexion automatique</strong>
							</label>
						</div>

						<div class="eo-api-credentials" style="<?php echo $auto_sync_value ? '' : 'display: none;'; ?>">
							<?php if ( $provider_key === 'google' ) : 
								$auth_method = isset($options['google_auth_method']) ? $options['google_auth_method'] : 'api_key';
							?>
								<div class="eo-setting-field" style="margin-bottom: 20px; padding: 15px; background: #f0f0f1; border-left: 4px solid #2271b1;">
									<label style="font-weight: bold; font-size: 14px; margin-bottom: 10px; display: block;">Méthode d'authentification Google</label>
									<label style="display: inline-block; margin-right: 20px;">
										<input type="radio" name="eoblocks_reviews_settings[google_auth_method]" class="eo-google-auth-method" value="oauth" <?php checked('oauth', $auth_method); ?>>
										OAuth 2.0 (Recommandé - Tous les avis)
									</label>
									<label style="display: inline-block;">
										<input type="radio" name="eoblocks_reviews_settings[google_auth_method]" class="eo-google-auth-method" value="api_key" <?php checked('api_key', $auth_method); ?>>
										Clé API Publique (Limité à 5 avis)
									</label>
								</div>

								<div class="eo-google-method-section eo-google-method-oauth" style="<?php echo $auth_method === 'oauth' ? '' : 'opacity: 0.5; pointer-events: none;'; ?>">
									<h3 style="margin-top: 15px;">Méthode 1 : OAuth 2.0 (Recommandé)</h3>
									<p class="description">Permet de récupérer plus de 5 avis (tous les avis). Nécessite une application Google Cloud approuvée.</p>
									
									<?php
										$client_id = isset($options['google_oauth_client_id']) ? $options['google_oauth_client_id'] : '';
										$client_secret = isset($options['google_oauth_client_secret']) ? $options['google_oauth_client_secret'] : '';
										$is_connected = !empty($options['google_oauth_access_token']);
									?>
									<div class="eo-setting-field">
										<label>Client ID OAuth</label>
										<input type="text" class="eo-api-input" name="eoblocks_reviews_settings[google_oauth_client_id]" value="<?php echo esc_attr($client_id); ?>" />
									</div>
									<div class="eo-setting-field">
										<label>Client Secret OAuth</label>
										<input type="password" class="eo-api-input" name="eoblocks_reviews_settings[google_oauth_client_secret]" value="<?php echo esc_attr($client_secret); ?>" />
									</div>
									<div class="eo-setting-field">
										<label>URI de redirection</label>
										<input type="text" class="eo-api-input" value="<?php echo esc_attr( \EoBlocks\Includes\Eoblocks_Google_OAuth::get_redirect_uri() ); ?>" readonly />
										<p class="description">Copiez cette URI dans la configuration de votre application sur Google Cloud.</p>
									</div>
									
									<div class="eo-oauth-actions" style="margin-top: 15px; margin-bottom: 20px;">
										<?php if ( $is_connected ) : ?>
											<button type="button" class="button" id="eo-google-oauth-disconnect">Déconnecter le compte</button>
											<span style="color: green; font-weight: bold; margin-left: 10px;">Connecté avec succès.</span>
											
											<div class="eo-setting-field" style="margin-top: 15px;">
												<label>Sélectionner l'établissement :</label>
												<select name="eoblocks_reviews_settings[google_oauth_location]" id="eo-google-oauth-location-select" style="min-width: 300px;">
													<option value="">Chargement des établissements...</option>
													<?php if ( !empty($options['google_oauth_location']) ) : ?>
														<option value="<?php echo esc_attr($options['google_oauth_location']); ?>" selected>
															Établissement sélectionné (ID: <?php echo esc_html($options['google_oauth_location']); ?>)
														</option>
													<?php endif; ?>
												</select>
												<button type="button" class="button" id="eo-google-oauth-load-locations">Rafraîchir la liste</button>
											</div>

										<?php else : ?>
											<?php if ( empty($client_id) ) : ?>
												<button type="button" class="button button-primary eo-oauth-disabled-btn" style="opacity: 0.5; cursor: not-allowed;">Se connecter avec Google</button>
												<p class="description" style="color: #d63638; font-weight: bold;">⚠️ Étape obligatoire : Vous devez d'abord coller votre Client ID et Secret ci-dessus et cliquer sur "Enregistrer les modifications" tout en bas de la page pour pouvoir vous connecter.</p>
											<?php else : ?>
												<a href="<?php echo esc_url( \EoBlocks\Includes\Eoblocks_Google_OAuth::get_auth_url() ); ?>" class="button button-primary">Se connecter avec Google</a>
											<?php endif; ?>
										<?php endif; ?>
									</div>
								</div>

								<hr>
								<div class="eo-google-method-section eo-google-method-api_key" style="<?php echo $auth_method === 'api_key' ? '' : 'opacity: 0.5; pointer-events: none;'; ?>">
									<h3 style="margin-top: 15px;">Méthode 2 : Clé API Publique</h3>
									<p class="description">Méthode simple. Limitée à 5 avis maximum.</p>
							<?php endif; ?>

							<?php foreach ( $provider_data['api_fields'] as $field_key => $field_label ) : 
								$field_name = $provider_key . '_' . $field_key;
								$field_value = isset( $options[ $field_name ] ) ? $options[ $field_name ] : '';
								$input_type = ( strpos( $field_key, 'api_key' ) !== false ) ? 'password' : 'text';
							?>
								<div class="eo-setting-field">
									<label><?php echo esc_html( $field_label ); ?></label>
									<input type="<?php echo esc_attr( $input_type ); ?>" class="eo-api-input" data-key="<?php echo esc_attr( $field_key ); ?>" name="eoblocks_reviews_settings[<?php echo esc_attr( $field_name ); ?>]" value="<?php echo esc_attr( $field_value ); ?>" />
									<?php if ( $field_key === 'place_id' && ! empty( $provider_data['place_id_link'] ) ) : ?>
										<p class="description"><a href="<?php echo esc_url( $provider_data['place_id_link'] ); ?>" target="_blank">Trouver mon Place ID</a></p>
									<?php endif; ?>
								</div>
							<?php endforeach; ?>
							
							<div class="eo-test-connection-wrapper">
								<button type="button" class="button eo-test-connection-btn" data-provider="<?php echo esc_attr( $provider_key ); ?>">Tester la connexion</button>
								<span class="eo-test-result"></span>
							</div>
							
							<?php if ( $provider_key === 'google' ) : ?>
								</div> <!-- end method 2 section -->
							<?php endif; ?>
							
							<hr>
						</div>

						<div class="eo-card-settings">
							<?php foreach ( $provider_data['manual_fields'] as $field_key => $field_label ) : 
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
