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
			'dashicons-location-alt',
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
		if ( 'toplevel_page_eo-blocks-maps' !== $hook ) {
			return;
		}

		wp_enqueue_media();

		// Enqueue Leaflet from CDN
		wp_enqueue_style( 'leaflet-css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', array(), '1.9.4' );
		wp_enqueue_script( 'leaflet-js', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', array(), '1.9.4', true );

		// Enqueue custom admin styles and script for maps
		if ( 'toplevel_page_eo-blocks-maps' === $hook ) {
			wp_enqueue_style( 'eo-blocks-maps-admin-css', EO_BLOCKS_URL . 'assets/css/maps-admin.css', array( 'leaflet-css' ), '1.0.0' );
			wp_enqueue_script( 'eo-blocks-maps-admin-js', EO_BLOCKS_URL . 'assets/js/maps-admin.js', array( 'jquery', 'leaflet-js' ), '1.0.0', true );

			wp_localize_script( 'eo-blocks-maps-admin-js', 'eoMapsAdmin', array(
				'ajaxUrl'     => admin_url( 'admin-ajax.php' ),
				'nonce'       => wp_create_nonce( 'eo_maps_admin_nonce' ),
				'mediaTitle'  => __('Sélectionner des images', 'eo-blocks'),
				'mediaButton' => __('Utiliser ces images', 'eo-blocks'),
			) );
		}

		if ( strpos( $hook, 'eo-blocks-reviews' ) !== false ) {
			wp_enqueue_style( 'eo-blocks-reviews-admin-css', EO_BLOCKS_URL . 'assets/css/reviews-admin.css', array(), '1.0.0' );
			wp_enqueue_script( 'eo-blocks-reviews-admin-js', EO_BLOCKS_URL . 'assets/js/reviews-admin.js', array('jquery'), '1.0.0', true );
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
