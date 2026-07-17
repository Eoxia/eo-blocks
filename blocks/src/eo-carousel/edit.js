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
import { InspectorControls, useBlockProps, InnerBlocks, store as blockEditorStore } from '@wordpress/block-editor';
import { PanelBody, Button, RangeControl, ToggleControl, SelectControl, ColorPicker, Dropdown, Tooltip } from '@wordpress/components';
import { __experimentalNumberControl as NumberControl,
	__experimentalHStack as HStack,
	__experimentalText as Text
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect, useRef, useMemo } from '@wordpress/element';
import { Icon, plus, chevronLeft, chevronRight, copy, trash } from '@wordpress/icons';


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './scss/editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { slides, selectedClientId, selectedParents } = useSelect(
		( select ) => {
			const editorSelect = select( blockEditorStore );
			const selected = editorSelect.getSelectedBlockClientId();
			return {
				slides: editorSelect.getBlocks( clientId ),
				selectedClientId: selected,
				selectedParents: selected ? editorSelect.getBlockParents( selected, true ) : [],
			};
		},
		[ clientId ]
	);

	const { selectBlock, insertBlock, removeBlock, moveBlockToPosition } = useDispatch( blockEditorStore );
	const dragIndexRef = useRef( null );
	const [ dragOverIndex, setDragOverIndex ] = useState( null );

	// If the current editor selection is a slide (or something inside a slide),
	// that slide becomes the active one, just like clicking through a real carousel.
	const selectedSlideId = useMemo( () => {
		if ( ! selectedClientId ) {
			return null;
		}
		const slideIds = slides.map( ( slide ) => slide.clientId );
		if ( slideIds.includes( selectedClientId ) ) {
			return selectedClientId;
		}
		return selectedParents.find( ( id ) => slideIds.includes( id ) ) || null;
	}, [ selectedClientId, selectedParents, slides ] );

	const [ activeSlideId, setActiveSlideId ] = useState( slides[ 0 ]?.clientId ?? null );
	// Whether the carousel is currently parked on the trailing, virtual "add a
	// slide" slot rather than on one of the real slides.
	const [ isOnAddSlot, setIsOnAddSlot ] = useState( false );
	const lastIndexRef = useRef( 0 );

	useEffect( () => {
		if ( selectedSlideId ) {
			setActiveSlideId( selectedSlideId );
			setIsOnAddSlot( false );
		}
	}, [ selectedSlideId ] );

	const activeIndex = useMemo( () => {
		if ( isOnAddSlot && slides.length > 0 ) {
			return slides.length;
		}
		const ids = slides.map( ( slide ) => slide.clientId );
		let index = activeSlideId ? ids.indexOf( activeSlideId ) : -1;
		if ( index === -1 ) {
			index = Math.max( Math.min( lastIndexRef.current, ids.length - 1 ), 0 );
		}
		lastIndexRef.current = index;
		return index;
	}, [ slides, activeSlideId, isOnAddSlot ] );

	// Undefined when activeIndex points at the trailing virtual "add a slide" slot.
	const activeSlide = slides[ activeIndex ];

	const goToSlide = ( index ) => {
		if ( slides.length > 0 && index === slides.length ) {
			setIsOnAddSlot( true );
			return;
		}
		const target = slides[ index ];
		if ( ! target ) {
			return;
		}
		setIsOnAddSlot( false );
		setActiveSlideId( target.clientId );
		selectBlock( target.clientId );
	};

	// The navigable range includes one extra, virtual slot at the end for "add a slide".
	const totalSlots = slides.length > 0 ? slides.length + 1 : 0;
	const goPrev = () => totalSlots && goToSlide( ( activeIndex - 1 + totalSlots ) % totalSlots );
	const goNext = () => totalSlots && goToSlide( ( activeIndex + 1 ) % totalSlots );

	const addSlide = ( afterIndex ) => {
		const newBlock = wp.blocks.createBlock( 'eo-blocks/slide' );
		insertBlock( newBlock, afterIndex + 1, clientId );
		setIsOnAddSlot( false );
		setActiveSlideId( newBlock.clientId );
		selectBlock( newBlock.clientId );
	};

	const duplicateSlide = ( index ) => {
		const source = slides[ index ];
		if ( ! source ) {
			return;
		}
		const cloned = wp.blocks.cloneBlock( source );
		insertBlock( cloned, index + 1, clientId );
		setIsOnAddSlot( false );
		setActiveSlideId( cloned.clientId );
		selectBlock( cloned.clientId );
	};

	const deleteSlide = ( index ) => {
		const target = slides[ index ];
		if ( ! target || slides.length <= 1 ) {
			return;
		}
		const fallback = slides[ index - 1 ] || slides[ index + 1 ];
		removeBlock( target.clientId, false );
		if ( fallback ) {
			setActiveSlideId( fallback.clientId );
		}
	};

	// Reordering slides by dragging their dot. Native HTML5 drag & drop, no
	// extra dependency: moveBlockToPosition already ships with block-editor.
	const handleDotDragStart = ( event, index ) => {
		dragIndexRef.current = index;
		event.dataTransfer.effectAllowed = 'move';
		// Firefox requires data to be set for the drag to actually start.
		event.dataTransfer.setData( 'text/plain', String( index ) );
	};

	const handleDotDragOver = ( event, index ) => {
		if ( dragIndexRef.current === null ) {
			return;
		}
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
		if ( dragOverIndex !== index ) {
			setDragOverIndex( index );
		}
	};

	const handleDotDrop = ( event, index ) => {
		event.preventDefault();
		const fromIndex = dragIndexRef.current;
		dragIndexRef.current = null;
		setDragOverIndex( null );
		if ( fromIndex === null || fromIndex === index ) {
			return;
		}
		const source = slides[ fromIndex ];
		if ( ! source ) {
			return;
		}
		// moveBlockToPosition expects the target index in the array *after* the
		// dragged item has been removed from it.
		const toIndex = index > fromIndex ? index - 1 : index;
		moveBlockToPosition( source.clientId, clientId, clientId, toIndex );
		setIsOnAddSlot( false );
		setActiveSlideId( source.clientId );
	};

	const handleDotDragEnd = () => {
		dragIndexRef.current = null;
		setDragOverIndex( null );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Carousel settings', 'eo-blocks')}>
					<RangeControl
						label={__('Slides to show', 'eo-blocks')}
						step={1}
						value={attributes.slidesPerView || 1}
						onChange={(value) => setAttributes({slidesPerView: value})}
						min={1}
						max={6}
					/>
					<RangeControl
						label={__('Slide animation speed (MS)', 'eo-blocks')}
						step={50}
						value={attributes.speed}
						onChange={(value) => setAttributes({speed: value})}
						min={0}
						max={3000}
					/>
					<div style={{
						fontSize: '11px',
						fontWeight: '500',
						lineHeight: '1.4',
						textTransform: 'uppercase',
						marginBottom: 8
					}}>{__('Main color', 'eo-blocks')}</div>
					<Dropdown
						style={{ marginBottom: 16 }}
						popoverProps={{placement: 'bottom-start'}}
						position="middle left"
						renderToggle={({isOpen, onToggle}) => (
							<Button
								variant="secondary"
								onClick={onToggle}
								aria-expanded={isOpen}
							>
								<HStack>
									<div style={{
										background: attributes.mainColor,
										width: 20,
										height: 20,
										borderRadius: '50%'
									}}></div>
									<Text>{__('Main color', 'eo-blocks')}</Text>
								</HStack>
							</Button>
						)}
						renderContent={() => (
							<ColorPicker
								color={attributes.mainColor}
								onChange={(value) => setAttributes({mainColor: value})}
								enableAlpha
								defaultValue="#000"
							/>
						)}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Prev/Next navigation', 'eo-blocks')}
						checked={attributes.navigation}
						onChange={(value) => setAttributes({navigation: value})}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Dots navigation', 'eo-blocks')}
						checked={attributes.pagination}
						onChange={(value) => setAttributes({pagination: value})}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Thumbs navigation', 'eo-blocks')}
						checked={attributes.thumbs}
						onChange={(value) => setAttributes({thumbs: value})}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Loop', 'eo-blocks')}
						checked={attributes.loop}
						onChange={(value) => setAttributes({loop: value})}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Autoplay', 'eo-blocks')}
						checked={attributes.autoplay}
						onChange={(value) => setAttributes({autoplay: value})}
					/>
					{attributes.autoplay && (
						<RangeControl
							label={__('Delay per slide (MS)', 'eo-blocks')}
							step={50}
							value={attributes.autoplayDelay}
							onChange={(value) => setAttributes({autoplayDelay: value})}
							min={0}
							max={1000}
						/>
					)}
					{attributes.autoplay && (
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Marquee mode', 'eo-blocks')}
							help={__( 'Scrolling without stop', 'eo-blocks' )}
							checked={attributes.marquee}
							onChange={(value) => setAttributes({marquee: value})}
						/>
					)}
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Transition effect', 'eo-blocks')}
						value={attributes.effect}
						options={[
							{label: __('Default', 'eo-blocks'), value: 'default'},
							{label: __('Fade', 'eo-blocks'), value: 'fade'},
							{label: __('Coverflow', 'eo-blocks'), value: 'coverflow'},
							{label: __('Flip', 'eo-blocks'), value: 'flip'},
							{label: __('Cube', 'eo-blocks'), value: 'cube'},
							{label: __('Cards', 'eo-blocks'), value: 'cards'},
						]}
						onChange={(value) => setAttributes({effect: value})}
					/>
					<RangeControl
						label={__('Space between slides (px)', 'eo-blocks')}
						step={1}
						value={attributes.spaceBetween}
						onChange={(value) => setAttributes({spaceBetween: value})}
						min={0}
						max={100}
					/>
				</PanelBody>

				<PanelBody title={__('Mobile settings', 'eo-blocks')}>
					<NumberControl
						label={__('Mobile Breakpoint', 'eo-blocks')}
						help={__('Screen width (px)', 'eo-blocks')}
						value={attributes.mobileBreakpoint}
						onChange={(value) => setAttributes({mobileBreakpoint: value})}
					/>
					<RangeControl
						label={__('Slides to show', 'eo-blocks')}
						step={1}
						value={attributes.mobileSlidesPerView || 1}
						onChange={(value) => setAttributes({mobileSlidesPerView: value})}
						min={1}
						max={6}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...useBlockProps({ className: 'eo-carousel-editor' })}>
				{ slides.length > 0 && (
					<style>
						{ /*
						 * Only elements carrying data-type="eo-blocks/slide" are targeted, never a
						 * depth-based selector, so blocks inserted *inside* the active slide (which
						 * carry their own, different data-type) are never accidentally hidden. When
						 * activeSlide is undefined (the virtual "add a slide" slot is active), every
						 * real slide is hidden and the placeholder card below takes their place.
						 */ `
						[data-block="${ clientId }"] .eo-carousel-editor__track [data-type="eo-blocks/slide"]${ activeSlide ? `:not([data-block="${ activeSlide.clientId }"])` : '' } { display: none; }
						` }
					</style>
				) }

				<div className="eo-carousel-editor__viewport" style={{ '--eo-carousel-editor-color': attributes.mainColor }}>
					<div className="eo-carousel-editor__track">
						<InnerBlocks
							allowedBlocks={['eo-blocks/slide']}
							renderAppender={false}
						/>
					</div>

					{ slides.length === 0 && (
						<div className="eo-carousel-editor__empty">
							<p>{ __( 'This carousel is empty.', 'eo-blocks' ) }</p>
							<Button variant="primary" onClick={ () => addSlide( -1 ) }>
								<Icon icon={ plus } />
								{ __( 'Add a new slide', 'eo-blocks' ) }
							</Button>
						</div>
					) }

					{ isOnAddSlot && (
						<div className="eo-carousel-editor__empty eo-carousel-editor__empty--add-slide">
							<p>{ __( 'Add another slide to your carousel.', 'eo-blocks' ) }</p>
							<Button variant="primary" onClick={ () => addSlide( slides.length - 1 ) }>
								<Icon icon={ plus } />
								{ __( 'Add a new slide', 'eo-blocks' ) }
							</Button>
						</div>
					) }

					{ slides.length > 0 && (
						<>
							<Button
								className="eo-carousel-editor__nav eo-carousel-editor__nav--prev"
								icon={ chevronLeft }
								label={ __( 'Previous slide', 'eo-blocks' ) }
								onClick={ goPrev }
							/>
							<Button
								className="eo-carousel-editor__nav eo-carousel-editor__nav--next"
								icon={ chevronRight }
								label={ __( 'Next slide', 'eo-blocks' ) }
								onClick={ goNext }
							/>
						</>
					) }
				</div>

				{ slides.length > 0 && (
					<div className="eo-carousel-editor__toolbar">
						<div className="eo-carousel-editor__dots">
							{ slides.map( ( slide, index ) => (
								<Tooltip
									key={ slide.clientId }
									text={
										/* translators: %d: slide number. */
										sprintf( __( 'Slide %d', 'eo-blocks' ), index + 1 )
									}
								>
									<button
										type="button"
										draggable
										className={
											'eo-carousel-editor__dot'
											+ ( index === activeIndex ? ' is-active' : '' )
											+ ( index === dragOverIndex ? ' is-dragover' : '' )
										}
										onClick={ () => goToSlide( index ) }
										onDragStart={ ( event ) => handleDotDragStart( event, index ) }
										onDragOver={ ( event ) => handleDotDragOver( event, index ) }
										onDrop={ ( event ) => handleDotDrop( event, index ) }
										onDragEnd={ handleDotDragEnd }
									>
										<span className="screen-reader-text">
											{ /* translators: %d: slide number. */
											sprintf( __( 'Go to slide %d', 'eo-blocks' ), index + 1 ) }
										</span>
									</button>
								</Tooltip>
							) ) }
							<Tooltip text={ __( 'Add a new slide', 'eo-blocks' ) }>
								<button
									type="button"
									className="eo-carousel-editor__dot eo-carousel-editor__dot--add"
									onClick={ () => addSlide( slides.length - 1 ) }
								>
									<Icon icon={ plus } size={ 14 } />
									<span className="screen-reader-text">{ __( 'Add a new slide', 'eo-blocks' ) }</span>
								</button>
							</Tooltip>
						</div>

						<div className="eo-carousel-editor__actions">
							<span className="eo-carousel-editor__counter">
								{ isOnAddSlot
									? __( 'New slide', 'eo-blocks' )
									: /* translators: 1: current slide number, 2: total number of slides. */
									  sprintf( __( 'Slide %1$d / %2$d', 'eo-blocks' ), activeIndex + 1, slides.length ) }
							</span>
							<Button
								icon={ copy }
								label={ __( 'Duplicate slide', 'eo-blocks' ) }
								onClick={ () => duplicateSlide( activeIndex ) }
								disabled={ isOnAddSlot }
							/>
							<Button
								icon={ trash }
								label={ __( 'Delete slide', 'eo-blocks' ) }
								onClick={ () => deleteSlide( activeIndex ) }
								disabled={ isOnAddSlot || slides.length <= 1 }
								isDestructive
							/>
						</div>
					</div>
				) }
			</div>
		</>
	);
}
