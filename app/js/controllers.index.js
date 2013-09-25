controllers.index = function() {
  var _this = this;

  var books = _.sortBy(store, "publishedOn").reverse();

  var scrollLock = false;
  var lastPage = false;
  var scrollTimer = null;
  var perPage = 100;

  function checkScroll() {
    if(!lastPage && utils.nearBottomOfPage()) utils.page(utils.page() + 1);
  }

  this.init = function() {
    console.log("starting index");
    $("#view-index").show().addClass("current-view");
    scrollTimer = setInterval(checkScroll, 250);
  }

  function paginate(books) {
    var page = utils.page();
    return books.slice((page - 1) * perPage, page * perPage);
  }

  function addBooks(books) {
    _.each(books, function(book) {
      var item = $("<li>");
      var link = $("<a>");
      link.attr("href", "#show/" + book.key + "!1");
      var img = $("<img>");
      img.attr("src", book.thumbnailUrl);
      link.append(img);
      item.append(link);

      item.append('<div class="info-wrapper"><div class="info"><div class="title">' + book.title + '</div>' +
        '<img src="img/icons/page_white.png" title="Pages"> ' + book.pageUrls.length + '</div></div>');

      $("#items").append(item);
    });
  }

  this.render = function() {
    console.log("rendering");
    var booksPage = paginate(books);
    addBooks(booksPage);
    if(booksPage.length < perPage) lastPage = true;
  }

  this.destroy = function() {
    console.log("destroying index");
    clearInterval(scrollTimer);
    $("#items").empty();
    $("#view-index").hide().removeClass("current-view");
  }
}
