/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./blocks/src/accordion/view.js ***!
  \**************************************/
(function ($) {
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
  var initializeBlock = function ($block) {
    $block.find('.eo-accordion__main-container:not(.eo-accordion__active) .eo-accordion__inner').toggle();
    $block.find('.eo-accordion__header').click(function () {
      $(this).closest('.eo-accordion__main-container').toggleClass('eo-accordion__active');
      $(this).closest('.eo-accordion__main-container').find('.eo-accordion__inner').slideToggle('fast');
    });
  };
  $(document).ready(function () {
    $('.wp-block-eo-accordion').each(function () {
      initializeBlock($(this));
    });
  });
})(jQuery);
/******/ })()
;
//# sourceMappingURL=view.js.map