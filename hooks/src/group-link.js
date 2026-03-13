/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { useState, useRef, useEffect, Fragment, createElement, cloneElement } from '@wordpress/element';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton, Popover } from '@wordpress/components';
import { LinkControl } from '@wordpress/block-editor';
import { link } from '@wordpress/icons';
import { createHigherOrderComponent } from "@wordpress/compose";

const allowedBlocks = [ 'core/group', 'core/cover' ];

function eoGroupAddAttributes( settings, name ) {

    if ( ! allowedBlocks.includes( name ) ) {
        return settings;
    }

    settings.attributes = Object.assign( settings.attributes, {
        blockLink: {
            "type": "object",
            "default": {}
        }
    });

    return settings;
}

addFilter(
    'blocks.registerBlockType',
    'eo-blocks/group-custom-attributes',
    eoGroupAddAttributes
);


const eoGroupAddAdvancedControls = createHigherOrderComponent( ( Block ) => {
    return ( props ) => {

        const { name, attributes, setAttributes, isSelected } = props;

        if( ! allowedBlocks.includes( name ) ) {
            return(
                <Block {...props} />
            )
        }

        const [isOpen, setIsOpen] = useState(false);
        const [linkValue, setLinkValue] = useState(attributes.blockLink || {});
        const [ popoverAnchor, setPopoverAnchor ] = useState( null );

        const onChange = (newLink) => {
            setLinkValue(newLink);
            setAttributes({ blockLink: newLink });
        };

        useEffect(() => {
            if (!isSelected) {
                setIsOpen(false);
            }
        }, [isSelected]);

        // Ajout de l'élément dans l'inspecteur
        return (
            <Fragment>
                <Block { ...props } />

                { isSelected && (
                    <BlockControls>
                        <ToolbarGroup>
                            <ToolbarButton
                                icon={link}
                                label="Ajouter un lien"
                                onClick={() => setIsOpen(!isOpen)}
                                ref={setPopoverAnchor}
                                isActive={ !!attributes.blockLink.url }
                            />
                        </ToolbarGroup>
                    </BlockControls>
                )}

                {isOpen && isSelected && (
                    <Popover
                        anchor={popoverAnchor}
                        onClose={() => setIsOpen(false)}
                        focusOnMount={false}
                        position="bottom"
                        offset={8}
                    >
                        <LinkControl
                            searchInputPlaceholder="Rechercher une page..."
                            value={linkValue}
                            settings={[
                                {id: 'opensInNewTab', title: 'Ouvrir dans un nouvel onglet'},
                            ]}
                            onChange={onChange}
                            onRemove={() => {
                                setLinkValue({});
                                setAttributes({blockLink: {}});
                                setIsOpen(false);
                            }}
                        />
                    </Popover>
                )}
            </Fragment>
        );
    };
}, 'eoGroupAddAdvancedControls');

addFilter(
    'editor.BlockEdit',
    'eo-blocks/group-custom-advanced-control',
    eoGroupAddAdvancedControls
);