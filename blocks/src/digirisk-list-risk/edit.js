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
import { useSelect } from '@wordpress/data';


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


	// @TODO Trouver un moyen pour lancer la requête dés que l'on a construit l'url en entier
	const routeApi = 'digiriskdolibarr/risk/getRisksByCotation';

	const eoblocksSettings = useSelect( ( select ) => select( 'core' ).getSite()?.eoblocks_settings );
	const dolibarrUrlApi = eoblocksSettings?.eoblocks_dolibarr_url;
	const dolibarrApiKey = eoblocksSettings?.eoblocks_dolibarr_api_key;
	let digiriskUrlApi = `${dolibarrUrlApi}/api/index.php/${routeApi}?DOLAPIKEY=${dolibarrApiKey}`;

	// Clean double slash.
	const [protocol, rest] = digiriskUrlApi.split('://');
	if ( rest ) {
		const cleanedRest = rest.replace(/\/{2,}/g, '/');
		digiriskUrlApi = `${protocol}://${cleanedRest}`;
	}

	useEffect(() => {
		fetch('http://127.0.0.1/dolibarr/htdocs/api/index.php/?DOLAPIKEY=UE6wI9n7gShKM2Onyso84bJ049WsUh8P')
			.then((resp) => resp.json())
			.then((data) => {
				console.log(data);
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
