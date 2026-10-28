// import Swiper from 'swiper';
// import { Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

const findArrow = (mainCarousel, direction) => {
	const selector = `:scope > .swiper-button-${direction}`;
	return mainCarousel.querySelector(selector) || mainCarousel.parentElement.querySelector(selector);
};

document.addEventListener('DOMContentLoaded', () => {
	const carousels = document.querySelectorAll('.wp-block-eo-blocks-carousel');
	carousels.forEach(carousel => {
		const mainCarousel = jQuery(carousel).find('.eo-carousel__main-carousel')[0];
		const thumbsCarousel = jQuery(carousel).find('.eo-carousel__thumbs-carousel')[0];

		if (!mainCarousel || !(mainCarousel instanceof HTMLElement)) {
			console.error('Main carousel is not a valid HTMLElement for:', carousel);
			return;
		}

		const swiperDefaultAttributes = {
			loop: true,
			speed: 300,
			autoplay: false,
			effect: 'default',
			spaceBetween: 0,
			slidesPerView: 1,
			centerInsufficientSlides: true,
			autoHeight: true,
			pagination: {
				el: '.swiper-pagination',
				dynamicBullets: true,
			},
			// Arrows are direct children of .swiper ("inside") or of its parent
			// ("outside"). Pass the elements themselves: string selectors would be
			// resolved against the whole document, and :scope keeps a carousel
			// nested in a slide from grabbing its parent's arrows (or vice versa).
			navigation: {
				nextEl: findArrow(mainCarousel, 'next'),
				prevEl: findArrow(mainCarousel, 'prev'),
			}
		};

		try {
			if ( thumbsCarousel ) {
				const swiperThumbs = new Swiper(thumbsCarousel, {
					loop: false,
					spaceBetween: 20,
					slidesPerView: 3,
					watchSlidesProgress: true,
				});
				swiperDefaultAttributes.thumbs = {
					swiper: swiperThumbs,
				}
			}

			const swiperCustomAttributes = jQuery(mainCarousel).data('carousel') || {};
			const mainOptions = jQuery.extend({}, swiperDefaultAttributes, swiperCustomAttributes);

			const swiperInit = new Swiper(mainCarousel, mainOptions);

		} catch (error) {
			console.error('Error initializing swiper for carousel:', carousel, error);
		}
	});
});
