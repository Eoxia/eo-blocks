<?php
/**
 * Admin settings menu.
 *
 * @package Views
 * @author Eoxia
 *
 * @since 1.0.0
 */

namespace EoBlocks\Includes\Admin;

if (!defined('ABSPATH')) {
	exit;
}

class Eoblocks_Menu {

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
	}

	public function add_admin_menu() {
		add_submenu_page(
			'options-general.php',
			__('EO Blocks', 'eo-blocks'),
			__('EO Blocks', 'eo-blocks'),
			'manage_options',
			'eo-blocks',
			[ $this, 'settings_page_view' ]
		);
	}

	public function settings_page_view() {
		include EO_BLOCKS_PATH . '/includes/admin/views/html-admin-page-settings.php';
	}
}
