/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

import { TabContext } from '../../context';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

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
export default function Edit( { attributes, clientId } ) {
	const { activeTab } = useContext( TabContext );
	const myIndex = useSelect( ( select ) => {
		const parentClientId = select( 'core/block-editor' ).getBlockRootClientId( clientId );
		const siblings = select( 'core/block-editor' ).getBlocks( parentClientId );
		return siblings.findIndex( ( block ) => block.clientId === clientId );
	}, [ clientId ]);
	const tabId = myIndex;

	const isVisible = activeTab === tabId;

	const blockProps = useBlockProps( {
		className: isVisible ? 'is-active' : 'is-inactive',
		style: {
			display: isVisible ? 'block' : 'none',
		}
	} );

	// Correction : on masque le contenu avec une classe CSS, pas avec display:none inline
	return (
		<div { ...blockProps }>
			{/* Le contenu réel du bloc d'onglet */}
			<InnerBlocks
				template={[
					[ 'core/heading', { content: 'Tab title' } ],
					[ 'core/paragraph', { content: 'Tab content' } ],
				]}
			/>
		</div>
	);
}
