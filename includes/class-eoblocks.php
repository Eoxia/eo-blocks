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
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
        add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_custom_block_hooks' ) );
		add_shortcode( 'eo_map', array( $this, 'render_map_shortcode' ) );

		// Landing pages hooks
		add_action( 'template_redirect', array( $this, 'intercept_frontend' ) );
		add_action( 'template_redirect', array( $this, 'intercept_404' ) );
		add_action( 'login_init', array( $this, 'intercept_login' ) );
		add_action( 'admin_bar_menu', array( $this, 'add_admin_bar_badge' ), 999 );
		add_action( 'wp_login_failed', array( $this, 'login_failed_redirect' ) );
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
		wp_enqueue_script( 'eo-map-view-script', EO_BLOCKS_URL . 'blocks/build/eo-map/view.js', array( 'jquery', 'leaflet-js' ), '1.0.0', true );
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

	/**
	 * Intercept frontend requests for Maintenance or Coming Soon modes
	 */
	public function intercept_frontend() {
		// Admin bar preview check first
		if ( current_user_can( 'manage_options' ) && isset( $_GET['eo_preview_landing_page'] ) ) {
			$type = sanitize_text_field( $_GET['eo_preview_landing_page'] );
			if ( in_array( $type, array( 'coming_soon', 'maintenance', 'login', '404' ) ) ) {
				$this->render_landing_page( $type );
				exit;
			}
		}

		// Administrators bypass maintenance and coming soon
		if ( current_user_can( 'manage_options' ) ) {
			return;
		}

		// Don't intercept admin panel or standard login actions
		if ( is_admin() || in_array( $GLOBALS['pagenow'] ?? '', array( 'wp-login.php', 'wp-register.php' ) ) ) {
			return;
		}

		$settings = get_option( 'eo_landing_pages_settings', array() );
		$coming_soon_active = !empty( $settings['coming_soon']['active'] );
		$maintenance_active = !empty( $settings['maintenance']['active'] );

		// Maintenance has priority
		if ( $maintenance_active ) {
			status_header( 503 );
			$this->render_landing_page( 'maintenance' );
			exit;
		} elseif ( $coming_soon_active ) {
			$this->render_landing_page( 'coming_soon' );
			exit;
		}
	}

	/**
	 * Intercept 404 requests to display custom 404 page
	 */
	public function intercept_404() {
		if ( is_404() ) {
			$settings = get_option( 'eo_landing_pages_settings', array() );
			$status_404_active = !empty( $settings['404']['active'] );
			if ( $status_404_active ) {
				status_header( 404 );
				$this->render_landing_page( '404' );
				exit;
			}
		}
	}

	public function intercept_login() {
		if ( is_user_logged_in() || ! empty( $_REQUEST['interim-login'] ) ) {
			return;
		}

		$settings = get_option( 'eo_landing_pages_settings', array() );
		$login_active = !empty( $settings['login']['active'] );

		if ( $login_active && isset( $_SERVER['REQUEST_METHOD'] ) && 'GET' === $_SERVER['REQUEST_METHOD'] ) {
			$action = isset( $_GET['action'] ) ? $_GET['action'] : 'login';
			if ( 'login' === $action ) {
				$this->render_landing_page( 'login' );
				exit;
			}
		}
	}

	/**
	 * Render the custom landing page template
	 * @param string $type Page type: coming_soon, maintenance, login, 404
	 */
	public function render_landing_page( $type ) {
		$settings_all = get_option( 'eo_landing_pages_settings', array() );
		
		// Load default values if not configured
		$defaults = array(
			'coming_soon' => array(
				'title'       => __( 'Bientôt disponible', 'eo-blocks' ),
				'description' => __( 'Notre nouveau site est en cours de création. Restez à l\'écoute !', 'eo-blocks' ),
				'style'       => 'minimalist',
				'bg_color'    => '#0f172a',
				'text_color'  => '#f8fafc',
				'accent_color'=> '#3b82f6',
			),
			'maintenance' => array(
				'title'       => __( 'Site en maintenance', 'eo-blocks' ),
				'description' => __( 'Nous effectuons actuellement des opérations de maintenance. Nous serons de retour très rapidement.', 'eo-blocks' ),
				'style'       => 'gradient',
				'bg_color'    => '#1e1b4b',
				'text_color'  => '#f8fafc',
				'accent_color'=> '#6366f1',
			),
			'login' => array(
				'title'       => __( 'Connexion', 'eo-blocks' ),
				'description' => __( 'Veuillez vous connecter pour accéder au site.', 'eo-blocks' ),
				'style'       => 'glassmorphism',
				'bg_color'    => '#0f172a',
				'text_color'  => '#f8fafc',
				'accent_color'=> '#06b6d4',
			),
			'404' => array(
				'title'       => __( 'Page non trouvée', 'eo-blocks' ),
				'description' => __( 'Désolé, la page que vous recherchez n\'existe pas ou a été déplacée.', 'eo-blocks' ),
				'style'       => 'minimalist',
				'bg_color'    => '#0f172a',
				'text_color'  => '#f8fafc',
				'accent_color'=> '#ef4444',
			),
		);

		$page_settings = isset( $settings_all[$type] ) ? array_merge( $defaults[$type], $settings_all[$type] ) : $defaults[$type];

		// Disable caching
		nocache_headers();

		include EO_BLOCKS_PATH . '/includes/templates/landing-page-template.php';
	}

	/**
	 * Add custom node to admin bar when Coming Soon or Maintenance mode is ON
	 */
	public function add_admin_bar_badge( $wp_admin_bar ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$settings = get_option( 'eo_landing_pages_settings', array() );
		$coming_soon_active = !empty( $settings['coming_soon']['active'] );
		$maintenance_active = !empty( $settings['maintenance']['active'] );

		if ( $coming_soon_active || $maintenance_active ) {
			$label = '';
			if ( $coming_soon_active && $maintenance_active ) {
				$label = __( 'Modes Prochainement & Maintenance actifs', 'eo-blocks' );
			} elseif ( $coming_soon_active ) {
				$label = __( 'Mode Prochainement actif', 'eo-blocks' );
			} else {
				$label = __( 'Mode Maintenance actif', 'eo-blocks' );
			}

			// Add custom styles for the red badge to the head
			add_action( 'admin_head', function() {
				echo '<style>
					#wpadminbar #wp-admin-bar-eo-landing-pages-status > .ab-item {
						background-color: #d63638 !important;
						color: #ffffff !important;
						font-weight: bold !important;
						border-radius: 4px;
						margin-top: 4px;
						height: 22px;
						line-height: 22px;
						padding: 0 10px;
					}
					#wpadminbar #wp-admin-bar-eo-landing-pages-status:hover > .ab-item {
						background-color: #b32424 !important;
						color: #ffffff !important;
					}
				</style>';
			} );

			// Also for frontend admin bar
			add_action( 'wp_head', function() {
				echo '<style>
					#wpadminbar #wp-admin-bar-eo-landing-pages-status > .ab-item {
						background-color: #d63638 !important;
						color: #ffffff !important;
						font-weight: bold !important;
						border-radius: 4px;
						margin-top: 4px;
						height: 22px;
						line-height: 22px;
						padding: 0 10px;
					}
					#wpadminbar #wp-admin-bar-eo-landing-pages-status:hover > .ab-item {
						background-color: #b32424 !important;
						color: #ffffff !important;
					}
				</style>';
			} );

			$wp_admin_bar->add_node( array(
				'id'    => 'eo-landing-pages-status',
				'title' => esc_html( $label ),
				'href'  => admin_url( 'admin.php?page=eo-blocks-landing-pages' ),
				'meta'  => array(
					'title' => $label,
				),
			) );
		}
	}

	/**
	 * Redirect failed login attempts back to custom login page with error arg
	 */
	public function login_failed_redirect( $username ) {
		$settings = get_option( 'eo_landing_pages_settings', array() );
		$login_active = !empty( $settings['login']['active'] );

		if ( $login_active ) {
			$referrer = wp_get_referer();
			if ( $referrer && strpos( $referrer, 'wp-login.php' ) !== false ) {
				// Redirect back with login_error flag
				wp_redirect( add_query_arg( 'login_error', '1', $referrer ) );
				exit;
			}
		}
	}
}