/**
 * Adds a "Breakpoint display" control to the Advanced tab of every block
 * (EO Blocks included, as well as native and third-party blocks). It lets an
 * element be shown only within a viewport-width range (min-width / max-width,
 * in px), e.g. visible only between 500px and 1000px.
 *
 * The "advanced" InspectorControls group renders in the Advanced panel, next
 * to the core "HTML anchor" / "Additional CSS class(es)" fields.
 *
 * The actual hiding happens on the front end (see the breakpoint_display_frontend
 * PHP filter), which reads the eoBreakpoint attribute straight from the parsed
 * block comment and emits a scoped media-query <style>. Nothing is simulated in
 * the editor (fixed width): the block stays visible for editing.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import {
	ToggleControl,
	Notice,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';

/**
 * Blocks that don't have a single, hideable wrapper element (structural,
 * raw-output or admin-only blocks) are skipped. Mirrors the animations list.
 */
const excludedBlocks = [
	'core/freeform',
	'core/html',
	'core/shortcode',
	'core/block',
	'core/legacy-widget',
	'core/widget-area',
	'core/template-part',
	'core/pattern',
	'core/more',
	'core/nextpage',
	// Carousel slides: only the parent carousel takes the option, not each
	// individual slide (Swiper manages their visibility itself).
	'eo-blocks/slide',
];

/**
 * Registers the eoBreakpoint attribute on every block.
 */
function eoAddBreakpointAttribute( settings, name ) {
	if ( excludedBlocks.includes( name ) ) {
		return settings;
	}

	settings.attributes = Object.assign( settings.attributes || {}, {
		eoBreakpoint: {
			type: 'object',
			default: {},
		},
	} );

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'eo-blocks/breakpoint-attributes',
	eoAddBreakpointAttribute
);

/**
 * Normalizes a raw NumberControl value into either a finite number or ''.
 */
function toBound( value ) {
	if ( value === '' || value === undefined || value === null ) {
		return '';
	}
	const parsed = parseFloat( value );
	return Number.isFinite( parsed ) ? parsed : '';
}

function BreakpointControl( { value, onChange } ) {
	const breakpoint = value || {};
	const isEnabled = !! breakpoint.enabled;
	const min = breakpoint.min ?? '';
	const max = breakpoint.max ?? '';

	const hasRangeError =
		min !== '' && max !== '' && Number( max ) < Number( min );

	const update = ( changes ) =>
		onChange( { ...breakpoint, ...changes } );

	return (
		<div className="eo-breakpoint-control">
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __(
					'Affichage selon la largeur d’écran',
					'eo-blocks'
				) }
				help={ __(
					'N’afficher cet élément que sur une plage de largeur de viewport.',
					'eo-blocks'
				) }
				checked={ isEnabled }
				onChange={ ( checked ) =>
					// Reset the whole attribute when disabling, so nothing is
					// emitted on the front end.
					onChange(
						checked
							? { ...breakpoint, enabled: true }
							: {}
					)
				}
			/>

			{ isEnabled && (
				<>
					<div className="eo-breakpoint-control__fields">
						<NumberControl
							label={ __( 'Largeur minimale (px)', 'eo-blocks' ) }
							help={ __(
								'Masqué en dessous de cette largeur.',
								'eo-blocks'
							) }
							min={ 0 }
							value={ min }
							onChange={ ( next ) =>
								update( { min: toBound( next ) } )
							}
						/>
						<NumberControl
							label={ __( 'Largeur maximale (px)', 'eo-blocks' ) }
							help={ __(
								'Masqué au-delà de cette largeur.',
								'eo-blocks'
							) }
							min={ 0 }
							value={ max }
							onChange={ ( next ) =>
								update( { max: toBound( next ) } )
							}
						/>
					</div>

					{ hasRangeError && (
						<Notice
							status="error"
							isDismissible={ false }
							className="eo-breakpoint-control__error"
						>
							{ __(
								'La largeur maximale doit être supérieure ou égale à la largeur minimale.',
								'eo-blocks'
							) }
						</Notice>
					) }
				</>
			) }
		</div>
	);
}

const eoAddBreakpointControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name, attributes, setAttributes } = props;

		if ( excludedBlocks.includes( name ) ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="advanced">
					<BreakpointControl
						value={ attributes.eoBreakpoint }
						onChange={ ( eoBreakpoint ) =>
							setAttributes( { eoBreakpoint } )
						}
					/>
				</InspectorControls>
			</>
		);
	};
}, 'eoAddBreakpointControls' );

addFilter(
	'editor.BlockEdit',
	'eo-blocks/breakpoint-controls',
	eoAddBreakpointControls
);
