import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Notice } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Edit( { attributes, setAttributes } ) {
	const { rating, maxRating, showStars } = attributes;
	const [ apiData, setApiData ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/eo-blocks/v1/reviews-data' } ).then( ( res ) => {
			if ( res && res.tripadvisor && res.tripadvisor !== false ) {
				setApiData( res.tripadvisor );
			}
		} ).catch( () => {} );
	}, [] );

	const displayRating = apiData && apiData.rating ? apiData.rating : rating;

	const renderStars = () => {
		if ( ! showStars ) return null;
		
		const stars = [];
		const r = parseFloat( displayRating ) || 0;
		const max = parseInt( maxRating ) || 5;

		for ( let i = 1; i <= max; i++ ) {
			if ( r >= i ) {
				stars.push( <span key={i} className="eo-star eo-star-full">â˜…</span> );
			} else if ( r >= i - 0.5 ) {
				stars.push( <span key={i} className="eo-star eo-star-half">â˜…</span> );
			} else {
				stars.push( <span key={i} className="eo-star eo-star-empty">â˜†</span> );
			}
		}
		return <div className="eo-grr-stars">{ stars }</div>;
	};

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'RÃ©glages de la note', 'eo-blocks' ) }>
					{ apiData ? (
						<Notice status="success" isDismissible={ false }>
							{ __( 'âœ… API ConnectÃ©e. Mise Ã  jour 1 fois / jour.', 'eo-blocks' ) }
						</Notice>
					) : (
						<Notice status="warning" isDismissible={ false }>
							{ __( 'âŒ API non configurÃ©e. Saisie manuelle.', 'eo-blocks' ) }
						</Notice>
					) }
					<TextControl
						label={ __( 'Note moyenne', 'eo-blocks' ) }
						type="number"
						step="0.1"
						value={ displayRating }
						onChange={ ( val ) => setAttributes( { rating: parseFloat( val ) || 0 } ) }
						disabled={ !!apiData }
						help={ !!apiData ? __( 'RÃ©cupÃ©rÃ© automatiquement depuis l\'API.', 'eo-blocks' ) : '' }
					/>
					<TextControl
						label={ __( 'Note maximale', 'eo-blocks' ) }
						type="number"
						value={ maxRating }
						onChange={ ( val ) => setAttributes( { maxRating: parseInt( val ) || 5 } ) }
					/>
					<ToggleControl
						label={ __( 'Afficher les Ã©toiles', 'eo-blocks' ) }
						checked={ showStars }
						onChange={ ( val ) => setAttributes( { showStars: val } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div className="eo-tripadvisor-reviews-rating-wrapper">
				<span className="eo-grr-score">{ Number(displayRating).toFixed(1) }</span>
				{ renderStars() }
			</div>
		</div>
	);
}
