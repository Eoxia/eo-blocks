/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, BlockControls, RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { AlignmentMatrixControl, DropdownMenu, Toolbar, ToolbarDropdownMenu, ToggleControl, PanelBody } from '@wordpress/components';
import {
	heading,
	headingLevel1,
	headingLevel2,
	headingLevel3,
	headingLevel4,
	headingLevel5,
	headingLevel6,
	paragraph
} from '@wordpress/icons';

import { useState } from '@wordpress/element';

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
export default function Edit( { attributes, setAttributes } ) {
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'eo-blocks' ) }>
					<AlignmentMatrixControl
						value={ attributes.contentPosition }
						onChange={ ( value ) => setAttributes( { contentPosition: value } ) }
					/>
					<DropdownMenu
						icon={ heading }
                        label={ __( 'Content position', 'eo-blocks' ) }
						controls={
							<AlignmentMatrixControl
								value={ attributes.contentPosition }
								onChange={ ( value ) => setAttributes( { contentPosition: value } ) }
							/>
						}
                    />
				</PanelBody>
			</InspectorControls>

		</>
	);
}
