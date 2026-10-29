<?php
/**
 * Summary WPML rendering helpers.
 *
 * @package EoBlocks
 */

namespace EoBlocks\Includes;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Eoblocks_Summary {
    public function __construct() {
        add_filter( 'render_block', array( $this, 'render_summary_label_wpml' ), 10, 2 );
    }

    public function render_summary_label_wpml( $block_content, $block ) {
        if ( empty( $block['blockName'] ) || 'core/heading' !== $block['blockName'] ) {
            return $block_content;
        }

        $attrs = $block['attrs'] ?? [];
        $display = $attrs['displaySummary'] ?? false;
        $summary_label = $attrs['summaryLabel'] ?? '';

        if ( ! $display || empty( $summary_label ) ) {
            return $block_content;
        }

        $translated_label = apply_filters( 'wpml_translate_single_string', $summary_label, 'gutenberg', 'summaryLabel' );
        $clean_id = strtolower( preg_replace( '/[^a-zA-Z0-9]+/', '-', remove_accents( $translated_label ) ) );
        $clean_id = trim( $clean_id, '-' );

        $block_content = preg_replace(
            '/summary-label="[^"]*"/',
            'summary-label="' . esc_attr( $translated_label ) . '"',
            $block_content
        );

        $block_content = preg_replace(
            '/\bid="[^"]*"/',
            'id="' . esc_attr( $clean_id ) . '"',
            $block_content
        );

        return $block_content;
    }
}
