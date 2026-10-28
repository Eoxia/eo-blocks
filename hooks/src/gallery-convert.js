/**
 * Adds an "EO Blocks" panel to the core/gallery block, in the Settings tab
 * right above "Advanced", with a button converting it into an EO Gallery.
 *
 * The conversion reuses the core/gallery -> eo-blocks/gallery transform
 * declared by the EO Gallery block (same media, same order, captions, alt
 * texts and compatible settings). The new block is inserted right after the
 * native one, then the user chooses whether to delete the native gallery.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useState } from '@wordpress/element';
import { useRegistry } from '@wordpress/data';
import { switchToBlockType, getBlockType } from '@wordpress/blocks';
import { InspectorControls, store as blockEditorStore } from '@wordpress/block-editor';
import { PanelBody, Button, Modal, __experimentalHStack as HStack } from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';

const EO_GALLERY = 'eo-blocks/gallery';

function GalleryConvertControl( { clientId } ) {
	const registry = useRegistry();
	// clientId of the EO Gallery just created, while the "delete?" modal is open.
	const [ createdClientId, setCreatedClientId ] = useState( null );

	const convert = () => {
		const { getBlock, getBlockRootClientId, getBlockIndex } = registry.select( blockEditorStore );
		const { insertBlocks } = registry.dispatch( blockEditorStore );
		const { createErrorNotice } = registry.dispatch( noticesStore );

		const newBlocks = switchToBlockType( getBlock( clientId ), EO_GALLERY );
		if ( ! newBlocks?.length ) {
			createErrorNotice( __( 'Impossible de convertir cette galerie.', 'eo-blocks' ), { type: 'snackbar' } );
			return;
		}

		// Inserted right after the native gallery, without moving the
		// selection: the modal below belongs to the native block's inspector.
		insertBlocks( newBlocks, getBlockIndex( clientId ) + 1, getBlockRootClientId( clientId ), false );
		setCreatedClientId( newBlocks[ 0 ].clientId );
	};

	const finish = ( deleteOriginal ) => {
		const { removeBlock, selectBlock } = registry.dispatch( blockEditorStore );
		const { createSuccessNotice } = registry.dispatch( noticesStore );
		const newClientId = createdClientId;

		setCreatedClientId( null );
		if ( deleteOriginal ) {
			removeBlock( clientId, false );
		}
		selectBlock( newClientId );
		createSuccessNotice(
			deleteOriginal
				? __( 'Galerie convertie en galerie EO Blocks.', 'eo-blocks' )
				: __( 'Galerie EO Blocks créée sous la galerie d’origine.', 'eo-blocks' ),
			{ type: 'snackbar' }
		);
	};

	return (
		<InspectorControls>
			<PanelBody title={ __( 'EO Blocks', 'eo-blocks' ) }>
				<p>
					{ __(
						'Mise en page grille, masonry ou carousel, ordre aléatoire, lightbox et vidéos : passez à la galerie EO Blocks en gardant les mêmes médias.',
						'eo-blocks'
					) }
				</p>
				<Button __next40pxDefaultSize variant="primary" onClick={ convert }>
					{ __( 'Convertir en galerie EO Blocks', 'eo-blocks' ) }
				</Button>
			</PanelBody>

			{ createdClientId && (
				<Modal
					title={ __( 'Supprimer l’ancienne galerie ?', 'eo-blocks' ) }
					onRequestClose={ () => finish( false ) }
					size="small"
				>
					<p>
						{ __(
							'La galerie EO Blocks a été créée juste en dessous, avec les mêmes médias dans le même ordre. Voulez-vous supprimer la galerie WordPress d’origine ?',
							'eo-blocks'
						) }
					</p>
					<HStack justify="flex-end" spacing={ 3 }>
						<Button __next40pxDefaultSize variant="tertiary" onClick={ () => finish( false ) }>
							{ __( 'Conserver', 'eo-blocks' ) }
						</Button>
						<Button __next40pxDefaultSize variant="primary" isDestructive onClick={ () => finish( true ) }>
							{ __( 'Supprimer', 'eo-blocks' ) }
						</Button>
					</HStack>
				</Modal>
			) }
		</InspectorControls>
	);
}

const eoGalleryConvertControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		// The EO Gallery block can be missing (e.g. not built yet).
		if ( props.name !== 'core/gallery' || ! props.isSelected || ! getBlockType( EO_GALLERY ) ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<GalleryConvertControl clientId={ props.clientId } />
			</>
		);
	};
}, 'eoGalleryConvertControl' );

addFilter( 'editor.BlockEdit', 'eo-blocks/gallery-convert-control', eoGalleryConvertControl );
