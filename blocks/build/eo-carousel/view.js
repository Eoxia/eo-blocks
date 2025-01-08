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
      slidesPerView: 1,
      loop: true,
      speed: 300,
      autoplay: false,
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