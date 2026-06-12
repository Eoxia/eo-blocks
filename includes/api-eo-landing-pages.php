<?php
/**
 * AJAX endpoints for managing landing pages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_action( 'wp_ajax_eo_save_landing_page_settings', 'eo_landing_pages_ajax_save_settings' );

function eo_landing_pages_ajax_save_settings() {
	check_ajax_referer( 'eo_landing_pages_admin_nonce', 'nonce' );

	if ( ! current_user_can( 'manage_options' ) ) {
		wp_send_json_error( array( 'message' => __( 'Vous n\'avez pas la permission de faire cela.', 'eo-blocks' ) ), 403 );
	}

	$type = isset( $_POST['type'] ) ? sanitize_text_field( $_POST['type'] ) : '';
	if ( ! in_array( $type, array( 'coming_soon', 'maintenance', 'login', '404' ) ) ) {
		wp_send_json_error( array( 'message' => __( 'Type de page invalide.', 'eo-blocks' ) ) );
	}

	$settings = get_option( 'eo_landing_pages_settings', array() );

	// Toggling active state only (fast toggle from list)
	if ( isset( $_POST['active_toggle'] ) ) {
		$active = !empty( $_POST['active'] ) && ( $_POST['active'] === 'true' || $_POST['active'] === '1' );
		
		// If turning Coming Soon or Maintenance to ON, make sure the other is turned OFF
		if ( $active ) {
			if ( 'coming_soon' === $type ) {
				$settings['maintenance']['active'] = false;
			} elseif ( 'maintenance' === $type ) {
				$settings['coming_soon']['active'] = false;
			}
		}

		$settings[$type]['active'] = $active;

		update_option( 'eo_landing_pages_settings', $settings );
		wp_send_json_success( array(
			'message'  => __( 'État mis à jour avec succès.', 'eo-blocks' ),
			'settings' => $settings,
		) );
	}

	// Full details save
	$title        = isset( $_POST['title'] ) ? sanitize_text_field( wp_unslash( $_POST['title'] ) ) : '';
	$description  = isset( $_POST['description'] ) ? wp_kses_post( wp_unslash( $_POST['description'] ) ) : '';
	$style        = isset( $_POST['style'] ) ? sanitize_text_field( $_POST['style'] ) : 'minimalist';
	$bg_color     = isset( $_POST['bg_color'] ) ? sanitize_hex_color( $_POST['bg_color'] ) : '';
	$text_color   = isset( $_POST['text_color'] ) ? sanitize_hex_color( $_POST['text_color'] ) : '';
	$accent_color = isset( $_POST['accent_color'] ) ? sanitize_hex_color( $_POST['accent_color'] ) : '';
	$active       = isset( $_POST['active'] ) && ( $_POST['active'] === 'true' || $_POST['active'] === '1' );

	if ( $active ) {
		if ( 'coming_soon' === $type ) {
			$settings['maintenance']['active'] = false;
		} elseif ( 'maintenance' === $type ) {
			$settings['coming_soon']['active'] = false;
		}
	}

	$settings[$type] = array(
		'active'       => $active,
		'title'        => $title,
		'description'  => $description,
		'style'        => $style,
		'bg_color'     => $bg_color,
		'text_color'   => $text_color,
		'accent_color' => $accent_color,
	);

	update_option( 'eo_landing_pages_settings', $settings );

	wp_send_json_success( array(
		'message'  => __( 'Paramètres enregistrés avec succès.', 'eo-blocks' ),
		'settings' => $settings,
	) );
}
