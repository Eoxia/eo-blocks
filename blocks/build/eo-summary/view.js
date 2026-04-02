/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************************!*\
  !*** ./blocks/src/eo-summary/view.js ***!
  \***************************************/
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
    $('.eo-summary__control').each(function () {
      $($block).find('.eo-summary__container').append('<a href="#' + $(this).attr('id') + '" class="eo-summary__item ' + $(this).attr('id') + '">' + $(this).attr('summary-label') + '</a>');
    });

    // Smooth Scroll.
    $('.eo-summary__item').on('click', function () {
      scrollSummary.call(this);
    });

    // Menu.
    $($block).find('.eo-summary__menu').on('click', function () {
      $($block).toggleClass('is-active-mobile-menu');
    });
    $($block).find('.eo-summary__menu-close').on('click', function () {
      $($block).removeClass('is-active-mobile-menu');
    });
    $($block).find('.eo-summary__item').on('click', function () {
      if ($($block).hasClass('is-active-mobile-menu')) {
        $($block).removeClass('is-active-mobile-menu');
        scrollSummary.call(this);
      }
    });
  };
  var scrollSummary = function () {
    var offset = 20;
    if ($('#wpadminbar').length > 0) {
      offset += 32;
    }
    if ($('.site-header .header-sticky').length > 0) {
      offset += $('.site-header .header-sticky').outerHeight();
    } // Beflex theme fix.

    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top - offset
      }, 500);
    }
  };
  var updateActiveMenu = function () {
    const menuItems = $('.eo-summary__item');
    var offset = 30;
    if ($('#wpadminbar')) {
      offset += 32;
    }
    if ($('.site-header .header-sticky')) {
      offset += $('.site-header .header-sticky').outerHeight();
    } // Beflex theme fix.

    const scrollPosition = $(window).scrollTop() + offset;
    let activeSection = '';
    menuItems.each(function (index) {
      const sectionId = $(this).attr('href');
      const section = $(sectionId);
      if (section.length) {
        const sectionTop = section.offset().top;
        const nextSectionTop = menuItems.eq(index + 1).attr('href') ? $(menuItems.eq(index + 1).attr('href')).offset().top : Infinity;
        if (scrollPosition >= sectionTop && scrollPosition < nextSectionTop || index === menuItems.length - 1 && scrollPosition >= sectionTop) {
          activeSection = sectionId;
          return false;
        }
      }
    });
    menuItems.removeClass('active');
    if (activeSection) {
      menuItems.filter(`[href="${activeSection}"]`).addClass('active');
    }
  };
  $(document).ready(function () {
    $('.wp-block-eo-blocks-summary').each(function () {
      initializeBlock($(this));
    });
    $(window).on('scroll', updateActiveMenu);
    updateActiveMenu();
  });
})(jQuery);
/******/ })()
;
//# sourceMappingURL=view.js.map