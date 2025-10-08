// src/edit.js

import { __ } from '@wordpress/i18n';
import { useState, useMemo, useEffect, useCallback, useRef } from '@wordpress/element';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import './scss/editor.scss';
import { useSelect } from '@wordpress/data';

import { TabContext } from './context';
import { findBlockRecursively } from '../../../assets/js/utils';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const [ activeTab, setActiveTab ] = useState( attributes.activeTabIndex || 0 );
	const handleSetActiveTab = useCallback(( index ) => {
		setActiveTab( index );
		setAttributes( { activeTabIndex: index } );
	}, [setAttributes]);

	const { getBlock, getBlocks, buttonContainerId, contentContainerId } = useSelect( ( select ) => {
		const { getBlock, getBlocks } = select( 'core/block-editor' );
		const parentBlock = getBlock(clientId);

		const btnContainer = findBlockRecursively(parentBlock?.innerBlocks || [], 'eo/tabs-buttons');
		const contentContainer = findBlockRecursively(parentBlock?.innerBlocks || [], 'eo/tabs-contents');

		return {
			getBlock,
			getBlocks,
			buttonContainerId: btnContainer?.clientId,
			contentContainerId: contentContainer?.clientId,
		};
	}, [ clientId ] ); // Dépend de clientId pour la re-sélection en cas de changement de structure

		// ... (contextValue - inchangé)
	const contextValue = useMemo(() => ({
		activeTab: activeTab,
		setActiveTab: handleSetActiveTab,
	}), [activeTab, handleSetActiveTab, handleRemoveTabSync]);

	const blockProps = useBlockProps( {
		'data-active-tab-index': activeTab,
	} );

	return (
		<div { ...blockProps }>
			<TabContext.Provider value={contextValue}>
				<InnerBlocks
					template={[
						[ 'eo/tabs-buttons', {} ],
						[ 'eo/tabs-contents', {} ],
					]}
				/>
			</TabContext.Provider>
		</div>
	);
}