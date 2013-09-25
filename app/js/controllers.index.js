controllers.index = function(search, sort) {
  var _this = this;

  function sortFor(type) {
    if(!type) type = "publishedOn";

    if(type == "publishedOn") return function(book) {
      return book.publishedOn;
    };
    if(type == "pages") return function(book) {
      return book.pageUrls.length;
    };
  }

  var books = store;
  if(search && search != "") {
    regex = RegExp(search, "i");
    books = _.filter(books, function(book) {
      return book.title.match(regex);
    });
  }
  console.log(sortFor(sort));
  books = _.sortBy(books, sortFor(sort)).reverse();

  var scrollLock = false;
  var lastPage = false;
  var scrollTimer = null;

  function perPageFromWindow() {
    var windowWidth = $(window).width();
    if(windowWidth < 1000) return 15;
    else if(windowWidth > 1000 && windowWidth < 1500) return 20;
    else if(windowWidth > 1500) return 100;
  }

  var perPage = perPageFromWindow();

  function checkScroll() {
    if(!lastPage && utils.nearBottomOfPage()) utils.page(utils.page() + 1);
  }

  this.init = function() {
    console.log("starting index");

    $("#search").bind("keydown", function(event) {
      if(event.keyCode == 13) {
        event.preventDefault();
        utils.locationParams([$("#search").val(), sort]);
      }
    });

    $("#clear-search").bind("click", function() {
      $("#search").val("");
    });

    $("a.sort").bind("click", function(event) {
      event.preventDefault();
      utils.locationParams([search, $(this).data("sort")]);
    });

    $("#view-index").show().addClass("current-view");
    scrollTimer = setInterval(checkScroll, 250);
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
    var booksPage = utils.paginate(books, perPage);
    addBooks(booksPage);
    if(booksPage.length < perPage) lastPage = true;
  }

  this.destroy = function() {
    console.log("destroying index");
    clearInterval(scrollTimer);
    $("#search").unbind("keydown");
    $("#clear-search").unbind("click");
    $("a.sort").unbind("click");
    $("#items").empty();
    $("#view-index").hide().removeClass("current-view");
  }
}
