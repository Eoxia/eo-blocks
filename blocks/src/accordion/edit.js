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
import { BlockControls, RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { Toolbar, ToolbarDropdownMenu } from '@wordpress/components';
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
			<BlockControls>
				<Toolbar label={ __('Change heading tag', 'eo-blocks') }>
					<ToolbarDropdownMenu
						icon={ heading }
						label={ __('Select title tag', 'eo-blocks') }
						controls={ [
							{
								title: __('Heading 1', 'eo-blocks'),
								icon: headingLevel1,
								onClick: () => setAttributes( { 'titleTag': 'h1' } ),
							},
							{
								title: __('Heading 2', 'eo-blocks'),
								icon: headingLevel2,
								onClick: () => setAttributes( { 'titleTag': 'h2' } ),
							},
							{
								title: __('Heading 3', 'eo-blocks'),
								icon: headingLevel3,
								onClick: () => setAttributes( { 'titleTag': 'h3' } ),
							},
							{
								title: __('Heading 4', 'eo-blocks'),
								icon: headingLevel4,
								onClick: () => setAttributes( { 'titleTag': 'h4' } ),
							},
							{
								title: __('Heading 5', 'eo-blocks'),
								icon: headingLevel5,
								onClick: () => setAttributes( { 'titleTag': 'h5' } ),
							},
							{
								title: __('Heading 6', 'eo-blocks'),
								icon: headingLevel6,
								onClick: () => setAttributes( { 'titleTag': 'h6' } ),
							},
							{
								title: __('Paragraph', 'eo-blocks'),
								icon: paragraph,
								onClick: () => setAttributes( { 'titleTag': 'span' } ),
							},
						] }
					/>
				</Toolbar>
			</BlockControls>

			<div {...useBlockProps()}>
				<div className="eo-accordion__header">
					<div className="eo-accordion__header-container">
						<RichText
							tagName={ attributes.titleTag }
							className="eo-accordion__title"
							value={attributes.title}
							allowedFormats={['core/bold', 'core/italic']}
							onChange={(title) => setAttributes({title})}
						/>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="eo-accordion__header-toggle">
							<path
								d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
						</svg>
					</div>

					<RichText
						tagName="span"
						className="eo-accordion__subtitle"
						value={attributes.subtitle}
						allowedFormats={['core/bold', 'core/italic']}
						onChange={(subtitle) => setAttributes({subtitle})}
						placeholder={__('Write subtitle here', 'eo-blocks')}
					/>
				</div>

				<div className="eo-accordion__content">
					<InnerBlocks />
				</div>
			</div>
		</>
	);
}
