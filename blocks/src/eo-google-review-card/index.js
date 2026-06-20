import { registerBlockType } from '@wordpress/blocks';
import './scss/style.scss';
import Edit from './edit';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: Edit,
} );
