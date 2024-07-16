/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useEffect, useState } from 'react';


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
export default function Edit() {
	const [data, setData] = useState([]);
	const blockProps = useBlockProps();

	useEffect(() => {
		const urlApi = 'http://127.0.0.1/dolibarr/htdocs/api/index.php/digiriskdolibarr/risk/getRisksByCotation?DOLAPIKEY=V9OCyHx4y5XA1ye511GbKymLz661tZCu&DOLENTITY=1';
		fetch(urlApi)
			.then((resp) => resp.json())
			.then((data) => {
				setData(data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	return (
		<div {...blockProps}>
			{data && (
				<div>
					{'Risques gris: ' + (data[1] || 0) + '. Risques Orange: ' + (data[2] || 0) + ' Risques Rouge: ' + (data[3] || 0) + '. Risques noir: ' + (data[4] || 0)}
				</div>
			)}
		</div>
	);
}
