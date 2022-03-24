$(document).ready( function() {

/*=============================================================================
    Skills meters
 =============================================================================*/

  /**
   * Add delayed animations to skills gauges
   */
  $(".js-meter > .js-fill").each( function(index, value) {
    var $_this = $(this);
    $_this
      .data("origWidth", $_this.attr('data-ratio'))
      .width(0)
      .velocity(
        {
          width: $_this.data("origWidth")+'%',
        }, {
          delay     : index * 50,
          duration  : 1000,
          animation : 'easeInOut',
        }
      );
  });


/*=============================================================================
    Git Graphs
 =============================================================================*/

  /**
   * Ugly function to resize svg graph of my CV page
   * @param {string} name
   */
  function resizeGraph(name, ul) {
    var graphHeight = ul.clientHeight + 29;
    var graph = document.getElementsByClassName(name+'__git-graph')[0];
    var paths = graph.getElementsByClassName('paths')[0];
    var timelinePath = graph.getElementsByClassName('timeline-path')[0];
    graph.setAttribute('viewBox', '0 0 170 '+graphHeight);
    graph.style.height = graphHeight;
    if (name=="experience") {
      paths.children[0].setAttribute('d', 'M 20,40 L 20,'+graphHeight);
      paths.children[1].setAttribute('d', 'M 60,40 L 60,'+graphHeight);
      paths.children[2].setAttribute('d', 'M 60,'+graphHeight+' L 60,400 20,360 20,240 60,200 60,40');
      timelinePath.setAttribute('d', 'M 120,31 L 120,'+graphHeight+' 170,'+(graphHeight-29)+' 170,0');
    } else if (name=="formation") {
      paths.children[0].setAttribute('d', 'M 20,40 L 20,'+graphHeight);
      paths.children[1].setAttribute('d', 'M 60,40 L 60,'+graphHeight);
      paths.children[2].setAttribute('d', 'M 60,'+graphHeight+' L 60,204 20,164 20,110 60,70 60,30');
      timelinePath.setAttribute('d', 'M 120,29 L 120,'+graphHeight+' 170,'+(graphHeight-29)+' 170,0');
    }
  }

  var experiencesUl = document.getElementsByClassName('experiences')[0];
  var formationsUl = document.getElementsByClassName('formations')[0];

  if (experiencesUl && formationsUl) {
    resizeGraph('experience', experiencesUl);
    resizeGraph('formation', formationsUl);

    $(window).resize( function() {
      resizeGraph('experience', experiencesUl);
      resizeGraph('formation', formationsUl);
    });
  }

});
