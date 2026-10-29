<?php
namespace EoBlocks\Includes;

if (!defined('ABSPATH')) {
	exit;
}

class Eoblocks_Google_OAuth {

	const OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
	const TOKEN_URL = 'https://oauth2.googleapis.com/token';
	const SCOPE = 'https://www.googleapis.com/auth/business.manage';

	public function __construct() {
		add_action( 'admin_init', array( $this, 'handle_oauth_callback' ) );
		add_action( 'wp_ajax_eo_google_oauth_disconnect', array( $this, 'ajax_disconnect' ) );
		add_action( 'wp_ajax_eo_google_oauth_get_locations', array( $this, 'ajax_get_locations' ) );
	}

	public static function get_redirect_uri() {
		return admin_url( 'admin.php?page=eo-blocks-reviews' );
	}

	public static function get_auth_url() {
		$options = get_option('eoblocks_reviews_settings', array());
		$client_id = isset($options['google_oauth_client_id']) ? $options['google_oauth_client_id'] : '';

		if ( empty( $client_id ) ) {
			return '#';
		}

		$params = array(
			'client_id'     => $client_id,
			'redirect_uri'  => self::get_redirect_uri(),
			'response_type' => 'code',
			'scope'         => self::SCOPE,
			'access_type'   => 'offline',
			'prompt'        => 'consent'
		);

		return add_query_arg( $params, self::OAUTH_URL );
	}

	public function handle_oauth_callback() {
		if ( isset( $_GET['page'] ) && $_GET['page'] === 'eo-blocks-reviews' && isset( $_GET['code'] ) ) {
			if ( ! current_user_can( 'manage_options' ) ) {
				return;
			}

			$options = get_option('eoblocks_reviews_settings', array());
			$client_id = isset($options['google_oauth_client_id']) ? $options['google_oauth_client_id'] : '';
			$client_secret = isset($options['google_oauth_client_secret']) ? $options['google_oauth_client_secret'] : '';

			if ( empty( $client_id ) || empty( $client_secret ) ) {
				return;
			}

			$code = sanitize_text_field( $_GET['code'] );

			$response = wp_remote_post( self::TOKEN_URL, array(
				'body' => array(
					'code'          => $code,
					'client_id'     => $client_id,
					'client_secret' => $client_secret,
					'redirect_uri'  => self::get_redirect_uri(),
					'grant_type'    => 'authorization_code',
				)
			) );

			if ( is_wp_error( $response ) ) {
				// Handle error
				return;
			}

			$body = json_decode( wp_remote_retrieve_body( $response ), true );

			if ( isset( $body['access_token'] ) ) {
				$options['google_oauth_access_token'] = $body['access_token'];
				if ( isset( $body['refresh_token'] ) ) {
					$options['google_oauth_refresh_token'] = $body['refresh_token'];
				}
				if ( isset( $body['expires_in'] ) ) {
					$options['google_oauth_expires_at'] = time() + $body['expires_in'];
				}
				
				update_option( 'eoblocks_reviews_settings', $options );
				
				// Redirect to remove the code from URL
				wp_safe_redirect( self::get_redirect_uri() );
				exit;
			}
		}
	}

	public static function refresh_token() {
		$options = get_option('eoblocks_reviews_settings', array());
		$client_id = isset($options['google_oauth_client_id']) ? $options['google_oauth_client_id'] : '';
		$client_secret = isset($options['google_oauth_client_secret']) ? $options['google_oauth_client_secret'] : '';
		$refresh_token = isset($options['google_oauth_refresh_token']) ? $options['google_oauth_refresh_token'] : '';

		if ( empty( $client_id ) || empty( $client_secret ) || empty( $refresh_token ) ) {
			return false;
		}

		$response = wp_remote_post( self::TOKEN_URL, array(
			'body' => array(
				'client_id'     => $client_id,
				'client_secret' => $client_secret,
				'refresh_token' => $refresh_token,
				'grant_type'    => 'refresh_token',
			)
		) );

		if ( is_wp_error( $response ) ) {
			return false;
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( isset( $body['access_token'] ) ) {
			$options['google_oauth_access_token'] = $body['access_token'];
			if ( isset( $body['expires_in'] ) ) {
				$options['google_oauth_expires_at'] = time() + $body['expires_in'];
			}
			update_option( 'eoblocks_reviews_settings', $options );
			return $body['access_token'];
		}

		return false;
	}

	public static function get_valid_access_token() {
		$options = get_option('eoblocks_reviews_settings', array());
		$access_token = isset($options['google_oauth_access_token']) ? $options['google_oauth_access_token'] : '';
		$expires_at = isset($options['google_oauth_expires_at']) ? $options['google_oauth_expires_at'] : 0;

		if ( empty( $access_token ) ) {
			return false;
		}

		// Refresh if expiring in less than 5 minutes
		if ( time() > ( $expires_at - 300 ) ) {
			return self::refresh_token();
		}

		return $access_token;
	}

	public static function get_accounts() {
		$token = self::get_valid_access_token();
		if ( ! $token ) {
			return false;
		}

		$response = wp_remote_get( 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts', array(
			'headers' => array(
				'Authorization' => 'Bearer ' . $token
			)
		) );

		if ( is_wp_error( $response ) ) {
			return false;
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( isset( $body['accounts'] ) ) {
			return $body['accounts'];
		}
		
		if ( isset( $body['error']['message'] ) ) {
			return new \WP_Error( 'google_api_error', $body['error']['message'] );
		}
		
		return array();
	}

	public static function get_locations( $account_name ) {
		$token = self::get_valid_access_token();
		if ( ! $token ) {
			return false;
		}

		// Read locations for specific account
		$url = 'https://mybusinessbusinessinformation.googleapis.com/v1/' . $account_name . '/locations?readMask=name,title,storeCode';

		$response = wp_remote_get( $url, array(
			'headers' => array(
				'Authorization' => 'Bearer ' . $token
			)
		) );

		if ( is_wp_error( $response ) ) {
			return false;
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( isset( $body['locations'] ) ) {
			return $body['locations'];
		}
		
		if ( isset( $body['error']['message'] ) ) {
			return new \WP_Error( 'google_api_error', $body['error']['message'] );
		}
		
		return array();
	}

	public function ajax_disconnect() {
		check_ajax_referer( 'eo_reviews_admin_nonce', 'nonce' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error();
		}

		$options = get_option('eoblocks_reviews_settings', array());
		unset($options['google_oauth_access_token']);
		unset($options['google_oauth_refresh_token']);
		unset($options['google_oauth_expires_at']);
		unset($options['google_oauth_location']);
		
		update_option( 'eoblocks_reviews_settings', $options );
		wp_send_json_success();
	}

	public function ajax_get_locations() {
		check_ajax_referer( 'eo_reviews_admin_nonce', 'nonce' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error();
		}

		$accounts = self::get_accounts();
		if ( is_wp_error( $accounts ) ) {
			wp_send_json_error( $accounts->get_error_message() );
		}
		if ( $accounts === false ) {
			wp_send_json_error( __( 'Échec de récupération des comptes.', 'eo-blocks' ) );
		}

		$all_locations = array();
		foreach ( $accounts as $account ) {
			$locations = self::get_locations( $account['name'] );
			if ( is_wp_error( $locations ) ) {
				wp_send_json_error( $locations->get_error_message() );
			}
			if ( ! empty( $locations ) ) {
				foreach ( $locations as $loc ) {
					$loc['account_name'] = isset($account['accountName']) ? $account['accountName'] : '';
					$all_locations[] = $loc;
				}
			}
		}

		wp_send_json_success( $all_locations );
	}

	public static function get_all_reviews( $location_name ) {
		$token = self::get_valid_access_token();
		if ( ! $token ) {
			return false;
		}

		$all_reviews = array();
		$next_page_token = '';
		$url = 'https://mybusiness.googleapis.com/v4/' . $location_name . '/reviews';

		do {
			$request_url = $url;
			if ( ! empty( $next_page_token ) ) {
				$request_url = add_query_arg( 'pageToken', $next_page_token, $url );
			}

			$response = wp_remote_get( $request_url, array(
				'headers' => array(
					'Authorization' => 'Bearer ' . $token
				)
			) );

			if ( is_wp_error( $response ) ) {
				break;
			}

			$body = json_decode( wp_remote_retrieve_body( $response ), true );
			
			if ( isset( $body['reviews'] ) ) {
				$all_reviews = array_merge( $all_reviews, $body['reviews'] );
			}

			$next_page_token = isset( $body['nextPageToken'] ) ? $body['nextPageToken'] : '';
		} while ( ! empty( $next_page_token ) );

		return $all_reviews;
	}
}

new Eoblocks_Google_OAuth();
