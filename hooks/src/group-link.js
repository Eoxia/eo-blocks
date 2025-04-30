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

const allowedBlocks = [ 'core/group' ];

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
    'eo/group-custom-attributes',
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
        const buttonRef = useRef();

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
                                ref={buttonRef}
                            />
                        </ToolbarGroup>
                    </BlockControls>
                )}

                {isOpen && isSelected && (
                    <Popover
                        anchorRef={buttonRef}
                        onClose={() => setIsOpen(false)}
                        focusOnMount={false}
                    >
                        <LinkControl
                            searchInputPlaceholder="Rechercher une page..."
                            value={linkValue}
                            settings={[
                                { id: 'opensInNewTab', title: 'Ouvrir dans un nouvel onglet' },
                            ]}
                            onChange={onChange}
                        />
                    </Popover>
                )}
            </Fragment>
        );
    };
}, 'eoGroupAddAdvancedControls');

addFilter(
    'editor.BlockEdit',
    'eo/group-custom-advanced-control',
    eoGroupAddAdvancedControls
);