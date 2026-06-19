import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Notice } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Edit( { attributes, setAttributes } ) {
	const { count, prefix, suffix, useApi } = attributes;
	const [ apiData, setApiData ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/eo-blocks/v1/reviews-data' } ).then( ( res ) => {
			if ( res && res.tripadvisor && res.tripadvisor !== false ) {
				setApiData( res.tripadvisor );
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
				</PanelBody>
			</InspectorControls>
			<div class="eo-tripadvisor-reviews-count-wrapper">
				{ prefix && <span class="eo-grc-prefix">{ prefix }</span> }
				<span class="eo-grc-count">{ displayCount }</span>
				{ suffix && <span class="eo-grc-suffix">{ suffix }</span> }
			</div>
		</div>
	);
}