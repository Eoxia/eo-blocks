/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	InspectorControls,
	BlockControls,
	BlockIcon,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	RangeControl,
	ToggleControl,
	SelectControl,
	TextareaControl,
	ColorPicker,
	Dropdown,
	Spinner,
	ToolbarGroup,
	ToolbarButton,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalHStack as HStack,
	__experimentalText as Text,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useEffect, useRef } from '@wordpress/element';
import { isBlobURL } from '@wordpress/blob';
import { chevronLeft, chevronRight, closeSmall } from '@wordpress/icons';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './scss/editor.scss';

import blockIcon from './icon';
import { mergeMedia } from './utils';

const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ];

// Media library selection mode: a plain click adds a media, a second click
// removes it. Shift (range) and Ctrl/Cmd (toggle) keep working as usual.
// With `true`, a plain click would replace the whole selection.
const MULTIPLE_SELECTION = 'toggle';

const ASPECT_RATIOS = [
	{ label: __( 'Square - 1:1', 'eo-blocks' ), value: '1' },
	{ label: __( 'Standard - 4:3', 'eo-blocks' ), value: '4/3' },
	{ label: __( 'Classic - 3:2', 'eo-blocks' ), value: '3/2' },
	{ label: __( 'Wide - 16:9', 'eo-blocks' ), value: '16/9' },
	{ label: __( 'Portrait - 3:4', 'eo-blocks' ), value: '3/4' },
	{ label: __( 'Tall - 2:3', 'eo-blocks' ), value: '2/3' },
];

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes, isSelected } ) {
	const {
		items,
		layout,
		columns,
		mobileColumns,
		gap,
		crop,
		aspectRatio,
		imageSize,
		radius,
		hoverZoom,
		order,
		showCaptions,
		linkTo,
		navigation,
		navigationPosition,
		pagination,
		mainColor,
		autoplay,
		autoplayDelay,
		loop,
		speed,
	} = attributes;

	// Index of the item currently selected inside the gallery (not a block).
	const [ selectedItem, setSelectedItem ] = useState( null );

	const imageSizes = useSelect( ( select ) => select( blockEditorStore ).getSettings().imageSizes || [], [] );

	useEffect( () => {
		if ( ! isSelected ) {
			setSelectedItem( null );
		}
	}, [ isSelected ] );

	const onSelectMedia = ( media ) => setAttributes( { items: mergeMedia( items, media ) } );

	const updateItem = ( index, changes ) => {
		setAttributes( { items: items.map( ( item, i ) => ( i === index ? { ...item, ...changes } : item ) ) } );
	};

	const moveItem = ( from, to ) => {
		if ( to < 0 || to >= items.length ) {
			return;
		}
		const next = [ ...items ];
		next.splice( to, 0, next.splice( from, 1 )[ 0 ] );
		setAttributes( { items: next } );
		setSelectedItem( to );
	};

	const removeItem = ( index ) => {
		setAttributes( { items: items.filter( ( _, i ) => i !== index ) } );
		setSelectedItem( null );
	};

	// Reordering by drag & drop. Like the Carousel block's dots, this uses
	// native listeners bound on the items container rather than React props:
	// the block wrapper has its own native "dragstart" listener (block
	// dragging) which cancels any drag it did not start, and only stopping the
	// event on the way up, before it reaches the wrapper, prevents that.
	const itemsContainerRef = useRef( null );
	const itemsRef = useRef( items );
	const moveItemRef = useRef( moveItem );
	const dragIndexRef = useRef( null );
	const [ dragIndex, setDragIndex ] = useState( null );
	// Drop target: { index, after } - insert before or after item `index`.
	const [ dropTarget, setDropTarget ] = useState( null );
	// Index of the item whose caption is being edited: it must not be
	// draggable, or selecting caption text would start dragging the item.
	const [ editingCaption, setEditingCaption ] = useState( null );

	useEffect( () => {
		itemsRef.current = items;
		moveItemRef.current = moveItem;
	} );

	useEffect( () => {
		const container = itemsContainerRef.current;
		if ( ! container ) {
			return;
		}

		const getItemIndex = ( target ) => {
			const itemEl = target?.closest?.( '[data-item-index]' );
			if ( ! itemEl || ! container.contains( itemEl ) ) {
				return null;
			}
			const index = Number( itemEl.dataset.itemIndex );
			return Number.isNaN( index ) ? null : { index, itemEl };
		};

		const reset = () => {
			dragIndexRef.current = null;
			setDragIndex( null );
			setDropTarget( null );
		};

		const onDragStart = ( event ) => {
			const found = getItemIndex( event.target );
			if ( ! found ) {
				return;
			}
			event.stopPropagation();
			dragIndexRef.current = found.index;
			setDragIndex( found.index );
			event.dataTransfer.effectAllowed = 'move';
			// Firefox requires data to be set for the drag to actually start. A
			// custom type, so the drag is never taken for text to paste.
			event.dataTransfer.setData( 'application/x-eo-gallery-item', String( found.index ) );
		};

		const onDragOver = ( event ) => {
			if ( dragIndexRef.current === null ) {
				return;
			}
			const found = getItemIndex( event.target );
			if ( ! found ) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			event.dataTransfer.dropEffect = 'move';
			const rect = found.itemEl.getBoundingClientRect();
			const after = event.clientX > rect.left + rect.width / 2;
			setDropTarget( ( current ) =>
				current?.index === found.index && current?.after === after ? current : { index: found.index, after }
			);
		};

		const onDrop = ( event ) => {
			const from = dragIndexRef.current;
			const found = getItemIndex( event.target );
			if ( from === null || ! found ) {
				reset();
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			const rect = found.itemEl.getBoundingClientRect();
			const gap = event.clientX > rect.left + rect.width / 2 ? found.index + 1 : found.index;
			// Target index once the dragged item has been taken out of the list.
			const to = gap > from ? gap - 1 : gap;
			reset();
			if ( to !== from && to >= 0 && to < itemsRef.current.length ) {
				moveItemRef.current( from, to );
			}
		};

		container.addEventListener( 'dragstart', onDragStart );
		container.addEventListener( 'dragover', onDragOver );
		container.addEventListener( 'drop', onDrop );
		container.addEventListener( 'dragend', reset );

		return () => {
			container.removeEventListener( 'dragstart', onDragStart );
			container.removeEventListener( 'dragover', onDragOver );
			container.removeEventListener( 'drop', onDrop );
			container.removeEventListener( 'dragend', reset );
		};
	}, [ items.length > 0 ] );

	const isCarousel = layout === 'carousel';
	const isCropped = crop && layout !== 'masonry';

	const blockProps = useBlockProps( {
		className: [
			'eo-gallery',
			`eo-gallery--${ layout }`,
			isCropped && 'eo-gallery--cropped',
			hoverZoom && 'eo-gallery--hover-zoom',
		]
			.filter( Boolean )
			.join( ' ' ),
		style: {
			'--eo-gallery-columns': columns,
			'--eo-gallery-columns-mobile': mobileColumns,
			'--eo-gallery-gap': `${ gap }px`,
			'--eo-gallery-ratio': aspectRatio,
			'--eo-gallery-radius': `${ radius }px`,
			'--eo-gallery-color': mainColor,
		},
	} );

	const mediaIds = items.filter( ( item ) => item.id ).map( ( item ) => item.id );

	if ( items.length === 0 ) {
		return (
			<div { ...blockProps }>
				<MediaPlaceholder
					icon={ <BlockIcon icon={ blockIcon } /> }
					labels={ {
						title: __( 'EO Gallery', 'eo-blocks' ),
						instructions: __(
							'Drag and drop images or videos, upload, or choose from your library.',
							'eo-blocks'
						),
					} }
					onSelect={ onSelectMedia }
					accept="image/*,video/*"
					allowedTypes={ ALLOWED_MEDIA_TYPES }
					multiple={ MULTIPLE_SELECTION }
				/>
			</div>
		);
	}

	const activeItem = selectedItem !== null ? items[ selectedItem ] : null;

	return (
		<>
			<BlockControls group="other">
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ onSelectMedia }
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						multiple={ MULTIPLE_SELECTION }
						value={ mediaIds }
						render={ ( { open } ) => (
							<ToolbarGroup>
								<ToolbarButton onClick={ open }>{ __( 'Add', 'eo-blocks' ) }</ToolbarButton>
							</ToolbarGroup>
						) }
					/>
				</MediaUploadCheck>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'eo-blocks' ) }>
					<ToggleGroupControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						isBlock
						label={ __( 'Layout', 'eo-blocks' ) }
						value={ layout }
						onChange={ ( value ) => setAttributes( { layout: value } ) }
					>
						<ToggleGroupControlOption value="grid" label={ __( 'Grid', 'eo-blocks' ) } />
						<ToggleGroupControlOption value="masonry" label={ __( 'Masonry', 'eo-blocks' ) } />
						<ToggleGroupControlOption value="carousel" label={ __( 'Carousel', 'eo-blocks' ) } />
					</ToggleGroupControl>
					<div style={ { height: 16 } } />
					<RangeControl
						__nextHasNoMarginBottom
						label={ isCarousel ? __( 'Media shown at once', 'eo-blocks' ) : __( 'Columns', 'eo-blocks' ) }
						value={ columns }
						onChange={ ( value ) => setAttributes( { columns: value } ) }
						min={ 1 }
						max={ 8 }
					/>
					<RangeControl
						__nextHasNoMarginBottom
						label={ isCarousel ? __( 'Media shown at once on mobile', 'eo-blocks' ) : __( 'Columns on mobile', 'eo-blocks' ) }
						value={ mobileColumns }
						onChange={ ( value ) => setAttributes( { mobileColumns: value } ) }
						min={ 1 }
						max={ 4 }
					/>
					<RangeControl
						__nextHasNoMarginBottom
						label={ __( 'Space between media (px)', 'eo-blocks' ) }
						value={ gap }
						onChange={ ( value ) => setAttributes( { gap: value } ) }
						min={ 0 }
						max={ 64 }
					/>
					{ layout !== 'masonry' && (
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Crop images to fit', 'eo-blocks' ) }
							checked={ crop }
							onChange={ ( value ) => setAttributes( { crop: value } ) }
						/>
					) }
					{ isCropped && (
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Aspect ratio', 'eo-blocks' ) }
							value={ aspectRatio }
							options={ ASPECT_RATIOS }
							onChange={ ( value ) => setAttributes( { aspectRatio: value } ) }
						/>
					) }
					<div style={ { height: 16 } } />
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Display order', 'eo-blocks' ) }
						help={ order !== 'normal' ? __( 'Applied on the front end only, so you can keep editing in the normal order.', 'eo-blocks' ) : undefined }
						value={ order }
						options={ [
							{ label: __( 'Normal', 'eo-blocks' ), value: 'normal' },
							{ label: __( 'Reversed', 'eo-blocks' ), value: 'reverse' },
							{ label: __( 'Random', 'eo-blocks' ), value: 'random' },
						] }
						onChange={ ( value ) => setAttributes( { order: value } ) }
					/>
					<div style={ { height: 16 } } />
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Resolution', 'eo-blocks' ) }
						help={ __( 'Size of the images shown in the gallery. The lightbox always uses the full size.', 'eo-blocks' ) }
						value={ imageSize }
						options={ imageSizes.map( ( { name, slug } ) => ( { label: name, value: slug } ) ) }
						onChange={ ( value ) => setAttributes( { imageSize: value } ) }
					/>
					<div style={ { height: 16 } } />
					<RangeControl
						__nextHasNoMarginBottom
						label={ __( 'Rounded corners (px)', 'eo-blocks' ) }
						value={ radius }
						onChange={ ( value ) => setAttributes( { radius: value } ) }
						min={ 0 }
						max={ 48 }
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Show captions', 'eo-blocks' ) }
						checked={ showCaptions }
						onChange={ ( value ) => setAttributes( { showCaptions: value } ) }
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Zoom on hover', 'eo-blocks' ) }
						checked={ hoverZoom }
						onChange={ ( value ) => setAttributes( { hoverZoom: value } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Click on a media', 'eo-blocks' ) }>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Action', 'eo-blocks' ) }
						value={ linkTo }
						options={ [
							{ label: __( 'Enlarge in a lightbox', 'eo-blocks' ), value: 'lightbox' },
							{ label: __( 'Link to the media file', 'eo-blocks' ), value: 'media' },
							{ label: __( 'Link to the attachment page', 'eo-blocks' ), value: 'attachment' },
							{ label: __( 'Nothing', 'eo-blocks' ), value: 'none' },
						] }
						onChange={ ( value ) => setAttributes( { linkTo: value } ) }
					/>
				</PanelBody>

				{ isCarousel && (
					<PanelBody title={ __( 'Carousel settings', 'eo-blocks' ) }>
						<div style={ {
							fontSize: '11px',
							fontWeight: '500',
							lineHeight: '1.4',
							textTransform: 'uppercase',
							marginBottom: 8,
						} }>{ __( 'Main color', 'eo-blocks' ) }</div>
						<Dropdown
							style={ { marginBottom: 16 } }
							popoverProps={ { placement: 'bottom-start' } }
							renderToggle={ ( { isOpen, onToggle } ) => (
								<Button variant="secondary" onClick={ onToggle } aria-expanded={ isOpen }>
									<HStack>
										<div style={ {
											background: mainColor,
											width: 20,
											height: 20,
											borderRadius: '50%',
										} }></div>
										<Text>{ __( 'Main color', 'eo-blocks' ) }</Text>
									</HStack>
								</Button>
							) }
							renderContent={ () => (
								<ColorPicker
									color={ mainColor }
									onChange={ ( value ) => setAttributes( { mainColor: value } ) }
									enableAlpha
									defaultValue="#007aff"
								/>
							) }
						/>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Prev/Next navigation', 'eo-blocks' ) }
							checked={ navigation }
							onChange={ ( value ) => setAttributes( { navigation: value } ) }
						/>
						{ navigation && (
							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Arrows position', 'eo-blocks' ) }
								value={ navigationPosition }
								options={ [
									{ label: __( 'Over the slides', 'eo-blocks' ), value: 'inside' },
									{ label: __( 'Outside the slides', 'eo-blocks' ), value: 'outside' },
								] }
								onChange={ ( value ) => setAttributes( { navigationPosition: value } ) }
							/>
						) }
						<div style={ { height: 16 } } />
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Dots navigation', 'eo-blocks' ) }
							checked={ pagination }
							onChange={ ( value ) => setAttributes( { pagination: value } ) }
						/>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Loop', 'eo-blocks' ) }
							checked={ loop }
							onChange={ ( value ) => setAttributes( { loop: value } ) }
						/>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Autoplay', 'eo-blocks' ) }
							help={ __( 'Pauses while the mouse is over the carousel.', 'eo-blocks' ) }
							checked={ autoplay }
							onChange={ ( value ) => setAttributes( { autoplay: value } ) }
						/>
						{ autoplay && (
							<RangeControl
								__nextHasNoMarginBottom
								label={ __( 'Delay per slide (MS)', 'eo-blocks' ) }
								step={ 250 }
								value={ autoplayDelay }
								onChange={ ( value ) => setAttributes( { autoplayDelay: value } ) }
								min={ 1000 }
								max={ 15000 }
							/>
						) }
						<RangeControl
							__nextHasNoMarginBottom
							label={ __( 'Slide animation speed (MS)', 'eo-blocks' ) }
							step={ 50 }
							value={ speed }
							onChange={ ( value ) => setAttributes( { speed: value } ) }
							min={ 0 }
							max={ 3000 }
						/>
					</PanelBody>
				) }

				{ activeItem && (
					<PanelBody title={ __( 'Selected media', 'eo-blocks' ) }>
						{ activeItem.type === 'image' && (
							<TextareaControl
								__nextHasNoMarginBottom
								label={ __( 'Alternative text', 'eo-blocks' ) }
								help={ __( 'Describe the purpose of the image. Leave empty to use the one from the media library.', 'eo-blocks' ) }
								value={ activeItem.alt }
								onChange={ ( value ) => updateItem( selectedItem, { alt: value } ) }
							/>
						) }
						<div style={ { height: 16 } } />
						<Button variant="secondary" isDestructive onClick={ () => removeItem( selectedItem ) }>
							{ __( 'Remove from gallery', 'eo-blocks' ) }
						</Button>
					</PanelBody>
				) }
			</InspectorControls>

			<div { ...blockProps }>
				<div className="eo-gallery__items" ref={ itemsContainerRef }>
					{ items.map( ( item, index ) => {
						const isItemSelected = isSelected && selectedItem === index;
						const isTransient = isBlobURL( item.url );
						// No marker where the drop would leave the item in place.
						const dropSide =
							dropTarget?.index === index &&
							dragIndex !== null &&
							index !== dragIndex &&
							! ( dropTarget.after && index === dragIndex - 1 ) &&
							! ( ! dropTarget.after && index === dragIndex + 1 )
								? ( dropTarget.after ? 'after' : 'before' )
								: null;
						return (
							<figure
								key={ item.id || item.url }
								data-item-index={ index }
								draggable={ ! isTransient && editingCaption !== index }
								className={ [
									'eo-gallery__item',
									`eo-gallery__item--${ item.type }`,
									isItemSelected && 'is-selected',
									isTransient && 'is-transient',
									dragIndex === index && 'is-dragging',
									dropSide && `is-drop-${ dropSide }`,
								]
									.filter( Boolean )
									.join( ' ' ) }
								style={ item.width && item.height ? { '--eo-item-ratio': `${ item.width } / ${ item.height }` } : undefined }
								onClick={ () => setSelectedItem( index ) }
								onFocus={ ( event ) => event.target.closest( '.eo-gallery__caption' ) && setEditingCaption( index ) }
								onBlur={ ( event ) => event.target.closest( '.eo-gallery__caption' ) && setEditingCaption( null ) }
							>
								{ item.type === 'video' ? (
									<video className="eo-gallery__media" src={ isTransient ? item.url : `${ item.url }#t=0.1` } muted playsInline preload="metadata" />
								) : (
									<img className="eo-gallery__media" src={ item.previewUrl || item.url } alt={ item.alt } />
								) }
								{ item.type === 'video' && <span className="eo-gallery__play" aria-hidden="true" /> }
								{ isTransient && <Spinner /> }

								{ isItemSelected && (
									<div className="eo-gallery-editor__item-toolbar">
										<Button
											icon={ chevronLeft }
											size="small"
											label={ __( 'Move backward', 'eo-blocks' ) }
											onClick={ ( event ) => {
												event.stopPropagation();
												moveItem( index, index - 1 );
											} }
											disabled={ index === 0 }
										/>
										<Button
											icon={ chevronRight }
											size="small"
											label={ __( 'Move forward', 'eo-blocks' ) }
											onClick={ ( event ) => {
												event.stopPropagation();
												moveItem( index, index + 1 );
											} }
											disabled={ index === items.length - 1 }
										/>
										<Button
											icon={ closeSmall }
											size="small"
											label={ __( 'Remove', 'eo-blocks' ) }
											onClick={ ( event ) => {
												event.stopPropagation();
												removeItem( index );
											} }
										/>
									</div>
								) }

								{ showCaptions && ( isItemSelected || ! RichText.isEmpty( item.caption ) ) && (
									<RichText
										tagName="figcaption"
										className="eo-gallery__caption"
										placeholder={ __( 'Add caption', 'eo-blocks' ) }
										value={ item.caption }
										onChange={ ( value ) => updateItem( index, { caption: value } ) }
										allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
										aria-label={
											/* translators: %d: media position in the gallery. */
											sprintf( __( 'Caption of media %d', 'eo-blocks' ), index + 1 )
										}
									/>
								) }
							</figure>
						);
					} ) }
				</div>

				{ /*
				 * The appender's DropZone accepts any drag that is not a core
				 * block, so it would cover the gallery with its "drop files to
				 * upload" overlay and swallow the drop: hide it while reordering.
				 */ }
				{ isSelected && dragIndex === null && (
					<MediaPlaceholder
						isAppender
						addToGallery
						value={ items }
						onSelect={ onSelectMedia }
						accept="image/*,video/*"
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						multiple={ MULTIPLE_SELECTION }
						labels={ { title: '', instructions: '' } }
					/>
				) }
			</div>
		</>
	);
}
