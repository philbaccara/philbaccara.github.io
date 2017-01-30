$(document).ready( function () {

/*=============================================================================
    FUNCTIONS
 =============================================================================*/

  /**
   * A simple function to extract uri variables
   * @param {sring} variable - extracted variable
   * return {boolean|array} - array of values false unless
   */
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0; i<vars.length; i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){return decodeURI(pair[1]);}
    }
    return(false);
  }

  /**
   * Switch to the desired Category tab
   * @param {jQuery} $_catTab - desired Category tab
   */
  function toggleTabs($_catTab){
    var postsCategoryId = $_catTab.attr('data-posts-category')+"Posts";
    var $_postsList = $("#"+postsCategoryId);
    $_postsList.addClass('active');
    $_catTab.addClass('active');
    if (postsCategoryId == 'developmentPosts') {
      $("#musicTab").removeClass('active');
      $("#musicPosts").removeClass('active');
    } else {
      $("#developmentTab").removeClass('active');
      $("#developmentPosts").removeClass('active');
    }
  }

  /**
   * Filtering posts and toggle tag filter to the selected one
   * @param {jQuery} $_tagFilter
   */
  function toggleTagFilters($_tagFilter){
    var $_tagFilters = $_tagFilter.closest('.tag-filters-list');
    var tagName = $_tagFilter.attr('data-tag');
    var $_oldActiveFilter = $_tagFilters.children('.js-tag-filter.active');
    // window.history.pushState({}, '', window.location.href+"?cat=dev&filter="+tagName);
    $_oldActiveFilter.toggleClass('active');
    $_tagFilter.toggleClass('active');
    $('.posts > .post', $_tagFilters.closest('.posts-category__content')).each( function(index) {
      var $_post = $(this);
      if (tagName == 'all') {
        $_post.show()
      } else {
        ($_post.attr('data-tags').split(',').indexOf(tagName) != -1)
        ? $_post.show()
        : $_post.hide();
      }
    });
  }


/*=============================================================================
    LISTENERS
 =============================================================================*/

  // Handle Blog category tabs
  $(".js-posts-category-toggle").click( function() {
    var $_this = $(this);
    if (!$_this.hasClass('active')) toggleTabs($_this);
  });

  // Handle tags filter
  $(".tag-filters-list .js-tag-filter").click( function() {
    $_this = $(this);
    if (!$_this.hasClass('active')) toggleTagFilters($_this);
  });

  // Handle tags filter
  $(".post__tags-list .post__tag").click( function() {
    $_this = $(this);
    $_tagFilter = ($(".tag-filters-list .js-tag-filter[data-tag='"+ $_this.attr('data-tag') +"']"));
    if (!$_tagFilter.hasClass('active')) toggleTagFilters($_tagFilter);
  });


/*=============================================================================
  INIT
 =============================================================================*/

  // toggle to the category tab if populated in the uri
  var categoryId = getQueryVariable('cat');

  if (categoryId && ['development', 'music'].indexOf(categoryId) != -1) {
    toggleTabs( $('#'+categoryId+'Tab') );
    var tagFilterId = getQueryVariable('tag');
    if (tagFilterId) {
      var $_tagFilter = $('#'+categoryId+'Posts .js-tag-filter[data-tag="'+tagFilterId+'"]');
      if ($_tagFilter.size() > 0) toggleTagFilters( $_tagFilter );
    }
  }

});
