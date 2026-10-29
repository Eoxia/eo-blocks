import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Notice } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Edit( { attributes, setAttributes } ) {
	const { rating, maxRating, showStars, useApi } = attributes;
	const [ apiData, setApiData ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/eo-blocks/v1/reviews-data' } ).then( ( res ) => {
			if ( res && res.thefork && res.thefork !== false ) {
				setApiData( res.thefork );
			}
		} ).catch( () => {} );
	}, [] );

	const displayRating = (useApi && apiData && apiData.rating) ? apiData.rating : rating;

	const renderStars = () => {
		if ( ! showStars ) return null;
		
		const stars = [];
		const r = parseFloat( displayRating ) || 0;
		const max = parseInt( maxRating ) || 5;

		for ( let i = 1; i <= max; i++ ) {
			if ( r >= i ) {
				stars.push( <span key={i} className="eo-star eo-star-full">★</span> );
			} else if ( r >= i - 0.5 ) {
				stars.push( <span key={i} className="eo-star eo-star-half">★</span> );
			} else {
				stars.push( <span key={i} className="eo-star eo-star-empty">☆</span> );
			}
		}
		return <div className="eo-grr-stars">{ stars }</div>;
	};

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'Réglages de la note', 'eo-blocks' ) }>
					{ apiData ? (
						<Notice status="success" isDismissible={ false }>
							{ __( '✅ API Connectée. Mise à jour 1 fois / jour.', 'eo-blocks' ) }
						</Notice>
					) : (
						<Notice status="warning" isDismissible={ false }>
							{ __( '❌ API non configurée (ou désactivée).', 'eo-blocks' ) }
						</Notice>
					) }

					<ToggleControl
						label={ __( 'Utiliser les données de l\'API', 'eo-blocks' ) }
						checked={ useApi }
						onChange={ ( val ) => setAttributes( { useApi: val } ) }
						help={ __( 'Si désactivé, vous pouvez forcer la note manuellement.', 'eo-blocks' ) }
					/>

					<TextControl
						label={ __( 'Note moyenne', 'eo-blocks' ) }
						type="number"
						step="0.1"
						value={ displayRating }
						onChange={ ( val ) => setAttributes( { rating: parseFloat( val ) || 0 } ) }
						disabled={ !!(useApi && apiData) }
						help={ (useApi && apiData) ? __( 'Récupéré automatiquement depuis l\'API.', 'eo-blocks' ) : '' }
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
			<div className="eo-thefork-reviews-rating-wrapper">
				<span className="eo-grr-score">{ Number(displayRating).toFixed(1) }</span>
				{ renderStars() }
			</div>
		</div>
	);
}