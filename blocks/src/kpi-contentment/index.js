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
	<svg width="53" height="46" viewBox="0 0 53 46" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M51.7583 5.85226C53.1868 4.72279 53.4146 2.64866 52.2759 1.23168C51.1372 -0.1853 49.0461 -0.411195 47.6176 0.718281L33.063 12.2697L21.8624 3.94242C20.6513 3.03884 18.9846 3.06964 17.8045 4.00403L1.24173 17.147C-0.186812 18.2765 -0.41455 20.3506 0.724142 21.7676C1.86283 23.1846 3.95389 23.4105 5.38243 22.281L19.937 10.7295L31.1376 19.0569C32.3487 19.9604 34.0154 19.9296 35.1955 18.9953L51.7583 5.85226ZM16.5623 22.9998V42.7143C16.5623 44.5317 18.0426 46 19.8749 46C21.7071 46 23.1874 44.5317 23.1874 42.7143V22.9998C23.1874 21.1823 21.7071 19.714 19.8749 19.714C18.0426 19.714 16.5623 21.1823 16.5623 22.9998ZM3.31208 32.857V42.7143C3.31208 44.5317 4.79238 46 6.62464 46C8.4569 46 9.9372 44.5317 9.9372 42.7143V32.857C9.9372 31.0396 8.4569 29.5713 6.62464 29.5713C4.79238 29.5713 3.31208 31.0396 3.31208 32.857ZM33.1251 26.2855C31.2929 26.2855 29.8126 27.7538 29.8126 29.5713V42.7143C29.8126 44.5317 31.2929 46 33.1251 46C34.9574 46 36.4377 44.5317 36.4377 42.7143V29.5713C36.4377 27.7538 34.9574 26.2855 33.1251 26.2855ZM43.0628 22.9998V42.7143C43.0628 44.5317 44.5431 46 46.3754 46C48.2076 46 49.6879 44.5317 49.6879 42.7143V22.9998C49.6879 21.1823 48.2076 19.714 46.3754 19.714C44.5431 19.714 43.0628 21.1823 43.0628 22.9998Z" fill="#0066FF"/>
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
	icon: blockIcon,
} );
