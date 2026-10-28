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

$items = isset( $attributes['items'] ) && is_array( $attributes['items'] ) ? $attributes['items'] : array();
$items = array_values(
	array_filter(
		$items,
		function ( $item ) {
			return is_array( $item ) && ( ! empty( $item['id'] ) || ! empty( $item['url'] ) );
		}
	)
);

if ( empty( $items ) ) {
	return;
}

$layout         = in_array( $attributes['layout'], array( 'grid', 'masonry', 'carousel' ), true ) ? $attributes['layout'] : 'grid';
$link_to        = in_array( $attributes['linkTo'], array( 'lightbox', 'media', 'attachment', 'none' ), true ) ? $attributes['linkTo'] : 'lightbox';
$columns        = max( 1, min( 8, (int) $attributes['columns'] ) );
$mobile_columns = max( 1, min( 4, (int) $attributes['mobileColumns'] ) );
$is_carousel    = 'carousel' === $layout;
$is_cropped     = $attributes['crop'] && 'masonry' !== $layout;
$image_size     = sanitize_key( $attributes['imageSize'] );
$aspect_ratio   = preg_match( '#^\d+(\.\d+)?(/\d+(\.\d+)?)?$#', $attributes['aspectRatio'] ) ? $attributes['aspectRatio'] : '4/3';

// The order is applied here and not in the editor, so authors keep editing
// in their own order. Note that a page cache freezes the "random" order
// until the cache is purged.
if ( 'reverse' === $attributes['order'] ) {
	$items = array_reverse( $items );
} elseif ( 'random' === $attributes['order'] ) {
	shuffle( $items );
}

// Images are as wide as a column (or a slide): tell the browser so it picks
// the right file from the srcset instead of the full-width one.
$sizes = sprintf( '(max-width: 599px) %1$svw, %2$svw', round( 100 / $mobile_columns, 2 ), round( 100 / $columns, 2 ) );

$render_item = function ( $item, $index ) use ( $link_to, $image_size, $sizes, $is_carousel, $attributes ) {
	$id      = ! empty( $item['id'] ) ? (int) $item['id'] : 0;
	$type    = isset( $item['type'] ) && 'video' === $item['type'] ? 'video' : 'image';
	$caption = $attributes['showCaptions'] && ! empty( $item['caption'] ) ? $item['caption'] : '';
	$width   = ! empty( $item['width'] ) ? (int) $item['width'] : 0;
	$height  = ! empty( $item['height'] ) ? (int) $item['height'] : 0;

	if ( 'image' === $type ) {
		$full = $id ? wp_get_attachment_image_src( $id, 'full' ) : false;
		if ( $full ) {
			list( $src, $width, $height ) = $full;
			$alt   = isset( $item['alt'] ) && '' !== $item['alt'] ? $item['alt'] : get_post_meta( $id, '_wp_attachment_image_alt', true );
			$media = wp_get_attachment_image(
				$id,
				$image_size,
				false,
				array(
					'class'   => 'eo-gallery__media',
					'alt'     => $alt,
					'sizes'   => $sizes,
					'loading' => 'lazy',
				)
			);
		} else {
			$src   = isset( $item['url'] ) ? $item['url'] : '';
			$alt   = isset( $item['alt'] ) ? $item['alt'] : '';
			$media = sprintf( '<img class="eo-gallery__media" src="%1$s" alt="%2$s" loading="lazy" decoding="async" />', esc_url( $src ), esc_attr( $alt ) );
		}
	} else {
		$src  = $id ? wp_get_attachment_url( $id ) : ( isset( $item['url'] ) ? $item['url'] : '' );
		$alt  = '';
		$meta = $id ? wp_get_attachment_metadata( $id ) : false;
		if ( ! empty( $meta['width'] ) && ! empty( $meta['height'] ) ) {
			$width  = (int) $meta['width'];
			$height = (int) $meta['height'];
		}
		// A featured image set on the video is used as poster, otherwise the
		// browser shows the first frame (#t=0.1 forces it on Safari).
		$poster = $id && has_post_thumbnail( $id ) ? get_the_post_thumbnail_url( $id, 'large' ) : '';
		$media  = sprintf(
			'<video class="eo-gallery__media" src="%1$s"%2$s%3$s muted playsinline preload="metadata"></video>',
			esc_url( $poster ? $src : $src . '#t=0.1' ),
			$poster ? ' poster="' . esc_url( $poster ) . '"' : '',
			'none' === $link_to ? ' controls' : ''
		);
	}

	if ( ! $src || ! $media ) {
		return '';
	}

	if ( 'lightbox' === $link_to ) {
		$media = sprintf(
			'<a class="eo-gallery__link" href="%1$s" data-eo-lightbox data-index="%2$d" data-type="%3$s" data-width="%4$d" data-height="%5$d" aria-label="%6$s">%7$s</a>',
			esc_url( $src ),
			$index,
			esc_attr( $type ),
			$width,
			$height,
			esc_attr(
				'video' === $type
					? __( 'Play the video', 'eo-blocks' )
					/* translators: %s: image alternative text. */
					: ( $alt ? sprintf( __( 'Enlarge: %s', 'eo-blocks' ), $alt ) : __( 'Enlarge the image', 'eo-blocks' ) )
			),
			$media
		);
	} elseif ( 'media' === $link_to || ( 'attachment' === $link_to && $id ) ) {
		$media = sprintf(
			'<a class="eo-gallery__link" href="%1$s">%2$s</a>',
			esc_url( 'media' === $link_to ? $src : get_attachment_link( $id ) ),
			$media
		);
	}

	$classes = array( 'eo-gallery__item', 'eo-gallery__item--' . $type );
	if ( $is_carousel ) {
		$classes[] = 'swiper-slide';
	}

	return sprintf(
		'<figure class="%1$s"%2$s>%3$s%4$s%5$s</figure>',
		esc_attr( implode( ' ', $classes ) ),
		$width && $height ? sprintf( ' style="--eo-item-ratio: %d / %d"', $width, $height ) : '',
		$media,
		'video' === $type && 'none' !== $link_to ? '<span class="eo-gallery__play" aria-hidden="true"></span>' : '',
		$caption ? '<figcaption class="eo-gallery__caption">' . wp_kses_post( $caption ) . '</figcaption>' : ''
	);
};

$items_html = '';
foreach ( $items as $index => $item ) {
	$items_html .= $render_item( $item, $index );
}

$classes = array( 'eo-gallery', 'eo-gallery--' . $layout );
if ( $is_cropped ) {
	$classes[] = 'eo-gallery--cropped';
}
if ( $attributes['hoverZoom'] ) {
	$classes[] = 'eo-gallery--hover-zoom';
}

$style = sprintf(
	'--eo-gallery-columns: %1$d; --eo-gallery-columns-mobile: %2$d; --eo-gallery-gap: %3$dpx; --eo-gallery-ratio: %4$s; --eo-gallery-radius: %5$dpx; --eo-gallery-color: %6$s;',
	$columns,
	$mobile_columns,
	(int) $attributes['gap'],
	$aspect_ratio,
	(int) $attributes['radius'],
	preg_match( '/^[#a-zA-Z0-9(),.%\s]+$/', $attributes['mainColor'] ) ? $attributes['mainColor'] : '#007aff'
);

$config = array(
	'layout'   => $layout,
	'lightbox' => 'lightbox' === $link_to,
	'labels'   => array(
		'dialog'  => __( 'Media viewer', 'eo-blocks' ),
		'close'   => __( 'Close', 'eo-blocks' ),
		'prev'    => __( 'Previous media', 'eo-blocks' ),
		'next'    => __( 'Next media', 'eo-blocks' ),
		'zoomIn'  => __( 'Zoom in', 'eo-blocks' ),
		'zoomOut' => __( 'Zoom out', 'eo-blocks' ),
	),
);

// The carousel markup is always the same (arrows next to .swiper, never
// inside it): only this class, read by the CSS, moves the arrows. Without
// arrows, "outside" would only leave an empty gutter on each side.
$navigation_position = $attributes['navigation'] && 'outside' === $attributes['navigationPosition'] ? 'outside' : 'inside';

if ( $is_carousel ) {
	// Swiper is only loaded on pages showing a carousel. Block themes render
	// the template before wp_enqueue_scripts, where these handles are
	// normally registered, hence the fallback registration.
	if ( ! wp_script_is( 'eo-blocks-swiper-js', 'registered' ) ) {
		wp_register_style( 'eo-blocks-swiper-css', EO_BLOCKS_URL . 'assets/inc/swiper-bundle.min.css', array(), '11.1.15' );
		wp_register_script( 'eo-blocks-swiper-js', EO_BLOCKS_URL . 'assets/inc/swiper-bundle.min.js', array(), '11.1.15', true );
	}
	wp_enqueue_style( 'eo-blocks-swiper-css' );
	wp_enqueue_script( 'eo-blocks-swiper-js' );

	$classes[] = 'eo-gallery--nav-' . $navigation_position;

	$config['carousel'] = array(
		'slidesPerView'       => $columns,
		'mobileSlidesPerView' => $mobile_columns,
		'spaceBetween'        => (int) $attributes['gap'],
		'speed'               => (int) $attributes['speed'],
		'loop'                => (bool) $attributes['loop'],
		'autoplay'            => $attributes['autoplay'] ? max( 1000, (int) $attributes['autoplayDelay'] ) : false,
		'navigation'          => (bool) $attributes['navigation'],
		'pagination'          => (bool) $attributes['pagination'],
		'autoHeight'          => ! $is_cropped && 1 === $columns,
	);
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'           => implode( ' ', $classes ),
		'style'           => $style,
		'data-eo-gallery' => wp_json_encode( $config ),
	)
);
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<?php if ( $is_carousel ) : ?>
		<div class="eo-gallery__carousel">
			<div class="swiper eo-gallery__swiper<?php echo $attributes['pagination'] ? ' has-pagination' : ''; ?>">
				<div class="swiper-wrapper">
					<?php echo $items_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in $render_item. ?>
				</div>
				<?php if ( $attributes['pagination'] ) : ?>
					<div class="swiper-pagination"></div>
				<?php endif; ?>
			</div>
			<?php if ( $attributes['navigation'] ) : ?>
				<div class="swiper-button-prev"></div>
				<div class="swiper-button-next"></div>
			<?php endif; ?>
		</div>
	<?php else : ?>
		<div class="eo-gallery__items">
			<?php echo $items_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in $render_item. ?>
		</div>
	<?php endif; ?>
</div>
