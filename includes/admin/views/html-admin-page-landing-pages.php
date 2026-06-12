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
		'active'       => false,
		'title'        => __( 'Connexion', 'eo-blocks' ),
		'description' => __( 'Veuillez vous connecter pour accéder au site.', 'eo-blocks' ),
		'style'       => 'glassmorphism',
		'bg_color'    => '#0f172a',
		'text_color'  => '#f8fafc',
		'accent_color'=> '#06b6d4',
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
							<input type="color" id="eo-lp-form-bg-color" name="bg_color" style="height: 35px; width: 60px; padding: 0; cursor: pointer; border: 1px solid #ccd0d4;" />
							<input type="text" id="eo-lp-form-bg-color-text" class="small-text" style="height: 35px; width: 100px; margin-left: 10px; font-family: monospace; text-transform: uppercase;" />
						</div>
					</div>

					<div class="eo-lp-form-group">
						<label for="eo-lp-form-text-color"><?php esc_html_e( 'Couleur du texte', 'eo-blocks' ); ?></label>
						<div class="eo-lp-color-picker-wrapper">
							<input type="color" id="eo-lp-form-text-color" name="text_color" style="height: 35px; width: 60px; padding: 0; cursor: pointer; border: 1px solid #ccd0d4;" />
							<input type="text" id="eo-lp-form-text-color-text" class="small-text" style="height: 35px; width: 100px; margin-left: 10px; font-family: monospace; text-transform: uppercase;" />
						</div>
					</div>

					<div class="eo-lp-form-group">
						<label for="eo-lp-form-accent-color"><?php esc_html_e( 'Couleur d\'accentuation (Boutons / Détails)', 'eo-blocks' ); ?></label>
						<div class="eo-lp-color-picker-wrapper">
							<input type="color" id="eo-lp-form-accent-color" name="accent_color" style="height: 35px; width: 60px; padding: 0; cursor: pointer; border: 1px solid #ccd0d4;" />
							<input type="text" id="eo-lp-form-accent-color-text" class="small-text" style="height: 35px; width: 100px; margin-left: 10px; font-family: monospace; text-transform: uppercase;" />
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
