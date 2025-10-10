/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import {__} from '@wordpress/i18n';
import { useContext, useCallback, useEffect } from '@wordpress/element';
import { TabContext } from '../../context';
import { findBlockRecursively } from '../../../../../assets/js/utils';
import classnames from 'classnames';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
    useBlockProps,
    InspectorControls,
    useInnerBlocksProps,
    InnerBlocks,
    __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
    __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients
} from '@wordpress/block-editor';
import { Flex, FlexBlock, FlexItem, PanelBody, Button, ToggleControl, RangeControl, PanelRow } from '@wordpress/components';
import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
    __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { v4 as uuid } from 'uuid';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './scss/editor.scss';
import {arrowDown, arrowRight, justifyCenter, justifyLeft, justifyRight, justifySpaceBetween} from "@wordpress/icons";

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

    const colorSettings = useMultipleOriginColorsAndGradients();
    const inlineStyles = {
        '--eo-tab-color': attributes.tabColor || '#414141',
        '--eo-tab-bg': attributes.tabBackgroundColor,
        '--eo-active-tab-color': attributes.activeTabColor || '#000000',
        '--eo-active-tab-bg': attributes.activeTabBackgroundColor,
    };

    const { getBlock, getBlockParents, innerBlocksCount } = wp.data.useSelect( ( select ) => {
        const { getBlock, getBlockParents, getBlockOrder } = select( 'core/block-editor' );
        return {
            getBlock: getBlock,
            getBlockParents: getBlockParents,
            innerBlocksCount: getBlockOrder( clientId ).length,
        };
    }, [ clientId ] );

    useEffect(() => {
        if (!activeTab) {
            setActiveTab('tab-1');
        }
    }, [activeTab, setActiveTab]);

    const onAddTab = useCallback(() => {
        const newTabKey = uuid();
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

        const newTabAttributes = { tabKey: newTabKey };

        wp.data.dispatch('core/block-editor').insertBlock(
            wp.blocks.createBlock('eo/tabs-buttons-inner', newTabAttributes),
            innerBlocksCount,
            clientId
        );

        wp.data.dispatch('core/block-editor').insertBlock(
            wp.blocks.createBlock('eo/tabs-contents-inner', newTabAttributes),
            innerBlocksCount,
            eoTabsContentsClientId
        );

        setActiveTab( newTabKey );

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

    const blockClassName = classnames(
        {
            [`is-orientation-${ attributes.orientation }`]: attributes.orientation,
            [`is-justify-${ attributes.justification }`]: attributes.justification,
            [`gap-${ attributes.gap }`]: attributes.gap,
            'is-mobile-wrap': attributes.mobileWrap,
        }
    );

    const blockProps = useBlockProps( {
        className: blockClassName,
        style: inlineStyles
    } );

    return (
        <>
            <InspectorControls>
                <PanelBody title={ __( 'Layout', 'eo-blocks' ) }>
                    <Flex>
                        <FlexItem>
                            <ToggleGroupControl
                                label={ __( 'Justification', 'eo-blocks' ) }
                                value={ attributes.justification }
                                onChange={ ( value ) => setAttributes( { justification: value } ) }
                                __next40pxDefaultSize
                            >
                                <ToggleGroupControlOptionIcon
                                    value="left"
                                    icon={ justifyLeft }
                                    label={ __( 'Left justification', 'eo-blocks' ) }
                                />
                                <ToggleGroupControlOptionIcon
                                    value="center"
                                    icon={ justifyCenter }
                                    label={ __( 'Center justification', 'eo-blocks' ) }
                                />
                                <ToggleGroupControlOptionIcon
                                    value="right"
                                    icon={ justifyRight }
                                    label={ __( 'Right justification', 'eo-blocks' ) }
                                />
                                <ToggleGroupControlOptionIcon
                                    value="space-between"
                                    icon={ justifySpaceBetween }
                                    label={ __( 'Space between blocks', 'eo-blocks' ) }
                                />
                            </ToggleGroupControl>
                        </FlexItem>
                        <FlexBlock>
                            <ToggleGroupControl
                                label={ __( 'Orientation', 'eo-blocks' ) }
                                value={ attributes.orientation }
                                onChange={ ( value ) => setAttributes( { orientation: value } ) }
                                __next40pxDefaultSize
                            >
                                <ToggleGroupControlOptionIcon
                                    value="horizontal"
                                    icon={ arrowRight }
                                    label={ __( 'Horizontal', 'eo-blocks' ) }
                                />
                                <ToggleGroupControlOptionIcon
                                    value="vertical"
                                    icon={ arrowDown }
                                    label={ __( 'Vertical', 'eo-blocks' ) }
                                />
                            </ToggleGroupControl>
                        </FlexBlock>
                    </Flex>
                    <ToggleControl
                        label={ __( 'Autoriser le passage sur plusieurs lignes', 'eo-blocks' ) }
                        checked={ attributes.mobileWrap }
                        onChange={ ( value ) => setAttributes( { mobileWrap: value } ) }
                    />
                    <RangeControl
                        label={__('Gap between nav elements', 'eo-blocks')}
                        step={1}
                        value={attributes.gap}
                        onChange={(value) => setAttributes({gap: value})}
                        min={0}
                        max={6}
                    />
                </PanelBody>

            </InspectorControls>

            <InspectorControls group="styles">
                <ToolsPanel label={ __( 'Tab styles', 'eo-blocks' ) } panelId="eo-tab-colors-panel">
                    <ToolsPanelItem
                        hasValue={ () => (
                            attributes.tabColor !== undefined ||
                            attributes.tabBackgroundColor !== undefined ||
                            attributes.activeTabColor !== undefined ||
                            attributes.activeTabBackgroundColor !== undefined
                        ) }
                        isShownByDefault={ true }
                        panelId='eo-tab-colors-settings'
                        resetAll={ () => setAttributes({
                            tabColor: undefined,
                            tabBackgroundColor: undefined,
                            activeTabColor: undefined,
                            activeTabBackgroundColor: undefined
                        }) }
                    >
                        <div style={{ marginBottom: '10px' }}>
                            <strong>{ __( 'Tab par défaut', 'eo-blocks' ) }</strong>
                        </div>
                        <ColorGradientSettingsDropdown
                            settings={ [
                                {
                                    label: __( 'Couleur du texte', 'eo-blocks' ),
                                    colorValue: attributes.tabColor,
                                    onColorChange: ( value ) => setAttributes( { tabColor: value } )
                                },
                                {
                                    label: __( 'Couleur de fond', 'eo-blocks' ),
                                    colorValue: attributes.tabBackgroundColor,
                                    onColorChange: ( value ) => setAttributes( { tabBackgroundColor: value } )
                                }
                            ] }
                            panelId={ clientId }
                            hasColorsOrGradients={ false }
                            disableCustomColors={ false }
                            __experimentalIsRenderedInSidebar
                            { ...colorSettings }
                        />

                        <div style={{ margin: '15px 0 10px 0' }}>
                            <strong>{ __( 'Tab actif', 'eo-blocks' ) }</strong>
                        </div>
                        <ColorGradientSettingsDropdown
                            settings={ [
                                {
                                    label: __( 'Couleur du texte', 'eo-blocks' ),
                                    colorValue: attributes.activeTabColor,
                                    onColorChange: ( value ) => setAttributes( { activeTabColor: value } )
                                },
                                {
                                    label: __( 'Couleur de fond', 'eo-blocks' ),
                                    colorValue: attributes.activeTabBackgroundColor,
                                    onColorChange: ( value ) => setAttributes( { activeTabBackgroundColor: value } )
                                }
                            ] }
                            panelId={ clientId }
                            hasColorsOrGradients={ false }
                            disableCustomColors={ false }
                            __experimentalIsRenderedInSidebar
                            { ...colorSettings }
                        />
                    </ToolsPanelItem>
                </ToolsPanel>

            </InspectorControls>

            <div {...blockProps }>
                <InnerBlocks
                    template={[
                        ['eo/tabs-buttons-inner', {tabKey: 'tab-1'}],
                        ['eo/tabs-buttons-inner', {tabKey: 'tab-2'}],
                        ['eo/tabs-buttons-inner', {tabKey: 'tab-3'}],
                    ]}
                    renderAppender={ () => <CustomAppender/> }
                />
            </div>
        </>
    );
}
