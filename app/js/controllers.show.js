controllers.show = function(key) {
  var _this = this;

  var book = _.find(store, function(book) {
    return book.key == key;
  });

  function page_url(index) {
    return book.url + "/" + book.page_urls[index - 1];
  }

  function go_next_page()
  {
    var index = utils.page();
    index += 1;

    if(index > book.page_urls.length) index = book.page_urls.length;
    utils.page(index);
  }

  this.init = function() {
    console.log("starting show");

    $(window).bind("keydown.show", function(event)
    {
      if((event.keyCode == 32 || event.keyCode == 13) && utils.scrollDistanceFromBottom() <= 0)
      {
        event.preventDefault();
        go_next_page();      
      }
      else if(event.keyCode == 8)
      {
        event.preventDefault();
        history.back();
      }
    });

    $("#view-show").bind("click", go_next_page);
    $("#view-show").show().addClass("current-view");
  }

  this.render = function() {
    var index = utils.page();

    $("#image").attr('src', "img/blank.png");    
    window.scrollTo(0, 0);
    $("#image").attr('src', page_url(index));

    if((index + 1) <= book.page_urls.length)
    {
      preload = new Image();
      preload.src = page_url(index + 1);
    }
  }

  this.destroy = function() {
    console.log("destroying show");
    $(window).unbind(".show");
    $("#view-show").unbind("click");
    $("#view-show").hide().removeClass("current-view");
  }
}

