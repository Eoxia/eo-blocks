import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { rating, maxRating, showStars } = attributes;

	const renderStars = () => {
		if ( ! showStars ) return null;
		
		const stars = [];
		const r = parseFloat( rating ) || 0;
		const max = parseInt( maxRating ) || 5;

		for ( let i = 1; i <= max; i++ ) {
			if ( r >= i ) {
				// Full star
				stars.push( <span key={i} className="eo-star eo-star-full">★</span> );
			} else if ( r >= i - 0.5 ) {
				// Half star
				stars.push( <span key={i} className="eo-star eo-star-half">★</span> );
			} else {
				// Empty star
				stars.push( <span key={i} className="eo-star eo-star-empty">☆</span> );
			}
		}
		return <div className="eo-grr-stars">{ stars }</div>;
	};

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'Réglages de la note', 'eo-blocks' ) }>
					<TextControl
						label={ __( 'Note moyenne', 'eo-blocks' ) }
						type="number"
						step="0.1"
						value={ rating }
						onChange={ ( val ) => setAttributes( { rating: parseFloat( val ) || 0 } ) }
					/>
					<TextControl
						label={ __( 'Note maximale', 'eo-blocks' ) }
						type="number"
						value={ maxRating }
						onChange={ ( val ) => setAttributes( { maxRating: parseInt( val ) || 5 } ) }
					/>
					<ToggleControl
						label={ __( 'Afficher les étoiles', 'eo-blocks' ) }
						checked={ showStars }
						onChange={ ( val ) => setAttributes( { showStars: val } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div className="eo-tripadvisor-reviews-rating-wrapper">
				<span className="eo-grr-score">{ Number(rating).toFixed(1) }</span>
				{ renderStars() }
			</div>
		</div>
	);
}

