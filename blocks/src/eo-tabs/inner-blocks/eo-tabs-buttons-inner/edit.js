// src/edit.js de eo-tabs-buttons-inner

import { __ } from '@wordpress/i18n';
// Importez useContext de @wordpress/element, pas de 'react'
import {useContext, useEffect} from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { TabContext } from '../../context';

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

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

	// Define Tab ID based on block index
	// const myIndex = useSelect( ( select ) => {
	// 	const parentClientId = select( 'core/block-editor' ).getBlockRootClientId( clientId );
	// 	const siblings = select( 'core/block-editor' ).getBlocks( parentClientId );
	// 	return siblings.findIndex( ( block ) => block.clientId === clientId );
	// }, [ clientId ]);

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

	return (
		<div { ...blockProps }>
			<InnerBlocks
				template={[[ 'core/paragraph', { content: 'Tab button' } ]]}
				templateLock={false}
			/>
		</div>
	);
}