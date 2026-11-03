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
import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, RangeControl, ToggleControl } from '@wordpress/components';

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
export default function Edit( { attributes, setAttributes } ) {
	const { number, decimals, separator, prefix, suffix, label, duration } = attributes;

	const formattedNumber = ( Number( number ) || 0 ).toLocaleString( undefined, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
		useGrouping: separator,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Réglages du chiffre', 'eo-blocks' ) }>
					<TextControl
						type="number"
						step="any"
						label={ __( 'Chiffre', 'eo-blocks' ) }
						value={ number }
						onChange={ ( value ) => setAttributes( { number: value === '' ? 0 : parseFloat( value ) } ) }
					/>
					<RangeControl
						label={ __( 'Nombre de décimales', 'eo-blocks' ) }
						value={ decimals }
						onChange={ ( value ) => setAttributes( { decimals: value } ) }
						min={ 0 }
						max={ 3 }
					/>
					<ToggleControl
						label={ __( 'Séparateur de milliers', 'eo-blocks' ) }
						checked={ separator }
						onChange={ ( value ) => setAttributes( { separator: value } ) }
					/>
					<TextControl
						label={ __( 'Préfixe', 'eo-blocks' ) }
						value={ prefix }
						onChange={ ( value ) => setAttributes( { prefix: value } ) }
					/>
					<TextControl
						label={ __( 'Suffixe', 'eo-blocks' ) }
						value={ suffix }
						onChange={ ( value ) => setAttributes( { suffix: value } ) }
						help={ __( 'Ex : +, %, k€…', 'eo-blocks' ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Animation', 'eo-blocks' ) }>
					<RangeControl
						label={ __( 'Durée (ms)', 'eo-blocks' ) }
						value={ duration }
						onChange={ ( value ) => setAttributes( { duration: value } ) }
						min={ 300 }
						max={ 6000 }
						step={ 100 }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<div className="eo-key-figure__value">
					{ prefix && <span className="eo-key-figure__prefix">{ prefix }</span> }
					<span className="eo-key-figure__number">{ formattedNumber }</span>
					{ suffix && <span className="eo-key-figure__suffix">{ suffix }</span> }
				</div>
				<RichText
					tagName="div"
					className="eo-key-figure__label"
					value={ label }
					onChange={ ( value ) => setAttributes( { label: value } ) }
					placeholder={ __( 'Libellé du chiffre…', 'eo-blocks' ) }
					allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
				/>
			</div>
		</>
	);
}
