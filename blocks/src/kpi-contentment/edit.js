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
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, RangeControl } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './scss/editor.scss';

/**
 * Import components
 */
import iconFrown from './assets/icon-frown.svg';
import iconSmile from './assets/icon-smile.svg';
import iconPin from './assets/icon-pin.svg';


/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { blockLabel, contentmentLabel } = attributes;
	const customTooltipContent = value => `${value}%`
	let contentmentLabelColorClass = 'bar__quater-1';

	if ( contentmentLabel < 25 ) {
		contentmentLabelColorClass = 'bar__quarter-1';
	} else if ( contentmentLabel >= 25 && contentmentLabel < 50 ) {
		contentmentLabelColorClass = 'bar__quarter-2';
	} else if ( contentmentLabel >= 50 && contentmentLabel < 75 ) {
		contentmentLabelColorClass = 'bar__quarter-3';
	} else {
		contentmentLabelColorClass = 'bar__quarter-4';
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'eo-blocks' ) }>
					<TextControl
						label={ __( 'Block title', 'eo-blocks' ) }
						value={ blockLabel || '' }
						onChange={ ( value ) => setAttributes( { blockLabel: value } ) }
					/>
					<RangeControl
						label={ __( 'Contentment percentage', 'eo-blocks' ) }
						value={ contentmentLabel || 50 }
						onChange={ ( value ) => setAttributes( { contentmentLabel: value } ) }
						min={ 0 }
						max={ 100 }
						renderTooltipContent={ customTooltipContent }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<img className='eo-kpi-contentment__icon-frown' src={ iconFrown } />
				<img className='eo-kpi-contentment__icon-smile' src={ iconSmile } />

				<div className='eo-kpi-contentment__container'>
					<div className='eo-kpi-contentment__bar-container'>
						<img className='eo-kpi-contentment__icon-pin' src={iconPin} style={{left: contentmentLabel + '%'}}/>
						<div className='eo-kpi-contentment__bar'>
							<span className='eo-kpi-contentment__bar-quarter bar__1'></span>
							<span className='eo-kpi-contentment__bar-quarter bar__2'></span>
							<span className='eo-kpi-contentment__bar-quarter bar__3'></span>
							<span className='eo-kpi-contentment__bar-quarter bar__4'></span>
						</div>
					</div>
					<div className='eo-kpi-contentment__content'>
						<div className='eo-kpi-contentment__block-label'>{ blockLabel }</div>
						<div className={`eo-kpi-contentment__block-contentment ${contentmentLabelColorClass}`}>{ contentmentLabel }%</div>
					</div>
				</div>
			</div>
		</>
	);
}
