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
import { Flex, FlexBlock, FlexItem, Toolbar, ToolbarGroup, ToolbarButton, Popover, ToolbarDropdownMenu, ToggleControl, PanelBody } from '@wordpress/components';
import { useState } from '@wordpress/element';
import {
	heading,
	headingLevel1,
	headingLevel2,
	headingLevel3,
	headingLevel4,
	headingLevel5,
	headingLevel6, link,
	paragraph,
	typography,
	rotateLeft
} from '@wordpress/icons';
import { __experimentalUnitControl as UnitControl } from '@wordpress/components';

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
	const [ isFontSizeOpen, setFontSizeOpen ] = useState( false );
	const [ popoverAnchor, setPopoverAnchor ] = useState( null );
	const units = [
		{ value: 'px', label: 'px', default: 0 },
		{ value: 'em', label: 'em', default: 0 },
	];

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
								isActive: attributes.titleTag === 'h1',
								onClick: () => setAttributes( { 'titleTag': 'h1' } ),
							},
							{
								title: __('Heading 2', 'eo-blocks'),
								icon: headingLevel2,
								isActive: attributes.titleTag === 'h2',
								onClick: () => setAttributes( { 'titleTag': 'h2' } ),
							},
							{
								title: __('Heading 3', 'eo-blocks'),
								icon: headingLevel3,
								isActive: attributes.titleTag === 'h3',
								onClick: () => setAttributes( { 'titleTag': 'h3' } ),
							},
							{
								title: __('Heading 4', 'eo-blocks'),
								icon: headingLevel4,
								isActive: attributes.titleTag === 'h4',
								onClick: () => setAttributes( { 'titleTag': 'h4' } ),
							},
							{
								title: __('Heading 5', 'eo-blocks'),
								icon: headingLevel5,
								isActive: attributes.titleTag === 'h5',
								onClick: () => setAttributes( { 'titleTag': 'h5' } ),
							},
							{
								title: __('Heading 6', 'eo-blocks'),
								icon: headingLevel6,
								isActive: attributes.titleTag === 'h6',
								onClick: () => setAttributes( { 'titleTag': 'h6' } ),
							},
							{
								title: __('Paragraph', 'eo-blocks'),
								icon: paragraph,
								isActive: attributes.titleTag === 'span',
								onClick: () => setAttributes( { 'titleTag': 'span' } ),
							},
						] }
					/>
				</Toolbar>
				<ToolbarGroup>
					<ToolbarButton
						icon={ typography }
						label={ __('Font size', 'eo-blocks') }
						isPressed={ isFontSizeOpen }
						onClick={ () => setFontSizeOpen( ! isFontSizeOpen ) }
					/>
					{ isFontSizeOpen && (
						<Popover
							onClose={ () => setFontSizeOpen( false ) }
							focusOnMount={ false }
							position="bottom"
							offset={8}
						>
							<div style={{ padding: '10px', maxWidth: '250px' }}>
                                <Flex align="end" justify="space-between">
									<FlexBlock>
										<UnitControl
											label={ __('Title custom size', 'eo-blocks') }
											value={ attributes.titleFontSize }
											onChange={ ( value ) => {
												if ( ! value ) {
													setAttributes({ titleFontSize: undefined });
												} else {
													setAttributes({ titleFontSize: value });
												}
											}}
											units={ units }
										/>
									</FlexBlock>
									<FlexItem>
										<ToolbarButton
											icon={rotateLeft}
											label={__('Réinitialiser la taille', 'eo-blocks')}
											onClick={() => setAttributes({ titleFontSize: undefined })}
										/>
									</FlexItem>
								</Flex>

								<Flex align="end" justify="space-between">
									<FlexBlock>
										<UnitControl
											label={ __('Subtitle custom size', 'eo-blocks') }
											value={ attributes.subtitleFontSize }
											onChange={ ( value ) => {
												if ( ! value ) {
													setAttributes({ subtitleFontSize: undefined });
												} else {
													setAttributes({ subtitleFontSize: value });
												}
											}}
											units={ units }
										/>
									</FlexBlock>
									<FlexItem>
										<ToolbarButton
											icon={rotateLeft}
											label={__('Réinitialiser la taille', 'eo-blocks')}
											onClick={() => setAttributes({ subtitleFontSize: undefined })}
										/>
									</FlexItem>
								</Flex>

							</div>
						</Popover>
					)}
				</ToolbarGroup>
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
							style={ attributes.titleFontSize && { fontSize: attributes.titleFontSize } }
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
						style={ attributes.subtitleFontSize && { fontSize: attributes.subtitleFontSize } }
					/>
				</div>

				<div className="eo-accordion__inner">
					<InnerBlocks />
				</div>
			</div>
		</>
	);
}  
