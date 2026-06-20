<?php
/**
 * Admin settings menu.
 *
 * @package Views
 * @author Eoxia
 *
 * @since 1.0.0
 */

namespace EoBlocks\Includes\Admin;

if (!defined('ABSPATH')) {
	exit;
}

class Eoblocks_Menu {

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
	}

	public function add_admin_menu() {
		// Parent top-level menu
		add_menu_page(
			__('EO Blocks', 'eo-blocks'),
			__('EO Blocks', 'eo-blocks'),
			'manage_options',
			'eo-blocks-maps',
			[ $this, 'maps_page_view' ],
			EO_BLOCKS_URL . 'assets/images/eoblocks-favicon-16x16.png',
			80
		);

		// Submenu pointing to Maps manager (default)
		add_submenu_page(
			'eo-blocks-maps',
			__('Cartes', 'eo-blocks'),
			__('Cartes', 'eo-blocks'),
			'manage_options',
			'eo-blocks-maps',
			[ $this, 'maps_page_view' ]
		);

		// Submenu pointing to general settings
		add_submenu_page(
			'eo-blocks-maps',
			__('Réglages', 'eo-blocks'),
			__('Réglages', 'eo-blocks'),
			'manage_options',
			'eo-blocks-settings',
			[ $this, 'settings_page_view' ]
		);

		// Submenu pointing to Reviews manager
		add_submenu_page(
			'eo-blocks-maps',
			__('Avis Clients', 'eo-blocks'),
			__('Avis Clients', 'eo-blocks'),
			'manage_options',
			'eo-blocks-reviews',
			[ $this, 'reviews_page_view' ]
		);

		// Hidden page for migration
		add_submenu_page(
			null,
			__('EO Blocks - Migration', 'eo-blocks'),
			__('EO Blocks - Migration', 'eo-blocks'),
			'manage_options',
			'eo-blocks-migration',
			[ $this, 'migration_page_view' ]
		);
	}

	public function enqueue_admin_assets( $hook ) {
		// Enqueue custom admin styles and script for maps
		if ( 'toplevel_page_eo-blocks-maps' === $hook ) {
			wp_enqueue_media();

			// Enqueue Leaflet from CDN
			wp_enqueue_style( 'leaflet-css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', array(), '1.9.4' );
			wp_enqueue_script( 'leaflet-js', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', array(), '1.9.4', true );

			wp_enqueue_style( 'eo-blocks-maps-admin-css', EO_BLOCKS_URL . 'assets/css/maps-admin.css', array( 'leaflet-css' ), '1.0.0' );
			wp_enqueue_script( 'eo-blocks-maps-admin-js', EO_BLOCKS_URL . 'assets/js/maps-admin.js', array( 'jquery', 'leaflet-js' ), '1.0.0', true );

			wp_localize_script( 'eo-blocks-maps-admin-js', 'eoMapsAdmin', array(
				'ajaxUrl'     => admin_url( 'admin-ajax.php' ),
				'nonce'       => wp_create_nonce( 'eo_maps_admin_nonce' ),
				'mediaTitle'  => __('Sélectionner des images', 'eo-blocks'),
				'mediaButton' => __('Utiliser ces images', 'eo-blocks'),
			) );
		}

		if ( isset( $_GET['page'] ) && $_GET['page'] === 'eo-blocks-reviews' ) {
			wp_enqueue_style( 'eo-blocks-reviews-admin-css', EO_BLOCKS_URL . 'assets/css/reviews-admin.css', array(), '1.0.0' );
			wp_enqueue_script( 'eo-blocks-reviews-admin-js', EO_BLOCKS_URL . 'assets/js/reviews-admin.js', array('jquery'), '1.0.0', true );
			
			wp_localize_script( 'eo-blocks-reviews-admin-js', 'eoReviewsAdmin', array(
				'nonce' => wp_create_nonce( 'eo_reviews_admin_nonce' ),
				'i18n'  => array(
					'apiErrorPrefix'   => __( 'Erreur API Google :', 'eo-blocks' ),
					'apiNotEnabled'    => __( 'L\'API Google My Business n\'est pas activée sur votre projet Google Cloud.', 'eo-blocks' ),
					'quotaExceeded'    => __( 'Le quota de requêtes vers l\'API Google a été dépassé. Veuillez patienter un peu avant de réessayer.', 'eo-blocks' ),
					'apiCheckReminder' => __( 'Avez-vous bien activé <strong>My Business Business Information API</strong> et <strong>My Business Account Management API</strong> dans Google Cloud ?', 'eo-blocks' ),
					'serverError'      => __( 'Erreur serveur lors du chargement des établissements.', 'eo-blocks' ),
					'unknownError'     => __( 'Erreur inconnue', 'eo-blocks' ),
					'active'           => __( 'ACTIF', 'eo-blocks' ),
					'inactive'         => __( 'INACTIF', 'eo-blocks' ),
					'testInProgress'   => __( 'Test en cours...', 'eo-blocks' ),
					'testConnection'   => __( 'Tester la connexion', 'eo-blocks' ),
					'connected'        => __( 'Connecté !', 'eo-blocks' ),
					'reviewsLabel'     => __( 'Avis', 'eo-blocks' ),
					'ratingLabel'      => __( 'Note', 'eo-blocks' ),
					'connectionError'  => __( 'Erreur de connexion.', 'eo-blocks' ),
					'serverErrorTest'  => __( 'Erreur serveur.', 'eo-blocks' ),
					'loading'          => __( 'Chargement...', 'eo-blocks' ),
					'refreshList'      => __( 'Rafraîchir la liste', 'eo-blocks' ),
					'noLocationFound'  => __( 'Aucun établissement trouvé', 'eo-blocks' ),
					'selectLocation'   => __( '-- Sélectionnez un établissement --', 'eo-blocks' ),
					'disconnecting'    => __( 'Déconnexion...', 'eo-blocks' ),
					'disconnectAccount'=> __( 'Déconnecter le compte', 'eo-blocks' ),
					'confirmDisconnect'=> __( 'Voulez-vous vraiment déconnecter le compte Google ?', 'eo-blocks' ),
					'disconnectError'  => __( 'Erreur lors de la déconnexion.', 'eo-blocks' ),
					'disconnectServer' => __( 'Erreur serveur lors de la déconnexion.', 'eo-blocks' ),
					'saveCredentialsAlert' => __( "⚠️ Attention !\n\nVous devez d'abord coller votre Client ID et votre Client Secret, puis descendre tout en bas de la page pour cliquer sur le bouton bleu 'Enregistrer les modifications'.\n\nUne fois la page rechargée, vous pourrez cliquer ici pour vous connecter !", 'eo-blocks' ),
				)
			) );
		}
	}

	public function maps_page_view() {
		include EO_BLOCKS_PATH . '/includes/admin/views/html-admin-page-maps.php';
	}

	public function settings_page_view() {
		include EO_BLOCKS_PATH . '/includes/admin/views/html-admin-page-settings.php';
	}

	public function migration_page_view() {
		include EO_BLOCKS_PATH . '/includes/admin/views/html-admin-page-migration.php';
	}

	public function reviews_page_view() {
		include EO_BLOCKS_PATH . '/includes/admin/views/html-admin-page-reviews.php';
	}
}
