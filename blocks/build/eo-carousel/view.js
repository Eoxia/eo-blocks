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
    const swiperCustomAttributes = jQuery(carousel).data('carousel');
    const swiperDefaultAttributes = {
      loop: true,
      speed: 300,
      autoplay: false,
      effect: 'default',
      spaceBetween: 0,
      slidesPerView: 1,
      // Mobile
      breakpoints: {
        599: {
          slidesPerView: 1 // Desktop
        }
      },
      pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    };
    console.log(jQuery.extend(swiperDefaultAttributes, swiperCustomAttributes));
    const swiperInit = new Swiper(carousel, jQuery.extend(swiperDefaultAttributes, swiperCustomAttributes));
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map