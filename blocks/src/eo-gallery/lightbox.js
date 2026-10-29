/**
 * Lightbox shared by every EO Gallery of the page.
 *
 * - Opens with a "FLIP" animation: the media grows out of its thumbnail. The
 *   thumbnail can be cropped while the enlarged media never is, so the
 *   animation also clips the media down to the thumbnail's visible area.
 * - Shows the already loaded thumbnail right away, then cross-fades to the
 *   full size file once it is decoded.
 * - Swipe left/right to navigate, swipe down to close, click/tap a picture
 *   bigger than the screen to see it at 100%, keyboard support.
 *
 * Item shape: { type, src, width, height, caption, alt, figure, thumb, trigger }
 */

const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
const MOBILE_WIDTH = 600;

const ICONS = {
	close: '<path d="M6 6l12 12M18 6L6 18"/>',
	prev: '<path d="M15 5l-7 7 7 7"/>',
	next: '<path d="M9 5l7 7-7 7"/>',
};

let root, backdrop, stage, spinner, counter, caption, buttons;
let session = null;
let gesture = null;
let spinnerTimer = null;
let scrollLock = null;

const reducedMotion = () => window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
const duration = ( ms ) => ( reducedMotion() ? 1 : ms );
const clamp = ( value, min, max ) => Math.min( Math.max( value, min ), max );

const build = () => {
	root = document.createElement( 'div' );
	root.className = 'eo-lightbox';
	root.hidden = true;
	root.setAttribute( 'role', 'dialog' );
	root.setAttribute( 'aria-modal', 'true' );

	const button = ( name ) =>
		`<button type="button" class="eo-lightbox__button eo-lightbox__button--${ name }"><svg viewBox="0 0 24 24" aria-hidden="true">${ ICONS[ name ] }</svg></button>`;

	root.innerHTML =
		'<div class="eo-lightbox__backdrop"></div>' +
		'<div class="eo-lightbox__stage"></div>' +
		'<div class="eo-lightbox__spinner"></div>' +
		'<div class="eo-lightbox__counter" aria-live="polite"></div>' +
		'<div class="eo-lightbox__caption"></div>' +
		button( 'prev' ) +
		button( 'next' ) +
		button( 'close' );

	backdrop = root.querySelector( '.eo-lightbox__backdrop' );
	stage = root.querySelector( '.eo-lightbox__stage' );
	spinner = root.querySelector( '.eo-lightbox__spinner' );
	counter = root.querySelector( '.eo-lightbox__counter' );
	caption = root.querySelector( '.eo-lightbox__caption' );
	buttons = {
		prev: root.querySelector( '.eo-lightbox__button--prev' ),
		next: root.querySelector( '.eo-lightbox__button--next' ),
		close: root.querySelector( '.eo-lightbox__button--close' ),
	};

	buttons.prev.addEventListener( 'click', () => step( -1 ) );
	buttons.next.addEventListener( 'click', () => step( 1 ) );
	buttons.close.addEventListener( 'click', close );

	root.addEventListener( 'pointerdown', onPointerDown );
	root.addEventListener( 'pointermove', onPointerMove );
	root.addEventListener( 'pointerup', onPointerUp );
	root.addEventListener( 'pointercancel', onPointerCancel );

	document.body.appendChild( root );
};

/* -------------------------------------------------------------------------
 * Geometry
 * ---------------------------------------------------------------------- */

// Where the media sits once opened: as big as possible, never cropped, never
// upscaled beyond its real size (videos excepted).
const getBounds = ( item ) => {
	const vw = document.documentElement.clientWidth;
	const vh = window.innerHeight;
	const mobile = vw < MOBILE_WIDTH;
	const padX = mobile ? 0 : 88;
	const padTop = mobile ? 72 : 76;
	let padBottom = mobile ? 76 : 76;
	if ( item.caption ) {
		padBottom = mobile ? 140 : 104;
	}

	let width = item.width;
	let height = item.height;
	let upscale = item.type === 'video';
	if ( ! width || ! height ) {
		// Unknown size (media inserted from a URL): use the thumbnail's ratio.
		width = item.thumb?.naturalWidth || item.thumb?.videoWidth || 16;
		height = item.thumb?.naturalHeight || item.thumb?.videoHeight || 9;
		upscale = true;
	}

	const availWidth = vw - padX * 2;
	const availHeight = Math.max( vh - padTop - padBottom, 100 );
	const scale = Math.min( availWidth / width, availHeight / height, upscale ? Infinity : 1 );
	const w = Math.round( width * scale );
	const h = Math.round( height * scale );

	return {
		left: Math.round( padX + ( availWidth - w ) / 2 ),
		top: Math.round( padTop + ( availHeight - h ) / 2 ),
		width: w,
		height: h,
	};
};

const applyBounds = ( el, bounds ) => {
	el._bounds = bounds;
	el.style.left = `${ bounds.left }px`;
	el.style.top = `${ bounds.top }px`;
	el.style.width = `${ bounds.width }px`;
	el.style.height = `${ bounds.height }px`;
};

// Visible rectangle of the thumbnail, or null when it is off screen.
const getSourceRect = ( item ) => {
	if ( ! item.figure ) {
		return null;
	}
	const rect = item.figure.getBoundingClientRect();
	const visible =
		rect.width > 0 &&
		rect.height > 0 &&
		rect.bottom > 0 &&
		rect.right > 0 &&
		rect.top < window.innerHeight &&
		rect.left < document.documentElement.clientWidth;
	return visible ? rect : null;
};

// Keyframes taking the media from its thumbnail to its opened position.
const flipKeyframes = ( item, el, rect, startTransform = 'none' ) => {
	const bounds = el._bounds;
	const scale = Math.max( rect.width / bounds.width, rect.height / bounds.height );
	const insetX = ( bounds.width - rect.width / scale ) / 2;
	const insetY = ( bounds.height - rect.height / scale ) / 2;
	const dx = rect.left + rect.width / 2 - ( bounds.left + bounds.width / 2 );
	const dy = rect.top + rect.height / 2 - ( bounds.top + bounds.height / 2 );
	const radius = parseFloat( window.getComputedStyle( item.figure ).borderTopLeftRadius ) || 0;

	return [
		{
			transform: `translate(${ dx }px, ${ dy }px) scale(${ scale })`,
			clipPath: `inset(${ insetY }px ${ insetX }px round ${ radius / scale }px)`,
		},
		{
			transform: startTransform,
			clipPath: 'inset(0px 0px round 4px)',
		},
	];
};

/* -------------------------------------------------------------------------
 * Media
 * ---------------------------------------------------------------------- */

const markLoaded = ( el ) => {
	el._loaded = true;
	if ( session?.media === el ) {
		clearTimeout( spinnerTimer );
		spinner.classList.remove( 'is-visible' );
	}
};

const createMedia = ( item ) => {
	const el = document.createElement( 'div' );
	el.className = 'eo-lightbox__media';
	applyBounds( el, getBounds( item ) );

	if ( item.type === 'video' ) {
		const video = document.createElement( 'video' );
		video.controls = true;
		video.playsInline = true;
		video.preload = 'auto';
		if ( item.thumb?.poster ) {
			video.poster = item.thumb.poster;
		}
		video.src = item.src;
		video.addEventListener( 'loadeddata', () => markLoaded( el ), { once: true } );
		video.addEventListener( 'error', () => markLoaded( el ), { once: true } );
		el.appendChild( video );
		return el;
	}

	// The thumbnail is already in the browser cache: show it immediately.
	const preview = item.thumb?.currentSrc || item.thumb?.src;
	if ( preview ) {
		const img = document.createElement( 'img' );
		img.src = preview;
		img.alt = '';
		el.appendChild( img );
	}

	const full = document.createElement( 'img' );
	full.className = 'eo-lightbox__full';
	full.alt = item.alt || '';
	full.decoding = 'async';
	full.draggable = false;
	const reveal = () => {
		full.classList.add( 'is-loaded' );
		markLoaded( el );
	};
	full.addEventListener( 'load', () => ( full.decode ? full.decode().catch( () => {} ) : Promise.resolve() ).then( reveal ), { once: true } );
	full.addEventListener( 'error', () => markLoaded( el ), { once: true } );
	full.src = item.src;
	el.appendChild( full );

	// Only worth zooming when the real picture is clearly bigger than shown.
	if ( item.width && item.width > el._bounds.width * 1.15 ) {
		el.classList.add( 'is-zoomable' );
	}
	return el;
};

const getVideo = ( el ) => el?.querySelector( 'video' );

const playVideo = ( el ) => {
	const video = getVideo( el );
	if ( video && session?.media === el ) {
		video.play().catch( () => {} );
	}
};

const preloadNeighbours = () => {
	const { items, index } = session;
	[ index - 1, index + 1 ].forEach( ( i ) => {
		const item = items[ ( i + items.length ) % items.length ];
		if ( item.type === 'image' ) {
			new Image().src = item.src;
		}
	} );
};

const setSourceHidden = ( item, hidden ) => {
	if ( item?.figure ) {
		item.figure.style.visibility = hidden ? 'hidden' : '';
	}
};

const updateUI = () => {
	const { items, index, media } = session;
	const item = items[ index ];
	counter.textContent = `${ index + 1 } / ${ items.length }`;
	// Captions were filtered by wp_kses_post() when the page was rendered.
	caption.innerHTML = item.caption || '';

	clearTimeout( spinnerTimer );
	spinner.classList.remove( 'is-visible' );
	if ( ! media._loaded ) {
		spinnerTimer = setTimeout( () => {
			if ( session?.media === media && ! media._loaded ) {
				spinner.classList.add( 'is-visible' );
			}
		}, 300 );
	}
};

/* -------------------------------------------------------------------------
 * Zoom
 * ---------------------------------------------------------------------- */

const zoomTransform = ( zoom ) => `translate(${ zoom.tx }px, ${ zoom.ty }px) scale(${ zoom.scale })`;

// Keeps the zoomed picture covering the screen (or centered when smaller).
const clampPan = ( el, zoom ) => {
	const bounds = el._bounds;
	const vw = document.documentElement.clientWidth;
	const vh = window.innerHeight;
	const axis = ( value, start, size, viewport ) => {
		const center = start + size / 2;
		const scaled = size * zoom.scale;
		if ( scaled <= viewport ) {
			return viewport / 2 - center;
		}
		return clamp( value, viewport - center - scaled / 2, scaled / 2 - center );
	};
	zoom.tx = axis( zoom.tx, bounds.left, bounds.width, vw );
	zoom.ty = axis( zoom.ty, bounds.top, bounds.height, vh );
};

const zoomIn = ( x, y ) => {
	const el = session.media;
	const bounds = el._bounds;
	const item = session.items[ session.index ];
	const scale = item.width / bounds.width;
	// Keep the clicked point under the pointer.
	const zoom = {
		scale,
		tx: ( x - ( bounds.left + bounds.width / 2 ) ) * ( 1 - scale ),
		ty: ( y - ( bounds.top + bounds.height / 2 ) ) * ( 1 - scale ),
	};
	clampPan( el, zoom );
	session.zoom = zoom;
	el.style.transition = `transform ${ duration( 450 ) }ms ${ EASE }`;
	el.style.transform = zoomTransform( zoom );
	el.classList.add( 'is-zoomed' );
	root.classList.add( 'is-zoomed' );
};

const zoomOut = ( instant = false ) => {
	const el = session?.media;
	if ( ! el || ! session.zoom ) {
		return;
	}
	session.zoom = null;
	el.style.transition = instant ? 'none' : `transform ${ duration( 400 ) }ms ${ EASE }`;
	el.style.transform = '';
	el.classList.remove( 'is-zoomed' );
	root.classList.remove( 'is-zoomed' );
};

// With a mouse, the zoomed picture follows the pointer: the whole picture
// can be explored without dragging.
const followPointer = ( event ) => {
	const { media: el, zoom } = session;
	const bounds = el._bounds;
	const vw = document.documentElement.clientWidth;
	const vh = window.innerHeight;
	const lerp = ( start, size, viewport, position ) => {
		const center = start + size / 2;
		const scaled = size * zoom.scale;
		const max = scaled / 2 - center;
		const min = viewport - center - scaled / 2;
		return max + ( min - max ) * clamp( position / viewport, 0, 1 );
	};
	zoom.tx = lerp( bounds.left, bounds.width, vw, event.clientX );
	zoom.ty = lerp( bounds.top, bounds.height, vh, event.clientY );
	clampPan( el, zoom );
	el.style.transition = `transform ${ duration( 160 ) }ms ease-out`;
	el.style.transform = zoomTransform( zoom );
};

/* -------------------------------------------------------------------------
 * Navigation
 * ---------------------------------------------------------------------- */

const goTo = ( index, direction, offset = 0 ) => {
	const { items } = session;
	zoomOut( true );

	const old = session.media;
	getVideo( old )?.pause();
	old.style.pointerEvents = 'none';
	old.style.transition = 'none';
	const out = old.animate(
		[
			{ transform: `translateX(${ offset }px)`, opacity: 1 },
			{ transform: `translateX(${ -direction * ( Math.abs( offset ) + 120 ) }px)`, opacity: 0 },
		],
		{ duration: duration( 260 ), easing: 'ease-in', fill: 'forwards' }
	);
	out.onfinish = () => old.remove();

	setSourceHidden( items[ session.index ], false );
	session.index = ( index + items.length ) % items.length;
	const item = items[ session.index ];
	setSourceHidden( item, true );

	const el = createMedia( item );
	stage.appendChild( el );
	session.media = el;
	el.animate(
		[
			{ transform: `translateX(${ direction * 120 }px)`, opacity: 0 },
			{ transform: 'none', opacity: 1 },
		],
		{ duration: duration( 420 ), easing: EASE }
	).onfinish = () => playVideo( el );

	updateUI();
	preloadNeighbours();
	session.options.onChange?.( session.index );
};

const step = ( direction, offset = 0 ) => {
	if ( session && ! session.closing && session.items.length > 1 ) {
		goTo( session.index + direction, direction, offset );
	}
};

const snapBack = ( el ) => {
	const from = el.style.transform;
	el.style.transform = '';
	backdrop.style.opacity = '';
	el.animate( [ { transform: from }, { transform: 'none' } ], { duration: duration( 300 ), easing: EASE } );
};

/* -------------------------------------------------------------------------
 * Gestures
 * ---------------------------------------------------------------------- */

function onPointerDown( event ) {
	if ( ! session || session.closing || event.button > 0 ) {
		return;
	}
	// Buttons, captions (links, text selection) and video controls keep their
	// own behaviour.
	if ( event.target.closest( 'button, video, .eo-lightbox__caption' ) ) {
		return;
	}
	gesture = {
		id: event.pointerId,
		x: event.clientX,
		y: event.clientY,
		time: performance.now(),
		axis: null,
		dx: 0,
		dy: 0,
		pan: session.zoom ? { tx: session.zoom.tx, ty: session.zoom.ty } : null,
	};
	root.setPointerCapture?.( event.pointerId );
}

function onPointerMove( event ) {
	if ( ! session || session.closing ) {
		return;
	}
	if ( session.zoom && event.pointerType === 'mouse' ) {
		followPointer( event );
		return;
	}
	if ( ! gesture || event.pointerId !== gesture.id ) {
		return;
	}

	const el = session.media;
	gesture.dx = event.clientX - gesture.x;
	gesture.dy = event.clientY - gesture.y;

	// Touch drag on a zoomed picture pans it.
	if ( session.zoom ) {
		session.zoom.tx = gesture.pan.tx + gesture.dx;
		session.zoom.ty = gesture.pan.ty + gesture.dy;
		clampPan( el, session.zoom );
		el.style.transition = 'none';
		el.style.transform = zoomTransform( session.zoom );
		return;
	}

	if ( ! gesture.axis && Math.hypot( gesture.dx, gesture.dy ) > 8 ) {
		gesture.axis = Math.abs( gesture.dx ) > Math.abs( gesture.dy ) ? 'x' : 'y';
	}
	el.style.transition = 'none';
	if ( gesture.axis === 'x' && session.items.length > 1 ) {
		el.style.transform = `translateX(${ gesture.dx }px)`;
	} else if ( gesture.axis === 'y' ) {
		// Pulling down closes: the media follows the finger and shrinks a bit.
		const y = gesture.dy > 0 ? gesture.dy : gesture.dy * 0.25;
		const progress = Math.min( Math.abs( y ) / window.innerHeight, 1 );
		el.style.transform = `translateY(${ y }px) scale(${ 1 - progress * 0.25 })`;
		backdrop.style.opacity = String( 1 - progress * 1.2 );
	}
}

function onPointerUp( event ) {
	const current = gesture;
	gesture = null;
	if ( ! current || ! session || session.closing || event.pointerId !== current.id ) {
		return;
	}
	const el = session.media;
	const elapsed = performance.now() - current.time;

	// A tap: outside the media closes, on a picture toggles the zoom.
	if ( Math.hypot( current.dx, current.dy ) < 8 ) {
		const rect = el.getBoundingClientRect();
		const onMedia =
			event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
		if ( session.zoom ) {
			zoomOut();
		} else if ( ! onMedia ) {
			close();
		} else if ( el.classList.contains( 'is-zoomable' ) ) {
			zoomIn( event.clientX, event.clientY );
		}
		return;
	}

	if ( session.zoom ) {
		return;
	}

	const fast = elapsed < 300;
	if ( current.axis === 'x' && session.items.length > 1 ) {
		if ( Math.abs( current.dx ) > 80 || ( fast && Math.abs( current.dx ) > 30 ) ) {
			const direction = current.dx < 0 ? 1 : -1;
			step( direction, current.dx );
			return;
		}
	} else if ( current.axis === 'y' ) {
		if ( current.dy > 120 || ( fast && current.dy > 50 ) ) {
			close();
			return;
		}
	}
	snapBack( el );
}

function onPointerCancel() {
	if ( gesture && session?.media && ! session.zoom ) {
		snapBack( session.media );
	}
	gesture = null;
}

const onKeyDown = ( event ) => {
	if ( ! session || session.closing ) {
		return;
	}
	switch ( event.key ) {
		case 'Escape':
			event.preventDefault();
			if ( session.zoom ) {
				zoomOut();
			} else {
				close();
			}
			break;
		case 'ArrowLeft':
			event.preventDefault();
			step( -1 );
			break;
		case 'ArrowRight':
			event.preventDefault();
			step( 1 );
			break;
		case 'Tab': {
			// Keep the focus inside the dialog.
			const focusables = [ buttons.prev, buttons.next, getVideo( session.media ), buttons.close ].filter(
				( el ) => el && el.offsetParent !== null
			);
			const position = focusables.indexOf( document.activeElement );
			const next = ( position + ( event.shiftKey ? -1 : 1 ) + focusables.length ) % focusables.length;
			event.preventDefault();
			focusables[ next ]?.focus();
			break;
		}
	}
};

const onResize = () => {
	if ( ! session || session.closing ) {
		return;
	}
	zoomOut( true );
	const el = session.media;
	applyBounds( el, getBounds( session.items[ session.index ] ) );
	el.classList.toggle( 'is-zoomable', !! session.items[ session.index ].width && session.items[ session.index ].width > el._bounds.width * 1.15 );
};

/* -------------------------------------------------------------------------
 * Open / close
 * ---------------------------------------------------------------------- */

const lockScroll = () => {
	const html = document.documentElement;
	const scrollbar = window.innerWidth - html.clientWidth;
	scrollLock = { overflow: html.style.overflow, paddingRight: document.body.style.paddingRight };
	html.style.overflow = 'hidden';
	if ( scrollbar > 0 ) {
		document.body.style.paddingRight = `${ scrollbar }px`;
	}
};

const unlockScroll = () => {
	if ( scrollLock ) {
		document.documentElement.style.overflow = scrollLock.overflow;
		document.body.style.paddingRight = scrollLock.paddingRight;
		scrollLock = null;
	}
};

export const openLightbox = ( items, index, options = {} ) => {
	if ( session || ! items[ index ] ) {
		return;
	}
	if ( ! root ) {
		build();
	}

	const labels = options.labels || {};
	root.setAttribute( 'aria-label', labels.dialog || '' );
	buttons.prev.setAttribute( 'aria-label', labels.prev || 'Previous' );
	buttons.next.setAttribute( 'aria-label', labels.next || 'Next' );
	buttons.close.setAttribute( 'aria-label', labels.close || 'Close' );

	const item = items[ index ];
	session = { items, index, options, media: null, zoom: null, closing: false, opener: document.activeElement };

	lockScroll();
	root.hidden = false;
	root.classList.remove( 'is-closing', 'is-zoomed' );
	root.classList.toggle( 'is-single', items.length < 2 );

	const el = createMedia( item );
	stage.appendChild( el );
	session.media = el;
	updateUI();

	const rect = getSourceRect( item );
	let animation;
	if ( rect && ! reducedMotion() ) {
		setSourceHidden( item, true );
		animation = el.animate( flipKeyframes( item, el, rect ), { duration: 500, easing: EASE } );
	} else {
		animation = el.animate(
			[
				{ opacity: 0, transform: 'scale(0.94)' },
				{ opacity: 1, transform: 'none' },
			],
			{ duration: duration( 300 ), easing: EASE }
		);
	}
	animation.onfinish = () => playVideo( el );

	// Next frame, so the backdrop and controls transition in.
	requestAnimationFrame( () => root.classList.add( 'is-open' ) );

	document.addEventListener( 'keydown', onKeyDown );
	window.addEventListener( 'resize', onResize );
	buttons.close.focus( { preventScroll: true } );
	preloadNeighbours();
	options.onOpen?.( index );
};

export function close() {
	if ( ! session || session.closing ) {
		return;
	}
	zoomOut( true );
	session.closing = true;

	const { items, index, media: el, options } = session;
	const item = items[ index ];
	getVideo( el )?.pause();

	// Let the gallery bring the thumbnail into view (carousel) first.
	options.onBeforeClose?.( index );

	root.classList.add( 'is-closing' );
	root.classList.remove( 'is-open' );
	backdrop.style.opacity = '';
	clearTimeout( spinnerTimer );
	spinner.classList.remove( 'is-visible' );

	const start = el.style.transform || 'none';
	el.style.transition = 'none';
	const rect = getSourceRect( item );
	let animation;
	if ( rect && ! reducedMotion() ) {
		setSourceHidden( item, true );
		animation = el.animate( flipKeyframes( item, el, rect, start ).reverse(), {
			duration: 420,
			easing: EASE,
			fill: 'forwards',
		} );
	} else {
		animation = el.animate(
			[
				{ opacity: 1, transform: start },
				{ opacity: 0, transform: `${ start === 'none' ? '' : start } scale(0.92)` },
			],
			{ duration: duration( 250 ), easing: 'ease-in', fill: 'forwards' }
		);
	}

	animation.onfinish = () => {
		setSourceHidden( item, false );
		stage.innerHTML = '';
		root.hidden = true;
		root.classList.remove( 'is-closing', 'is-zoomed' );
		unlockScroll();
		document.removeEventListener( 'keydown', onKeyDown );
		window.removeEventListener( 'resize', onResize );
		const focusTarget = item.trigger || session.opener;
		session = null;
		focusTarget?.focus?.( { preventScroll: true } );
		options.onClose?.( index );
	};
}
