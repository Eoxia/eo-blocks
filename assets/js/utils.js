/**
 * Utils JS functions
 *
 */

/**
 * WordPress dependencies
 */
import { useState, useEffect } from 'react';

/**
 * Clean URL
 *
 * @param url
 * @returns {*}
 */
const cleanUrl = (url) => {
	let cleanedUrl = url.replace(/:\//g, '://');
	cleanedUrl = cleanedUrl.replace(/([^:]\/)\/+/g, '$1');
	cleanedUrl = cleanedUrl.replace(/^\/+|\/+$/g, '');
	return cleanedUrl;
};

/**
 * Get datas from DigiRisk module on Dolibarr
 *
 * @param route
 * @param params
 * @param queryParams Optional query parameters object or string (e.g., 'entity=1' or {entity: 1})
 * @returns {{data: unknown, error: unknown}}
 */
export const digiriskApiGet = (route, params, queryParams = '') => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			if (!params) {
				return;
			}
			const { eoblocks_dolibarr_url: baseUrlApi, eoblocks_dolibarr_api_key: apiKey } = params;
			if (!baseUrlApi || !apiKey || !route) {
				setError('Missing API key or base URL or route');
				return;
			}

			let digiriskUrlApi = `${baseUrlApi}/api/index.php/${route}?DOLAPIKEY=${apiKey}`;

			if (queryParams) {
				if (typeof queryParams === 'object') {
					const queryString = Object.keys(queryParams)
						.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
						.join('&');
					digiriskUrlApi += `&${queryString}`;
				} else {
					digiriskUrlApi += `&${queryParams}`;
				}
			}
			digiriskUrlApi = cleanUrl(digiriskUrlApi);

			try {
				const response = await fetch(digiriskUrlApi);

				if (!response.ok) {
					if (response.status === 401) {
						setError('Unauthorized: Wrong API Key or Unauthorized');
					} else if (response.status === 404) {
						setError('Not Found: Wrong Dolibarr URL');
					} else {
						setError(`Error: ${response.status}`);
					}
					return;
				}

				const data = await response.json();

				if (data.error) {
					setError('Error in API response');
					return;
				}

				setData(data);
			} catch (err) {
				setError(err.message);
			}
		};
		fetchData();
	}, [route, params, queryParams]);

	return { data, error };
}


export const findBlockRecursively = ( blocks, blockName ) => {
	for ( const block of blocks ) {
		if ( block.name === blockName ) {
			return block;
		}
		if ( block.innerBlocks && block.innerBlocks.length ) {
			const found = findBlockRecursively( block.innerBlocks, blockName );
			if ( found ) {
				return found;
			}
		}
	}
	return null;
};