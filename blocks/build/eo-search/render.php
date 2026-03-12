<?php
/**
 * Dynamic Block Template.
 * @param   array $attributes - A clean associative array of block attributes.
 * @param   array $block - All the block settings and attributes.
 * @param   string $content - The block inner HTML (usually empty unless using inner blocks).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$search_text         = ! empty( $attributes['searchText'] ) ? $attributes['searchText'] : 'Rechercher';
$selected_post_types = ! empty( $attributes['selectedPostTypes'] ) ? $attributes['selectedPostTypes'] : array();
$show_icon           = isset( $attributes['showIcon'] ) ? (bool) $attributes['showIcon'] : true;
$show_label          = isset( $attributes['showLabel'] ) ? (bool) $attributes['showLabel'] : true;
$show_thumbnail      = isset( $attributes['showThumbnail'] ) ? (bool) $attributes['showThumbnail'] : true;
$show_title          = isset( $attributes['showTitle'] ) ? (bool) $attributes['showTitle'] : true;
$show_description    = isset( $attributes['showDescription'] ) ? (bool) $attributes['showDescription'] : true;

// Convert selected post types to JSON for JavaScript
$post_types_json = wp_json_encode( $selected_post_types );
$options_json = wp_json_encode( array(
	'showIcon'       => $show_icon,
	'showThumbnail'  => $show_thumbnail,
	'showTitle'      => $show_title,
	'showDescription' => $show_description,
) );
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?> data-post-types="<?php echo esc_attr( $post_types_json ); ?>" data-options="<?php echo esc_attr( $options_json ); ?>">
	<div class="eo-search__container eo-search__trigger">
		<?php if ( $show_icon ) : ?>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="eo-search__icon">
				<circle cx="11" cy="11" r="8"></circle>
				<path d="m21 21-4.35-4.35"></path>
			</svg>
		<?php endif; ?>
		<?php if ( $show_label ) : ?>
			<span class="eo-search__text"><?php echo esc_html( $search_text ); ?></span>
		<?php endif; ?>
	</div>

	<div class="eo-search__modal" style="display: none;">
		<div class="eo-search__modal-overlay"></div>
		<div class="eo-search__modal-content">
			<div class="eo-search__modal-header">
				<input
					type="text"
					class="eo-search__input"
					placeholder="<?php echo esc_attr( $search_text ); ?>"
					aria-label="<?php echo esc_attr( $search_text ); ?>"
				/>
				<button class="eo-search__close" aria-label="<?php echo esc_attr( __( 'Close search', 'eo-blocks' ) ); ?>">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>
			<div class="eo-search__results" id="eo-search-results"></div>
		</div>
	</div>
</div>
