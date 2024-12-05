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
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Flex, FlexBlock, FlexItem, PanelBody } from '@wordpress/components';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import {
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifySpaceBetween,
	arrowDown,
	arrowRight
} from '@wordpress/icons';


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
				<PanelBody title={ __( 'Layout', 'eo-blocks' ) }>
					<Flex>
						<FlexBlock>
							<ToggleGroupControl
								label={ __( 'Orientation', 'eo-blocks' ) }
								value={ attributes.orientation }
								onChange={ ( value ) => setAttributes( { orientation: value } ) }
								__nextHasNoMarginBottom
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
						<FlexItem>
							<ToggleGroupControl
								label={ __( 'Justification', 'eo-blocks' ) }
								value={ attributes.justification }
								onChange={ ( value ) => setAttributes( { justification: value } ) }
								__nextHasNoMarginBottom
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
					</Flex>
				</PanelBody>

			</InspectorControls>

			<div {...useBlockProps()}>
				Coucou
			</div>
		</>
	);
}
