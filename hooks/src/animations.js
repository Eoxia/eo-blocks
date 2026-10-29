/**
 * Adds an "Animations" panel (entrance / exit) to the Styles tab of every
 * block (EO Blocks included, as well as native and third-party blocks).
 *
 * The "styles" InspectorControls group is the generic, always-rendered slot
 * at the bottom of the Styles tab (used by core for the same purpose e.g.
 * shadow support). Filling it also makes the Styles tab appear even on
 * blocks that otherwise have no color/typography/border support.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { useState } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import {
	ToggleControl,
	Button,
	Modal,
	Icon,
	PanelBody,
} from '@wordpress/components';
import { check } from '@wordpress/icons';

/**
 * Blocks that don't have a single, animatable wrapper element (structural,
 * raw-output or admin-only blocks) are skipped.
 */
const excludedBlocks = [
	'core/freeform',
	'core/html',
	'core/shortcode',
	'core/block',
	'core/legacy-widget',
	'core/widget-area',
	'core/template-part',
	'core/pattern',
	'core/more',
	'core/nextpage',
	// Carousel slides: only the parent carousel takes the animation option,
	// not each individual slide (Swiper manages their visibility itself).
	'eo-blocks/slide',
];

export const ANIMATIONS = [
	{ value: 'fade', label: __( 'Fondu', 'eo-blocks' ) },
	{ value: 'scale-up', label: __( 'Agrandissement', 'eo-blocks' ) },
	{ value: 'scale-down', label: __( 'Rétrécissement', 'eo-blocks' ) },
	{ value: 'slide-top', label: __( 'Glissement du haut', 'eo-blocks' ) },
	{ value: 'slide-right', label: __( 'Glissement de droite', 'eo-blocks' ) },
	{ value: 'slide-bottom', label: __( 'Glissement du bas', 'eo-blocks' ) },
	{ value: 'slide-left', label: __( 'Glissement de gauche', 'eo-blocks' ) },
	{ value: 'rotate', label: __( 'Rotation', 'eo-blocks' ) },
	{ value: 'bounce', label: __( 'Rebond', 'eo-blocks' ) },
	{ value: 'flip', label: __( 'Retournement', 'eo-blocks' ) },
];

const getAnimationLabel = ( value ) =>
	ANIMATIONS.find( ( animation ) => animation.value === value )?.label;

/**
 * Registers the eoAnimationIn / eoAnimationOut attributes on every block.
 */
function eoAddAnimationAttributes( settings, name ) {
	if ( excludedBlocks.includes( name ) ) {
		return settings;
	}

	settings.attributes = Object.assign( settings.attributes || {}, {
		eoAnimationIn: {
			type: 'string',
			default: '',
		},
		eoAnimationOut: {
			type: 'string',
			default: '',
		},
	} );

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'eo-blocks/animations-attributes',
	eoAddAnimationAttributes
);

/**
 * Gallery of animations, used to pick the entrance/exit animation.
 * Every card loops its animation continuously so it's easy to compare them.
 */
function AnimationGallery( { value, onSelect } ) {
	return (
		<div className="eo-anim-gallery">
			{ ANIMATIONS.map( ( animation ) => (
				<button
					key={ animation.value }
					type="button"
					className={
						'eo-anim-card' +
						( value === animation.value ? ' is-selected' : '' )
					}
					onClick={ () => onSelect( animation.value ) }
				>
					{ value === animation.value && (
						<span className="eo-anim-card__check">
							<Icon icon={ check } />
						</span>
					) }
					<span className="eo-anim-card__stage">
						<span
							className="eo-anim-card__shape"
							data-eo-anim-preview={ animation.value }
						/>
					</span>
					<span className="eo-anim-card__label">
						{ animation.label }
					</span>
				</button>
			) ) }
		</div>
	);
}

function AnimationControl( { label, value, onChange } ) {
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const isEnabled = !! value;

	return (
		<>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ label }
				checked={ isEnabled }
				onChange={ ( checked ) =>
					onChange( checked ? ANIMATIONS[ 0 ].value : '' )
				}
			/>
			{ isEnabled && (
				<Button
					variant="secondary"
					className="eo-anim-picker-button"
					onClick={ () => setIsModalOpen( true ) }
				>
					{ getAnimationLabel( value ) ||
						__( 'Choisir une animation', 'eo-blocks' ) }
				</Button>
			) }
			{ isModalOpen && (
				<Modal
					title={ label }
					onRequestClose={ () => setIsModalOpen( false ) }
					className="eo-anim-modal"
				>
					<AnimationGallery
						value={ value }
						onSelect={ ( newValue ) => {
							onChange( newValue );
							setIsModalOpen( false );
						} }
					/>
				</Modal>
			) }
		</>
	);
}

const eoAddAnimationControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name, attributes, setAttributes } = props;

		if ( excludedBlocks.includes( name ) ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="styles">
					<PanelBody
						title={ __( 'Animations', 'eo-blocks' ) }
						initialOpen={ false }
						className="eo-anim-panel"
					>
						<AnimationControl
							label={ __( "Animation d'entrée", 'eo-blocks' ) }
							value={ attributes.eoAnimationIn }
							onChange={ ( value ) =>
								setAttributes( { eoAnimationIn: value } )
							}
						/>
						<AnimationControl
							label={ __( 'Animation de sortie', 'eo-blocks' ) }
							value={ attributes.eoAnimationOut }
							onChange={ ( value ) =>
								setAttributes( { eoAnimationOut: value } )
							}
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'eoAddAnimationControls' );

addFilter(
	'editor.BlockEdit',
	'eo-blocks/animations-controls',
	eoAddAnimationControls
);
