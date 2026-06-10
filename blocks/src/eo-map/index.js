/**
 * Registers a new block provided a unique name and an object defining its behavior.
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 */
import './scss/style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';

const blockIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
		<path
			d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z"
			fill="#0066FF"/>
	</svg>
);

registerBlockType( metadata.name, {
	edit: Edit,
	save: () => null, // Renders dynamically via render.php
	icon: blockIcon,
} );
