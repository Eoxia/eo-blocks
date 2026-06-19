import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Notice } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Edit( { attributes, setAttributes } ) {
	const { count, prefix, suffix } = attributes;
	const [ apiData, setApiData ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/eo-blocks/v1/reviews-data' } ).then( ( res ) => {
			if ( res && res.google && res.google !== false ) {
				setApiData( res.google );
			}
		} ).catch( () => {} );
	}, [] );

	const displayCount = apiData && apiData.count ? apiData.count : count;

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'RÃ©glages des Avis', 'eo-blocks' ) }>
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
						label={ __( 'PrÃ©fixe', 'eo-blocks' ) }
						value={ prefix }
						onChange={ ( val ) => setAttributes( { prefix: val } ) }
					/>
					<TextControl
						label={ __( 'Nombre d\'avis', 'eo-blocks' ) }
						type="number"
						value={ displayCount }
						onChange={ ( val ) => setAttributes( { count: Number( val ) } ) }
						disabled={ !!apiData }
						help={ !!apiData ? __( 'RÃ©cupÃ©rÃ© automatiquement depuis l\'API.', 'eo-blocks' ) : '' }
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
				<span className="eo-grc-count">{ displayCount }</span>
				{ suffix && <span className="eo-grc-suffix">{ suffix }</span> }
			</div>
		</div>
	);
}
