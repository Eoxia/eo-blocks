/**
 * Key figure counter animation.
 *
 * Lightweight vanilla replacement for Counter-Up: the number is rendered
 * server-side with its final value (SEO / no-JS), then counted up from 0
 * when it enters the viewport.
 */
( function () {
	const formatNumber = ( value, decimals, decimalPoint, thousands ) => {
		const [ integer, fraction ] = Math.abs( value ).toFixed( decimals ).split( '.' );
		const grouped = integer.replace( /\B(?=(\d{3})+(?!\d))/g, thousands );

		return ( value < 0 ? '-' : '' ) + grouped + ( fraction ? decimalPoint + fraction : '' );
	};

	const getSettings = ( el ) => ( {
		target: parseFloat( el.dataset.target ) || 0,
		decimals: parseInt( el.dataset.decimals, 10 ) || 0,
		duration: parseInt( el.dataset.duration, 10 ) || 2000,
		decimalPoint: el.dataset.decimalPoint || '.',
		thousands: el.dataset.thousands || '',
	} );

	const animate = ( el ) => {
		const { target, decimals, duration, decimalPoint, thousands } = getSettings( el );
		let start = null;

		const step = ( now ) => {
			if ( null === start ) {
				start = now;
			}

			const progress = Math.min( ( now - start ) / duration, 1 );
			const eased = 1 - Math.pow( 1 - progress, 3 ); // easeOutCubic

			el.textContent = formatNumber( target * eased, decimals, decimalPoint, thousands );

			if ( progress < 1 ) {
				window.requestAnimationFrame( step );
			}
		};

		window.requestAnimationFrame( step );
	};

	const init = () => {
		const numbers = document.querySelectorAll( '.wp-block-eo-blocks-key-figure .eo-key-figure__number[data-target]' );

		// Keep the final value as is when animation is not wanted or not supported.
		if ( ! numbers.length || ! ( 'IntersectionObserver' in window ) || window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
			return;
		}

		const observer = new IntersectionObserver( ( entries ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting ) {
					observer.unobserve( entry.target );
					animate( entry.target );
				}
			} );
		}, { threshold: 0.5 } );

		numbers.forEach( ( el ) => {
			const { decimals, decimalPoint, thousands } = getSettings( el );

			// Lock the width on the final value to avoid layout shifts while counting.
			el.style.minWidth = el.getBoundingClientRect().width + 'px';
			el.textContent = formatNumber( 0, decimals, decimalPoint, thousands );
			observer.observe( el );
		} );
	};

	if ( 'loading' === document.readyState ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
