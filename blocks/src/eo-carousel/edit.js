/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, Button, RangeControl, ToggleControl, SelectControl, ColorPicker, Dropdown } from '@wordpress/components';
import { __experimentalNumberControl as NumberControl,
	__experimentalHStack as HStack,
	__experimentalText as Text
} from '@wordpress/components';
import {Icon, plus} from '@wordpress/icons';


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
	const innerBlocksCount = wp.data.select('core/block-editor').getBlockOrder(clientId).length;
	const CustomAppender = () => (
		<div style={{ textAlign: 'center', margin: '10px 0' }}>
			<Button
				variant="secondary"
				onClick={() => wp.data.dispatch('core/block-editor').insertBlock(
					wp.blocks.createBlock('eo/slide'),
					innerBlocksCount,
					clientId
				)}
			>
				<Icon icon={plus} />
				{ __( 'Add a new slide', 'eo-blocks' ) }
			</Button>
		</div>
	);

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

			<div {...useBlockProps()}>
				<div className="eo-carousel__inner">
					<InnerBlocks
						template={[]}
						renderAppender={() => <CustomAppender/>}
					/>
				</div>
			</div>
		</>
	);
}
