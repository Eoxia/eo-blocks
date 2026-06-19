import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, SelectControl, Notice } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Edit( { attributes, setAttributes } ) {
	const { useApi, layout, shape, width, height, showPhoto, showName, showStars, showDate, showText, textLimit } = attributes;
	const [ apiData, setApiData ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/eo-blocks/v1/reviews-data' } ).then( ( res ) => {
			if ( res && res.google && res.google !== false ) {
				setApiData( res.google );
			}
		} ).catch( () => {} );
	}, [] );

	const reviews = (useApi && apiData && apiData.reviews) ? apiData.reviews : [];

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'Réglages des Avis Google', 'eo-blocks' ) }>
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
					/>
					
					<SelectControl
						label={ __( 'Disposition', 'eo-blocks' ) }
						value={ layout }
						options={ [
							{ label: __( 'Grille', 'eo-blocks' ), value: 'grid' },
							{ label: __( 'Carrousel', 'eo-blocks' ), value: 'carousel' },
						] }
						onChange={ ( val ) => setAttributes( { layout: val } ) }
					/>
					
					<SelectControl
						label={ __( 'Format de la carte', 'eo-blocks' ) }
						value={ shape }
						options={ [
							{ label: __( 'Rectangle', 'eo-blocks' ), value: 'rectangle' },
							{ label: __( 'Carré', 'eo-blocks' ), value: 'square' },
						] }
						onChange={ ( val ) => setAttributes( { shape: val } ) }
					/>

					<TextControl
						label={ __( 'Largeur', 'eo-blocks' ) }
						value={ width }
						onChange={ ( val ) => setAttributes( { width: val } ) }
						help={ __( 'Ex: 100%, 300px, etc.', 'eo-blocks' ) }
					/>

					<TextControl
						label={ __( 'Hauteur', 'eo-blocks' ) }
						value={ height }
						onChange={ ( val ) => setAttributes( { height: val } ) }
						help={ __( 'Ex: auto, 250px, etc.', 'eo-blocks' ) }
					/>

					<ToggleControl
						label={ __( 'Afficher la photo', 'eo-blocks' ) }
						checked={ showPhoto }
						onChange={ ( val ) => setAttributes( { showPhoto: val } ) }
					/>
					<ToggleControl
						label={ __( 'Afficher le nom', 'eo-blocks' ) }
						checked={ showName }
						onChange={ ( val ) => setAttributes( { showName: val } ) }
					/>
					<ToggleControl
						label={ __( 'Afficher les étoiles', 'eo-blocks' ) }
						checked={ showStars }
						onChange={ ( val ) => setAttributes( { showStars: val } ) }
					/>
					<ToggleControl
						label={ __( 'Afficher la date', 'eo-blocks' ) }
						checked={ showDate }
						onChange={ ( val ) => setAttributes( { showDate: val } ) }
					/>
					<ToggleControl
						label={ __( 'Afficher le texte', 'eo-blocks' ) }
						checked={ showText }
						onChange={ ( val ) => setAttributes( { showText: val } ) }
					/>
					{ showText && (
						<TextControl
							label={ __( 'Limite de caractères', 'eo-blocks' ) }
							type="number"
							value={ textLimit }
							onChange={ ( val ) => setAttributes( { textLimit: Number(val) } ) }
							help={ __( '0 pour ne pas couper.', 'eo-blocks' ) }
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<div className={ `eo-review-container layout-${layout} shape-${shape}` }>
				{ reviews.length > 0 ? reviews.map( ( review, idx ) => (
					<div key={ idx } className="eo-review-card" style={ { width: width, height: height } }>
						<div className="eo-review-header">
							{ showPhoto && <img src={ review.profile_photo_url } alt={ review.author_name } className="eo-review-photo" /> }
							<div className="eo-review-info">
								{ showName && <strong className="eo-review-name">{ review.author_name }</strong> }
								{ showStars && (
									<div className="eo-review-stars">
										{ Array.from({ length: 5 }).map((_, i) => (
											<span key={i} className={ i < review.rating ? 'star-full' : 'star-empty' }>★</span>
										)) }
									</div>
								) }
								{ showDate && <small className="eo-review-date">{ review.relative_time_description }</small> }
							</div>
						</div>
						{ showText && (
							<div className="eo-review-text">
								{ textLimit > 0 && review.text.length > textLimit 
									? review.text.substring(0, textLimit) + '...'
									: review.text }
							</div>
						) }
					</div>
				) ) : (
					<p>{ __( 'Aucun avis à afficher (ou API non connectée).', 'eo-blocks' ) }</p>
				) }
			</div>
		</div>
	);
}