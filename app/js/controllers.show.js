controllers.show = function(key) {
  var _this = this;

  var book = _.find(store, function(book) {
    return book.key == key;
  });

  function pageUrl(index) {
    return book.url + "/" + book.pageUrls[index - 1];
  }

  function preloadImage(index) {
    var image = new Image();
    image.src = pageUrl(index);
  }

  function preloadImages() {
    _(book.pageUrls.length).times(function(i) {
      preloadImage(i + 1);
    });
  }

  function goNextPage() {
    utils.page(utils.page() + 1, book.pageUrls.length);
  }

  this.init = function() {
    console.log("starting show");

    $(window).bind("keydown.show", function(event)
    {
      if((event.keyCode == 32 || event.keyCode == 13) && utils.scrollDistanceFromBottom() <= 0)
      {
        event.preventDefault();
        goNextPage();
      }
      else if(event.keyCode == 8)
      {
        event.preventDefault();
        history.back();
      }
    });

    $("#view-show").bind("click", goNextPage);
    $("#view-show").show().addClass("current-view");

    setTimeout(preloadImages, 5000);
  }

  this.render = function() {
    var index = utils.page();

    $("#image").attr('src', "img/blank.png");    
    window.scrollTo(0, 0);
    _(5).times(function() {
      $("#image").attr('src', pageUrl(index));
    });

    if((index + 1) <= book.pageUrls.length) {
      preloadImage(index + 1);
    }
  }

  this.destroy = function() {
    console.log("destroying show");
    $(window).unbind(".show");
    $("#view-show").unbind("click");
    $("#view-show").hide().removeClass("current-view");
  }
}

