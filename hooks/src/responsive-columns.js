/**
 * Adds a "Colonnes responsives" control to the core/columns block, right
 * below its native "Stack on mobile" toggle in the Settings tab.
 *
 * By default, when "Stack on mobile" is checked, WordPress stacks every
 * column at 100% width below 782px. Enabling "Activer les colonnes
 * responsives" replaces that with two configurable column counts instead
 * of a full stack: one for tablet widths (782px and below) and one for
 * mobile widths (599px and below). Both are capped by the actual number of
 * columns in the block.
 *
 * The actual layout change happens on the front end (see the
 * responsive_columns_frontend PHP filter), which reads the
 * eoResponsiveColumns attribute straight from the parsed block comment and
 * emits a scoped media-query <style>. Nothing is simulated in the editor.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import { ToggleControl, PanelBody, RangeControl } from '@wordpress/components';

const allowedBlocks = [ 'core/columns' ];

/**
 * Registers the eoResponsiveColumns attribute on the columns block.
 */
function eoAddResponsiveColumnsAttribute( settings, name ) {
	if ( ! allowedBlocks.includes( name ) ) {
		return settings;
	}

	settings.attributes = Object.assign( settings.attributes || {}, {
		eoResponsiveColumns: {
			type: 'object',
			default: {},
		},
	} );

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'eo-blocks/responsive-columns-attributes',
	eoAddResponsiveColumnsAttribute
);

/**
 * Keeps a value within [1, max], falling back to `fallback` when max is 0.
 */
function clamp( value, max, fallback ) {
	if ( ! max ) {
		return fallback;
	}
	return Math.min( Math.max( value || fallback, 1 ), max );
}

function ResponsiveColumnsControl( { value, onChange, columnsCount } ) {
	const responsive = value || {};
	const isEnabled = !! responsive.enabled;
	const tablet = clamp( responsive.tablet, columnsCount, Math.min( 2, columnsCount ) );
	const mobile = clamp( responsive.mobile, columnsCount, 1 );

	// Re-clamp the stored values whenever a column is added or removed, so a
	// slide never stays above the current column count.
	useEffect( () => {
		if ( ! isEnabled ) {
			return;
		}
		if ( responsive.tablet !== tablet || responsive.mobile !== mobile ) {
			onChange( { ...responsive, tablet, mobile } );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ isEnabled, columnsCount ] );

	if ( columnsCount < 2 ) {
		return null;
	}

	return (
		<PanelBody title={ __( 'Colonnes responsives', 'eo-blocks' ) }>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Activer les colonnes responsives', 'eo-blocks' ) }
				help={ __(
					'Affiche plusieurs colonnes par ligne sur tablette et mobile au lieu de tout empiler.',
					'eo-blocks'
				) }
				checked={ isEnabled }
				onChange={ ( checked ) =>
					onChange(
						checked
							? { enabled: true, tablet, mobile }
							: {}
					)
				}
			/>

			{ isEnabled && (
				<div className="eo-responsive-columns-control__fields">
					<RangeControl
						__nextHasNoMarginBottom
						label={ __( 'Nombre de colonnes tablette', 'eo-blocks' ) }
						value={ tablet }
						onChange={ ( next ) =>
							onChange( { ...responsive, tablet: clamp( next, columnsCount, 1 ) } )
						}
						min={ 1 }
						max={ columnsCount }
					/>
					<RangeControl
						__nextHasNoMarginBottom
						label={ __( 'Nombre de colonnes mobile', 'eo-blocks' ) }
						value={ mobile }
						onChange={ ( next ) =>
							onChange( { ...responsive, mobile: clamp( next, columnsCount, 1 ) } )
						}
						min={ 1 }
						max={ columnsCount }
					/>
				</div>
			) }
		</PanelBody>
	);
}

const eoAddResponsiveColumnsControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name, clientId, attributes, setAttributes } = props;
		const isColumns = allowedBlocks.includes( name );

		// Hooks must run unconditionally on every render, so the selector
		// itself is what's guarded, not the call.
		const columnsCount = useSelect(
			( select ) =>
				isColumns
					? select( 'core/block-editor' ).getBlockOrder( clientId ).length
					: 0,
			[ isColumns, clientId ]
		);

		// Skip non-columns blocks, and hide the feature entirely when
		// columns don't stack on mobile in the first place.
		if ( ! isColumns || attributes.isStackedOnMobile === false ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<ResponsiveColumnsControl
						value={ attributes.eoResponsiveColumns }
						columnsCount={ columnsCount }
						onChange={ ( eoResponsiveColumns ) =>
							setAttributes( { eoResponsiveColumns } )
						}
					/>
				</InspectorControls>
			</>
		);
	};
}, 'eoAddResponsiveColumnsControls' );

addFilter(
	'editor.BlockEdit',
	'eo-blocks/responsive-columns-controls',
	eoAddResponsiveColumnsControls
);
