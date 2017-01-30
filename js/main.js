$(document).ready( function() {

  // FitVids init
  // $("#main").fitVids();

/*=============================================================================
    Sticky top menu
 =============================================================================*/

  /**
   * Toggle the fixed top menu size when viewport reach the top offset
   */
  function toggleNavCollapse() {
   (50 < $(".navbar").offset().top)
     ? $(".navbar-fixed-top").addClass("top-nav-collapse")
     : $(".navbar-fixed-top").removeClass("top-nav-collapse");
  }

  toggleNavCollapse();

  $(window).scroll(toggleNavCollapse);

  $("a.js-page-scroll").click( function(event) {
    event.preventDefault();
    event.stopPropagation();
    var $_a = $(this);
    var offset = $($_a.attr('href')).offset().top-50;
    $("html, body").velocity('stop').velocity(
      'scroll', {
        offset    : offset+'px',
        duration  : 1000,
        animation : 'easeInOutExpo',
        complete  : function() {
          $_a.blur()
        }
      }
    );
  });

  $(".navbar-collapse ul li a").click( function() {
    $(".navbar-toggle:visible").click();
  });

  $(".navbar-brand").click( function() {
    $(".collapse.in") && $(".collapse.in").velocity(
      {
        height    : '1px'
      }, {
        duration  : 500,
        complete  : function() {
          $(".collapse.in").removeClass("in");
        }
      }
    );
  });


/*=============================================================================
    Sticky top menu
 =============================================================================*/

  // init sticky sidebar
  $(".js-sticky").Stickyfill();

  $(".js-input").click( function() {
    var $_this = $(this);
    if ($_this) { $_this.addClass('focused'); }
  })

  $(".js-input > input, .js-input > textarea").focusout( function() {
    var $_this = $(this);
    if ($_this.val() == '')
      $_this.parent().removeClass('focused');
  });


/*=============================================================================
  Project image animation
 =============================================================================*/

  var uponOffset = 70;
  var stepDuration = 400;
  var stepEasing = 'easeOutQuart';
  var stepsParams = {
    origin: {
      boxShadowY: 2,
      boxShadowBlur: 8
    },
    step1: {
      boxShadowY: 7,
      boxShadowBlur: 22
    },
    step2: {
      boxShadowY: 14,
      boxShadowBlur: 40
    }
  };

  function setProjectImgAnim() {
    if (window.innerWidth > 992) {
      $(".js-go_upon").each( function(index, element) {
        var $_element = $(element);
        var elementOrigin = element.getBoundingClientRect();
        $_element.hover(
          function() {
            if ($_element.hasClass('by_left')) {
              translateX  = '-'+uponOffset+'px';
              offsetX     = elementOrigin.left - element.getBoundingClientRect().left;
            } else {
              translateX  = uponOffset+'px';
              offsetX     = element.getBoundingClientRect().left - elementOrigin.left;
            };
            $_element.velocity('stop', true);
            if ($_element.css('z-index') == 0) {
              $_element.velocity(
                {
                  translateX    : translateX,
                  boxShadowY    : stepsParams['step1']['boxShadowY'],
                  boxShadowBlur : stepsParams['step1']['boxShadowBlur']
                }, {
                  duration      : (stepDuration/uponOffset)*(uponOffset - offsetX),
                  easing        : stepEasing,
                  complete      : function() { $_element.css('z-index', 2) }
                }
              ).velocity(
                {
                  translateX    : [0, translateX],
                  boxShadowY    : [stepsParams['step2']['boxShadowY'], stepsParams['step1']['boxShadowY']],
                  boxShadowBlur : [stepsParams['step2']['boxShadowBlur'], stepsParams['step1']['boxShadowBlur']]
                }, {
                  duration      : stepDuration,
                  easing        : stepEasing
                }
              );
            } else {
              $_element.velocity(
                {
                  translateX    : 0,
                  boxShadowY    : stepsParams['step2']['boxShadowY'],
                  boxShadowBlur : stepsParams['step2']['boxShadowBlur']
                }, {
                  duration      : (stepDuration/uponOffset)*offsetX,
                  easing        : stepEasing
                }
              );
            }
          },
          function() {
            if ($_element.hasClass('by_left')) {
              translateX  = '-'+uponOffset+'px';
              offsetX     = elementOrigin.left - element.getBoundingClientRect().left;
            } else {
              translateX  = uponOffset+'px';
              offsetX     = element.getBoundingClientRect().left - elementOrigin.left;
            };
            $_element.velocity('stop', true);
            if ($_element.css('z-index') == 2) {
              $_element.velocity(
                {
                  translateX    : translateX,
                  boxShadowY    : stepsParams['step1']['boxShadowY'],
                  boxShadowBlur : stepsParams['step1']['boxShadowBlur']
                }, {
                  duration      : (stepDuration/uponOffset)*(uponOffset - offsetX),
                  easing        : stepEasing
                }
              ).velocity(
                {
                  translateX    : [0, translateX],
                  boxShadowY    : [stepsParams['origin']['boxShadowY'], stepsParams['step1']['boxShadowY']],
                  boxShadowBlur : [stepsParams['origin']['boxShadowBlur'], stepsParams['step1']['boxShadowBlur']]
                }, {
                  duration      : stepDuration,
                  easing        : stepEasing,
                  begin         : function() { $_element.css('z-index', 0) },
                }
              );
            } else {
              $_element.velocity(
                {
                  translateX    : 0,
                  boxShadowY    : stepsParams['origin']['boxShadowY'],
                  boxShadowBlur : stepsParams['origin']['boxShadowBlur']
                }, {
                  duration      : (stepDuration/uponOffset)*offsetX,
                  easing        : stepEasing
                }
              );
            }
          }
        );
      });
    } else {
      $(".js-go_upon").each( function(index, element) {
        $(element).unbind('mouseenter mouseleave');
      });
    }
  };

  setProjectImgAnim();
  $(window).resize( function() {
    setProjectImgAnim();
  });


/*=============================================================================
  Scroll To Top Button
 =============================================================================*/

  var $_scrollToTop = $('#scrollToTop');
  var $_viewport = $(window);

  /**
   * Set the #scrollToTop button sticky to the footer or fixed depending on the footer is visible inside the $_viewport
   * @param {jQuery} $_viewport
   */
  function stickyOrFixed($_viewport) {
    ($_viewport.scrollTop() <= 100)
      ? $_scrollToTop.fadeOut('fast')
      : $_scrollToTop.fadeIn('fast');
    ( ($_viewport.scrollTop() + window.innerHeight) >= $("footer").offset().top )
      ? $_scrollToTop.addClass('fixed')
      : $_scrollToTop.removeClass('fixed');
  };

  stickyOrFixed($_viewport);
  $_viewport
    .scroll( function() { stickyOrFixed($_viewport) })
    .resize( function() { stickyOrFixed($_viewport) });

  $_scrollToTop.click( function(event) {
    event.preventDefault();
    event.stopPropagation();
    $('html, body').velocity('stop').velocity(
      'scroll', {
        offset    : 0,
        duration  : 1000,
        animation : 'easeInOutExpo'
      }
    );
  });


/*=============================================================================
  Licence Modal
 =============================================================================*/

  var $_termsAndPoliciesModal = $('#termsAndPoliciesModal');

  $('.js-modal').click( function(event) {
    event.preventDefault();
    event.stopPropagation();
    $_termsAndPoliciesModal.show();
    $("html, body").css('overflow', 'hidden');
  });
  $('.close-icon', $_termsAndPoliciesModal).click( function(event) {
    event.preventDefault();
    event.stopPropagation();
    $_termsAndPoliciesModal.hide();
    $("html, body").attr('style', '');
  });


/*=============================================================================
  Photo Swipe Gallery
 =============================================================================*/

  var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
      var thumbElements = el.childNodes;
      var numNodes = thumbElements.length;
      var items = [];
      var figureEl;
      var linkEl;
      var size;
      var item;

      for(var i = 0; i < numNodes; i++) {
        figureEl = thumbElements[i]; // <figure> element
        // include only element nodes
        if(figureEl.nodeType !== 1) continue;
        linkEl = figureEl.children[0]; // <a> element
        size = linkEl.getAttribute('data-size').split('x');
        // create slide object
        item = {
          src : linkEl.getAttribute('href'),
          w   : parseInt(size[0], 10),
          h   : parseInt(size[1], 10)
        };
        if(figureEl.children.length > 1) // <figcaption> content
          item.title = figureEl.children[1].innerHTML;
        if(linkEl.children.length > 0) // <img> thumbnail element, retrieving thumbnail url
          item.msrc = linkEl.children[0].getAttribute('src');
        item.el = figureEl; // save link to element for getThumbBoundsFn
        items.push(item);
      }
      return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
      return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
      e = e || window.event;
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
      var eTarget = e.target || e.srcElement;
      // find root element of slide
      var clickedListItem = closest(eTarget, function(el) {
        return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
      });
      if(!clickedListItem)
        return;

      // find index of clicked item by looping through all child nodes
      // alternatively, you may define index via data- attribute
      var clickedGallery = clickedListItem.parentNode;
      var childNodes = clickedListItem.parentNode.childNodes;
      var numChildNodes = childNodes.length;
      var nodeIndex = 0;
      var index;

      for (var i = 0; i < numChildNodes; i++) {
        if(childNodes[i].nodeType !== 1)
          continue;

        if(childNodes[i] === clickedListItem) {
          index = nodeIndex;
          break;
        }
        nodeIndex++;
      }
      if(index >= 0) // open PhotoSwipe if valid index found
        openPhotoSwipe( index, clickedGallery );
      return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
      var hash = window.location.hash.substring(1);
      var params = {};

      if(hash.length < 5)
        return params;
      var vars = hash.split('&');
      for (var i = 0; i < vars.length; i++) {
        if(!vars[i])
          continue;
        var pair = vars[i].split('=');
        if(pair.length < 2)
          continue;
        params[pair[0]] = pair[1];
      }
      if(params.gid)
        params.gid = parseInt(params.gid, 10);
      return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
      var pswpElement = document.querySelectorAll('.pswp')[0];
      var gallery;
      var options;
      var items;
      items = parseThumbnailElements(galleryElement);

      // define options (if needed)
      options = {
        // define gallery index (for URL)
        galleryUID: galleryElement.getAttribute('data-pswp-uid'),
        getThumbBoundsFn: function(index) {
          // See Options -> getThumbBoundsFn section of documentation for more info
          var thumbnail = items[index].el.getElementsByTagName('img')[0]; // find thumbnail
          var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          var rect = thumbnail.getBoundingClientRect();
          return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
        }
      };

      // PhotoSwipe opened from URL
      if(fromURL) {
        if(options.galleryPIDs) {
          // parse real index when custom PIDs are used
          // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
          for(var j = 0; j < items.length; j++) {
            if(items[j].pid == index) {
              options.index = j;
              break;
            }
          }
        } else {
          // in URL indexes start from 1
          options.index = parseInt(index, 10) - 1;
        }
      } else {
        options.index = parseInt(index, 10);
      }

      // exit if index not found
      if( isNaN(options.index) )
        return;
      if(disableAnimation)
        options.showAnimationDuration = 0;

      // Pass data to PhotoSwipe and initialize it
      gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
      galleryElements[i].setAttribute('data-pswp-uid', i+1);
      galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
      openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
  };

  initPhotoSwipeFromDOM('.js-gallery');

});
