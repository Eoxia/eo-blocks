/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import {__} from '@wordpress/i18n';
import { useContext, useCallback } from '@wordpress/element';
import { TabContext } from '../../context';
import { findBlockRecursively } from '../../../../../assets/js/utils';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {useBlockProps, useInnerBlocksProps, InnerBlocks} from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './scss/editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({attributes, setAttributes, clientId}) {
    const { activeTab, setActiveTab } = useContext( TabContext );

    const { getBlock, getBlockParents, innerBlocksCount } = wp.data.useSelect( ( select ) => {
        const { getBlock, getBlockParents, getBlockOrder } = select( 'core/block-editor' );
        return {
            getBlock: getBlock,
            getBlockParents: getBlockParents,
            innerBlocksCount: getBlockOrder( clientId ).length,
        };
    }, [ clientId ] );

    const onAddTab = useCallback(() => {
        const parentBlocks = getBlockParents( clientId, true ).map( id => getBlock( id ) );
        const eoTabsBlock = parentBlocks.find( block => block && block.name === 'eo/tabs' );

        if ( !eoTabsBlock ) {
            console.error('No eo/tabs parent block found');
            return;
        }

        const eoTabsContentsBlock = findBlockRecursively( eoTabsBlock.innerBlocks, 'eo/tabs-contents' );

        if ( !eoTabsContentsBlock ) {
            console.error('No eo/tabs-contents block found inside eo/tabs');
            return;
        }

        const eoTabsContentsClientId = eoTabsContentsBlock.clientId;

        wp.data.dispatch('core/block-editor').insertBlock(
            wp.blocks.createBlock('eo/tabs-buttons-inner'),
            innerBlocksCount,
            clientId
        );

        wp.data.dispatch('core/block-editor').insertBlock(
            wp.blocks.createBlock('eo/tabs-contents-inner'),
            innerBlocksCount,
            eoTabsContentsClientId
        );

        setActiveTab( innerBlocksCount );

    }, [ getBlock, getBlockParents, clientId, innerBlocksCount ]);

    const CustomAppender = () => (
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <Button
                variant="primary"
                onClick={onAddTab}
            >
                { __( 'Add tab', 'eo-blocks' ) }
            </Button>
        </div>
    );

    return (
        <div {...useBlockProps()}>
            <InnerBlocks
                template={[
                    ['eo/tabs-buttons-inner', {}],
                    ['eo/tabs-buttons-inner', {}],
                    ['eo/tabs-buttons-inner', {}],
                ]}
                renderAppender={ () => <CustomAppender/> }
            />
        </div>
    );
}
