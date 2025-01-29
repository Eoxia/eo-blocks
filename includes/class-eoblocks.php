<?php
/**
 * Plugin Settings.
 *
 * @author Eoxia
 *
 * @since 1.0.0
 */

namespace EoBlocks\Includes;

use EoBlocks\Includes\Admin\Eoblocks_Menu;
use EoBlocks\Includes\Eoblocks_Settings;
use EoBlocks\Includes\Eoblocks_Helper;

if (!defined('ABSPATH')) {
	exit;
}

class Eoblocks {
	private static $initiated = false;
	/**
	 * Class constructor
	 *
	 * @since 1.1.0
	 */
	public function __construct() {
		$eoblocks_menu = new Eoblocks_Menu();
		$eoblocks_settings = new Eoblocks_Settings();

		if ( ! self::$initiated ) {
			$this->init_hooks();
		}
	}

	public function init_hooks() {
		self::$initiated = true;

		add_filter( 'block_categories_all', array( $this, 'create_block_category' ), 10, 2 );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	/**
	 * Create Eoblocks block custom category
	 *
	 * @param $block_categories
	 * @param $editor_context
	 * @return mixed
	 */
	public function create_block_category( $block_categories, $editor_context ) {
		if ( ! empty( $editor_context->post ) ) {
			array_unshift(
				$block_categories,
				array(
					'slug'  => 'eo-blocks',
					'title' => __( 'EO Blocks', 'eo-blocks' ),
				)
			);
		}
		return $block_categories;
	}

	/**
	 * Enqueue plugin scripts
	 * @return void
	 */
	public function enqueue_scripts() {
        wp_register_style( 'eo-blocks-swiper-css', EO_BLOCKS_URL . 'assets/inc/swiper-bundle.min.css' );
        wp_register_script( 'eo-blocks-swiper-js', EO_BLOCKS_URL . 'assets/inc/swiper-bundle.min.js', array(), false, true );

        wp_enqueue_script( 'eo-blocks-js', EO_BLOCKS_URL . 'assets/js/eoblocks.js', array( 'jquery') );
	}
}
