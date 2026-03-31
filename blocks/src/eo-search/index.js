/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

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
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.97 512.08">
		<path d="M416,208c0,45.9-14.9,88.3-40,122.7l126.6,126.7c12.5,12.5,12.5,32.8,0,45.3s-32.8,12.5-45.3,0l-126.6-126.7c-34.4,25.1-76.8,40-122.7,40C93.1,416,0,322.9,0,208S93.1,0,208,0s208,93.1,208,208ZM208,352c79.5,0,144-64.5,144-144s-64.5-144-144-144S64,128.5,64,208s64.5,144,144,144Z"
		fill="#0066FF"/>
	</svg>
);

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	save: () => {
		return null;
	},
	icon: blockIcon,
} );
