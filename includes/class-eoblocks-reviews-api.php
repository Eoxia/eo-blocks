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
	 * Get Google Reviews data (Rating and Count).
	 *
	 * @param string $place_id Override default place ID.
	 * @return array|false array('rating' => float, 'count' => int) or false on failure.
	 */
	public static function get_google_data( $place_id = '' ) {
		$options = get_option('eoblocks_reviews_settings', array());
		if ( empty( $options['google_active'] ) ) {
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
		if ( empty( $options['trustpilot_active'] ) ) {
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
		if ( empty( $options['tripadvisor_active'] ) ) {
			return false;
		}

		// Return dummy data or false until API is fully implemented
		return array(
			'rating' => 4.0,
			'count'  => 300,
		);
	}
}
