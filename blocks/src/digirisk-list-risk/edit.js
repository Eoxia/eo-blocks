import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';
import { useEffect, useState } from 'react';

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
		const url = 'http://localhost/dolibarr-17.0.2/htdocs/api/index.php/digiriskdolibarr/risk/getRisksByCotation?DOLAPIKEY=EfvH46ntG4zdnTYHP1q39jE56bkSN6M2&DOLENTITY=1';
		fetch(url)
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
					{'nb risk black: ' + (data[0] || 0) + ' nb risk red: ' + (data[1] || 0) + ' nb risk orange: ' + (data[2] || 0)}
				</div>
			)}
		</div>
	);
}
