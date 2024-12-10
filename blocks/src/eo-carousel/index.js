/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor'
import iconCarousel from './../../../assets/images/icon-carousel.svg';
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
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
	<svg id="Calque_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 182.85 111.3">
		<g id="Calque_1-2">
			<path className="cls-1"
				  d="m135.26,111.3H47.59c-6.87,0-12.45-5.59-12.45-12.46V12.45c0-6.87,5.59-12.45,12.45-12.45h87.68c6.87,0,12.45,5.59,12.45,12.45v86.39c0,6.87-5.59,12.46-12.45,12.46ZM47.59,9c-1.9,0-3.45,1.55-3.45,3.45v86.39c0,1.91,1.55,3.46,3.45,3.46h87.68c1.9,0,3.45-1.55,3.45-3.46V12.45c0-1.9-1.55-3.45-3.45-3.45H47.59Z"/>
			<path className="cls-1"
				  d="m170.39,111.3h-5.79c-6.87,0-12.46-5.59-12.46-12.46V12.45c0-6.87,5.59-12.45,12.46-12.45h5.79c6.87,0,12.46,5.59,12.46,12.45v86.39c0,6.87-5.59,12.46-12.46,12.46Zm-5.79-102.3c-1.91,0-3.46,1.55-3.46,3.45v86.39c0,1.91,1.55,3.46,3.46,3.46h5.79c1.91,0,3.46-1.55,3.46-3.46V12.45c0-1.9-1.55-3.45-3.46-3.45h-5.79Z"/>
			<path className="cls-1"
				  d="m18.25,111.3h-5.79c-6.87,0-12.45-5.59-12.45-12.46V12.45C0,5.59,5.59,0,12.45,0h5.79c6.87,0,12.45,5.59,12.45,12.45v86.39c0,6.87-5.59,12.46-12.45,12.46ZM12.45,9c-1.9,0-3.45,1.55-3.45,3.45v86.39c0,1.91,1.55,3.46,3.45,3.46h5.79c1.9,0,3.45-1.55,3.45-3.46V12.45c0-1.9-1.55-3.45-3.45-3.45h-5.79Z"/>
			<path className="cls-1"
				  d="m122.17,43.09h-61.49c-5.39,0-9.77-4.38-9.77-9.77v-7.47c0-5.39,4.38-9.77,9.77-9.77h61.49c5.39,0,9.77,4.38,9.77,9.77v7.47c0,5.39-4.38,9.77-9.77,9.77Zm-61.49-18.01c-.43,0-.77.35-.77.77v7.47c0,.43.35.77.77.77h61.49c.43,0,.77-.35.77-.77v-7.47c0-.43-.35-.77-.77-.77h-61.49Z"/>
			<path className="cls-1"
				  d="m122.43,96.14h-62.01c-5.25,0-9.51-4.27-9.51-9.51v-27.54c0-5.25,4.27-9.51,9.51-9.51h62.01c5.25,0,9.51,4.27,9.51,9.51v27.54c0,5.25-4.27,9.51-9.51,9.51Zm-62.01-37.57c-.28,0-.51.23-.51.51v27.54c0,.28.23.51.51.51h62.01c.28,0,.51-.23.51-.51v-27.54c0-.28-.23-.51-.51-.51h-62.01Z"/>
		</g>
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
	edit: Edit,
	save: props => {
		return <InnerBlocks.Content/>
	},
	icon: blockIcon,
});
