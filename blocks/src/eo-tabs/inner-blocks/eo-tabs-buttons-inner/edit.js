// src/edit.js de eo-tabs-buttons-inner

import { __ } from '@wordpress/i18n';
// Importez useContext de @wordpress/element, pas de 'react'
import {useContext, useEffect} from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { TabContext } from '../../context';

import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import './scss/editor.scss';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { activeTab, setActiveTab } = useContext( TabContext );
	const { tabKey } = attributes;

	// Définir le tabKey par défaut si vide
	const myIndex = useSelect( ( select ) => {
		const parentClientId = select( 'core/block-editor' ).getBlockRootClientId( clientId );
		const siblings = select( 'core/block-editor' ).getBlocks( parentClientId );
		return siblings.findIndex( ( block ) => block.clientId === clientId );
	}, [ clientId ]);

	useEffect(() => {
		if (!tabKey && myIndex >= 0) {
			const staticKey = 'tab-' + (myIndex + 1);
			setAttributes({ tabKey: staticKey });
		}
	}, [tabKey, myIndex, setAttributes]);

	// const tabId = myIndex;
	const finalTabKey = tabKey || 'temp-loading';
	const isSelected = activeTab === finalTabKey;

	const blockProps = useBlockProps({
		className: isSelected ? 'is-active' : '',
		tabkey: finalTabKey,
		onClick: () => {
			setActiveTab( finalTabKey );
		},
	});

	const PARENT_BLOCK_NAME = 'eo/tabs-buttons';
	const targetParentClientId = useSelect( ( select ) => {
		const { getBlockParents, getBlock } = select( 'core/block-editor' );
		const allParentsIds = getBlockParents( clientId );
		for ( const parentId of allParentsIds ) {
			const parentBlock = getBlock( parentId );

			if ( parentBlock && parentBlock.name === PARENT_BLOCK_NAME ) {
				return parentId;
			}
		}
		return null;
	}, [ clientId ] );

	const { selectBlock } = useDispatch( 'core/block-editor' );
	const handleLinkClick = ( event ) => {
		event.preventDefault();
		if ( targetParentClientId ) {
			selectBlock( targetParentClientId );
		}
	};



	return (
		<>
			<InspectorControls>
				<PanelBody>
					{ __( 'To modify the properties of this block, ', 'eo-blocks' ) }
					<a
						href="#"
						onClick={ handleLinkClick }
						style={{ cursor: 'pointer', textDecoration: 'underline' }}
						title={ __( 'Select the parent block', 'eo-blocks' ) }
					>
						{ __( 'refer to its parent Tab Buttons', 'eo-blocks' ) }
					</a>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<InnerBlocks
					template={[[ 'core/paragraph', { content: 'Tab button' } ]]}
					templateLock={false}
				/>
			</div>
		</>

	);
}