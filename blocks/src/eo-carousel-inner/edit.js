/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, useBlockProps, InnerBlocks, store as blockEditorStore } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

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
export default function Edit( { attributes, setAttributes, clientId } ) {

	const { isEmpty, slidePosition, slidesCount } = useSelect(
		(select) => {
			const editorSelect = select(blockEditorStore);
			const innerBlocks = editorSelect.getBlocks(clientId);
			const parentClientId = editorSelect.getBlockRootClientId(clientId);
			const siblingIds = parentClientId ? editorSelect.getBlockOrder(parentClientId) : [];
			return {
				isEmpty: innerBlocks.length === 0,
				slidePosition: siblingIds.indexOf(clientId) + 1,
				slidesCount: siblingIds.length,
			};
		},
		[clientId]
	);
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Slide settings', 'eo-blocks' ) }>
					{ slidesCount > 0 && (
						<p className="eo-slide__position">
							{ /* translators: 1: slide position, 2: total number of slides. */
							sprintf( __( 'Slide %1$d of %2$d', 'eo-blocks' ), slidePosition, slidesCount ) }
						</p>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() }>
				<div className="eo-slide__inner">
					<InnerBlocks
						renderAppender={() =>
							isEmpty ? <InnerBlocks.ButtonBlockAppender /> : null
						}
					/>
				</div>
			</div>
		</>
	);
}
