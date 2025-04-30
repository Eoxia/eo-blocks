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
        add_filter( 'render_block', array( $this, 'group_link_frontend' ), 10, 2 );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
        add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_custom_block_hooks' ) );
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
        wp_register_style( 'eo-blocks-swiper-css', EO_BLOCKS_URL . 'assets/inc/swiper-bundle.min.css', array(), '11.1.15' );
        wp_register_script( 'eo-blocks-swiper-js', EO_BLOCKS_URL . 'assets/inc/swiper-bundle.min.js', array(), '11.1.15', true );

        wp_enqueue_script( 'eo-blocks-js', EO_BLOCKS_URL . 'assets/js/eoblocks.js', array( 'jquery'), '1.1.0' );
	}

    /**
     * Enqueue custom block hooks
     * @return void
     */
    public function enqueue_custom_block_hooks() {
            wp_enqueue_script(
                'eo-blocks-hooks',
                EO_BLOCKS_URL . 'hooks/build/hooks.js',
                ['wp-blocks', 'wp-hooks', 'wp-edit-post'],
                '1.2.0',
                true
            );
    }

    public function group_link_frontend( $block_content, $block ) {
        if ( $block['blockName'] !== 'core/group' ) {
            return $block_content;
        }

        $attrs = $block['attrs'];
        if ( empty( $attrs['blockLink']['url'] ) ) {
            return $block_content;
        }

        $url = esc_url( $attrs['blockLink']['url'] );
        $new_tab = ! empty( $attrs['blockLink']['opensInNewTab'] ) ? ' target="_blank" rel="noopener noreferrer"' : '';

        return sprintf(
            '<a href="%s" class="eo-group-link" %s>%s</a>',
            $url,
            $new_tab,
            $block_content
        );
    }
}
