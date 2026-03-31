// src/edit.js

import { __ } from '@wordpress/i18n';
import { useState, useMemo, useEffect, useCallback, useRef } from '@wordpress/element';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls
} from '@wordpress/block-editor';
import {
	PanelBody
} from '@wordpress/components';
import './scss/editor.scss';
import { useSelect } from '@wordpress/data';
import { v4 as uuid } from 'uuid';

import { TabContext } from './context';
import { findBlockRecursively } from '../../../assets/js/utils';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const [ activeTab, setActiveTab ] = useState( attributes.activeTabIndex || '' );

	const handleSetActiveTab = useCallback(( tabKey ) => {
        setActiveTab( tabKey );
        setAttributes( { activeTabIndex: tabKey } );
    }, [setAttributes]);

	const { getBlock, getBlocks, buttonContainerId, contentContainerId } = useSelect( ( select ) => {
		const { getBlock, getBlocks } = select( 'core/block-editor' );
		const parentBlock = getBlock(clientId);

		const btnContainer = findBlockRecursively(parentBlock?.innerBlocks || [], 'eo-blocks/tabs-buttons');
		const contentContainer = findBlockRecursively(parentBlock?.innerBlocks || [], 'eo-blocks/tabs-contents');

		return {
			getBlock,
			getBlocks,
			buttonContainerId: btnContainer?.clientId,
			contentContainerId: contentContainer?.clientId,
		};
	}, [ clientId ] ); // Dépend de clientId pour la re-sélection en cas de changement de structure

	/**
	 * Synchronously removes a tab's counterpart (button or content) when one is deleted.
	 * @param {string} tabKey - The tabKey of the block that was removed.
	 * @param {string} initiatorType - The type of block that initiated the removal ('button' or 'content').
	 */
	const handleRemoveTabSync = useCallback(( tabKey, initiatorType ) => {
		if (!tabKey || !buttonContainerId || !contentContainerId) return;

		const { removeBlock } = wp.data.dispatch('core/block-editor');

		const siblingsButtons = getBlocks( buttonContainerId );
		const siblingsContents = getBlocks( contentContainerId );

		const twinSiblings = (initiatorType === 'button') ? siblingsContents : siblingsButtons;
		const blockToRemove = twinSiblings.find(block => block.attributes.tabKey === tabKey);

		if (blockToRemove) {
			removeBlock( blockToRemove.clientId );
			if (activeTab === tabKey && twinSiblings.length > 1) {
				const remainingBlocks = (initiatorType === 'button') ? siblingsButtons : siblingsContents;
				const remainingIndex = remainingBlocks.findIndex(block => block.attributes.tabKey === tabKey);

				let newActiveTab;
				if (remainingIndex > 0) {
					newActiveTab = remainingBlocks[remainingIndex - 1].attributes.tabKey;
				} else if (remainingBlocks.length > 0) {
					newActiveTab = remainingBlocks[0].attributes.tabKey;
				} else {
					newActiveTab = '';
				}

				if (newActiveTab) {
					handleSetActiveTab( newActiveTab );
				}
			}
		}
	}, [ getBlocks, buttonContainerId, contentContainerId, activeTab, handleSetActiveTab ]);

	const handleAddTabSync = useCallback(( tabKey, initiatorType ) => {
		if (!tabKey || initiatorType !== 'content' || !buttonContainerId || !contentContainerId) return;

		const { insertBlock } = wp.data.dispatch('core/block-editor');
		const siblingsContents = wp.data.select('core/block-editor').getBlocks(contentContainerId);
		const siblingsButtons = wp.data.select('core/block-editor').getBlocks(buttonContainerId);

		const twinButtonExists = siblingsButtons.some(block => block.attributes.tabKey === tabKey);
		if (twinButtonExists) return;

		const newContentIndex = siblingsContents.findIndex(block => block.attributes.tabKey === tabKey);

		if (newContentIndex === -1) {
			console.error(`handleAddTabSync: Bloc de contenu avec la clé ${tabKey} non trouvé ou pas encore indexé.`);
			return;
		}

		const newTabAttributes = { tabKey: tabKey };

		insertBlock(
			wp.blocks.createBlock('eo-blocks/tabs-buttons-inner', newTabAttributes),
			newContentIndex, // Utilisation de l'index du bloc de contenu
			buttonContainerId
		);

		handleSetActiveTab( tabKey );

	}, [ buttonContainerId, contentContainerId, handleSetActiveTab ]);

	const contextValue = useMemo(() => ({
		activeTab: activeTab,
		setActiveTab: handleSetActiveTab,
		onRemoveTab: (tabKey) => handleRemoveTabSync(tabKey, 'button'),
	}), [activeTab, handleSetActiveTab]);

	const blockProps = useBlockProps( {
		'data-active-tab-key': activeTab
	} );
	const lastInnerBlocksRef = useRef(null); // Assurez-vous d'avoir useRef pour l'état précédent

	useEffect(() => {
		if (!buttonContainerId || !contentContainerId) return;

		if (lastInnerBlocksRef.current === null) {
			lastInnerBlocksRef.current = getBlock(clientId)?.innerBlocks || [];
		}

		const targetBlockNames = ['eo-blocks/tabs-buttons-inner', 'eo-blocks/tabs-contents-inner'];

		const unsubscribe = wp.data.subscribe(() => {
			const currentInnerBlocks = getBlock(clientId)?.innerBlocks;
			const lastInnerBlocks = lastInnerBlocksRef.current;

			if (!currentInnerBlocks || !lastInnerBlocks) return;

			targetBlockNames.forEach(blockName => {
				const isButtonInner = blockName === 'eo-blocks/tabs-buttons-inner';
				const containerName = isButtonInner ? 'eo-blocks/tabs-buttons' : 'eo-blocks/tabs-contents';
				const containerId = isButtonInner ? buttonContainerId : contentContainerId;

				const oldContainer = findBlockRecursively(lastInnerBlocks, containerName);
				if (!oldContainer) return;

				const currentSiblings = getBlocks(containerId);
				const oldSiblingsClientIds = oldContainer.innerBlocks.map(block => block.clientId);

				const newContainer = findBlockRecursively(currentInnerBlocks, containerName);
				if (!newContainer) return;

				// Ajout
				if (currentSiblings.length > oldSiblingsClientIds.length) {
					currentSiblings.forEach((currentBlock) => {
						const stillExists = oldSiblingsClientIds.some(oldId => oldId === currentBlock.clientId);

						if (!stillExists) {
							let newTabKey;
							if ( !currentBlock.attributes.tabKey ) {
								newTabKey = uuid();
								wp.data.dispatch('core/block-editor').updateBlockAttributes(
									currentBlock.clientId,
									{ tabKey: newTabKey }
								);
							} else {
								newTabKey = currentBlock.attributes.tabKey;
							}
							const initiatorType = isButtonInner ? 'button' : 'content';

							if (newTabKey && initiatorType === 'content') {
								handleAddTabSync(newTabKey, 'content');
							}
						}
					});
				}

				// Suppression
				if (currentSiblings.length < oldSiblingsClientIds.length) {

					oldContainer.innerBlocks.forEach((oldBlock) => {
						const stillExists = currentSiblings.some(newBlock => newBlock.clientId === oldBlock.clientId);

						if (!stillExists) {
							const removedTabKey = oldBlock.attributes.tabKey;
							const initiatorType = isButtonInner ? 'button' : 'content';

							if (removedTabKey) {
								handleRemoveTabSync(removedTabKey, initiatorType);
							}
						}
					});
				}
			});

			lastInnerBlocksRef.current = currentInnerBlocks;
		});

		return () => unsubscribe();
	}, [clientId, getBlock, getBlocks, buttonContainerId, contentContainerId, handleRemoveTabSync, handleAddTabSync]);

	return (
		<>

			<div { ...blockProps }>
				<TabContext.Provider value={contextValue}>
					<InnerBlocks
						template={[
							[ 'eo-blocks/tabs-buttons', {} ],
							[ 'core/spacer', { height: '20px' } ],
							[ 'eo-blocks/tabs-contents', {} ],
						]}
					/>
				</TabContext.Provider>
			</div>
		</>
	);
}