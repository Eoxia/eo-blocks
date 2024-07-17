<?php
/**
 * Plugin Name:       EO Blocks
 * Description:       A collection of Gutenberg blocks for WordPress made by Eoxia
 * Requires at least: 6.5.5
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            Eoxia
 * License:           GPL-3.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       eo-blocks
 * Update URI:        https://www.eoxia.com
 *
 * @package EoBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'EO_BLOCKS_BASEFILE', __FILE__ );
define( 'EO_BLOCKS_URL', plugins_url( '/', __FILE__ ) );
define( 'EO_BLOCKS_PATH', dirname( __FILE__ ) );
define( 'EO_BLOCKS_VERSION', '0.1.0' );

/**
 * Autoload the php files.
 */
require_once EO_BLOCKS_PATH . '/includes/autoload.php';

use EoBlocks\Includes\Admin\Eoblocks_Menu;
use EoBlocks\Includes\Eoblocks_Settings;
use EoBlocks\Includes\Eoblocks_Helper;

$eoblocks_menu = new Eoblocks_Menu();
$eoblocks_settings = new Eoblocks_Settings();

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function eo_blocks_block_init() {
	$block_build_dir = EO_BLOCKS_PATH . "/blocks/build/";

	// Register all blocks in build Blocks directory.
	$block_dir_urls = scandir( $block_build_dir );
	foreach ( $block_dir_urls as $url ) {
		$block_dir = $block_build_dir . '/' . $url;
		if ( ! empty( $url ) && file_exists( $block_dir . '/block.json' ) ) {
			register_block_type( $block_dir );

			// @TODO Récupérer les options dans le JS
//			wp_enqueue_script(
//				'mon-plugin-block',
//				plugins_url($block_dir . '/edit.js', __FILE__),
//				array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'),
//				filemtime(plugin_dir_path(__FILE__) . 'block/edit.js'),
//				true // Charger dans le footer
//			);
//			$options = get_option('eoblocks_settings');
//			wp_localize_script('mon-plugin-block', 'MonPluginSettings', array(
//				'eoblocks_dolibarr_url' => isset($options['eoblocks_dolibarr_url']) ? $options['eoblocks_dolibarr_url'] : '',
//				'eoblocks_dolibarr_api_key' => isset($options['eoblocks_dolibarr_api_key']) ? $options['eoblocks_dolibarr_api_key'] : '',
//			));

		}
	}

}
add_action( 'init', 'eo_blocks_block_init' );
