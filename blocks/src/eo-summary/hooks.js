/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from "@wordpress/hooks";
import { Fragment } from "@wordpress/element";
import { InspectorControls } from "@wordpress/block-editor";
import { createHigherOrderComponent } from "@wordpress/compose";
import { ToggleControl, TextControl } from "@wordpress/components";

const allowedBlocks = [ 'core/heading' ];

function eoSummaryAddAttributes( settings, name ) {

    if ( ! allowedBlocks.includes( name ) ) {
        return settings;
    }

    settings.attributes = Object.assign( settings.attributes, {
        displaySummary: {
            type: 'boolean',
            default: false,
        },
        summaryLabel: {
            type: 'string',
            default: ''
        }
    });

    return settings;
}

addFilter(
    'blocks.registerBlockType',
    'eo-blocks/summary-custom-attributes',
    eoSummaryAddAttributes
);


const eoSummaryAddAdvancedControls = createHigherOrderComponent( ( Block ) => {
    return ( props ) => {

        const { name, attributes, setAttributes, isSelected } = props;
        const { displaySummary, summaryLabel } = attributes;

        if( ! allowedBlocks.includes( name ) ) {
            return(
                <Block {...props} />
            )
        }

        // Ajout de l'élément dans l'inspecteur
        return (
            <Fragment>
                <Block { ...props } />
                { isSelected &&
                     <InspectorControls group="color">
                        <div className="full-width-control-wrapper">
                            <strong>{ __( "Eo Blocks - Summary", 'eo-blocks' ) }</strong>
                            <p className="box-subtitle">{ __( 'Parameter for Summary block', 'eo-blocks' ) }</p>

                            <ToggleControl
                                label={ __( 'Use as summary title', 'eo-blocks' ) }
                                checked={ displaySummary === true }
                                onChange={ ( value ) => setAttributes({ displaySummary: value }) }
                                className="full-width-control-wrapper"
                            />

                            { displaySummary &&
                                <TextControl
                                    label={ __( 'Title displayed as summary', 'eo-blocks' ) }
                                    value={ summaryLabel }
                                    onChange={ ( value ) => setAttributes({ summaryLabel: value }) }
                                    className="full-width-control-wrapper"
                                />
                            }
                        </div>
                    </InspectorControls>
                }
            </Fragment>
        );
    };
}, 'eoSummaryAddAdvancedControls');

addFilter(
    'editor.BlockEdit',
    'eo-blocks/summary-custom-advanced-control',
    eoSummaryAddAdvancedControls
);

function eoSummaryApplyExtraClass( extraProps, blockType, attributes ) {
    if (!allowedBlocks.includes(blockType.name)) {
        return extraProps;
    }

    const { displaySummary, summaryLabel, content } = attributes;

    if (typeof displaySummary !== 'undefined' && displaySummary === true) {

        const className = extraProps.className ? `${extraProps.className} eo-summary__control` : 'eo-summary__control';
        let label = '';

        if (typeof summaryLabel !== 'undefined' && summaryLabel) {
            label = summaryLabel;
        } else if (content) {
            const contentCopy = JSON.parse(JSON.stringify(content));
            if (typeof contentCopy === 'object') {
                label = contentCopy?.originalHTML || contentCopy?.[0]?.originalHTML || '';
            } else if (typeof contentCopy === 'string') {
                label = contentCopy;
            }
        }

        const cleanedValue = label
            ? cleanSummaryString( label )
            : '';

        return {
            ...extraProps,
            className,
            'summary-label': label,
            id: cleanedValue,
        };
    }

    return extraProps;
}

addFilter(
    'blocks.getSaveContent.extraProps',
    'eo-blocks/summary-applyExtraClass',
    eoSummaryApplyExtraClass
);

function cleanSummaryString( str ) {
    if ( typeof str !== 'string' ) {
        console.error( 'cleanSummaryString: Argument is not a string', str );
        return '';
    }

    const normalized = str.normalize ? str.normalize( 'NFD' ).replace( /[\u0300-\u036f]/g, '' ) : str;
    return normalized
        .toLowerCase()
        .replace( /[^a-zA-Z0-9]+/g, '-' )
        .replace( /^-+|-+$/g, '' );
}
