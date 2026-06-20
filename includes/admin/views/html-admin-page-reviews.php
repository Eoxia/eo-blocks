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
		'title' => __( 'Google', 'eo-blocks' ),
		'desc' => __( 'Récupérez automatiquement les avis depuis Google Places API.', 'eo-blocks' ),
		'icon' => 'dashicons-google',
		'api_fields' => array(
			'api_key' => __( 'Clé API Google Places', 'eo-blocks' ),
			'place_id' => __( 'Place ID par défaut', 'eo-blocks' ),
		),
		'manual_fields' => array(
			'url' => __( 'Lien vers la fiche', 'eo-blocks' ),
			'review_url' => __( 'Lien vers déposer un avis', 'eo-blocks' ),
		),
		'place_id_link' => 'https://developers.google.com/maps/documentation/places/web-service/place-id',
		'help_text' => __( "<strong>Pour récupérer de simples avis publics, Google utilise un système beaucoup plus basique : une Clé API.</strong><br><br>Voici la marche à suivre exacte pas-à-pas pour la générer (ça prend 1 minute) :<br><br><strong>1. Créer la Clé API</strong><br>Sur Google Cloud, regarde le menu de navigation à gauche (les 3 traits horizontaux) et va dans <em>API et services > Identifiants</em> (Credentials en anglais).<br>En haut de l'écran, clique sur le bouton <strong>+ CRÉER DES IDENTIFIANTS</strong> (+ CREATE CREDENTIALS).<br>Dans le menu déroulant qui s'ouvre, choisis le tout premier choix : <strong>Clé API</strong> (API key).<br>Une petite fenêtre va s'ouvrir avec ta nouvelle clé API. Elle ressemble à une longue suite de lettres et de chiffres qui commence généralement par <code>AIzaSy...</code> (et il n'y a pas de \"code secret\").<br>Copie cette clé, c'est celle-ci qu'il faut coller dans la case Clé API Google Places de notre plugin !<br><br><strong>2. Activer l'API (Très important !)</strong><br>Pour que cette clé ait le droit de lire les avis, il faut lui en donner la permission :<br><br>Toujours dans le menu de gauche, va dans <em>API et services > Bibliothèque</em> (Library).<br>Dans la barre de recherche, tape <strong>Places API</strong> (ou Places API (New)).<br>Clique dessus, et clique sur le bouton bleu <strong>Activer</strong> (Enable).<br><br>Et voilà ! Tu as maintenant la bonne Clé API. Pour le Place ID, tu peux utiliser le petit lien \"Trouver mon Place ID\" que je t'ai ajouté juste en dessous du champ dans tes réglages WordPress.", 'eo-blocks' ),
	),
	'trustpilot' => array(
		'title' => __( 'Trustpilot', 'eo-blocks' ),
		'desc' => __( 'Affichez votre score Trustpilot.', 'eo-blocks' ),
		'icon' => 'dashicons-star-filled',
		'api_fields' => array(
			'business_unit_id' => __( 'Business Unit ID', 'eo-blocks' ),
			'api_key' => __( 'Clé API Trustpilot', 'eo-blocks' ),
		),
		'manual_fields' => array(
			'url' => __( 'Lien vers la fiche', 'eo-blocks' ),
			'review_url' => __( 'Lien vers déposer un avis', 'eo-blocks' ),
		),
	),
	'tripadvisor' => array(
		'title' => __( 'TripAdvisor', 'eo-blocks' ),
		'desc' => __( 'Vos notes de TripAdvisor.', 'eo-blocks' ),
		'icon' => 'dashicons-palmtree',
		'api_fields' => array(
			'api_key' => __( 'Clé API TripAdvisor', 'eo-blocks' ),
			'location_id' => __( 'Location ID', 'eo-blocks' ),
		),
		'manual_fields' => array(
			'url' => __( 'Lien vers la fiche', 'eo-blocks' ),
			'review_url' => __( 'Lien vers déposer un avis', 'eo-blocks' ),
		),
	),
	'thefork' => array(
		'title' => __( 'TheFork', 'eo-blocks' ),
		'desc' => __( 'Récupérez vos avis TheFork.', 'eo-blocks' ),
		'icon' => 'dashicons-food',
		'api_fields' => array(
			'restaurant_id' => __( 'Restaurant ID', 'eo-blocks' ),
			'api_key' => __( 'Clé API TheFork', 'eo-blocks' ),
		),
		'manual_fields' => array(
			'url' => __( 'Lien vers la fiche', 'eo-blocks' ),
			'review_url' => __( 'Lien vers déposer un avis', 'eo-blocks' ),
		),
	),
);
?>
<div class="wrap eo-admin-wrap">
	<h1><?php esc_html_e( 'EO Blocks - Avis Clients', 'eo-blocks' ); ?></h1>
	<p class="eo-admin-description">
		<?php esc_html_e( 'Configurez les accès aux API de vos prestataires d\'avis pour récupérer automatiquement les données dans les blocs Gutenberg.', 'eo-blocks' ); ?>
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
							<span class="eo-toggle-label"><?php echo $is_active ? esc_html__( 'ACTIF', 'eo-blocks' ) : esc_html__( 'INACTIF', 'eo-blocks' ); ?></span>
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
								<strong><?php esc_html_e( 'Activer la connexion automatique', 'eo-blocks' ); ?></strong>
							</label>
						</div>

						<div class="eo-api-credentials" style="<?php echo $auto_sync_value ? '' : 'display: none;'; ?>">
							<?php if ( $provider_key === 'google' ) : 
								$auth_method = isset($options['google_auth_method']) ? $options['google_auth_method'] : 'api_key';
							?>
								<div class="eo-setting-field" style="margin-bottom: 20px; padding: 15px; background: #f0f0f1; border-left: 4px solid #2271b1;">
									<label style="font-weight: bold; font-size: 14px; margin-bottom: 10px; display: block;"><?php esc_html_e( 'Méthode d\'authentification Google', 'eo-blocks' ); ?></label>
									<label style="display: inline-block; margin-right: 20px;">
										<input type="radio" name="eoblocks_reviews_settings[google_auth_method]" class="eo-google-auth-method" value="oauth" <?php checked('oauth', $auth_method); ?>>
										<?php esc_html_e( 'OAuth 2.0 (Recommandé - Tous les avis)', 'eo-blocks' ); ?>
									</label>
									<label style="display: inline-block;">
										<input type="radio" name="eoblocks_reviews_settings[google_auth_method]" class="eo-google-auth-method" value="api_key" <?php checked('api_key', $auth_method); ?>>
										<?php esc_html_e( 'Clé API Publique (Limité à 5 avis)', 'eo-blocks' ); ?>
									</label>
								</div>

								<div class="eo-google-method-section eo-google-method-oauth" style="<?php echo $auth_method === 'oauth' ? '' : 'opacity: 0.5; pointer-events: none;'; ?>">
									
									<div style="background: #fff; border: 1px solid #ccd0d4; padding: 20px; border-radius: 4px; margin-top: 15px;">
										<h4 style="margin-top: 0;"><?php esc_html_e( 'Étape 1 : Obtenir les identifiants', 'eo-blocks' ); ?></h4>
										<p><?php esc_html_e( 'Pour utiliser OAuth 2.0 (et contourner la limite de 5 avis), vous devez créer une application sur Google Cloud.', 'eo-blocks' ); ?></p>
										<p>
											<a href="https://console.cloud.google.com/" target="_blank" class="button"><?php esc_html_e( 'Aller sur Google Cloud Console', 'eo-blocks' ); ?></a>
										</p>
										<ul style="list-style-type: disc; margin-left: 20px; font-size: 13px; color: #555;">
											<li><?php esc_html_e( 'Créez un projet ou sélectionnez-en un.', 'eo-blocks' ); ?></li>
											<li><?php esc_html_e( 'Allez dans "API et services" > "Écran de consentement OAuth" et configurez-le (type Interne ou Externe).', 'eo-blocks' ); ?></li>
											<li><?php esc_html_e( 'Allez dans "Identifiants" > "Créer des identifiants" > "ID client OAuth".', 'eo-blocks' ); ?></li>
											<li><?php echo wp_kses_post( __( 'Type d\'application : <strong>Application Web</strong>.', 'eo-blocks' ) ); ?></li>
											<li><?php esc_html_e( 'Copiez-collez les deux URI ci-dessous dans les champs correspondants de Google Cloud.', 'eo-blocks' ); ?></li>
										</ul>
										<div style="display: flex; gap: 20px; margin-top: 15px;">
											<div class="eo-setting-field" style="flex: 1;">
												<?php
													$parsed = parse_url( site_url() );
													$js_origin = $parsed['scheme'] . '://' . $parsed['host'];
													if ( isset( $parsed['port'] ) ) {
														$js_origin .= ':' . $parsed['port'];
													}
												?>
												<label><?php esc_html_e( 'Origines JavaScript autorisées', 'eo-blocks' ); ?></label>
												<input type="text" class="eo-api-input" value="<?php echo esc_attr( $js_origin ); ?>" readonly style="background: #f0f0f1;" />
											</div>
											<div class="eo-setting-field" style="flex: 1;">
												<label><?php esc_html_e( 'URI de redirection autorisés', 'eo-blocks' ); ?></label>
												<input type="text" class="eo-api-input" value="<?php echo esc_attr( \EoBlocks\Includes\Eoblocks_Google_OAuth::get_redirect_uri() ); ?>" readonly style="background: #f0f0f1;" />
											</div>
										</div>
									</div>

									<div style="background: #fff; border: 1px solid #ccd0d4; padding: 20px; border-radius: 4px; margin-top: 15px;">
										<h4 style="margin-top: 0;"><?php esc_html_e( 'Étape 2 : Remplir les informations', 'eo-blocks' ); ?></h4>
										<p><?php echo wp_kses_post( __( 'Collez ici les identifiants générés à l\'étape 1, puis <strong>Enregistrez les modifications (en bas de la page)</strong>.', 'eo-blocks' ) ); ?></p>
										<?php
											$client_id = isset($options['google_oauth_client_id']) ? $options['google_oauth_client_id'] : '';
											$client_secret = isset($options['google_oauth_client_secret']) ? $options['google_oauth_client_secret'] : '';
											$is_connected = !empty($options['google_oauth_access_token']);
										?>
										<div class="eo-setting-field">
											<label><?php esc_html_e( 'Client ID OAuth', 'eo-blocks' ); ?></label>
											<input type="text" class="eo-api-input" name="eoblocks_reviews_settings[google_oauth_client_id]" value="<?php echo esc_attr($client_id); ?>" />
										</div>
										<div class="eo-setting-field" style="margin-bottom: 0;">
											<label><?php esc_html_e( 'Client Secret OAuth', 'eo-blocks' ); ?></label>
											<input type="password" class="eo-api-input" name="eoblocks_reviews_settings[google_oauth_client_secret]" value="<?php echo esc_attr($client_secret); ?>" />
										</div>
									</div>

									<div style="background: #fff; border: 1px solid #ccd0d4; padding: 20px; border-radius: 4px; margin-top: 15px;">
										<h4 style="margin-top: 0;"><?php esc_html_e( 'Étape 3 : Se connecter et sélectionner l\'établissement', 'eo-blocks' ); ?></h4>
										<p><?php esc_html_e( 'Une fois les identifiants enregistrés, connectez votre compte Google pour autoriser l\'accès.', 'eo-blocks' ); ?></p>
										
										<div class="eo-oauth-actions" style="margin-top: 15px;">
											<?php if ( $is_connected ) : ?>
												<div style="display: flex; align-items: center; gap: 10px;">
													<button type="button" class="button" id="eo-google-oauth-disconnect"><?php esc_html_e( 'Déconnecter le compte', 'eo-blocks' ); ?></button>
													<span style="color: green; font-weight: bold;"><?php esc_html_e( 'Connecté avec succès.', 'eo-blocks' ); ?></span>
												</div>
												
												<div class="eo-setting-field" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
													<label><?php esc_html_e( 'Sélectionner l\'établissement :', 'eo-blocks' ); ?></label>
													<div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
														<select name="eoblocks_reviews_settings[google_oauth_location]" id="eo-google-oauth-location-select" style="flex: 1; max-width: 400px;">
															<option value=""><?php esc_html_e( 'Chargement des établissements...', 'eo-blocks' ); ?></option>
															<?php if ( !empty($options['google_oauth_location']) ) : ?>
																<option value="<?php echo esc_attr($options['google_oauth_location']); ?>" selected>
																	<?php printf( esc_html__( 'Établissement sélectionné (ID: %s)', 'eo-blocks' ), esc_html($options['google_oauth_location']) ); ?>
																</option>
															<?php endif; ?>
														</select>
														<button type="button" class="button" id="eo-google-oauth-load-locations"><?php esc_html_e( 'Rafraîchir la liste', 'eo-blocks' ); ?></button>
													</div>
													<div id="eo-google-oauth-locations-error" style="color: #d63638; margin-top: 10px; display: none; font-size: 13px; line-height: 1.4; background: #fcf0f1; border-left: 4px solid #d63638; padding: 10px;"></div>
												</div>

											<?php else : ?>
												<?php if ( empty($client_id) ) : ?>
													<button type="button" class="button button-primary eo-oauth-disabled-btn" style="opacity: 0.5; cursor: not-allowed;"><?php esc_html_e( 'Se connecter avec Google', 'eo-blocks' ); ?></button>
												<?php else : ?>
													<a href="<?php echo esc_url( \EoBlocks\Includes\Eoblocks_Google_OAuth::get_auth_url() ); ?>" class="button button-primary"><?php esc_html_e( 'Se connecter avec Google', 'eo-blocks' ); ?></a>
												<?php endif; ?>
											<?php endif; ?>
										</div>
									</div>
								</div>

								<hr>
								<div class="eo-google-method-section eo-google-method-api_key" style="<?php echo $auth_method === 'api_key' ? '' : 'opacity: 0.5; pointer-events: none;'; ?>">
									<h3 style="margin-top: 15px;"><?php esc_html_e( 'Méthode 2 : Clé API Publique', 'eo-blocks' ); ?></h3>
									<p class="description"><?php esc_html_e( 'Méthode simple. Limitée à 5 avis maximum.', 'eo-blocks' ); ?></p>
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
										<p class="description"><a href="<?php echo esc_url( $provider_data['place_id_link'] ); ?>" target="_blank"><?php esc_html_e( 'Trouver mon Place ID', 'eo-blocks' ); ?></a></p>
									<?php endif; ?>
								</div>
							<?php endforeach; ?>
							
							<?php if ( $provider_key === 'google' ) : ?>
								</div> <!-- end method 2 section -->
							<?php endif; ?>
							
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

						<div class="eo-card-actions" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; display: flex; gap: 10px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
							<?php submit_button( __( 'Enregistrer', 'eo-blocks' ), 'primary', 'submit', false, array('id' => 'submit-'.$provider_key) ); ?>
							
							<div class="eo-test-connection-wrapper" style="display: flex; gap: 10px; align-items: center;">
								<span class="eo-test-result"></span>
								<button type="button" class="button eo-test-connection-btn" data-provider="<?php echo esc_attr( $provider_key ); ?>"><?php esc_html_e( 'Tester la connexion', 'eo-blocks' ); ?></button>
							</div>
						</div>
					</div>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="eo-submit-wrapper">
			<?php submit_button( __( 'Enregistrer les modifications', 'eo-blocks' ), 'primary', 'submit', false); ?>
		</div>
	</form>
</div>
