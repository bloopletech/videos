controllers.index = function() {
  var _this = this;

  var books = _.sortBy(store, "published_on").reverse();

  var scroll_lock = false;
  var last_page = false;
  var current_page = 1;
  var scroll_timer = null;

  function checkScroll()
  {
    if(!last_page && !scroll_lock && utils.nearBottomOfPage())
    {
      scroll_lock = true;

      utils.page(utils.page() + 1);

      scroll_lock = false;
    }
  }

  this.init = function() {
    console.log("starting index");
    $("#view-index").show().addClass("current-view");
    scroll_timer = setInterval(checkScroll, 250);
  }

  function paginate(books) {
    var page = utils.page();
    var per_page = 100;
    console.log("getting books from ", (page - 1) * per_page, " to ", page * per_page);
    return books.slice((page - 1) * per_page, page * per_page);
  }

  function add_books(books) {
    _.each(books, function(book) {
      var item = $("<li>");
      var link = $("<a>");
      link.attr("href", "#show/" + book.key + "!1");
      var img = $("<img>");
      img.attr("src", book.thumbnail_url);
      link.append(img);
      item.append(link);
      $("#items").append(item);
    });
  }

  this.render = function() {
    console.log("rendering");
    var books_page = paginate(books);
    console.log(books_page);
    add_books(books_page);
  }

  this.destroy = function() {
    console.log("destroying index");
    clearInterval(scroll_timer);
    $("#items").empty();
    $("#view-index").hide().removeClass("current-view");
  }
}
