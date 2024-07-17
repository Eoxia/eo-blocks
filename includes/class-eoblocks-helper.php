<?php
/**
 * Plugin Settings.
 *
 * @author Eoxia
 *
 * @since 1.0.0
 */

namespace EoBlocks\Includes;

if (!defined('ABSPATH')) {
	exit;
}

class Eoblocks_Helper {
	public static function digirisk_api_get( $route, $params ) {
		$eoblocks_settings = get_option('eoblocks_settings');
		$base_url_api = $eoblocks_settings['eoblocks_dolibarr_url'];
		$api_key = $eoblocks_settings['eoblocks_dolibarr_api_key'];

		if ( empty( $api_key) || empty( $base_url_api ) || empty( $route ) ) {
			return [];
		}

		$digirsk_url_api = $base_url_api . '/api/index.php/' . $route . '?DOLAPIKEY=' . $api_key;
		$digirsk_url_api =  str_replace(':/','://', trim(preg_replace('/\/+/', '/', $digirsk_url_api), '/'));

		$digirisk_request_api = wp_remote_get( $digirsk_url_api );

		if ( is_wp_error( $digirisk_request_api ) ) {
			return [];
		}

		if ( isset( $digirisk_request_api['response'] ) ) {
			if ( 401 == $digirisk_request_api['response']['code'] ) {
				return []; // Wrong API Key or Unauthorized
			}
			if ( 404 == $digirisk_request_api['response']['code'] ) {
				return []; // Wrong Dolibarr URL
			}
		}

		$body_api = wp_remote_retrieve_body( $digirisk_request_api );
		$data_api = json_decode( $body_api, true );

		if ( isset( $data_api['error'] ) ) {
			return [];
		}



		return $data_api;
	}
}
