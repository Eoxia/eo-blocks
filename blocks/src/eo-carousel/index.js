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
	<svg id="Calque_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 576 512">
		<path fill="#0066FF"
			d="M512,64v224H64V64h448ZM64,0C28.7,0,0,28.7,0,64v224c0,35.3,28.7,64,64,64h448c35.3,0,64-28.7,64-64V64C576,28.7,547.3,0,512,0H64Z"/>
		<path fill="#0066FF" d="M288,392.2c-32.8,0-59.6,26.7-59.6,59.6s26.7,59.6,59.6,59.6,59.6-26.7,59.6-59.6-26.7-59.6-59.6-59.6Z"/>
		<path fill="#0066FF"
			d="M457.2,392.2c-32.8,0-59.6,26.7-59.6,59.6s26.7,59.6,59.6,59.6,59.6-26.7,59.6-59.6-26.7-59.6-59.6-59.6ZM457.2,471.3c-10.8,0-19.6-8.8-19.6-19.6s8.8-19.6,19.6-19.6,19.6,8.8,19.6,19.6-8.8,19.6-19.6,19.6Z"/>
		<path fill="#0066FF"
			d="M118.8,392.2c-32.8,0-59.6,26.7-59.6,59.6s26.7,59.6,59.6,59.6,59.6-26.7,59.6-59.6-26.7-59.6-59.6-59.6ZM118.8,471.3c-10.8,0-19.6-8.8-19.6-19.6s8.8-19.6,19.6-19.6,19.6,8.8,19.6,19.6-8.8,19.6-19.6,19.6Z"/>
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
