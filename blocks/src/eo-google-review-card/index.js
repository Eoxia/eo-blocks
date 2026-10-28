import { registerBlockType } from '@wordpress/blocks';
import './scss/style.scss';
import Edit from './edit';
import metadata from './block.json';

const blockIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<rect x="2" y="3" width="20" height="18" rx="3" fill="#0066FF"/>
		<rect x="5" y="7" width="8" height="2" rx="1" fill="#FFFFFF"/>
		<rect x="5" y="11" width="14" height="2" rx="1" fill="#FFFFFF"/>
		<rect x="5" y="15" width="11" height="2" rx="1" fill="#FFFFFF"/>
	</svg>
);

registerBlockType( metadata.name, {
	edit: Edit,
	icon: blockIcon,
} );
