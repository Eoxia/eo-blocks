<?php
/**
 * AJAX endpoints for eo-search block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Get available post types via AJAX
 */
add_action( 'wp_ajax_nopriv_eo_search_get_post_types', 'eo_search_ajax_get_post_types' );
add_action( 'wp_ajax_eo_search_get_post_types', 'eo_search_ajax_get_post_types' );

function eo_search_ajax_get_post_types() {
	// Get all post types
	$post_types = get_post_types(
		array(
			'public' => true,
		),
		'objects'
	);

	$types_array = array();
	foreach ( $post_types as $type ) {
		// Skip attachment type
		if ( 'attachment' === $type->name ) {
			continue;
		}

		// Include all public post types, especially page and post
		$types_array[] = array(
			'value' => $type->name,
			'label' => $type->label,
		);
	}

	wp_send_json_success( $types_array );
}

/**
 * Perform search via AJAX
 */
add_action( 'wp_ajax_nopriv_eo_search_perform_search', 'eo_search_ajax_perform_search' );
add_action( 'wp_ajax_eo_search_perform_search', 'eo_search_ajax_perform_search' );

function eo_search_ajax_perform_search() {
	$search_term = isset( $_POST['search'] ) ? sanitize_text_field( wp_unslash( $_POST['search'] ) ) : '';
	$post_types  = isset( $_POST['post_types'] ) ? array_map( 'sanitize_text_field', (array) wp_unslash( $_POST['post_types'] ) ) : array();
	$per_page    = isset( $_POST['per_page'] ) ? intval( wp_unslash( $_POST['per_page'] ) ) : 10;

	if ( ! $search_term ) {
		wp_send_json_success( array() );
	}

	if ( empty( $post_types ) ) {
		wp_send_json_success( array() );
	}

	$args = array(
		's'              => $search_term,
		'post_type'      => $post_types,
		'posts_per_page' => $per_page,
		'paged'          => 1,
	);

	$query   = new WP_Query( $args );
	$results = array();

	foreach ( $query->posts as $post ) {
		$featured_image_url = '';
		if ( has_post_thumbnail( $post->ID ) ) {
			$featured_image_url = get_the_post_thumbnail_url( $post->ID, 'thumbnail' );
		}

		$results[] = array(
			'id'       => $post->ID,
			'title'    => $post->post_title,
			'url'      => get_permalink( $post->ID ),
			'type'     => $post->post_type,
			'subtype'  => $post->post_type,
			'excerpt'  => wp_trim_words( $post->post_excerpt ?: $post->post_content, 20 ),
			'thumbnail' => $featured_image_url,
		);
	}

	wp_send_json_success( $results );
}
