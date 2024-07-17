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
	}

	public function register_settings() {
		register_setting('eoblocks_settings_group', 'eoblocks_settings', array(
			'show_in_rest' => true,
		));

		add_settings_section(
			'eoblocks_settings_section',
			__('General Settings', 'eoblocks'),
			null,
			'eoblocks'
		);

		add_settings_field(
			'eoblocks_dolibarr_url',
			__('Dolibarr URL', 'eoblocks'),
			array( $this, 'dolibarr_url_cb' ),
			'eoblocks',
			'eoblocks_settings_section'
		);

		add_settings_field(
				'eoblocks_dolibarr_api_key',
				__('Dolibarr API Key', 'eoblocks'),
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
}
