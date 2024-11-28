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
import { Flex, FlexBlock, FlexItem, RangeControl, DropdownMenu, Toolbar, ToolbarDropdownMenu, ToggleControl, PanelBody, Spacer } from '@wordpress/components';
// import { AlignmentMatrixControl } from '@wordpress/components';

/**
 * Experimental components
 */
import {
	__experimentalBlockAlignmentMatrixControl as BlockAlignmentMatrixControl
} from '@wordpress/block-editor';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'

import {
	sidesHorizontal,
	sidesVertical,
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
	const gapPercentTooltip = value => `${value}em`;
	const titleStyle = {
		fontSize: '11px',
		fontWeight: '500',
		lineHeight: '1.4',
		textTransform: 'uppercase'
	};
	const stickyPositionTranslate = {
		'top left': __( 'At the top left of screen', 'eo-blocks' ),
		'top center': __( 'At the top middle of screen', 'eo-blocks' ),
		'top right': __( 'At the top right of screen', 'eo-blocks' ),
		'center left': __( 'At the middle left of screen', 'eo-blocks' ),
		'center center': __( 'At the middle of screen', 'eo-blocks' ),
		'center right': __( 'At the middle right of screen', 'eo-blocks' ),
		'bottom left': __( 'At the bottom left of screen', 'eo-blocks' ),
		'bottom center': __( 'At the bottom middle of screen', 'eo-blocks' ),
		'bottom right': __( 'At the bottom right of screen', 'eo-blocks' ),
	}
	return (
		<>
			<BlockControls>
				<BlockAlignmentMatrixControl
					label={ __( 'Change sticky position', 'eo-blocks' ) }
					value={ attributes.contentPosition }
					onChange={ ( nextPosition ) =>
						setAttributes( {
							contentPosition: nextPosition,
						} )
					}
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'eo-blocks' ) }>
					<span style={titleStyle}>{ __( 'Sticky position', 'eo-blocks' ) }</span>
					<Flex>
						<FlexItem>
							<BlockAlignmentMatrixControl
								label={ __( 'Change sticky position', 'eo-blocks' ) }
								value={ attributes.contentPosition }
								onChange={ ( nextPosition ) =>
									setAttributes( {
										contentPosition: nextPosition,
									} )
								}
							/>
						</FlexItem>
						<FlexBlock>
							{ stickyPositionTranslate[attributes.contentPosition] }
						</FlexBlock>
					</Flex>


				</PanelBody>
				<PanelBody title={ __( 'Gap Offset', 'eo-blocks' ) }>
					<RangeControl
						label={ __( 'Horizontal Gap offset (em)', 'eo-blocks' ) }
						help={ __( 'Offset of the sticky from the edge of the screen', 'eo-blocks' ) }
						beforeIcon={ sidesHorizontal }
						step={1}
						value={attributes.horizontalGapPercent || 0}
						onChange={(value) => setAttributes({horizontalGapPercent: value})}
						min={0}
						max={6}
						renderTooltipContent={gapPercentTooltip}
					/>
					<RangeControl
						label={ __( 'Vertical Gap offset (em)', 'eo-blocks' ) }
						help={ __( 'Offset of the sticky from the edge of the screen', 'eo-blocks' ) }
						beforeIcon={ sidesVertical }
						step={1}
						value={attributes.verticalGapPercent || 0}
						onChange={(value) => setAttributes({verticalGapPercent: value})}
						min={0}
						max={6}
						renderTooltipContent={gapPercentTooltip}
					/>
				</PanelBody>

				<PanelBody title={ __( 'Mobile settings', 'eo-blocks' ) }>
					<ToggleControl
						label={ __( 'Show in mobile', 'eo-blocks' ) }
						checked={ attributes.displayMobile }
						onChange={ ( value ) => setAttributes( { displayMobile: value } ) }
					/>
					{ attributes.displayMobile &&
						<ToggleGroupControl
							label={ __( 'Style in mobile', 'eo-blocks' ) }
							isBlock
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							value={ attributes.styleMobile }
							onChange={ ( value ) => setAttributes( { styleMobile: value } ) }
						>
							<ToggleGroupControlOption value="standard" label={ __( 'Standard', 'eo-blocks' ) } />
							<ToggleGroupControlOption value="menu" label={ __( 'Menu', 'eo-blocks' ) } />
						</ToggleGroupControl>
					}
				</PanelBody>
			</InspectorControls>

			<div {...useBlockProps()}>
				<InnerBlocks/>
			</div>
		</>
	);
}
