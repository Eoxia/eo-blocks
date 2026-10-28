import { createBlock } from '@wordpress/blocks';

/**
 * Converts the native Gallery block both ways, so switching never loses
 * pictures. Videos have no equivalent in the native Gallery and are dropped
 * when going back to it.
 */
const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/gallery' ],
			transform: ( attributes, innerBlocks = [] ) => {
				const fromInnerBlocks = innerBlocks
					.filter( ( block ) => block.name === 'core/image' && block.attributes.url )
					.map( ( { attributes: image } ) => ( {
						id: image.id ? Number( image.id ) : 0,
						type: 'image',
						url: image.url,
						previewUrl: image.url,
						alt: image.alt || '',
						caption: image.caption ? String( image.caption ) : '',
						width: image.width ? parseInt( image.width, 10 ) || 0 : 0,
						height: image.height ? parseInt( image.height, 10 ) || 0 : 0,
					} ) );

				// Galleries saved before WordPress 5.9 keep their images in an attribute.
				const fromLegacy = ( attributes.images || [] ).map( ( image ) => ( {
					id: image.id ? Number( image.id ) : 0,
					type: 'image',
					url: image.fullUrl || image.url,
					previewUrl: image.url,
					alt: image.alt || '',
					caption: image.caption ? String( image.caption ) : '',
					width: 0,
					height: 0,
				} ) );

				// Explicit links are kept; "none" (the native default) gets the
				// lightbox, the main reason to switch to this block.
				const linkTo = { media: 'media', attachment: 'attachment' }[ attributes.linkTo ] || 'lightbox';

				return createBlock( 'eo-blocks/gallery', {
					items: fromInnerBlocks.length ? fromInnerBlocks : fromLegacy,
					columns: attributes.columns || 3,
					crop: attributes.imageCrop !== false,
					imageSize: attributes.sizeSlug || 'large',
					linkTo,
				} );
			},
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/gallery' ],
			transform: ( attributes ) =>
				createBlock(
					'core/gallery',
					{
						columns: attributes.columns,
						imageCrop: attributes.crop,
						sizeSlug: attributes.imageSize,
						linkTo: [ 'media', 'attachment' ].includes( attributes.linkTo ) ? attributes.linkTo : 'none',
					},
					attributes.items
						.filter( ( item ) => item.type === 'image' )
						.map( ( item ) =>
							createBlock( 'core/image', {
								id: item.id || undefined,
								url: item.url,
								alt: item.alt,
								caption: item.caption,
								sizeSlug: attributes.imageSize,
								lightbox: attributes.linkTo === 'lightbox' ? { enabled: true } : undefined,
							} )
						)
				),
		},
	],
};

export default transforms;
