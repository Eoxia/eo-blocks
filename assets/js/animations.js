/**
 * Plays a block's entrance/exit CSS animation when it enters/leaves the
 * viewport. No dependency: the animation itself is 100% CSS (see
 * assets/scss/hooks/_animations.scss); this script only arms the relevant
 * @keyframes (paused, sitting on its first frame) and later resumes it.
 *
 * Animations are always resumed from a paused state, never started fresh in
 * "running" mode: some engines mis-resolve `animation-fill-mode: both` when
 * an animation is renamed and set to running in the same tick, which made
 * the exit animation jump straight to hidden instead of fading out.
 */
( function () {
	'use strict';

	if ( ! ( 'IntersectionObserver' in window ) ) {
		return;
	}

	var elements = document.querySelectorAll(
		'[data-eo-anim-in], [data-eo-anim-out]'
	);

	if ( ! elements.length ) {
		return;
	}

	// Entrance plays as soon as the block starts appearing. Exit plays while
	// the block is still half visible so it isn't already scrolled away.
	var ENTER_RATIO = 0.15;
	var EXIT_RATIO = 0.5;

	function armIn( el, type ) {
		el.style.animationName = 'eo-anim-in-' + type;
		el.style.animationPlayState = 'paused';
		el.dataset.eoAnimPhase = 'in';
	}

	function armOut( el, type ) {
		el.style.animationName = 'eo-anim-out-' + type;
		el.style.animationPlayState = 'paused';
		el.dataset.eoAnimPhase = 'out';
	}

	function play( el ) {
		el.style.animationPlayState = 'running';
	}

	// Plays the currently armed animation if the last known intersection
	// ratio already qualifies for it. Called both from the observer (on
	// scroll) and right after an animation finishes: on a very fast scroll,
	// an exit animation can still be mid-flight when the user reverses
	// direction, and by the time it finishes and the entrance gets re-armed,
	// scrolling may already have stopped — no new observer callback would
	// ever fire to resume it, leaving the block stuck hidden. Re-checking
	// immediately here closes that gap.
	function evaluate( el ) {
		var ratio = el.__eoRatio;
		var phase = el.dataset.eoAnimPhase;

		if ( ratio >= ENTER_RATIO ) {
			el.dataset.eoSeen = '1';
		}

		if ( phase === 'in' && ratio >= ENTER_RATIO ) {
			play( el );
		} else if (
			phase === 'out' &&
			ratio <= EXIT_RATIO &&
			el.dataset.eoSeen === '1'
		) {
			play( el );
		}
	}

	// "slide-left" / "slide-right" rest on a translateX() offset while
	// armed (before playing, or after a completed exit), which can push the
	// block past the edge of the page and create a horizontal scrollbar.
	var hasHorizontalSlide = false;

	elements.forEach( function ( el ) {
		var animIn = el.dataset.eoAnimIn;
		var animOut = el.dataset.eoAnimOut;

		if ( animIn ) {
			armIn( el, animIn );
		} else if ( animOut ) {
			armOut( el, animOut );
		}

		if (
			animIn === 'slide-left' ||
			animIn === 'slide-right' ||
			animOut === 'slide-left' ||
			animOut === 'slide-right'
		) {
			hasHorizontalSlide = true;
		}

		el.__eoRatio = 0;
	} );

	if ( hasHorizontalSlide ) {
		document.documentElement.style.overflowX = 'hidden';
	}

	// Once an animation finishes, arm the other direction (paused) so it is
	// ready to be resumed later without ever being started "cold", then
	// immediately re-check in case the block's visibility already changed
	// again while that animation was playing.
	document.addEventListener( 'animationend', function ( event ) {
		if (
			! event.animationName ||
			event.animationName.indexOf( 'eo-anim-' ) !== 0
		) {
			return;
		}

		var el = event.target;
		var phase = el.dataset.eoAnimPhase;

		if ( phase === 'in' && el.dataset.eoAnimOut ) {
			armOut( el, el.dataset.eoAnimOut );
		} else if ( phase === 'out' && el.dataset.eoAnimIn ) {
			armIn( el, el.dataset.eoAnimIn );
		} else {
			return;
		}

		evaluate( el );
	} );

	var observer = new IntersectionObserver(
		function ( entries ) {
			entries.forEach( function ( entry ) {
				var el = entry.target;
				el.__eoRatio = entry.intersectionRatio;
				evaluate( el );
			} );
		},
		{ threshold: [ 0, ENTER_RATIO, EXIT_RATIO, 1 ] }
	);

	elements.forEach( function ( el ) {
		observer.observe( el );
	} );
} )();
