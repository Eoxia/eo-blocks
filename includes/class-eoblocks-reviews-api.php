<?php
/**
 * Helper for fetching reviews from APIs.
 *
 * @package eo-blocks
 */

namespace EoBlocks\Includes;

if (!defined('ABSPATH')) {
	exit;
}

class Eoblocks_Reviews_API {

	/**
	 * Initialize hooks
	 */
	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_rest_routes' ) );
		add_action( 'wp_ajax_eo_test_api_connection', array( __CLASS__, 'test_api_connection' ) );
	}

	/**
	 * Register REST API routes for Gutenberg editor
	 */
	public static function register_rest_routes() {
		register_rest_route( 'eo-blocks/v1', '/reviews-data', array(
			'methods'  => 'GET',
			'callback' => array( __CLASS__, 'get_all_reviews_data' ),
			'permission_callback' => function() {
				return current_user_can( 'edit_posts' );
			}
		) );
	}

	/**
	 * Get all reviews data for the REST API
	 */
	public static function get_all_reviews_data() {
		return rest_ensure_response( array(
			'google' => self::get_google_data(),
			'trustpilot' => self::get_trustpilot_data(),
			'tripadvisor' => self::get_tripadvisor_data(),
			'thefork' => self::get_thefork_data(),
		) );
	}

	/**
	 * AJAX endpoint to test connection directly with provided credentials
	 */
	public static function test_api_connection() {
		check_ajax_referer( 'eo_reviews_admin_nonce', 'security' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => 'Non autorisé.' ) );
		}

		$provider = isset( $_POST['provider'] ) ? sanitize_text_field( wp_unslash( $_POST['provider'] ) ) : '';

		if ( 'google' === $provider ) {
			$api_key = isset( $_POST['api_key'] ) ? sanitize_text_field( wp_unslash( $_POST['api_key'] ) ) : '';
			$place_id = isset( $_POST['place_id'] ) ? sanitize_text_field( wp_unslash( $_POST['place_id'] ) ) : '';
			
			if ( empty( $api_key ) || empty( $place_id ) ) {
				wp_send_json_error( array( 'message' => 'Clé API ou Place ID manquant.' ) );
			}

			$url = add_query_arg( array(
				'place_id' => $place_id,
				'fields'   => 'rating,user_ratings_total',
				'key'      => $api_key,
			), 'https://maps.googleapis.com/maps/api/place/details/json' );

			$response = wp_remote_get( $url );

			if ( is_wp_error( $response ) ) {
				wp_send_json_error( array( 'message' => 'Erreur réseau lors de la requête.' ) );
			}

			$body = wp_remote_retrieve_body( $response );
			$data = json_decode( $body, true );

			if ( isset( $data['status'] ) ) {
				if ( $data['status'] === 'OK' && isset( $data['result'] ) ) {
					$result = array(
						'rating' => isset( $data['result']['rating'] ) ? (float) $data['result']['rating'] : 0,
						'count'  => isset( $data['result']['user_ratings_total'] ) ? (int) $data['result']['user_ratings_total'] : 0,
					);
					wp_send_json_success( $result );
				} else {
					$err_msg = isset( $data['error_message'] ) ? $data['error_message'] : $data['status'];
					wp_send_json_error( array( 'message' => 'Erreur API: ' . $err_msg ) );
				}
			}
			wp_send_json_error( array( 'message' => 'Réponse inattendue de l\'API.' ) );
		}

		// Fallback/Mock for other providers
		if ( in_array( $provider, array( 'trustpilot', 'tripadvisor', 'thefork' ) ) ) {
			wp_send_json_error( array( 'message' => 'L\'API de ce prestataire n\'est pas encore complètement implémentée en backend.' ) );
		}

		wp_send_json_error( array( 'message' => 'Prestataire inconnu.' ) );
	}

	/**
	 * Get Google Reviews data (Rating and Count).
	 *
	 * @param string $place_id Override default place ID.
	 * @return array|false array('rating' => float, 'count' => int) or false on failure.
	 */
	public static function get_google_data( $place_id = '' ) {
		$options = get_option('eoblocks_reviews_settings', array());
		if ( empty( $options['google_active'] ) || empty( $options['google_auto_sync'] ) ) {
			return false;
		}

		$api_key = isset( $options['google_api_key'] ) ? $options['google_api_key'] : '';
		if ( empty( $place_id ) ) {
			$place_id = isset( $options['google_place_id'] ) ? $options['google_place_id'] : '';
		}

		if ( empty( $api_key ) || empty( $place_id ) ) {
			return false;
		}

		$transient_key = 'eoblocks_google_reviews_' . md5( $place_id );
		$cached = get_transient( $transient_key );

		if ( false !== $cached ) {
			$cached['url'] = isset( $options['google_url'] ) ? $options['google_url'] : '';
			$cached['review_url'] = isset( $options['google_review_url'] ) ? $options['google_review_url'] : '';
			return $cached;
		}

		$url = add_query_arg( array(
			'place_id' => $place_id,
			'fields'   => 'rating,user_ratings_total',
			'key'      => $api_key,
		), 'https://maps.googleapis.com/maps/api/place/details/json' );

		$response = wp_remote_get( $url );

		if ( is_wp_error( $response ) ) {
			return false;
		}

		$body = wp_remote_retrieve_body( $response );
		$data = json_decode( $body, true );

		if ( isset( $data['status'] ) && $data['status'] === 'OK' && isset( $data['result'] ) ) {
			$result = array(
				'rating' => isset( $data['result']['rating'] ) ? (float) $data['result']['rating'] : 0,
				'count'  => isset( $data['result']['user_ratings_total'] ) ? (int) $data['result']['user_ratings_total'] : 0,
			);
			set_transient( $transient_key, $result, DAY_IN_SECONDS );
			
			$result['url'] = isset( $options['google_url'] ) ? $options['google_url'] : '';
			$result['review_url'] = isset( $options['google_review_url'] ) ? $options['google_review_url'] : '';
			return $result;
		}

		return false;
	}

	/**
	 * Get Trustpilot Reviews data.
	 *
	 * @param string $business_unit_id Override default BU ID.
	 * @return array|false
	 */
	public static function get_trustpilot_data( $business_unit_id = '' ) {
		// Scaffold for Trustpilot API
		$options = get_option('eoblocks_reviews_settings', array());
		if ( empty( $options['trustpilot_active'] ) || empty( $options['trustpilot_auto_sync'] ) ) {
			return false;
		}
		
		// Return dummy data or false until API is fully implemented
		return array(
			'rating' => 4.5,
			'count'  => 120,
		);
	}

	/**
	 * Get TripAdvisor Reviews data.
	 *
	 * @param string $location_id Override default location ID.
	 * @return array|false
	 */
	public static function get_tripadvisor_data( $location_id = '' ) {
		// Scaffold for TripAdvisor API
		$options = get_option('eoblocks_reviews_settings', array());
		if ( empty( $options['tripadvisor_active'] ) || empty( $options['tripadvisor_auto_sync'] ) ) {
			return false;
		}

		// Return dummy data or false until API is fully implemented
		return array(
			'rating' => 4.0,
			'count'  => 300,
		);
	}

	/**
	 * Get TheFork Reviews data.
	 *
	 * @param string $restaurant_id Override default restaurant ID.
	 * @return array|false
	 */
	public static function get_thefork_data( $restaurant_id = '' ) {
		// Scaffold for TheFork API
		$options = get_option('eoblocks_reviews_settings', array());
		if ( empty( $options['thefork_active'] ) || empty( $options['thefork_auto_sync'] ) ) {
			return false;
		}

		// Return dummy data or false until API is fully implemented
		return array(
			'rating' => 4.8,
			'count'  => 450,
		);
	}
}
