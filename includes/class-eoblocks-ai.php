<?php
/**
 * Documents EO Blocks for AI assistants connected through EO Tools (MCP).
 *
 * - Usage guides: blocks/ai-guides/{block}.md, returned by the eo-tools/get-block tool.
 * - Block extensions: attributes EO Blocks adds to core blocks (e.g. the summary
 *   on headings), so EO Tools can generate the same HTML as the editor.
 *
 * Without EO Tools, these filters are never applied.
 *
 * @package EoBlocks
 */

namespace EoBlocks\Includes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Eoblocks_Ai {

	/**
	 * Blocks sharing the guide of another block.
	 */
	const GUIDE_ALIASES = array(
		'tabs-buttons'          => 'tabs',
		'tabs-buttons-inner'    => 'tabs',
		'tabs-contents'         => 'tabs',
		'tabs-contents-inner'   => 'tabs',
		'google-review-card'    => 'reviews',
		'google-review-prompt'  => 'reviews',
		'google-reviews-count'  => 'reviews',
		'google-reviews-rating' => 'reviews',
	);

	public function __construct() {
		add_filter( 'eo_tools_mcp_block_guide', array( $this, 'block_guide' ), 10, 2 );
		add_filter( 'eo_tools_mcp_block_extensions', array( $this, 'block_extensions' ) );
	}

	/**
	 * Returns the usage guide of an EO Blocks block.
	 *
	 * @param string $guide Guide provided so far.
	 * @param string $name  Block name.
	 * @return string
	 */
	public function block_guide( $guide, $name ) {
		if ( 0 !== strpos( $name, 'eo-blocks/' ) ) {
			return $guide;
		}

		$slug = substr( $name, strlen( 'eo-blocks/' ) );
		$slug = isset( self::GUIDE_ALIASES[ $slug ] ) ? self::GUIDE_ALIASES[ $slug ] : $slug;
		$file = dirname( __DIR__ ) . '/blocks/ai-guides/' . sanitize_file_name( $slug ) . '.md';

		if ( ! is_readable( $file ) ) {
			return $guide;
		}

		return trim( (string) file_get_contents( $file ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	}

	/**
	 * Declares the attributes EO Blocks adds to core blocks.
	 *
	 * @param array[] $extensions Extensions.
	 * @return array[]
	 */
	public function block_extensions( $extensions ) {
		// Same output as eoSummaryApplyExtraClass() in blocks/src/eo-summary/hooks.js.
		$extensions[] = array(
			'block'      => 'core/heading',
			'attributes' => array( 'displaySummary', 'summaryLabel' ),
			'props'      => array( $this, 'summary_props' ),
		);

		return $extensions;
	}

	/**
	 * Wrapper props of a heading included in the summary.
	 *
	 * @param array $attributes Heading attributes.
	 * @return array
	 */
	public function summary_props( $attributes ) {
		if ( empty( $attributes['displaySummary'] ) ) {
			return array();
		}

		$label = ! empty( $attributes['summaryLabel'] ) ? (string) $attributes['summaryLabel'] : ( isset( $attributes['content'] ) ? (string) $attributes['content'] : '' );

		return array(
			'class'      => array( 'eo-summary__control' ),
			'attributes' => array(
				'summary-label' => $label,
				'id'            => self::summary_anchor( $label ),
			),
		);
	}

	/**
	 * Anchor of a summary item, same as cleanSummaryString() in hooks.js.
	 *
	 * @param string $label Label.
	 * @return string
	 */
	public static function summary_anchor( $label ) {
		if ( class_exists( 'Normalizer' ) ) {
			$label = preg_replace( '/\p{Mn}/u', '', \Normalizer::normalize( $label, \Normalizer::FORM_D ) );
		} else {
			$label = remove_accents( $label );
		}

		return trim( preg_replace( '/[^a-zA-Z0-9]+/', '-', strtolower( $label ) ), '-' );
	}
}
