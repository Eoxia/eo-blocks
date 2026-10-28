/**
 * Adds a "Text shadow" control to the native "Border & Shadow" panel of the
 * Styles tab, on paragraph blocks.
 *
 * The control is injected into the "border" InspectorControls group (the
 * ToolsPanel core uses for border / radius / shadow), so it shows up in the
 * panel's "⋮" menu next to "Shadow" and is cleared by its "Reset all".
 *
 * Its UI mirrors core's "Drop shadow" dropdown (same markup and CSS classes,
 * see ShadowPopover in @wordpress/block-editor, which isn't exported), with
 * text-specific presets plus a "Custom" option to set the offsets, blur and
 * color of the shadow by hand.
 *
 * Stored attributes:
 * - eoTextShadow: preset slug, or "custom";
 * - eoTextShadowCustom: { x, y, blur, color } used by the "custom" option.
 *
 * On the front end, the text_shadow_frontend PHP filter adds a
 * has-eo-text-shadow-{slug} class (presets styled in
 * assets/scss/hooks/_text-shadow.scss) or, for "custom", an inline
 * text-shadow style.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { useRef } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls, useSettings } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	ColorPalette,
	Composite,
	Dropdown,
	FlexItem,
	Icon,
	RangeControl,
	Tooltip,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { check, pencil, reset, shadow as shadowIcon } from '@wordpress/icons';

const allowedBlocks = [ 'core/paragraph' ];

/**
 * Text shadow presets. Values must be kept in sync with
 * assets/scss/hooks/_text-shadow.scss (used on the front end).
 *
 * Names follow core's default box-shadow presets, with offsets/blur scaled
 * down to suit glyphs. "Unset" forces text-shadow: none (text-shadow is
 * inherited, so it can cancel one coming from a parent or the theme).
 */
export const TEXT_SHADOWS = [
	{ slug: 'none', name: __( 'Unset', 'eo-blocks' ), shadow: 'none' },
	{
		slug: 'natural',
		name: __( 'Natural', 'eo-blocks' ),
		shadow: '2px 2px 3px rgba(0, 0, 0, 0.2)',
	},
	{
		slug: 'deep',
		name: __( 'Deep', 'eo-blocks' ),
		shadow: '3px 3px 6px rgba(0, 0, 0, 0.4)',
	},
	{
		slug: 'sharp',
		name: __( 'Sharp', 'eo-blocks' ),
		shadow: '2px 2px 0 rgba(0, 0, 0, 0.2)',
	},
	{
		slug: 'outlined',
		name: __( 'Outlined', 'eo-blocks' ),
		shadow: '2px 2px 0 #fff, 3px 3px 0 #000',
	},
	{
		slug: 'crisp',
		name: __( 'Crisp', 'eo-blocks' ),
		shadow: '2px 2px 0 #000',
	},
	{
		slug: 'glow',
		name: __( 'Glow', 'eo-blocks' ),
		shadow: '0 0 8px rgba(0, 0, 0, 0.5)',
	},
];

const CUSTOM = 'custom';

/**
 * Starting values of the "Custom" option. Must be kept in sync with
 * Eoblocks::text_shadow_frontend() (PHP).
 */
const DEFAULT_CUSTOM = { x: 2, y: 2, blur: 4, color: 'rgba(0, 0, 0, 0.4)' };

const getCustom = ( custom ) => ( { ...DEFAULT_CUSTOM, ...custom } );

const toCustomShadow = ( custom ) => {
	const { x, y, blur, color } = getCustom( custom );
	return `${ x }px ${ y }px ${ blur }px ${ color }`;
};

const getTextShadow = ( { eoTextShadow, eoTextShadowCustom } ) =>
	eoTextShadow === CUSTOM
		? toCustomShadow( eoTextShadowCustom )
		: TEXT_SHADOWS.find( ( preset ) => preset.slug === eoTextShadow )
				?.shadow;

/**
 * Registers the eoTextShadow / eoTextShadowCustom attributes on allowed
 * blocks.
 */
function eoAddTextShadowAttribute( settings, name ) {
	if ( ! allowedBlocks.includes( name ) ) {
		return settings;
	}

	settings.attributes = Object.assign( settings.attributes || {}, {
		eoTextShadow: {
			type: 'string',
			default: '',
		},
		eoTextShadowCustom: {
			type: 'object',
			default: {},
		},
	} );

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'eo-blocks/text-shadow-attribute',
	eoAddTextShadowAttribute
);

function TextShadowIndicator( { slug, name, shadow, isActive, onSelect } ) {
	let content = <span style={ { textShadow: shadow } }>Aa</span>;
	if ( isActive ) {
		content = <Icon icon={ check } />;
	} else if ( slug === CUSTOM ) {
		content = <Icon icon={ pencil } size={ 18 } />;
	}

	return (
		<Tooltip text={ name }>
			<Composite.Item
				role="option"
				aria-label={ name }
				aria-selected={ isActive }
				className={
					'block-editor-global-styles__shadow__item' +
					( isActive ? ' is-active' : '' )
				}
				render={
					<button
						type="button"
						className={
							'block-editor-global-styles__shadow-indicator eo-text-shadow-indicator' +
							( slug === 'none' ? ' unset' : '' )
						}
						onClick={ onSelect }
						aria-label={ name }
					>
						{ content }
					</button>
				}
			/>
		</Tooltip>
	);
}

function TextShadowPresets( { value, onChange } ) {
	const options = [
		...TEXT_SHADOWS,
		{ slug: CUSTOM, name: __( 'Custom', 'eo-blocks' ) },
	];

	return (
		<Composite
			role="listbox"
			className="block-editor-global-styles__shadow__list"
			aria-label={ __( 'Text shadows', 'eo-blocks' ) }
		>
			{ options.map( ( { slug, name, shadow } ) => (
				<TextShadowIndicator
					key={ slug }
					slug={ slug }
					name={ name }
					shadow={ shadow }
					isActive={ slug === value }
					onSelect={ () => onChange( slug === value ? '' : slug ) }
				/>
			) ) }
		</Composite>
	);
}

/**
 * Hand-made shadow: live preview, X / Y offsets, blur and color (theme
 * palette or any color, with transparency).
 */
function CustomTextShadowEditor( { value, onChange } ) {
	const custom = getCustom( value );
	const [ palette ] = useSettings( 'color.palette' );
	const update = ( key, next ) =>
		onChange( { ...custom, [ key ]: next ?? DEFAULT_CUSTOM[ key ] } );

	return (
		<VStack spacing={ 3 } className="eo-text-shadow-custom">
			<div
				className="eo-text-shadow-custom__preview"
				style={ { textShadow: toCustomShadow( custom ) } }
			>
				Aa
			</div>
			<RangeControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Horizontal offset', 'eo-blocks' ) }
				value={ custom.x }
				onChange={ ( next ) => update( 'x', next ) }
				min={ -20 }
				max={ 20 }
			/>
			<RangeControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Vertical offset', 'eo-blocks' ) }
				value={ custom.y }
				onChange={ ( next ) => update( 'y', next ) }
				min={ -20 }
				max={ 20 }
			/>
			<RangeControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Blur', 'eo-blocks' ) }
				value={ custom.blur }
				onChange={ ( next ) => update( 'blur', next ) }
				min={ 0 }
				max={ 40 }
			/>
			<BaseControl.VisualLabel>
				{ __( 'Color', 'eo-blocks' ) }
			</BaseControl.VisualLabel>
			<ColorPalette
				colors={ palette }
				value={ custom.color }
				onChange={ ( next ) => update( 'color', next ) }
				enableAlpha
				clearable={ false }
				__experimentalIsRenderedInSidebar
			/>
		</VStack>
	);
}

function TextShadowPopover( { value, custom, onChange, onCustomChange } ) {
	const toggleRef = useRef();

	return (
		<Dropdown
			popoverProps={ { placement: 'left-start', offset: 36, shift: true } }
			className="block-editor-global-styles__shadow-dropdown"
			renderToggle={ ( { onToggle, isOpen } ) => (
				<>
					<Button
						__next40pxDefaultSize
						ref={ toggleRef }
						onClick={ onToggle }
						aria-expanded={ isOpen }
						className={
							'block-editor-global-styles__shadow-dropdown-toggle' +
							( isOpen ? ' is-open' : '' )
						}
					>
						<HStack justify="flex-start">
							<Icon
								className="block-editor-global-styles__toggle-icon"
								icon={ shadowIcon }
								size={ 24 }
							/>
							<FlexItem>
								{ __( 'Text shadow', 'eo-blocks' ) }
							</FlexItem>
						</HStack>
					</Button>
					{ !! value && (
						<Button
							__next40pxDefaultSize
							size="small"
							icon={ reset }
							label={ __( 'Remove', 'eo-blocks' ) }
							className="block-editor-global-styles__shadow-editor__remove-button"
							onClick={ () => {
								if ( isOpen ) {
									onToggle();
								}
								onChange( '' );
								toggleRef.current?.focus();
							} }
						/>
					) }
				</>
			) }
			renderContent={ () => (
				<DropdownContentWrapper paddingSize="medium">
					<div className="block-editor-global-styles__shadow-popover-container eo-text-shadow-popover">
						<VStack spacing={ 4 }>
							<Heading level={ 5 }>
								{ __( 'Text shadow', 'eo-blocks' ) }
							</Heading>
							<TextShadowPresets
								value={ value }
								onChange={ onChange }
							/>
							{ value === CUSTOM && (
								<CustomTextShadowEditor
									value={ custom }
									onChange={ onCustomChange }
								/>
							) }
							<div className="block-editor-global-styles__clear-shadow">
								<Button
									__next40pxDefaultSize
									variant="tertiary"
									onClick={ () => onChange( '' ) }
									disabled={ ! value }
									accessibleWhenDisabled
								>
									{ __( 'Clear', 'eo-blocks' ) }
								</Button>
							</div>
						</VStack>
					</div>
				</DropdownContentWrapper>
			) }
		/>
	);
}

// Returned attributes are merged by the panel's "Reset all".
const resetAllFilter = () => ( { eoTextShadow: '', eoTextShadowCustom: {} } );

const eoAddTextShadowControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name, clientId, attributes, setAttributes } = props;

		if ( ! allowedBlocks.includes( name ) ) {
			return <BlockEdit { ...props } />;
		}

		const value = attributes.eoTextShadow;

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls
					group="border"
					resetAllFilter={ resetAllFilter }
				>
					<ToolsPanelItem
						panelId={ clientId }
						label={ __( 'Text shadow', 'eo-blocks' ) }
						hasValue={ () => !! value }
						onDeselect={ () => setAttributes( resetAllFilter() ) }
						isShownByDefault={ false }
					>
						<BaseControl.VisualLabel as="legend">
							{ __( 'Text shadow', 'eo-blocks' ) }
						</BaseControl.VisualLabel>
						<TextShadowPopover
							value={ value }
							custom={ attributes.eoTextShadowCustom }
							onChange={ ( eoTextShadow ) =>
								setAttributes( { eoTextShadow } )
							}
							onCustomChange={ ( eoTextShadowCustom ) =>
								setAttributes( { eoTextShadowCustom } )
							}
						/>
					</ToolsPanelItem>
				</InspectorControls>
			</>
		);
	};
}, 'eoAddTextShadowControls' );

addFilter(
	'editor.BlockEdit',
	'eo-blocks/text-shadow-controls',
	eoAddTextShadowControls
);

/**
 * Previews the text shadow in the editor canvas. Applied inline because the
 * plugin stylesheet isn't loaded inside the iframed editor canvas.
 */
const eoAddTextShadowPreview = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			const shadow =
				allowedBlocks.includes( props.name ) &&
				getTextShadow( props.attributes );

			if ( ! shadow ) {
				return <BlockListBlock { ...props } />;
			}

			const wrapperProps = props.wrapperProps || {};

			return (
				<BlockListBlock
					{ ...props }
					wrapperProps={ {
						...wrapperProps,
						style: { ...wrapperProps.style, textShadow: shadow },
					} }
				/>
			);
		};
	},
	'eoAddTextShadowPreview'
);

addFilter(
	'editor.BlockListBlock',
	'eo-blocks/text-shadow-preview',
	eoAddTextShadowPreview
);
