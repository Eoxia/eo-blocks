import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Notice } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Edit( { attributes, setAttributes } ) {
	const { message, buttonText, useApi } = attributes;
	const [ apiData, setApiData ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/eo-blocks/v1/reviews-data' } ).then( ( res ) => {
			if ( res && res.google && res.google !== false ) {
				setApiData( res.google );
			}
		} ).catch( () => {} );
	}, [] );

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'Réglages de l\'Écran d\'Avis', 'eo-blocks' ) }>
					{ apiData ? (
						<Notice status="success" isDismissible={ false }>
							{ __( '✅ API Connectée.', 'eo-blocks' ) }
						</Notice>
					) : (
						<Notice status="warning" isDismissible={ false }>
							{ __( '❌ API non configurée (ou désactivée).', 'eo-blocks' ) }
						</Notice>
					) }

					<ToggleControl
						label={ __( 'Utiliser l\'URL de l\'API', 'eo-blocks' ) }
						checked={ useApi }
						onChange={ ( val ) => setAttributes( { useApi: val } ) }
					/>

					<TextControl
						label={ __( 'Message d\'incitation', 'eo-blocks' ) }
						value={ message }
						onChange={ ( val ) => setAttributes( { message: val } ) }
					/>

					<TextControl
						label={ __( 'Texte du bouton', 'eo-blocks' ) }
						value={ buttonText }
						onChange={ ( val ) => setAttributes( { buttonText: val } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div className="eo-review-prompt-wrapper">
				<h3 className="eo-rp-message">{ message }</h3>
				<div className="eo-rp-stars">
					<span className="star-empty">☆</span>
					<span className="star-empty">☆</span>
					<span className="star-empty">☆</span>
					<span className="star-empty">☆</span>
					<span className="star-empty">☆</span>
				</div>
				<button className="eo-rp-button" disabled>{ buttonText }</button>
			</div>
		</div>
	);
}