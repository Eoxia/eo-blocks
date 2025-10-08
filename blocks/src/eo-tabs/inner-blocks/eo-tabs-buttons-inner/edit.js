// src/edit.js de eo-tabs-buttons-inner

import { __ } from '@wordpress/i18n';
// Importez useContext de @wordpress/element, pas de 'react'
import { useContext } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { TabContext } from '../../context';

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import './scss/editor.scss';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { activeTab, setActiveTab } = useContext( TabContext );

	// Define Tab ID based on block index
	const myIndex = useSelect( ( select ) => {
		const parentClientId = select( 'core/block-editor' ).getBlockRootClientId( clientId );
		const siblings = select( 'core/block-editor' ).getBlocks( parentClientId );
		return siblings.findIndex( ( block ) => block.clientId === clientId );
	}, [ clientId ]);

	const tabId = myIndex;
	const isSelected = activeTab === tabId;

	const blockProps = useBlockProps({
		className: isSelected ? 'is-active' : '',
		onClick: () => {
			setActiveTab( tabId );
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