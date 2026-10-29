/**
 * Media helpers shared by the editor and the block transforms.
 *
 * A gallery item is stored as:
 * { id, type: 'image'|'video', url, previewUrl, alt, caption, width, height }
 * The front end only really needs `id` (render.php reads everything else from
 * the attachment); the other keys keep the editor fast and are the fallback
 * for media inserted from a URL, which have no attachment.
 */

const PREVIEW_SIZES = [ 'large', 'medium_large', 'medium', 'full' ];

const getMime = ( media ) => media.mime || media.mime_type || '';

export const getMediaType = ( media ) => {
	if ( media.type === 'video' || media.media_type === 'video' || getMime( media ).startsWith( 'video/' ) ) {
		return 'video';
	}
	if ( /\.(mp4|m4v|webm|ogv|mov)(\?|#|$)/i.test( media.url || '' ) ) {
		return 'video';
	}
	return 'image';
};

// Media library objects expose `sizes[size].url`, REST objects (uploads)
// expose `media_details.sizes[size].source_url`.
const getPreviewUrl = ( media ) => {
	for ( const size of PREVIEW_SIZES ) {
		const url = media.sizes?.[ size ]?.url || media.media_details?.sizes?.[ size ]?.source_url;
		if ( url ) {
			return url;
		}
	}
	return media.url || media.source_url;
};

const getCaption = ( media ) => {
	const caption = media.caption?.raw ?? media.caption ?? '';
	return typeof caption === 'string' ? caption : String( caption );
};

export const mediaToItem = ( media ) => {
	const type = getMediaType( media );
	const url = media.url || media.source_url || '';
	return {
		id: media.id ? Number( media.id ) : 0,
		type,
		url,
		previewUrl: type === 'image' ? getPreviewUrl( media ) : url,
		alt: media.alt || media.alt_text || '',
		caption: getCaption( media ),
		width: media.width || media.media_details?.width || 0,
		height: media.height || media.media_details?.height || 0,
	};
};

/**
 * Maps the list handed over by MediaPlaceholder / MediaUpload onto the stored
 * items. That list already holds the current items (as plain items, or as
 * media objects when coming back from the library) followed by the new ones,
 * so we mirror its order and only keep our existing data (captions, alt...)
 * for media we already know.
 */
export const mergeMedia = ( currentItems, mediaList ) => {
	const list = Array.isArray( mediaList ) ? mediaList : [ mediaList ];
	return list
		.filter( ( media ) => media && ( media.id || media.url ) )
		.map( ( media ) => {
			const existing = currentItems.find( ( item ) =>
				media.id ? item.id === Number( media.id ) : ! item.id && item.url === media.url
			);
			return existing || mediaToItem( media );
		} );
};
