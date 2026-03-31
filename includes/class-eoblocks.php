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
        wp_enqueue_style( 'eo-blocks-css', EO_BLOCKS_URL . 'assets/css/style.min.css', array(), '1.0.0', 'all' );

        // Localize AJAX URL for eo-search block
        wp_localize_script( 'eo-blocks-js', 'eoSearch', array(
            'ajaxUrl' => admin_url( 'admin-ajax.php' ),
            'homeUrl' => home_url(),
        ) );
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

            // Localize AJAX URL for eo-search block in editor
            wp_localize_script( 'eo-blocks-hooks', 'eoSearch', array(
                'ajaxUrl' => admin_url( 'admin-ajax.php' ),
                'homeUrl' => home_url(),
            ) );
    }

    public function group_link_frontend($block_content, $block) {
        $allowed_blocks = array( 'core/group', 'core/cover' );
        if ( ! in_array($block['blockName'], $allowed_blocks ) ) {
            return $block_content;
        }

        $block_name = explode( '/', $block['blockName'] );
        $block_name = isset( $block_name[1] ) ? $block_name[1] : '';

        $attrs = $block['attrs'];
        if (empty($attrs['blockLink']['url'])) {
            return $block_content;
        }

        $url     = esc_url($attrs['blockLink']['url']);
        $new_tab = !empty($attrs['blockLink']['opensInNewTab']) 
            ? ' target="_blank" rel="noopener noreferrer"' 
            : '';

        $block_content = preg_replace_callback(
            '/<div\s[^>]*class="[^"]*wp-block-' . preg_quote($block_name, '/') . '[^"]*"/',
            function ($matches) {
                if (strpos($matches[0], 'has-link') === false) {
                    return str_replace('class="', 'class="has-link ', $matches[0]);
                }
                return $matches[0];
            },
            $block_content,
            1
        );


        $link = sprintf('<a href="%s" class="eo-group-link" %s></a>', $url, $new_tab);

        $block_content = preg_replace(
            '/<\/div>\s*$/',
            $link . '</div>',
            $block_content
        );

        return $block_content;
    }
}