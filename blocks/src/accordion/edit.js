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
import { Toolbar, ToolbarDropdownMenu, ToggleControl, PanelBody } from '@wordpress/components';
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
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'eo-blocks' ) }>
					<ToggleControl
						label={ __( 'Is opened by default', 'eo-blocks' ) }
						checked={ attributes.isOpened }
						onChange={ ( value ) => setAttributes( { isOpened: value } ) }
					/>
				</PanelBody>
			</InspectorControls>

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

			<div { ...useBlockProps() }>
				<div className="eo-accordion__header">
					<div className="eo-accordion__header-container">
						<RichText
							tagName={attributes.titleTag}
							className="eo-accordion__title"
							value={attributes.title}
							allowedFormats={['core/bold', 'core/italic', 'core/text-color', 'core/image']}
							onChange={(title) => setAttributes({title})}
							placeholder={ __( 'Title', 'eo-blocks' ) }
						/>
						<span className="eo-accordion__header-toggle dashicons dashicons-arrow-right-alt2"></span>
					</div>

					<RichText
						tagName="span"
						className="eo-accordion__subtitle"
						value={attributes.subtitle}
						allowedFormats={['core/bold', 'core/italic']}
						onChange={(subtitle) => setAttributes({subtitle})}
						placeholder={ __('Write subtitle...', 'eo-blocks') }
					/>
				</div>

				<div className="eo-accordion__inner">
					<InnerBlocks/>
				</div>
			</div>
		</>
	);
}
