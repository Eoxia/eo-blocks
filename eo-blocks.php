<?php
/**
 * Plugin Name:       EO Blocks
 * Description:       A collection of Gutenberg blocks for WordPress made by Eoxia
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
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
		}
	}

}
add_action( 'init', 'eo_blocks_block_init' );
