import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Notice } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Edit( { attributes, setAttributes } ) {
	const { count, prefix, suffix, useApi, addReviewLink, reviewLinkText } = attributes;
	const [ apiData, setApiData ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/eo-blocks/v1/reviews-data' } ).then( ( res ) => {
			if ( res && res.google && res.google !== false ) {
				setApiData( res.google );
			}
		} ).catch( () => {} );
	}, [] );

	const displayCount = (useApi && apiData && apiData.count) ? apiData.count : count;

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'Réglages des Avis', 'eo-blocks' ) }>
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
						help={ __( 'Si désactivé, vous pouvez forcer la valeur manuellement.', 'eo-blocks' ) }
					/>

					<TextControl
						label={ __( 'Préfixe', 'eo-blocks' ) }
						value={ prefix }
						onChange={ ( val ) => setAttributes( { prefix: val } ) }
					/>
					<TextControl
						label={ __( 'Nombre d\'avis', 'eo-blocks' ) }
						type="number"
						value={ displayCount }
						onChange={ ( val ) => setAttributes( { count: Number( val ) } ) }
						disabled={ !!(useApi && apiData) }
						help={ (useApi && apiData) ? __( 'Récupéré automatiquement depuis l\'API.', 'eo-blocks' ) : '' }
					/>
					<TextControl
						label={ __( 'Suffixe', 'eo-blocks' ) }
						value={ suffix }
						onChange={ ( val ) => setAttributes( { suffix: val } ) }
					/>
					
					<ToggleControl
						label={ __( 'Ajouter un lien "Déposer un avis"', 'eo-blocks' ) }
						checked={ addReviewLink }
						onChange={ ( val ) => setAttributes( { addReviewLink: val } ) }
					/>
					{ addReviewLink && (
						<TextControl
							label={ __( 'Texte du lien', 'eo-blocks' ) }
							value={ reviewLinkText }
							onChange={ ( val ) => setAttributes( { reviewLinkText: val } ) }
						/>
					) }
				</PanelBody>
			</InspectorControls>
			<div className="eo-google-reviews-count-wrapper">
				{ prefix && <span className="eo-grc-prefix">{ prefix }</span> }
				<span className="eo-grc-count">{ displayCount }</span>
				{ suffix && <span className="eo-grc-suffix">{ suffix }</span> }
				{ addReviewLink && reviewLinkText && (
					<a href={ apiData && apiData.review_url ? apiData.review_url : '#' } onClick={ (e) => e.preventDefault() } className="eo-grc-review-link" style={ { marginLeft: '10px' } }>
						{ reviewLinkText }
					</a>
				) }
			</div>
		</div>
	);
}