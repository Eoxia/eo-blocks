import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { count, prefix, suffix } = attributes;

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'Réglages des Avis', 'eo-blocks' ) }>
					<TextControl
						label={ __( 'Préfixe', 'eo-blocks' ) }
						value={ prefix }
						onChange={ ( val ) => setAttributes( { prefix: val } ) }
					/>
					<TextControl
						label={ __( 'Nombre d\'avis', 'eo-blocks' ) }
						type="number"
						value={ count }
						onChange={ ( val ) => setAttributes( { count: Number( val ) } ) }
					/>
					<TextControl
						label={ __( 'Suffixe', 'eo-blocks' ) }
						value={ suffix }
						onChange={ ( val ) => setAttributes( { suffix: val } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div className="eo-google-reviews-count-wrapper">
				{ prefix && <span className="eo-grc-prefix">{ prefix }</span> }
				<span className="eo-grc-count">{ count }</span>
				{ suffix && <span className="eo-grc-suffix">{ suffix }</span> }
			</div>
		</div>
	);
}
