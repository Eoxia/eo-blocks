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
 * @returns {{data: unknown, error: unknown}}
 */
export const digiriskApiGet = (route, params) => {
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
	}, [route, params]);

	return { data, error };
}
