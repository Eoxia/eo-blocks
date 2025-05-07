/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!****************************************!*\
  !*** ./blocks/src/eo-carousel/view.js ***!
  \****************************************/
// import Swiper from 'swiper';
// import { Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.wp-block-eo-carousel');
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
      pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    };
    try {
      if (thumbsCarousel) {
        const swiperThumbs = new Swiper(thumbsCarousel, {
          loop: false,
          spaceBetween: 20,
          slidesPerView: 3,
          watchSlidesProgress: true
        });
        swiperDefaultAttributes.thumbs = {
          swiper: swiperThumbs
        };
      }
      const swiperCustomAttributes = jQuery(mainCarousel).data('carousel') || {};
      const mainOptions = jQuery.extend({}, swiperDefaultAttributes, swiperCustomAttributes);
      const swiperInit = new Swiper(mainCarousel, mainOptions);
    } catch (error) {
      console.error('Error initializing swiper for carousel:', carousel, error);
    }
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map