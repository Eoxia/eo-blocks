/**
 * React component that defines the block editor interface.
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Placeholder } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export default function Edit( { attributes, setAttributes } ) {
	const { mapId } = attributes;
	const blockProps = useBlockProps();

	// Fetch all created maps CPT
	const maps = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'postType', 'eo-map', {
			per_page: -1,
		} );
	}, [] );

	// Prepare options for SelectControl
	const options = [ { value: '', label: __( 'Sélectionnez une carte...', 'eo-blocks' ) } ];
	if ( maps ) {
		maps.forEach( ( map ) => {
			options.push( {
				value: String( map.id ),
				label: map.title.rendered || `Carte #${ map.id }`,
			} );
		} );
	}

	const selectedMap = maps ? maps.find( ( m ) => String( m.id ) === mapId ) : null;

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Configuration de la carte', 'eo-blocks' ) }>
					<SelectControl
						label={ __( 'Choisir une carte', 'eo-blocks' ) }
						value={ mapId }
						options={ options }
						onChange={ ( value ) => setAttributes( { mapId: value } ) }
					/>
				</PanelBody>
			</InspectorControls>

			{ ! mapId ? (
				<Placeholder
					icon="location"
					label={ __( 'Carte OpenStreetMap', 'eo-blocks' ) }
					instructions={ __( 'Veuillez sélectionner une carte dans les réglages du bloc à droite ou en créer une dans l\'administration.', 'eo-blocks' ) }
				/>
			) : (
				<div style={{
					border: '1px solid #ccd0d4',
					padding: '20px',
					background: '#f8f9fa',
					borderRadius: '4px',
					textAlign: 'center'
				}}>
					<div style={{
						display: 'inline-flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '40px',
						height: '40px',
						borderRadius: '50%',
						background: '#e1f0ff',
						color: '#0066FF',
						marginBottom: '10px'
					}}>
						<span className="dashicons dashicons-location" style={{ fontSize: '24px', width: 'auto', height: 'auto' }}></span>
					</div>
					<h3 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
						{ selectedMap ? selectedMap.title.rendered : __( 'Carte sélectionnée', 'eo-blocks' ) }
					</h3>
					<p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>
						{ __( 'Identifiant de la carte :', 'eo-blocks' ) } <code>{ mapId }</code>
					</p>
					<div style={{
						fontSize: '11px',
						color: '#8c8f94',
						borderTop: '1px solid #e2e4e7',
						paddingTop: '10px',
						marginTop: '10px'
					}}>
						{ __( 'L\'affichage interactif de la carte OpenStreetMap sera visible sur le site public.', 'eo-blocks' ) }
					</div>
				</div>
			) }
		</div>
	);
}
