import { openLightbox } from './lightbox';

// Height of an item relative to its width, from the ratio set by render.php.
const getItemRatio = ( item ) => {
	const [ width, height ] = ( item.style.getPropertyValue( '--eo-item-ratio' ) || '' ).split( '/' ).map( parseFloat );
	if ( width && height ) {
		return height / width;
	}
	const media = item.querySelector( '.eo-gallery__media' );
	return media?.naturalWidth ? media.naturalHeight / media.naturalWidth : 1;
};

/**
 * Masonry: items are dealt, in order, into the shortest column. Unlike CSS
 * columns (the no-JS fallback) this keeps a left-to-right reading order, and
 * it needs no image to be loaded since render.php gives every ratio.
 */
const initMasonry = ( gallery ) => {
	const container = gallery.querySelector( '.eo-gallery__items' );
	if ( ! container ) {
		return;
	}
	const items = Array.from( container.querySelectorAll( '.eo-gallery__item' ) );
	let currentColumns = 0;

	const layout = () => {
		const count = parseInt( window.getComputedStyle( gallery ).getPropertyValue( '--eo-gallery-cols' ), 10 ) || 1;
		if ( count === currentColumns ) {
			return;
		}
		currentColumns = count;

		const columns = [];
		const heights = [];
		for ( let i = 0; i < count; i++ ) {
			const column = document.createElement( 'div' );
			column.className = 'eo-gallery__column';
			columns.push( column );
			heights.push( 0 );
		}
		items.forEach( ( item ) => {
			const shortest = heights.indexOf( Math.min( ...heights ) );
			columns[ shortest ].appendChild( item );
			// The small constant stands for the gap between items.
			heights[ shortest ] += getItemRatio( item ) + 0.05;
		} );
		container.replaceChildren( ...columns );
		container.classList.add( 'is-masonry-ready' );
	};

	layout();
	let frame = null;
	window.addEventListener( 'resize', () => {
		cancelAnimationFrame( frame );
		frame = requestAnimationFrame( layout );
	} );
};

const initCarousel = ( gallery, settings ) => {
	const wrapper = gallery.querySelector( '.eo-gallery__carousel' );
	const element = wrapper?.querySelector( '.eo-gallery__swiper' );
	if ( ! element || typeof window.Swiper === 'undefined' ) {
		return null;
	}

	const count = element.querySelectorAll( '.swiper-slide' ).length;

	try {
		return new window.Swiper( element, {
			slidesPerView: settings.mobileSlidesPerView,
			spaceBetween: settings.spaceBetween,
			breakpoints: {
				600: { slidesPerView: settings.slidesPerView },
			},
			speed: settings.speed,
			// Swiper needs more slides than the visible ones to loop.
			loop: settings.loop && count > settings.slidesPerView,
			autoHeight: settings.autoHeight,
			grabCursor: true,
			watchOverflow: true,
			autoplay: settings.autoplay
				? { delay: settings.autoplay, pauseOnMouseEnter: true, disableOnInteraction: false }
				: false,
			// Pass the elements themselves: string selectors would be resolved
			// against the whole document.
			navigation: settings.navigation
				? {
					nextEl: wrapper.querySelector( ':scope > .swiper-button-next' ),
					prevEl: wrapper.querySelector( ':scope > .swiper-button-prev' ),
				}
				: false,
			pagination: settings.pagination
				? {
					el: element.querySelector( ':scope > .swiper-pagination' ),
					clickable: true,
					dynamicBullets: count > 7,
				}
				: false,
		} );
	} catch ( error ) {
		console.error( 'Error initializing swiper for gallery:', gallery, error );
		return null;
	}
};

const isFullyVisible = ( element, container ) => {
	const rect = element.getBoundingClientRect();
	const bounds = container.getBoundingClientRect();
	return rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1;
};

const initGallery = ( gallery ) => {
	if ( gallery.dataset.eoGalleryReady ) {
		return;
	}
	gallery.dataset.eoGalleryReady = '1';

	let config = {};
	try {
		config = JSON.parse( gallery.dataset.eoGallery || '{}' );
	} catch ( error ) {
		return;
	}

	if ( config.layout === 'masonry' ) {
		initMasonry( gallery );
	}

	// Read before Swiper's loop mode starts moving slides around.
	const triggers = Array.from( gallery.querySelectorAll( '[data-eo-lightbox]' ) ).sort(
		( a, b ) => Number( a.dataset.index ) - Number( b.dataset.index )
	);

	const swiper = config.layout === 'carousel' && config.carousel ? initCarousel( gallery, config.carousel ) : null;

	if ( ! config.lightbox || ! triggers.length ) {
		return;
	}

	const items = triggers.map( ( trigger ) => {
		const figure = trigger.closest( '.eo-gallery__item' );
		const thumb = trigger.querySelector( '.eo-gallery__media' );
		const caption = figure?.querySelector( '.eo-gallery__caption' );
		return {
			type: trigger.dataset.type === 'video' ? 'video' : 'image',
			src: trigger.getAttribute( 'href' ),
			width: Number( trigger.dataset.width ) || 0,
			height: Number( trigger.dataset.height ) || 0,
			caption: caption ? caption.innerHTML.trim() : '',
			alt: thumb?.getAttribute( 'alt' ) || '',
			figure,
			thumb,
			trigger,
		};
	} );

	const options = {
		labels: config.labels,
		onOpen: () => swiper?.autoplay?.stop(),
		// Bring the current media into view so the lightbox can shrink back
		// into it.
		onBeforeClose: ( index ) => {
			if ( ! swiper || isFullyVisible( items[ index ].figure, swiper.el ) ) {
				return;
			}
			if ( swiper.params.loop ) {
				swiper.slideToLoop( index, 0 );
			} else {
				swiper.slideTo( index, 0 );
			}
		},
		onClose: () => {
			if ( swiper && config.carousel.autoplay ) {
				swiper.autoplay.start();
			}
		},
	};

	triggers.forEach( ( trigger, index ) => {
		trigger.addEventListener( 'click', ( event ) => {
			// Swiper cancels clicks ending a drag; modified clicks open the file.
			if ( event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button > 0 ) {
				return;
			}
			event.preventDefault();
			openLightbox( items, index, options );
		} );
	} );
};

const init = () => document.querySelectorAll( '.wp-block-eo-blocks-gallery' ).forEach( initGallery );

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
