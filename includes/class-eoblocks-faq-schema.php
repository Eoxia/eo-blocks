<?php
/**
 * Aggregates schema.org FAQPage structured data from EO Accordion blocks.
 *
 * @package EoBlocks
 */

namespace EoBlocks\Includes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Eoblocks_Faq_Schema {

	/**
	 * Questions collected while the page is rendered.
	 *
	 * @var array
	 */
	private static $questions = array();

	public function __construct() {
		add_filter( 'render_block', array( $this, 'collect_question' ), 10, 2 );
		add_action( 'wp_footer', array( $this, 'print_schema' ) );
	}

	/**
	 * Collects question/answer pairs from accordion blocks that opted in to the schema markup.
	 *
	 * @param string $block_content Rendered block markup.
	 * @param array  $block         Parsed block, including its attributes and inner blocks.
	 * @return string Unmodified block markup.
	 */
	public function collect_question( $block_content, $block ) {
		if ( is_admin() || empty( $block['blockName'] ) || 'eo-blocks/accordion' !== $block['blockName'] ) {
			return $block_content;
		}

		$attrs = $block['attrs'] ?? array();

		if ( empty( $attrs['displaySchema'] ) || empty( $attrs['title'] ) ) {
			return $block_content;
		}

		$question = trim( wp_strip_all_tags( $attrs['title'] ) );
		$answer   = $this->extract_answer( $block_content );

		if ( '' === $question || '' === $answer ) {
			return $block_content;
		}

		$key = md5( $question . '|' . $answer );

		self::$questions[ $key ] = array(
			'question' => $question,
			'answer'   => $answer,
		);

		return $block_content;
	}

	/**
	 * Extracts the plain-text answer from the rendered accordion markup.
	 *
	 * @param string $block_content Rendered block markup.
	 * @return string Plain-text answer, empty string if none found.
	 */
	private function extract_answer( $block_content ) {
		if ( '' === trim( $block_content ) ) {
			return '';
		}

		$dom = new \DOMDocument();
		libxml_use_internal_errors( true );
		$dom->loadHTML( '<?xml encoding="utf-8" ?><div>' . $block_content . '</div>' );
		libxml_clear_errors();

		$xpath = new \DOMXPath( $dom );
		$nodes = $xpath->query( "//*[contains(concat(' ', normalize-space(@class), ' '), ' eo-accordion__inner ')]" );

		if ( ! $nodes || 0 === $nodes->length ) {
			return '';
		}

		$inner_html = '';
		foreach ( $nodes->item( 0 )->childNodes as $child ) {
			$inner_html .= $dom->saveHTML( $child );
		}

		return trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( $inner_html ) ) );
	}

	/**
	 * Prints a single FAQPage JSON-LD script combining every opted-in accordion on the page.
	 */
	public function print_schema() {
		if ( empty( self::$questions ) ) {
			return;
		}

		$schema = array(
			'@context'   => 'https://schema.org',
			'@type'      => 'FAQPage',
			'mainEntity' => array_map(
				function ( $item ) {
					return array(
						'@type'          => 'Question',
						'name'           => $item['question'],
						'acceptedAnswer' => array(
							'@type' => 'Answer',
							'text'  => $item['answer'],
						),
					);
				},
				array_values( self::$questions )
			),
		);

		echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";

		self::$questions = array();
	}
}
