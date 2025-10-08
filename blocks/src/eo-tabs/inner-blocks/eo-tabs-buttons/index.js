/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor'

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './scss/style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';

const blockIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 250 250">
		<path d="M240,23.7h-100.3c-5.5,0-10,4.5-10,10v14.5l-9.7-15.1c-1.8-2.8-4.4-5.1-7.4-6.6-4.2-2-8.9-3.1-13.6-3.1H31.2C14,23.4,0,37.4,0,54.7v140.6c0,17.3,14,31.2,31.2,31.2h187.5c17.3,0,31.2-14,31.2-31.2V33.7c0-5.5-4.5-10-10-10ZM230,61.3h-28.3v-17.5h28.3v17.5ZM149.7,43.8h31.9v17.5h-31.9v-17.5ZM226.6,195.3c0,4.3-3.5,7.8-7.8,7.8H31.2c-4.3,0-7.8-3.5-7.8-7.8V54.7c0-4.3,3.5-7.8,7.8-7.8h67.7c1.7,0,3.3.5,4.7,1.6l15.6,24.1c2.6,4,6.1,7.3,10.4,9.2,5.1,2.3,10.6,3.5,16.2,3.5h72.9c4.3,0,7.8,3.5,7.8,7.8v102.2Z" fill="#0066FF" />
	</svg>
);

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata.name, {
	/**
	 * @see ./edit.js
	 */
	usesContext: [ 'eo/tabActive' ],
	edit: Edit,
	save: props => {
		return <InnerBlocks.Content />
	},
	icon: blockIcon,
} );
