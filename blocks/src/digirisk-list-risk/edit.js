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
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl  } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
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
export default function Edit( { attributes, setAttributes } ) {
	const { blockGrid, displayRisk1, displayRisk2, displayRisk3, displayRisk4 } = attributes;
	const [data, setData] = useState([]);
	const [error, setError] = useState([]);
	const blockProps = useBlockProps();
	const customTooltipContent = value => `${value}`;

	const routeApi = 'digiriskdolibarr/risk/getRisksByCotation';
	const eoblocksSettings = useSelect( ( select ) => select( 'core' ).getSite()?.eoblocks_settings );

	// @TODO: Isoler la fonction API dans un helper.
	// Clean URL.
	const cleanUrl = (url) => {
		let cleanedUrl = url.replace(/:\//g, '://');
		cleanedUrl = cleanedUrl.replace(/([^:]\/)\/+/g, '$1');
		cleanedUrl = cleanedUrl.replace(/^\/+|\/+$/g, '');
		return cleanedUrl;
	};

	useEffect(() => {
		const fetchData = async () => {
			if (!eoblocksSettings) {
				return;
			}
			const { eoblocks_dolibarr_url: baseUrlApi, eoblocks_dolibarr_api_key: apiKey } = eoblocksSettings;
			if (!baseUrlApi || !apiKey || !routeApi) {
				setError('Missing API key or base URL or route');
				return;
			}

			let digiriskUrlApi = `${baseUrlApi}/api/index.php/${routeApi}?DOLAPIKEY=${apiKey}`;
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
	}, [eoblocksSettings, routeApi]);

	if (error) {
		console.log('Error:' + error);
	}

	const riskLabel = {
		1: __( 'faible', 'eo-blocks' ),
		2: __( 'à planifier', 'eo-blocks' ),
		3: __( 'à traiter', 'eo-blocks' ),
		4: __( 'inacceptable', 'eo-blocks' )
	}
	const riskRender = {
		1: displayRisk1,
		2: displayRisk2,
		3: displayRisk3,
		4: displayRisk4
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'eo-blocks' ) }>
					<ToggleControl
						label={ __( 'Display grey risk', 'eo-blocks' ) }
						checked={ displayRisk1 }
						onChange={ ( value ) => setAttributes( { displayRisk1: value } ) }
					/>
					<ToggleControl
						label={ __( 'Display orange risk', 'eo-blocks' ) }
						checked={ displayRisk2 }
						onChange={ ( value ) => setAttributes( { displayRisk2: value } ) }
					/>
					<ToggleControl
						label={ __( 'Display red risk', 'eo-blocks' ) }
						checked={ displayRisk3 }
						onChange={ ( value ) => setAttributes( { displayRisk3: value } ) }
					/>
					<ToggleControl
						label={ __( 'Display black risk', 'eo-blocks' ) }
						checked={ displayRisk4 }
						onChange={ ( value ) => setAttributes( { displayRisk4: value } ) }
					/>
					<RangeControl
						label={ __( 'Columns', 'eo-blocks' ) }
						value={ blockGrid || 2 }
						onChange={ ( value ) => setAttributes( { blockGrid: value } ) }
						min={ 1 }
						max={ 4 }
						renderTooltipContent={ customTooltipContent }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				{data && (
					<div className={`eo-digirisk-list-risk__list eo-grid eo-grid__col-${blockGrid}`}>
						{Object.entries(data).map(([key, value]) => {
							if (!riskRender[key]) {
								return null;
							}

							return (
								<div className={`eo-digirisk-list-risk__element --risk-${key}`}>
									<div className='eo-digirisk-list-risk__content'>
										<div className='eo-digirisk-list-risk__content-label-group'>
											<svg className='eo-digirisk-list-risk__icon-risk' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>
											<div className='eo-digirisk-list-risk__content-label'>{__('Risque', 'eo-blocks')}</div>
										</div>
										<div className='eo-digirisk-list-risk__content-risk'>{value}</div>
									</div>
									<div className='eo-digirisk-list-risk__label'>{riskLabel[key]}</div>
								</div>
							)
						})}
					</div>
				)}
			</div>
		</>
	);
}
