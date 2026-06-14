<?php
/**
 * Landing Pages management admin view.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$settings = get_option( 'eo_landing_pages_settings', array() );

$defaults = array(
	'coming_soon' => array(
		'active'       => false,
		'title'        => __( 'Bientôt disponible', 'eo-blocks' ),
		'description' => __( 'Notre nouveau site est en cours de création. Restez à l\'écoute !', 'eo-blocks' ),
		'style'       => 'minimalist',
		'bg_color'    => '#0f172a',
		'text_color'  => '#f8fafc',
		'accent_color'=> '#f59e0b',
	),
	'maintenance' => array(
		'active'       => false,
		'title'        => __( 'Site en maintenance', 'eo-blocks' ),
		'description' => __( 'Nous effectuons actuellement des opérations de maintenance. Nous serons de retour très rapidement.', 'eo-blocks' ),
		'style'       => 'gradient',
		'bg_color'    => '#1e1b4b',
		'text_color'  => '#f8fafc',
		'accent_color'=> '#6366f1',
	),
	'login' => array(
		'active'                 => false,
		'title'                  => __( 'Connexion', 'eo-blocks' ),
		'description'            => __( 'Veuillez vous connecter pour accéder au site.', 'eo-blocks' ),
		'style'                  => 'glassmorphism',
		'bg_color'               => '#0f172a',
		'text_color'             => '#f8fafc',
		'accent_color'           => '#06b6d4',
		'email_filtering_active' => false,
		'email_rules'            => '',
		'ip_rules'               => array(),
		'log_limit'              => 1000,
	),
	'404' => array(
		'active'       => false,
		'title'        => __( 'Page non trouvée', 'eo-blocks' ),
		'description' => __( 'Désolé, la page que vous recherchez n\'existe pas ou a été déplacée.', 'eo-blocks' ),
		'style'       => 'minimalist',
		'bg_color'    => '#0f172a',
		'text_color'  => '#f8fafc',
		'accent_color'=> '#3b82f6',
	),
);

$coming_soon = isset( $settings['coming_soon'] ) ? array_merge( $defaults['coming_soon'], $settings['coming_soon'] ) : $defaults['coming_soon'];
$maintenance = isset( $settings['maintenance'] ) ? array_merge( $defaults['maintenance'], $settings['maintenance'] ) : $defaults['maintenance'];
$login       = isset( $settings['login'] ) ? array_merge( $defaults['login'], $settings['login'] ) : $defaults['login'];
$status_404  = isset( $settings['404'] ) ? array_merge( $defaults['404'], $settings['404'] ) : $defaults['404'];

$pages_data = array(
	'coming_soon' => array(
		'title'       => __( 'Mode Prochainement', 'eo-blocks' ),
		'desc'        => __( 'La page Prochainement sera accessible aux visiteurs à la place du site en cours de construction.', 'eo-blocks' ),
		'icon'        => 'dashicons-clock',
		'config'      => $coming_soon,
		'color_class' => 'eo-status-coming-soon',
	),
	'maintenance' => array(
		'title'       => __( 'Mode Maintenance', 'eo-blocks' ),
		'desc'        => __( 'La page de Maintenance informera les visiteurs et les moteurs de recherche que le site est temporairement indisponible.', 'eo-blocks' ),
		'icon'        => 'dashicons-admin-tools',
		'config'      => $maintenance,
		'color_class' => 'eo-status-maintenance',
	),
	'login' => array(
		'title'       => __( 'Page de connexion', 'eo-blocks' ),
		'desc'        => __( 'Remplacez la page de connexion par défaut (wp-login.php) par un écran de connexion moderne et personnalisé.', 'eo-blocks' ),
		'icon'        => 'dashicons-lock',
		'config'      => $login,
		'color_class' => 'eo-status-login',
	),
	'404' => array(
		'title'       => __( 'Page 404', 'eo-blocks' ),
		'desc'        => __( 'Personnalisez la page d\'erreur 404 (Page non trouvée) affichée lorsque les visiteurs tentent d\'accéder à une URL brisée.', 'eo-blocks' ),
		'icon'        => 'dashicons-warning',
		'config'      => $status_404,
		'color_class' => 'eo-status-404',
	),
);
?>

<div class="wrap eo-landing-pages-admin-wrapper">
	<h1 class="wp-heading-inline"><?php esc_html_e( 'EO Blocks - Pages d\'atterrissage', 'eo-blocks' ); ?></h1>
	<p class="description" style="margin: 8px 0 20px 0; font-size: 14px;">
		<?php esc_html_e( 'Contrôlez ce que voient vos visiteurs lorsque votre site est en construction, en maintenance, ou lorsqu\'ils rencontrent des erreurs.', 'eo-blocks' ); ?>
	</p>
	<hr class="wp-header-end">

	<!-- Grille des modes de pages -->
	<div class="eo-lp-grid">
		<?php foreach ( $pages_data as $key => $page ) : ?>
			<?php 
				$is_active = !empty( $page['config']['active'] ); 
				$preview_url = add_query_arg( 'eo_preview_landing_page', $key, home_url() );
			?>
			<div class="eo-lp-card <?php echo esc_attr( $page['color_class'] ); ?> <?php echo $is_active ? 'active' : ''; ?>" data-type="<?php echo esc_attr( $key ); ?>">
				<div class="eo-lp-card-header">
					<span class="dashicons <?php echo esc_attr( $page['icon'] ); ?> eo-lp-card-icon"></span>
					<div class="eo-lp-toggle-wrapper">
						<label class="eo-lp-switch">
							<input type="checkbox" class="eo-lp-toggle-checkbox" <?php checked( $is_active ); ?> />
							<span class="eo-lp-slider"></span>
						</label>
						<span class="eo-lp-toggle-label <?php echo $is_active ? 'active' : ''; ?>">
							<?php echo $is_active ? esc_html__( 'ACTIF', 'eo-blocks' ) : esc_html__( 'INACTIF', 'eo-blocks' ); ?>
						</span>
					</div>
				</div>
				<div class="eo-lp-card-body">
					<h3 class="eo-lp-card-title"><?php echo esc_html( $page['title'] ); ?></h3>
					<p class="eo-lp-card-desc"><?php echo esc_html( $page['desc'] ); ?></p>
					<?php if ( 'login' === $key ) : ?>
						<div class="eo-lp-card-sub-toggle" style="margin-top: 15px; display: flex; align-items: center; gap: 8px; padding-top: 10px; border-top: 1px dashed #e2e8f0;">
							<label class="eo-lp-switch" style="width: 34px; height: 18px;">
								<input type="checkbox" class="eo-lp-email-filter-toggle" <?php checked( !empty( $page['config']['email_filtering_active'] ) ); ?> style="width:0; height:0; opacity:0;" />
								<span class="eo-lp-slider" style="border-radius: 18px;"></span>
							</label>
							<span style="font-size: 11px; font-weight: 600; color: #64748b;">
								<?php esc_html_e( 'Filtrage e-mails', 'eo-blocks' ); ?>
							</span>
						</div>
					<?php endif; ?>
				</div>
				<div class="eo-lp-card-footer">
					<button type="button" class="button button-primary eo-lp-edit-btn" data-type="<?php echo esc_attr( $key ); ?>">
						<?php esc_html_e( 'Modifier la page', 'eo-blocks' ); ?>
					</button>
					<a href="<?php echo esc_url( $preview_url ); ?>" target="_blank" class="button button-secondary eo-lp-preview-btn">
						<?php esc_html_e( 'Prévisualisation', 'eo-blocks' ); ?>
					</a>
				</div>
			</div>
		<?php endforeach; ?>
	</div>

	<!-- Panneau d'édition des pages -->
	<div class="eo-lp-editor-panel" style="display: none;">
		<div class="eo-lp-editor-header">
			<h2 class="eo-lp-editor-title">
				<span class="dashicons eo-lp-editor-icon"></span>
				<span class="eo-lp-editor-title-text"><?php esc_html_e( 'Configuration', 'eo-blocks' ); ?></span>
			</h2>
			<button type="button" class="eo-lp-editor-close-btn">&times;</button>
		</div>
		
		<form id="eo-lp-editor-form" method="post">
			<input type="hidden" name="type" id="eo-lp-form-type" value="" />
			
			<div class="eo-lp-editor-grid">
				<!-- Colonne de gauche : contenu -->
				<div class="eo-lp-editor-col-left">
					<div class="eo-lp-form-group">
						<label for="eo-lp-form-title"><?php esc_html_e( 'Titre principal', 'eo-blocks' ); ?></label>
						<input type="text" id="eo-lp-form-title" name="title" class="regular-text" style="width: 100%;" required />
						<p class="description"><?php esc_html_e( 'S\'affiche comme titre majeur sur la page.', 'eo-blocks' ); ?></p>
					</div>

					<div class="eo-lp-form-group">
						<label for="eo-lp-form-description"><?php esc_html_e( 'Texte / Description', 'eo-blocks' ); ?></label>
						<textarea id="eo-lp-form-description" name="description" rows="6" style="width: 100%; font-family: sans-serif;" required></textarea>
						<p class="description"><?php esc_html_e( 'Description ou informations affichées sous le titre (accepte le code HTML basique).', 'eo-blocks' ); ?></p>
					</div>
					
					<div class="eo-lp-form-group eo-lp-form-login-hint" style="display: none; background: #e0f2fe; color: #0369a1; padding: 12px; border-radius: 6px; border-left: 4px solid #0284c7;">
						<span class="dashicons dashicons-info" style="vertical-align: middle; margin-right: 4px;"></span>
						<?php esc_html_e( 'Le formulaire de connexion standard WordPress sécurisé sera automatiquement intégré en dessous du texte.', 'eo-blocks' ); ?>
					</div>

					<div class="eo-lp-form-group eo-lp-form-404-hint" style="display: none; background: #fee2e2; color: #b91c1c; padding: 12px; border-radius: 6px; border-left: 4px solid #ef4444;">
						<span class="dashicons dashicons-info" style="vertical-align: middle; margin-right: 4px;"></span>
						<?php esc_html_e( 'Un bouton "Retour à l\'accueil" redirigeant vers le site sera automatiquement affiché en dessous du texte.', 'eo-blocks' ); ?>
					</div>

					<div id="eo-lp-login-security-section" style="display: none; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
						<h3 style="margin-top: 0; font-size: 16px; color: #1e293b; display: flex; align-items: center; gap: 8px;">
							<span class="dashicons dashicons-shield"></span>
							<?php esc_html_e( 'Sécurité & Filtrage des Connexions', 'eo-blocks' ); ?>
						</h3>
						
						<!-- Filtrage E-mails -->
						<div class="eo-lp-security-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
							<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
								<span style="font-weight: 600; font-size: 13px; color: #334155;">
									<?php esc_html_e( 'Activer le filtrage par adresse e-mail', 'eo-blocks' ); ?>
								</span>
								<label class="eo-lp-switch">
									<input type="checkbox" id="eo-lp-email-filtering-active" name="email_filtering_active" value="1" />
									<span class="eo-lp-slider"></span>
								</label>
							</div>
							<div class="eo-lp-form-group eo-lp-email-rules-group" style="display: none;">
								<label for="eo-lp-email-rules"><?php esc_html_e( 'Adresses e-mail ou domaines autorisés', 'eo-blocks' ); ?></label>
								<textarea id="eo-lp-email-rules" name="email_rules" rows="3" style="width: 100%; font-family: monospace;" placeholder="@eoxia.com, admin@monsite.fr, @lenomdomaine"></textarea>
								<p class="description">
									<?php esc_html_e( 'Séparez les entrées par des virgules. Exemple : "@eoxia.com" ou "@eoxia" (autorise n\'importe quel TLD comme .com, .fr, .net).', 'eo-blocks' ); ?>
								</p>

								<div class="eo-lp-email-test-wrapper" style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #e2e8f0; display: flex; align-items: center; gap: 10px;">
									<span style="font-size: 12px; font-weight: 600; color: #475569; min-width: 120px;">
										<?php esc_html_e( 'Tester une adresse :', 'eo-blocks' ); ?>
									</span>
									<div style="position: relative; flex: 1; display: flex; align-items: center; gap: 10px;">
										<input type="text" id="eo-lp-email-test-input" placeholder="ex: user@eoxia.com" style="flex: 1; height: 32px; font-size: 12px;" />
										<span id="eo-lp-email-test-result" style="font-size: 11px; font-weight: bold; border-radius: 4px; padding: 4px 10px; display: none;"></span>
									</div>
								</div>
							</div>
						</div>

						<!-- Filtrage IP -->
						<div class="eo-lp-security-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
							<h4 style="margin-top: 0; margin-bottom: 12px; font-size: 13px; font-weight: 600; color: #334155;">
								<?php esc_html_e( 'Contrôle d\'accès par adresses IP / CIDR', 'eo-blocks' ); ?>
							</h4>
							<p class="description" style="margin-bottom: 12px;">
								<?php esc_html_e( 'Définissez des règles d\'autorisation ou de blocage d\'adresses IP. Si des règles d\'autorisation existent, seules ces IP pourront se connecter.', 'eo-blocks' ); ?>
							</p>
							
							<div class="eo-lp-ip-rules-container">
								<table class="wp-list-table widefat fixed striped eo-lp-ip-rules-table" style="margin-bottom: 12px; border-radius: 6px; overflow: hidden; border: 1px solid #cbd5e1;">
									<thead>
										<tr>
											<th style="width: 50%; font-weight: 600; padding: 8px 10px;"><?php esc_html_e( 'Adresse IP / CIDR', 'eo-blocks' ); ?></th>
											<th style="width: 30%; font-weight: 600; padding: 8px 10px;"><?php esc_html_e( 'Action', 'eo-blocks' ); ?></th>
											<th style="width: 20%; text-align: right; font-weight: 600; padding: 8px 10px;"><?php esc_html_e( 'Actions', 'eo-blocks' ); ?></th>
										</tr>
									</thead>
									<tbody id="eo-lp-ip-rules-tbody">
										<!-- IP rules will be loaded dynamically here -->
									</tbody>
								</table>
								
								<div class="eo-lp-ip-add-controls" style="display: flex; gap: 10px; align-items: flex-end;">
									<div style="flex: 2; display: flex; flex-direction: column;">
										<label for="eo-lp-new-ip-val" style="font-size: 11px; font-weight: 600; margin-bottom: 4px;"><?php esc_html_e( 'IP ou CIDR (ex: 192.168.1.0/24)', 'eo-blocks' ); ?></label>
										<input type="text" id="eo-lp-new-ip-val" placeholder="192.168.1.1" style="height: 32px; font-size: 12px;" />
									</div>
									<div style="flex: 1.5; display: flex; flex-direction: column;">
										<label for="eo-lp-new-ip-action" style="font-size: 11px; font-weight: 600; margin-bottom: 4px;"><?php esc_html_e( 'Règle', 'eo-blocks' ); ?></label>
										<select id="eo-lp-new-ip-action" style="height: 32px; font-size: 12px; padding: 0 6px;">
											<option value="allow"><?php esc_html_e( 'Autoriser (Allow)', 'eo-blocks' ); ?></option>
											<option value="block"><?php esc_html_e( 'Bloquer (Block)', 'eo-blocks' ); ?></option>
										</select>
									</div>
									<button type="button" id="eo-lp-add-ip-rule-btn" class="button button-secondary" style="height: 32px; line-height: 30px;">
										<?php esc_html_e( 'Ajouter', 'eo-blocks' ); ?>
									</button>
								</div>
								
								<input type="hidden" id="eo-lp-ip-rules-hidden" name="ip_rules" value="[]" />
							</div>
						</div>

						<!-- Limite des logs -->
						<div class="eo-lp-security-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
							<div style="display: flex; align-items: center; justify-content: space-between;">
								<span style="font-weight: 600; font-size: 13px; color: #334155;">
									<?php esc_html_e( 'Seuil de purge automatique des logs', 'eo-blocks' ); ?>
								</span>
								<input type="number" id="eo-lp-log-limit" name="log_limit" min="1" max="100000" style="width: 100px; height: 32px;" value="1000" />
							</div>
							<p class="description" style="margin-top: 8px; margin-bottom: 0;">
								<?php esc_html_e( 'Nombre maximum de tentatives de connexions à conserver dans le journal (par défaut 1000).', 'eo-blocks' ); ?>
							</p>
						</div>

						<!-- Journal de connexion -->
						<div class="eo-lp-security-box" style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px;">
							<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
								<h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #1e293b;">
									<?php esc_html_e( 'Journal des tentatives de connexion', 'eo-blocks' ); ?>
								</h4>
								<button type="button" id="eo-lp-clear-logs-btn" class="button button-link-delete" style="color: #d63638; text-decoration: none;">
									<span class="dashicons dashicons-trash" style="vertical-align: middle; font-size: 16px;"></span>
									<?php esc_html_e( 'Vider le journal', 'eo-blocks' ); ?>
								</button>
							</div>
							
							<div class="eo-lp-logs-table-wrapper" style="max-height: 300px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 6px;">
								<table class="wp-list-table widefat fixed striped eo-lp-logs-table" style="border: none;">
									<thead>
										<tr>
											<th style="font-weight: 600; font-size: 11px; padding: 8px;"><?php esc_html_e( 'Date', 'eo-blocks' ); ?></th>
											<th style="font-weight: 600; font-size: 11px; padding: 8px;"><?php esc_html_e( 'IP', 'eo-blocks' ); ?></th>
											<th style="font-weight: 600; font-size: 11px; padding: 8px;"><?php esc_html_e( 'Identifiant', 'eo-blocks' ); ?></th>
											<th style="font-weight: 600; font-size: 11px; padding: 8px;"><?php esc_html_e( 'Statut', 'eo-blocks' ); ?></th>
											<th style="font-weight: 600; font-size: 11px; padding: 8px;"><?php esc_html_e( 'Navigateur', 'eo-blocks' ); ?></th>
										</tr>
									</thead>
									<tbody id="eo-lp-logs-tbody">
										<tr>
											<td colspan="5" style="text-align: center; padding: 20px; color: #64748b;">
												<?php esc_html_e( 'Chargement des données...', 'eo-blocks' ); ?>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>

				<!-- Colonne de droite : Design & Style -->
				<div class="eo-lp-editor-col-right">
					<div class="eo-lp-form-group">
						<label for="eo-lp-form-style"><?php esc_html_e( 'Style esthétique', 'eo-blocks' ); ?></label>
						<select id="eo-lp-form-style" name="style" style="width: 100%; height: 35px;">
							<option value="minimalist"><?php esc_html_e( 'Minimaliste Moderne', 'eo-blocks' ); ?></option>
							<option value="gradient"><?php esc_html_e( 'Dégradé Premium', 'eo-blocks' ); ?></option>
							<option value="glassmorphism"><?php esc_html_e( 'Effet Verre (Glassmorphism)', 'eo-blocks' ); ?></option>
						</select>
					</div>

					<div class="eo-lp-form-group">
						<label for="eo-lp-form-bg-color"><?php esc_html_e( 'Couleur d\'arrière-plan', 'eo-blocks' ); ?></label>
						<div class="eo-lp-color-picker-wrapper">
							<input type="color" id="eo-lp-form-bg-color" name="bg_color" />
							<input type="text" id="eo-lp-form-bg-color-text" class="small-text" />
						</div>
					</div>

					<div class="eo-lp-form-group">
						<label for="eo-lp-form-text-color"><?php esc_html_e( 'Couleur du texte', 'eo-blocks' ); ?></label>
						<div class="eo-lp-color-picker-wrapper">
							<input type="color" id="eo-lp-form-text-color" name="text_color" />
							<input type="text" id="eo-lp-form-text-color-text" class="small-text" />
						</div>
					</div>

					<div class="eo-lp-form-group">
						<label for="eo-lp-form-accent-color"><?php esc_html_e( 'Couleur d\'accentuation (Boutons / Détails)', 'eo-blocks' ); ?></label>
						<div class="eo-lp-color-picker-wrapper">
							<input type="color" id="eo-lp-form-accent-color" name="accent_color" />
							<input type="text" id="eo-lp-form-accent-color-text" class="small-text" />
						</div>
					</div>
				</div>
			</div>

			<!-- Pied de formulaire -->
			<div class="eo-lp-editor-footer">
				<div class="eo-lp-editor-status-text"></div>
				<button type="submit" id="eo-lp-save-btn" class="button button-primary button-large">
					<?php esc_html_e( 'Enregistrer les paramètres', 'eo-blocks' ); ?>
				</button>
				<button type="button" class="button button-secondary button-large eo-lp-form-preview-btn" target="_blank">
					<?php esc_html_e( 'Prévisualiser', 'eo-blocks' ); ?>
				</button>
			</div>
		</form>
	</div>
</div>

<script type="text/javascript">
	// Local data configuration passed to JS
	window.eoLandingPagesConfig = <?php echo json_encode( array(
		'coming_soon' => $coming_soon,
		'maintenance' => $maintenance,
		'login'       => $login,
		'404'         => $status_404,
		'homeUrl'     => home_url(),
	) ); ?>;
</script>
