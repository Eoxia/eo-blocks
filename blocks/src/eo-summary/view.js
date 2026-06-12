(function($) {

	/**
	 * initializeBlock
	 *
	 * Adds custom JavaScript to the block Accordion.
	 *
	 * @since   1.0.0
	 *
	 * @param   object $block The block jQuery element.
	 * @return  void
	 */
	var initializeBlock = function( $block ) {
		$( '.eo-summary__control' ).each( function() {
			$( $block ).find( '.eo-summary__container' ).append( '<a href="#' +  $( this ).attr( 'id' ) + '" class="eo-summary__item ' + $( this ).attr( 'id' ) + '"><span class="eo-summary__item-label">' + $( this ).attr( 'summary-label' ) + '</span></a>' );
		});

		// Smooth Scroll.
		$('.eo-summary__item').on('click', function() {
			scrollSummary.call(this);
		});

		// Menu.
		$($block).find('.eo-summary__menu').on( 'click', function() {
			$($block).toggleClass('is-active-mobile-menu');
		})
		$($block).find('.eo-summary__menu-close').on('click', function() {
			$($block).removeClass('is-active-mobile-menu');
		});
		
		$($block).find('.eo-summary__item').on('click', function() {
			if ( $($block).hasClass('is-active-mobile-menu') ) {
				$($block).removeClass('is-active-mobile-menu');
				scrollSummary.call(this);
			}
		 });


	}

	var updateScrollOffset = function() { 
		var offset = 10;

		// Barre Admin WP (32px ou 46px sur mobile)
		var adminBar = document.getElementById('wpadminbar');
		if (adminBar) { 
			offset += adminBar.offsetHeight; 
		}

		// Header Sticky (Beflex)
		var stickyHeader = document.querySelector('.site-header .header-sticky');
		if (stickyHeader) { 
			offset += stickyHeader.offsetHeight; 
		}

		document.documentElement.style.setProperty('--eo-blocks--summary--scroll-offset', offset + 'px');
	};
	
	var scrollSummary = function() {
		if (this.hash !== "") {
		}
		
/* 		var offset = 20;
		if ( $('#wpadminbar').length > 0 ) { offset += 32; }
		if ( $('.site-header .header-sticky').length > 0 ) { offset += $('.site-header .header-sticky').outerHeight(); } // Beflex theme fix.

		if (this.hash !== "") {
			event.preventDefault();
			var hash = this.hash;

			$('html, body').animate({
				scrollTop: $(hash).offset().top - offset
			}, 500 );
		} */
	}

	var updateActiveMenu = function() {
		const menuItems = $('.eo-summary__item');
		
		// On récupère l'offset exact calculé dynamiquement par l'autre fonction
		// On ajoute +5 ou +10px de "marge d'erreur" pour déclencher l'activation un peu avant
		const dynamicOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--eo-blocks--summary--scroll-offset')) || 80;
		const scrollPosition = $(window).scrollTop() + dynamicOffset + 35;

		let activeSection = '';

		menuItems.each(function(index) {
			const sectionId = $(this).attr('href');
			if (!sectionId || sectionId === "#") return;
			
			const section = $(sectionId);

			if (section.length) {
				const sectionTop = section.offset().top;
				const nextItem = menuItems.eq(index + 1);
				const nextSection = nextItem.length ? $(nextItem.attr('href')) : null;
				const nextSectionTop = (nextSection && nextSection.length) ? nextSection.offset().top : Infinity;

				if (scrollPosition >= sectionTop && scrollPosition < nextSectionTop) {
					activeSection = sectionId;
					return false; // Stop la boucle each
				}
			}
		});

		// Application de la classe active
		menuItems.removeClass('active'); // Remplacez par votre classe CSS d'activation
		if (activeSection) {
			$(`.eo-summary__item[href="${activeSection}"]`).addClass('active');
		}
	};

	$(document).ready(function(){
		$('.wp-block-eo-blocks-summary').each(function(){
			initializeBlock( $(this) );
		});

		window.addEventListener('load', updateScrollOffset);
		window.addEventListener('resize', updateScrollOffset);

		$(window).on('scroll', updateActiveMenu);
		updateActiveMenu();
	});

})(jQuery);
