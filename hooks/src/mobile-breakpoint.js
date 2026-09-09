/**
 * Adds a "Mobile Breakpoints" control to the core/navigation block, right
 * below its native "Overlay" panel in the Settings tab.
 *
 * WordPress core hardcodes the width at which the navigation menu switches
 * between its horizontal (desktop) and overlay/hamburger (mobile) layouts at
 * 600px (see wp-includes/blocks/navigation/style.css), and only actually
 * uses that width-based switch when the block's own "Overlay" setting
 * ("overlayMenu" attribute) is "Mobile" — "Off" never uses a responsive
 * layout, and "Always" is already an overlay at every width regardless of
 * viewport, so the control is hidden in both cases.
 *
 * Enabling "Mobile Breakpoints" and entering a width (e.g. 1400) makes the
 * menu switch to its mobile version at that width instead of 600px.
 *
 * The actual override happens on the front end (see the
 * mobile_breakpoint_frontend PHP filter), which reads the eoMobileBreakpoint
 * attribute straight from the parsed block comment and emits a scoped
 * media-query <style>. Nothing is simulated in the editor.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import {
	ToggleControl,
	PanelBody,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';

const allowedBlocks = [ 'core/navigation' ];

/**
 * Registers the eoMobileBreakpoint attribute on the navigation block.
 */
function eoAddMobileBreakpointAttribute( settings, name ) {
	if ( ! allowedBlocks.includes( name ) ) {
		return settings;
	}

	settings.attributes = Object.assign( settings.attributes || {}, {
		eoMobileBreakpoint: {
			type: 'object',
			default: {},
		},
	} );

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'eo-blocks/mobile-breakpoint-attributes',
	eoAddMobileBreakpointAttribute
);

/**
 * Normalizes a raw NumberControl value into either a positive finite number
 * or ''.
 */
function toBound( value ) {
	if ( value === '' || value === undefined || value === null ) {
		return '';
	}
	const parsed = parseFloat( value );
	return Number.isFinite( parsed ) && parsed > 0 ? parsed : '';
}

function MobileBreakpointControl( { value, onChange } ) {
	const breakpoint = value || {};
	const isEnabled = !! breakpoint.enabled;
	const bpValue = breakpoint.value ?? '';

	return (
		<PanelBody title={ __( 'Mobile Breakpoints', 'eo-blocks' ) }>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Mobile Breakpoints', 'eo-blocks' ) }
				help={ __(
					'Change la largeur à laquelle le menu bascule en version mobile, à la place des 600px par défaut de WordPress.',
					'eo-blocks'
				) }
				checked={ isEnabled }
				onChange={ ( checked ) =>
					// Reset the whole attribute when disabling, so nothing is
					// emitted on the front end.
					onChange( checked ? { enabled: true, value: bpValue } : {} )
				}
			/>

			{ isEnabled && (
				<NumberControl
					label={ __( 'Mobile Breakpoints', 'eo-blocks' ) }
					help={ __(
						'Le menu passe en mode mobile à cette largeur et en dessous.',
						'eo-blocks'
					) }
					min={ 0 }
					suffix="px"
					value={ bpValue }
					onChange={ ( next ) =>
						onChange( { ...breakpoint, value: toBound( next ) } )
					}
				/>
			) }
		</PanelBody>
	);
}

const eoAddMobileBreakpointControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name, attributes, setAttributes } = props;

		// Only "Mobile" actually switches layout based on viewport width.
		// "Off" has no responsive layout at all, and "Always" is already an
		// overlay regardless of width, so neither has a breakpoint to set.
		const overlayMenu = attributes.overlayMenu ?? 'mobile';
		if ( ! allowedBlocks.includes( name ) || overlayMenu !== 'mobile' ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<MobileBreakpointControl
						value={ attributes.eoMobileBreakpoint }
						onChange={ ( eoMobileBreakpoint ) =>
							setAttributes( { eoMobileBreakpoint } )
						}
					/>
				</InspectorControls>
			</>
		);
	};
}, 'eoAddMobileBreakpointControls' );

addFilter(
	'editor.BlockEdit',
	'eo-blocks/mobile-breakpoint-controls',
	eoAddMobileBreakpointControls
);
