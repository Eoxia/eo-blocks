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
    __experimentalUnitControl as UnitControl,
    __experimentalBoxControl as BoxControl
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
        '--eo-tab-color': attributes.tabColor || '#a1a1a1',
        '--eo-tab-bg': attributes.tabBackgroundColor,
        '--eo-active-tab-color': attributes.activeTabColor || '#000000',
        '--eo-active-tab-bg': attributes.activeTabBackgroundColor || '#eeeeee',
        '--eo-hover-tab-color': attributes.hoverTabColor,
        '--eo-hover-tab-bg': attributes.hoverTabBackgroundColor,
        '--eo-tab-border-radius': attributes.tabRadius,
        '--eo-tab-padding-top': attributes.tabPadding?.top,
        '--eo-tab-padding-right': attributes.tabPadding?.right,
        '--eo-tab-padding-bottom': attributes.tabPadding?.bottom,
        '--eo-tab-padding-left': attributes.tabPadding?.left,
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
        const eoTabsBlock = parentBlocks.find( block => block && block.name === 'eo-blocks/tabs' );

        if ( !eoTabsBlock ) {
            console.error('No eo/tabs parent block found');
            return;
        }

        const eoTabsContentsBlock = findBlockRecursively( eoTabsBlock.innerBlocks, 'eo-blocks/tabs-contents' );

        if ( !eoTabsContentsBlock ) {
            console.error('No eo/tabs-contents block found inside eo/tabs');
            return;
        }

        const eoTabsContentsClientId = eoTabsContentsBlock.clientId;

        const newTabAttributes = { tabKey: newTabKey };

        wp.data.dispatch('core/block-editor').insertBlock(
            wp.blocks.createBlock('eo-blocks/tabs-buttons-inner', newTabAttributes),
            innerBlocksCount,
            clientId
        );

        wp.data.dispatch('core/block-editor').insertBlock(
            wp.blocks.createBlock('eo-blocks/tabs-contents-inner', newTabAttributes),
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
                        label={ __( 'Allow multiple lines to cross', 'eo-blocks' ) }
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
                            attributes.activeTabBackgroundColor !== undefined ||
                            attributes.hoverTabColor !== undefined ||
                            attributes.hoverTabBackgroundColor !== undefined ||
                            attributes.tabRadius !== undefined ||
                            (attributes.tabPadding && Object.keys(attributes.tabPadding).length > 0)
                        ) }
                        isShownByDefault={ true }
                        panelId='eo-tab-colors-settings'
                        resetAll={ () => setAttributes({
                            tabColor: undefined,
                            tabBackgroundColor: undefined,
                            activeTabColor: undefined,
                            activeTabBackgroundColor: undefined,
                            hoverTabColor: undefined,
                            hoverTabBackgroundColor: undefined,
                            tabRadius: undefined,
                            tabPadding: {
                                top: '0em',
                                right: '1.2em',
                                bottom: '0em',
                                left: '1.2em',
                            }
                        }) }
                    >
                        <div>
                            <strong>{ __( 'Default tab', 'eo-blocks' ) }</strong>
                        </div>
                        <ColorGradientSettingsDropdown
                            settings={ [
                                {
                                    label: __( 'Text color', 'eo-blocks' ),
                                    colorValue: attributes.tabColor,
                                    onColorChange: ( value ) => setAttributes( { tabColor: value } )
                                },
                                {
                                    label: __( 'Background color', 'eo-blocks' ),
                                    colorValue: attributes.tabBackgroundColor,
                                    onColorChange: ( value ) => setAttributes( { tabBackgroundColor: value } )
                                }
                            ] }
                            panelId={ `${ clientId }-default-colors` }
                            hasColorsOrGradients={ false }
                            disableCustomColors={ false }
                            __experimentalIsRenderedInSidebar
                            { ...colorSettings }
                        />

                        <div style={{ margin: '15px 0 10px 0' }}>
                            <strong>{ __( 'Hover tab', 'eo-blocks' ) }</strong>
                        </div>
                        <ColorGradientSettingsDropdown
                            settings={ [
                                {
                                    label: __( 'Text color', 'eo-blocks' ),
                                    colorValue: attributes.hoverTabColor,
                                    onColorChange: ( value ) => setAttributes( { hoverTabColor: value } )
                                },
                                {
                                    label: __( 'Background color', 'eo-blocks' ),
                                    colorValue: attributes.hoverTabBackgroundColor,
                                    onColorChange: ( value ) => setAttributes( { hoverTabBackgroundColor: value } )
                                }
                            ] }
                            panelId={ `${ clientId }-hover-colors` }
                            hasColorsOrGradients={ false }
                            disableCustomColors={ false }
                            __experimentalIsRenderedInSidebar
                            { ...colorSettings }
                        />

                        <div style={{ margin: '15px 0 10px 0' }}>
                            <strong>{ __( 'Active tab', 'eo-blocks' ) }</strong>
                        </div>
                        <ColorGradientSettingsDropdown
                            settings={ [
                                {
                                    label: __( 'Text color', 'eo-blocks' ),
                                    colorValue: attributes.activeTabColor,
                                    onColorChange: ( value ) => setAttributes( { activeTabColor: value } )
                                },
                                {
                                    label: __( 'Background color', 'eo-blocks' ),
                                    colorValue: attributes.activeTabBackgroundColor,
                                    onColorChange: ( value ) => setAttributes( { activeTabBackgroundColor: value } )
                                }
                            ] }
                            panelId={ `${ clientId }-active-colors` }
                            hasColorsOrGradients={ false }
                            disableCustomColors={ false }
                            __experimentalIsRenderedInSidebar
                            { ...colorSettings }
                        />

                        <div style={{ margin: '15px 0 10px 0' }}>
                            <strong>{ __( 'Tab radius', 'eo-blocks' ) }</strong>
                        </div>
                        <UnitControl
                            label={ __( 'Radius', 'eo-blocks' ) }
                            key="eo-tab-radius"
                            labelPosition="top"
                            value={ attributes.tabRadius }
                            onChange={ ( value ) => setAttributes( { tabRadius: value } ) }
                            units={[
                                { value: 'px', label: 'px', step: 1, key: 'px' },
                                { value: '%', label: '%', step: 1, key: '%' },
                                { value: 'em', label: 'em', step: 0.1, key: 'em' },
                            ]}
                            min={0}
                            max={100}
                            step={1}
                            __next40pxDefaultSize
                            />
                        <div style={{ margin: '15px 0 10px 0' }}>
                            <strong>{ __( 'Tab padding', 'eo-blocks' ) }</strong>
                        </div>
                        <BoxControl
                            label={ __( 'Internal margins (Padding)', 'eo-blocks' ) }
                            key="eo-tab-padding"
                            values={ attributes.tabPadding }
                            onChange={ ( newPadding ) => setAttributes( { tabPadding: newPadding } ) }
                            // units={[
                            //     { value: 'px', label: 'px', key: 'px' },
                            //     { value: '%', label: '%', key: '%' },
                            //     { value: 'em', label: 'em', key: 'em' },
                            //     { value: 'rem', label: 'rem', key: 'rem' }
                            // ]}
                            // sides={[ 'top', 'right', 'bottom', 'left' ]}
                            allowReset={ false }
                            __next40pxDefaultSize
                        />
                    </ToolsPanelItem>
                </ToolsPanel>

            </InspectorControls>

            <div {...blockProps }>
                <InnerBlocks
                    template={[
                        ['eo-blocks/tabs-buttons-inner', {tabKey: 'tab-1'}],
                        ['eo-blocks/tabs-buttons-inner', {tabKey: 'tab-2'}],
                        ['eo-blocks/tabs-buttons-inner', {tabKey: 'tab-3'}],
                    ]}
                    renderAppender={ () => <CustomAppender/> }
                />
            </div>
        </>
    );
}
