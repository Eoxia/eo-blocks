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
	<svg width="47" height="50" viewBox="0 0 47 50" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M43.6927 12.2532C44.3914 14.0606 45.2534 15.7834 45.7286 17.6077C48.6545 28.8614 44.8722 41.3758 32.7381 46.9688C28.9445 48.7179 24.9104 49.2966 20.7693 49.3022C19.4622 49.3022 18.1532 49.3022 16.786 49.3022V34.8866C18.2189 34.8866 19.6744 35.0632 21.0698 34.8433C23.0286 34.5371 25.0513 34.1895 26.8486 33.4061C30.0976 31.9914 31.4479 29.115 31.6826 25.7183C31.7709 24.4539 31.6864 23.1368 31.4347 21.895C30.6215 17.8989 27.7951 15.8623 24.054 15.2592C20.959 14.7614 17.7776 14.8102 14.4891 14.6073C14.4891 15.2874 14.4891 15.7139 14.4891 16.1404C14.4854 26.7929 14.4703 37.4454 14.4966 48.0998C14.4985 49.0242 14.2976 49.3342 13.3135 49.3191C9.11792 49.259 4.92236 49.2909 0.726804 49.2891C0.510829 49.2891 0.296731 49.2646 0 49.2477V0.871768C1.12307 0.871768 2.15412 0.871768 3.18517 0.871768C8.53948 0.873647 13.8938 0.847344 19.2481 0.888677C24.4221 0.928131 29.4703 1.67775 34.2781 3.9285C34.2781 3.9285 40.0456 5.90306 43.6927 12.2551V12.2532Z" fill="#263C5C"/>
		<path d="M40.5452 12.9145C44.1101 12.9145 47 10.0235 47 6.45727C47 2.89102 44.1101 0 40.5452 0C36.9803 0 34.0903 2.89102 34.0903 6.45727C34.0903 10.0235 36.9803 12.9145 40.5452 12.9145Z" fill="#61BCC0"/>
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
