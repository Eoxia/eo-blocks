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

		add_action( 'init', array( $this, 'register_post_types' ) );
		add_action( 'init', array( $this, 'register_global_assets' ) );
		add_filter( 'block_categories_all', array( $this, 'create_block_category' ), 10, 2 );
        add_filter( 'render_block', array( $this, 'group_link_frontend' ), 10, 2 );
        add_filter( 'render_block', array( $this, 'animations_frontend' ), 10, 2 );
        add_filter( 'render_block', array( $this, 'breakpoint_display_frontend' ), 10, 2 );
        add_filter( 'render_block', array( $this, 'responsive_columns_frontend' ), 10, 2 );
        add_filter( 'render_block', array( $this, 'mobile_breakpoint_frontend' ), 10, 2 );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
        add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_custom_block_hooks' ) );
		add_shortcode( 'eo_map', array( $this, 'render_map_shortcode' ) );

	}

	/**
	 * Register Custom Post Types.
	 */
	public function register_post_types() {
		register_post_type( 'eo-map', array(
			'labels' => array(
				'name'               => __( 'Cartes', 'eo-blocks' ),
				'singular_name'      => __( 'Carte', 'eo-blocks' ),
				'add_new'            => __( 'Ajouter une carte', 'eo-blocks' ),
				'add_new_item'       => __( 'Ajouter une nouvelle carte', 'eo-blocks' ),
				'edit_item'          => __( 'Modifier la carte', 'eo-blocks' ),
				'new_item'           => __( 'Nouvelle carte', 'eo-blocks' ),
				'view_item'          => __( 'Voir la carte', 'eo-blocks' ),
				'search_items'       => __( 'Rechercher des cartes', 'eo-blocks' ),
				'not_found'          => __( 'Aucune carte trouvée', 'eo-blocks' ),
				'not_found_in_trash' => __( 'Aucune carte trouvée dans la corbeille', 'eo-blocks' ),
			),
			'public'              => false,
			'show_ui'             => true,
			'show_in_menu'        => false,
			'show_in_rest'        => true,
			'supports'            => array( 'title' ),
			'capability_type'     => 'post',
			'map_meta_cap'        => true,
			'hierarchical'        => false,
			'query_var'           => true,
			'rewrite'             => false,
		) );
	}

	/**
	 * Register global assets.
	 */
	public function register_global_assets() {
		wp_register_style( 'leaflet-css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', array(), '1.9.4' );
		wp_register_script( 'leaflet-js', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', array(), '1.9.4', true );

		// MapLibre GL (vector tiles) + Leaflet binding, used by the "OpenFreeMap" (multilingual) basemap.
		wp_register_style( 'maplibre-gl-css', 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css', array(), '4.7.1' );
		wp_register_script( 'maplibre-gl-js', 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js', array(), '4.7.1', true );
		wp_register_script( 'maplibre-gl-leaflet-js', 'https://unpkg.com/@maplibre/maplibre-gl-leaflet@0.0.20/leaflet-maplibre-gl.js', array( 'leaflet-js', 'maplibre-gl-js' ), '0.0.20', true );
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
        wp_enqueue_script( 'eo-blocks-animations-js', EO_BLOCKS_URL . 'assets/js/animations.js', array(), '1.0.0', true );
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

            // Animation gallery preview styles (keyframes + modal grid).
            wp_enqueue_style( 'eo-blocks-css', EO_BLOCKS_URL . 'assets/css/style.min.css', array(), '1.0.0', 'all' );

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

    /**
     * Adds the data-eo-anim-in / data-eo-anim-out attributes on a block's
     * root element so assets/js/animations.js can trigger the matching
     * CSS animation on scroll. Works for any block (EO Blocks, core or
     * third-party) since the attributes are read directly from the parsed
     * block comment, without requiring PHP-side attribute registration.
     */
    public function animations_frontend( $block_content, $block ) {
        $attrs = isset( $block['attrs'] ) ? $block['attrs'] : array();

        $anim_in  = ! empty( $attrs['eoAnimationIn'] ) ? sanitize_html_class( $attrs['eoAnimationIn'] ) : '';
        $anim_out = ! empty( $attrs['eoAnimationOut'] ) ? sanitize_html_class( $attrs['eoAnimationOut'] ) : '';

        if ( ! $anim_in && ! $anim_out ) {
            return $block_content;
        }

        // Some dynamic blocks (e.g. the carousel) emit one or more leading
        // <style> blocks before their wrapper element. Skip those so the data
        // attributes land on the actual wrapper and not on a <style> tag.
        $target_pattern = '/^(\s*(?:<style\b[^>]*>.*?<\/style>\s*)*<[a-zA-Z][a-zA-Z0-9-]*)/s';

        if ( ! preg_match( $target_pattern, $block_content ) ) {
            return $block_content;
        }

        $data_attrs = '';
        if ( $anim_in ) {
            $data_attrs .= ' data-eo-anim-in="' . esc_attr( $anim_in ) . '"';
        }
        if ( $anim_out ) {
            $data_attrs .= ' data-eo-anim-out="' . esc_attr( $anim_out ) . '"';
        }

        return preg_replace(
            $target_pattern,
            '$1' . $data_attrs,
            $block_content,
            1
        );
    }

    /**
     * Hides a block outside a viewport-width range (min-width / max-width, in
     * px) set through the "Affichage selon la largeur d'écran" control. Reads
     * the eoBreakpoint attribute directly from the parsed block comment, so it
     * works for any block (EO Blocks, core or third-party) without PHP-side
     * attribute registration.
     *
     * A unique data-eo-bp attribute is injected on the block's root element and
     * a scoped <style> with the matching media queries is prepended.
     */
    public function breakpoint_display_frontend( $block_content, $block ) {
        $attrs      = isset( $block['attrs'] ) ? $block['attrs'] : array();
        $breakpoint = isset( $attrs['eoBreakpoint'] ) ? $attrs['eoBreakpoint'] : array();

        if ( empty( $breakpoint['enabled'] ) ) {
            return $block_content;
        }

        // Bounds are optional (a single side of the range may be set).
        $min = ( isset( $breakpoint['min'] ) && $breakpoint['min'] !== '' ) ? floatval( $breakpoint['min'] ) : '';
        $max = ( isset( $breakpoint['max'] ) && $breakpoint['max'] !== '' ) ? floatval( $breakpoint['max'] ) : '';

        if ( $min === '' && $max === '' ) {
            return $block_content;
        }

        // Invalid range (max below min): don't break the rendering, just skip.
        if ( $min !== '' && $max !== '' && $max < $min ) {
            return $block_content;
        }

        // Same wrapper-targeting pattern as animations_frontend: skip any
        // leading <style> blocks (e.g. the carousel) so the attribute lands on
        // the real wrapper element.
        $target_pattern = '/^(\s*(?:<style\b[^>]*>.*?<\/style>\s*)*<[a-zA-Z][a-zA-Z0-9-]*)/s';

        if ( ! preg_match( $target_pattern, $block_content ) ) {
            return $block_content;
        }

        $id       = 'eo-bp-' . substr( md5( $block_content . wp_json_encode( $breakpoint ) ), 0, 8 );
        $selector = '[data-eo-bp="' . $id . '"]';

        // 0.02px offset (Bootstrap convention) avoids overlap at the exact
        // boundary; bounds are inclusive: visible for min <= width <= max.
        $rules = '';
        if ( $min !== '' ) {
            $rules .= '@media (max-width:' . ( $min - 0.02 ) . 'px){' . $selector . '{display:none !important}}';
        }
        if ( $max !== '' ) {
            $rules .= '@media (min-width:' . ( $max + 0.02 ) . 'px){' . $selector . '{display:none !important}}';
        }

        $block_content = preg_replace(
            $target_pattern,
            '$1 data-eo-bp="' . esc_attr( $id ) . '"',
            $block_content,
            1
        );

        return '<style>' . $rules . '</style>' . $block_content;
    }

    /**
     * Overrides how many columns are shown per row on tablet (≤781px) and
     * mobile (≤599px) when the "Activer les colonnes responsives" control is
     * enabled on a core/columns block that has "Stack on mobile" checked —
     * instead of WordPress' default of stacking every column at 100% width.
     *
     * Reads the eoResponsiveColumns attribute directly from the parsed block
     * comment. A unique data-eo-rc attribute is injected on the columns
     * wrapper and a scoped <style> with the matching media queries is
     * prepended. The per-column width always uses the WordPress predefined
     * block-gap custom property (forced, regardless of any custom gap set on
     * this particular block) so columns line up exactly N per row.
     */
    public function responsive_columns_frontend( $block_content, $block ) {
        if ( ! isset( $block['blockName'] ) || 'core/columns' !== $block['blockName'] ) {
            return $block_content;
        }

        $attrs = isset( $block['attrs'] ) ? $block['attrs'] : array();

        // "Stack on mobile" defaults to true when not explicitly turned off.
        $is_stacked_on_mobile = ! isset( $attrs['isStackedOnMobile'] ) || $attrs['isStackedOnMobile'];
        if ( ! $is_stacked_on_mobile ) {
            return $block_content;
        }

        $responsive = isset( $attrs['eoResponsiveColumns'] ) ? $attrs['eoResponsiveColumns'] : array();
        if ( empty( $responsive['enabled'] ) ) {
            return $block_content;
        }

        // Number of actual core/column children; tablet/mobile counts can
        // never exceed it.
        $columns_count = 0;
        if ( ! empty( $block['innerBlocks'] ) ) {
            foreach ( $block['innerBlocks'] as $inner_block ) {
                if ( isset( $inner_block['blockName'] ) && 'core/column' === $inner_block['blockName'] ) {
                    $columns_count++;
                }
            }
        }

        if ( $columns_count < 2 ) {
            return $block_content;
        }

        $tablet = isset( $responsive['tablet'] ) ? intval( $responsive['tablet'] ) : 0;
        $mobile = isset( $responsive['mobile'] ) ? intval( $responsive['mobile'] ) : 0;

        // Clamp server-side too, in case a stale value slipped through.
        $tablet = $tablet > 0 ? min( $tablet, $columns_count ) : 0;
        $mobile = $mobile > 0 ? min( $mobile, $columns_count ) : 0;

        if ( ! $tablet && ! $mobile ) {
            return $block_content;
        }

        $target_pattern = '/^(\s*(?:<style\b[^>]*>.*?<\/style>\s*)*<[a-zA-Z][a-zA-Z0-9-]*)/s';

        if ( ! preg_match( $target_pattern, $block_content ) ) {
            return $block_content;
        }

        $id       = 'eo-rc-' . substr( md5( $block_content . wp_json_encode( $responsive ) ), 0, 8 );
        // Prefixed with .wp-block-columns so this selector's specificity
        // matches (and, being injected later in the page, wins over) core's
        // own ":not(.is-not-stacked-on-mobile) > .wp-block-column" rule at
        // the same breakpoint.
        $selector = '.wp-block-columns[data-eo-rc="' . $id . '"]';

        $rules = '';
        if ( $tablet ) {
            $rules .= '@media (max-width:781px){' . $this->responsive_columns_rule( $selector, $tablet ) . '}';
        }
        if ( $mobile ) {
            $rules .= '@media (max-width:599px){' . $this->responsive_columns_rule( $selector, $mobile ) . '}';
        }

        $block_content = preg_replace(
            $target_pattern,
            '$1 data-eo-rc="' . esc_attr( $id ) . '"',
            $block_content,
            1
        );

        return '<style>' . $rules . '</style>' . $block_content;
    }

    /**
     * Builds the "$count columns per row" CSS for one breakpoint: forces the
     * WordPress predefined block-gap custom property (falling back to core's
     * own 2em default) and derives each column's flex-basis from it.
     */
    private function responsive_columns_rule( $selector, $count ) {
        $gap   = 'var(--wp--style--block-gap, 2em)';
        $basis = 1 === $count
            ? '100%'
            : 'calc((100% - (' . ( $count - 1 ) . ' * ' . $gap . ')) / ' . $count . ')';

        return $selector . '{gap:' . $gap . ' !important}'
            . $selector . '>.wp-block-column{flex-basis:' . $basis . ' !important;flex-grow:0 !important}';
    }

    /**
     * Changes the width at which a core/navigation block switches between its
     * horizontal (desktop) and overlay/hamburger (mobile) layouts, set
     * through the "Mobile Breakpoints" control. Only applies when the
     * block's own "Overlay" setting is "Mobile": "Off" never renders a
     * responsive/overlay layout, and "Always" is already an overlay at every
     * width regardless of viewport, so neither has anything to switch.
     *
     * WordPress core hardcodes that switch at 600px (see two
     * "@media (min-width: 600px)" rules in
     * wp-includes/blocks/navigation/style.css): one shows the responsive
     * container as a normal, non-overlay menu, the other hides the
     * open/hamburger button. Reads the eoMobileBreakpoint attribute directly
     * from the parsed block comment, so no PHP-side attribute registration is
     * needed.
     *
     * A unique data-eo-mnb attribute is injected on the block's <nav>
     * wrapper and a scoped <style> is prepended that redoes both rules at the
     * custom width. When that width is above 600px, an extra rule forces the
     * mobile layout back on between 600px and the custom width, a range core
     * itself would otherwise have already switched to desktop.
     */
    public function mobile_breakpoint_frontend( $block_content, $block ) {
        if ( ! isset( $block['blockName'] ) || 'core/navigation' !== $block['blockName'] ) {
            return $block_content;
        }

        $attrs = isset( $block['attrs'] ) ? $block['attrs'] : array();

        $overlay_menu = isset( $attrs['overlayMenu'] ) ? $attrs['overlayMenu'] : 'mobile';
        if ( 'mobile' !== $overlay_menu ) {
            return $block_content;
        }

        $breakpoint = isset( $attrs['eoMobileBreakpoint'] ) ? $attrs['eoMobileBreakpoint'] : array();
        if ( empty( $breakpoint['enabled'] ) || empty( $breakpoint['value'] ) ) {
            return $block_content;
        }

        $bp = floatval( $breakpoint['value'] );
        if ( $bp <= 0 ) {
            return $block_content;
        }

        $target_pattern = '/^(\s*(?:<style\b[^>]*>.*?<\/style>\s*)*<[a-zA-Z][a-zA-Z0-9-]*)/s';

        if ( ! preg_match( $target_pattern, $block_content ) ) {
            return $block_content;
        }

        $id       = 'eo-mnb-' . substr( md5( $block_content . wp_json_encode( $breakpoint ) ), 0, 8 );
        $selector = '[data-eo-mnb="' . $id . '"]';

        // Redo core's two 600px rules at the custom breakpoint instead.
        $rules = '@media (min-width:' . $bp . 'px){'
            . $selector . ' .wp-block-navigation__responsive-container:not(.hidden-by-default):not(.is-menu-open){display:block !important;width:100% !important;position:relative !important;z-index:auto !important;background-color:inherit !important}'
            . $selector . ' .wp-block-navigation__responsive-container:not(.hidden-by-default):not(.is-menu-open) .wp-block-navigation__responsive-container-close{display:none !important}'
            . $selector . ' .wp-block-navigation__responsive-container-open:not(.always-shown){display:none !important}'
            . '}';

        // Core's native 600px rule already applies on its own between 600px
        // and the custom breakpoint when the latter is higher, so force the
        // mobile layout back on for that range. When the custom breakpoint is
        // 600px or below, min-width ends up greater than max-width and the
        // query simply never matches, which is harmless.
        $rules .= '@media (min-width:600px) and (max-width:' . ( $bp - 0.02 ) . 'px){'
            . $selector . ' .wp-block-navigation__responsive-container:not(.is-menu-open){display:none !important}'
            . $selector . ' .wp-block-navigation__responsive-container-open{display:flex !important}'
            . '}';

        $block_content = preg_replace(
            $target_pattern,
            '$1 data-eo-mnb="' . esc_attr( $id ) . '"',
            $block_content,
            1
        );

        return '<style>' . $rules . '</style>' . $block_content;
    }

	/**
	 * Shortcode to render maps.
	 */
	public function render_map_shortcode( $atts ) {
		$atts = shortcode_atts( array(
			'id' => 0,
		), $atts, 'eo_map' );

		$map_id = intval( $atts['id'] );
		if ( ! $map_id ) {
			return '';
		}

		$settings = get_post_meta( $map_id, '_eo_map_settings', true );
		$markers  = get_post_meta( $map_id, '_eo_map_markers', true );

		if ( ! is_array( $settings ) ) {
			return '';
		}

		if ( ! is_array( $markers ) ) {
			$markers = array();
		}

		$width  = esc_attr( $settings['width'] ?? '100%' );
		$height = esc_attr( $settings['height'] ?? '600px' );

		wp_enqueue_style( 'leaflet-css' );
		wp_enqueue_style( 'dashicons' );
		wp_enqueue_script( 'leaflet-js' );
		wp_enqueue_style( 'maplibre-gl-css' );
		wp_enqueue_script( 'maplibre-gl-leaflet-js' );
		wp_enqueue_script( 'eo-map-view-script', EO_BLOCKS_URL . 'blocks/build/eo-map/view.js', array( 'jquery', 'leaflet-js', 'maplibre-gl-leaflet-js' ), '1.0.0', true );
		wp_enqueue_style( 'eo-map-style', EO_BLOCKS_URL . 'blocks/build/eo-map/style-index.css', array( 'leaflet-css' ), '1.0.0' );

		ob_start();
		?>
		<div class="wp-block-eo-blocks-map eo-map-block-wrapper">
			<div class="eo-map-frontend-container"
				id="eo-map-frontend-<?php echo esc_attr( $map_id ); ?>"
				style="width: <?php echo $width; ?>; height: <?php echo $height; ?>;"
				data-settings="<?php echo esc_attr( json_encode( $settings ) ); ?>"
				data-markers="<?php echo esc_attr( json_encode( $markers ) ); ?>">
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

}