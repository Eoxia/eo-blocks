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
import { useSelect  } from '@wordpress/data';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Flex, FlexBlock, FlexItem, ToggleControl, TextControl, PanelBody } from '@wordpress/components';
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
	const headers = useSelect((select) => {
		const { getBlocks } = select('core/block-editor');
		const allBlocks = getBlocks();

		// Utilise la fonction récursive pour récupérer les `Headings`
		return getHeadingsWithDisplaySummary(allBlocks);
	}, []);

	if ( headers.length == 0 ) {
		headers.push({
			content: __( 'Please activate "Summary title" on heading blocks to display the summary nav', 'eo-blocks' )
		});
	}

	const { labelMenuMobile, justification, orientation } = attributes;

	const className = [
		justification ? `is-justification-${justification}` : '',
		orientation ? `is-orientation-${orientation}` : ''
	]
		.filter(Boolean)
		.join(' ');

	const blockProps = useBlockProps({
		className: className,
	});

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

				<PanelBody title={ __( 'Mobile settings', 'eo-blocks' ) }>
					<ToggleControl
						label={ __( 'Show in mobile', 'eo-blocks' ) }
						checked={ attributes.displayMobile }
						onChange={ ( value ) => setAttributes( { displayMobile: value } ) }
					/>
					{ attributes.displayMobile &&
						<>
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
							
							{ attributes.styleMobile === 'menu' && (
								<TextControl
									label={ __( 'Menu label', 'eo-blocks' ) }
									value={ labelMenuMobile || '' }
									onChange={ ( value ) => setAttributes( { labelMenuMobile: value } ) }
								/>
							) }
						</>
					}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{headers.map((header, index) => {
					return (
						<div className="eo-summary__item" key={index}>
							{typeof header.content === 'string' ? header.content : JSON.stringify(header.content)}
						</div>
					);
				})}
			</div>
		</>
	);
}

function getHeadingsWithDisplaySummary(blocks) {
	let headings = [];

	blocks.forEach((block) => {
		if (block.name === 'core/heading' && block.attributes.displaySummary === true) {

			var label = '';
			if (typeof block.attributes.summaryLabel !== 'undefined' && block.attributes.summaryLabel) {
				label = block.attributes.summaryLabel;
			} else if (block.attributes.content) {
				const contentCopy = JSON.parse(JSON.stringify(block.attributes.content));
				if (typeof contentCopy === 'object') {
					label = contentCopy?.originalHTML || contentCopy?.[0]?.originalHTML || '';
				} else if (typeof contentCopy === 'string') {
					label = contentCopy;
				}
			}

			headings.push({
				content: label || '',
			});
		}

		if (block.innerBlocks && block.innerBlocks.length > 0) {
			headings = headings.concat(getHeadingsWithDisplaySummary(block.innerBlocks));
		}
	});

	return headings;
}
