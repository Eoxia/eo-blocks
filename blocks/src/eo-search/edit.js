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
import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, CheckboxControl, ToggleControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

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
	const [ postTypes, setPostTypes ] = useState( [] );

	// Fetch available post types on component mount
	useEffect( () => {
		// Get AJAX URL from localized variable or construct it
		let ajaxUrl = window.eoSearch?.ajaxUrl;

		if ( ! ajaxUrl ) {
			// Fallback: construct URL using window.location.origin
			ajaxUrl = window.location.origin + '/wp-admin/admin-ajax.php';
		}

		fetch( ajaxUrl + '?action=eo_search_get_post_types', {
			method: 'GET',
		} )
			.then( ( response ) => response.json() )
			.then( ( data ) => {
				console.log( 'Post types response:', data );
				if ( data.success && Array.isArray( data.data ) ) {
					setPostTypes( data.data );
				} else {
					console.error( 'Error fetching post types:', data );
				}
			} )
			.catch( ( error ) => {
				console.error( 'Error fetching post types:', error );
			} );
	}, [] );

	const handlePostTypeChange = ( postType ) => {
		const current = attributes.selectedPostTypes || [];
		if ( current.includes( postType ) ) {
			setAttributes( { selectedPostTypes: current.filter( ( pt ) => pt !== postType ) } );
		} else {
			setAttributes( { selectedPostTypes: [ ...current, postType ] } );
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Search Settings', 'eo-blocks' ) }>
					<ToggleControl
						label={ __( 'Show Icon', 'eo-blocks' ) }
						checked={ attributes.showIcon }
						onChange={ ( value ) => setAttributes( { showIcon: value } ) }
					/>
					<ToggleControl
						label={ __( 'Show label', 'eo-blocks' ) }
						checked={ attributes.showLabel }
						onChange={ ( value ) => setAttributes( { showLabel: value } ) }
					/>
					{ attributes.showLabel && (
						<TextControl
							label={ __( 'Search Text', 'eo-blocks' ) }
							value={ attributes.searchText }
							onChange={ ( value ) => setAttributes( { searchText: value } ) }
							placeholder={ __( 'Enter search text', 'eo-blocks' ) }
						/>
					) }

					<div className="eo-search__panel-divider" style={ { marginTop: '15px', marginBottom: '15px' } }>
						<h3 style={ { margin: '0 0 10px 0' } }>{ __( 'Post Types to Search', 'eo-blocks' ) }</h3>
						<p style={ { margin: '0 0 10px 0', fontSize: '12px', color: '#666' } }>
							{ __( 'Select one or more post types to include in the search', 'eo-blocks' ) }
						</p>
						{ postTypes.length > 0 ? (
							<div>
								{ postTypes.map( ( postType ) => (
									<CheckboxControl
										key={ postType.value }
										label={ postType.label }
										checked={ ( attributes.selectedPostTypes || [] ).includes( postType.value ) }
										onChange={ () => handlePostTypeChange( postType.value ) }
									/>
								) ) }
							</div>
						) : (
							<p>{ __( 'Loading post types...', 'eo-blocks' ) }</p>
						) }
					</div>
				</PanelBody>

				<PanelBody title={ __( 'Results Settings', 'eo-blocks' ) }>
					<ToggleControl
						label={ __( 'Show Thumbnail', 'eo-blocks' ) }
						checked={ attributes.showThumbnail }
						onChange={ ( value ) => setAttributes( { showThumbnail: value } ) }
					/>
					<ToggleControl
						label={ __( 'Show Title', 'eo-blocks' ) }
						checked={ attributes.showTitle }
						onChange={ ( value ) => setAttributes( { showTitle: value } ) }
					/>
					<ToggleControl
						label={ __( 'Show Description', 'eo-blocks' ) }
						checked={ attributes.showDescription }
						onChange={ ( value ) => setAttributes( { showDescription: value } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() }>
				<div className="eo-search__container">
					{ attributes.showIcon && (
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="eo-search__icon">
							<circle cx="11" cy="11" r="8"></circle>
							<path d="m21 21-4.35-4.35"></path>
						</svg>
					) }
					{ attributes.showLabel && (
						<RichText
							tagName="span"
							className="eo-search__text"
							value={ attributes.searchText }
							allowedFormats={ [ 'core/bold', 'core/italic' ] }
							onChange={ ( value ) => setAttributes( { searchText: value } ) }
							placeholder={ __( 'Rechercher', 'eo-blocks' ) }
						/>
					) }
				</div>
			</div>
		</>
	);
}
