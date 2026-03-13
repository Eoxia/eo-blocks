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

class Eoblocks_Settings {

	public function __construct() {
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'wp_ajax_eoblocks_migrate_blocks', array( $this, 'ajax_migrate_blocks' ) );
//		add_action( 'rest_api_init', array( $this, 'api_test' ) );
	}


	public function register_settings() {
		register_setting('eoblocks_settings_group', 'eoblocks_settings', array(
			'type'         => 'object',
			'show_in_rest' => array(
				'schema' => array(
					'type'       => 'object',
					'properties' => array(
						'eoblocks_dolibarr_url' => array(
							'type' => 'string',
						),
						'eoblocks_dolibarr_api_key' => array(
							'type' => 'string',
						),
					),
					'additionalProperties' => false,
				),
			),
		));

		add_settings_section(
			'eoblocks_settings_section',
			__('General Settings', 'eo-blocks'),
			null,
			'eoblocks'
		);

		add_settings_field(
			'eoblocks_dolibarr_url',
			__('Dolibarr URL', 'eo-blocks'),
			array( $this, 'dolibarr_url_cb' ),
			'eoblocks',
			'eoblocks_settings_section'
		);

		add_settings_field(
				'eoblocks_dolibarr_api_key',
				__('Dolibarr API Key', 'eo-blocks'),
				array( $this, 'dolibarr_api_key_cb' ),
				'eoblocks',
				'eoblocks_settings_section'
		);
	}

	public function dolibarr_url_cb() {
		$options = get_option('eoblocks_settings');
		?>
		<input type="text" name="eoblocks_settings[eoblocks_dolibarr_url]" value="<?php echo isset($options['eoblocks_dolibarr_url']) ? esc_attr($options['eoblocks_dolibarr_url']) : ''; ?>" />
		<?php

	}

	public function dolibarr_api_key_cb() {
		$options = get_option('eoblocks_settings');
		?>
		<input type="text" name="eoblocks_settings[eoblocks_dolibarr_api_key]" value="<?php echo isset($options['eoblocks_dolibarr_api_key']) ? esc_attr($options['eoblocks_dolibarr_api_key']) : ''; ?>" />
		<?php
	}

	/**
	 * Liste des blocs à migrer de eo/ vers eo-blocks/
	 */
	public function get_blocks_to_migrate() {
		return array(
			'tabs',
			'tabs-buttons',
			'tabs-contents',
			'tabs-buttons-inner',
			'tabs-contents-inner',
			'carousel',
			'slide',
			'accordion',
			'sticky',
			'marquee',
			'summary',
			'search',
			'kpi-contentment',
			'digirisk-list-risk',
		);
	}

	/**
	 * Migrer les blocs dans la base de données
	 */
	public function migrate_blocks() {
		$blocks = $this->get_blocks_to_migrate();
		$migrated = 0;

		foreach ( $blocks as $block ) {
			// Migrer les posts
			$migrated += $this->migrate_block_in_posts( $block );
			// Migrer les postmeta
			$migrated += $this->migrate_block_in_postmeta( $block );
		}

		return $migrated;
	}

	/**
	 * Migrer un bloc spécifique dans post_content
	 */
	private function migrate_block_in_posts( $block ) {
		global $wpdb;

		$old_name = '<!-- wp:eo/' . $block;
		$new_name = '<!-- wp:eo-blocks/' . $block;

		$updated = $wpdb->query(
			$wpdb->prepare(
				"UPDATE {$wpdb->posts}
				SET post_content = REPLACE(post_content, %s, %s)
				WHERE post_content LIKE %s",
				$old_name,
				$new_name,
				'%' . $wpdb->esc_like( $old_name ) . '%'
			)
		);

		return $updated ? $updated : 0;
	}

	/**
	 * Migrer un bloc spécifique dans postmeta
	 */
	private function migrate_block_in_postmeta( $block ) {
		global $wpdb;

		$old_name = '<!-- wp:eo/' . $block;
		$new_name = '<!-- wp:eo-blocks/' . $block;

		$updated = $wpdb->query(
			$wpdb->prepare(
				"UPDATE {$wpdb->postmeta}
				SET meta_value = REPLACE(meta_value, %s, %s)
				WHERE meta_value LIKE %s",
				$old_name,
				$new_name,
				'%' . $wpdb->esc_like( $old_name ) . '%'
			)
		);

		return $updated ? $updated : 0;
	}

	/**
	 * Endpoint AJAX pour lancer la migration
	 */
	public function ajax_migrate_blocks() {
		check_ajax_referer( 'eoblocks_migrate_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array(
				'message' => __( 'Vous n\'avez pas les permissions nécessaires.', 'eo-blocks' ),
			), 403 );
		}

		$migrated = $this->migrate_blocks();

		wp_send_json_success( array(
			'message' => sprintf(
				__( 'Migration terminée ! %d référence(s) de bloc mise(s) à jour.', 'eo-blocks' ),
				$migrated
			),
			'count' => $migrated,
		) );
	}
}
