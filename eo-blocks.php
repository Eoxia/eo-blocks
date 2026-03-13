<?php
/**
 * Plugin Name:       EO Blocks
 * Description:       A collection of Gutenberg blocks for WordPress made by Eoxia
 * Requires at least: 6.6.2
 * Requires PHP:      7.0
 * Version:           1.1.0
 * Author:            Eoxia
 * Author URI:        https://www.eoxia.com
 * License:           GPL-3.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       eo-blocks
 *
 * @package EoBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'EO_BLOCKS_BASEFILE', __FILE__ );
define( 'EO_BLOCKS_URL', plugin_dir_url( __FILE__ ) );
define( 'EO_BLOCKS_PATH', plugin_dir_path( __FILE__ ) );
define( 'EO_BLOCKS_VERSION', '1.0.0' );

/**
 * Autoload the php files.
 */
require_once EO_BLOCKS_PATH . '/includes/autoload.php';

// Load AJAX API endpoints
require_once EO_BLOCKS_PATH . '/includes/api-eo-search.php';

use EoBlocks\Includes\Eoblocks;

$eoblocks = new Eoblocks();

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
		if ( ! empty( $url ) && $url !== '.' && $url !== '..' && is_dir( $block_dir ) ) {
			// Register main block if block.json exists
			if ( file_exists( $block_dir . '/block.json' ) ) {
				register_block_type( $block_dir );
			}

			// Register inner-blocks if present
			$inner_blocks_dir = $block_dir . '/inner-blocks';
			if ( is_dir( $inner_blocks_dir ) ) {
				$inner_block_dirs = scandir( $inner_blocks_dir );
				foreach ( $inner_block_dirs as $inner_url ) {
					$inner_block_dir = $inner_blocks_dir . '/' . $inner_url;
					if ( ! empty( $inner_url ) && $inner_url !== '.' && $inner_url !== '..' && is_dir( $inner_block_dir ) ) {
						if ( file_exists( $inner_block_dir . '/block.json' ) ) {
							register_block_type( $inner_block_dir );
						}
					}
				}
			}
		}
	}

}
add_action( 'init', 'eo_blocks_block_init' );
