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

  this.init = function() {
    console.log("starting show");
    $("#image").attr("src", "img/blank.png");
    $("#view-show").show().addClass("current-view");
    //setTimeout(preloadImages, 5000);
  }

  this.render = function() {
    window.scrollTo(0, 0);

    var index = utils.page();

    $("#image").attr('src', pageUrl(index));

    if((index + 1) <= book.pageUrls.length) {
      preloadImage(index + 1);
    }
  }

  this.destroy = function() {
    console.log("destroying show");
    $("#view-show").hide().removeClass("current-view");
  }
}

