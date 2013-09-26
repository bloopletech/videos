controllers.index = function(search, sort, sortDirection) {
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
  books = _.sortBy(books, sortFor(sort));

  if(!sortDirection) sortDirection = "desc";
  if(sortDirection == "desc") books = books.reverse();

  function perPageFromWindow() {
    var windowWidth = $(window).width();
    if(windowWidth < 1000) return 15;
    else if(windowWidth > 1000 && windowWidth < 1500) return 20;
    else if(windowWidth > 1500) return 100;
  }

  var perPage = perPageFromWindow();
  var pages = utils.pages(books, perPage);

  this.init = function() {
    console.log("starting index");

    $("#search").bind("keydown", function(event) {
      if(event.keyCode == 13) {
        event.preventDefault();
        utils.locationParams([$("#search").val(), sort, sortDirection]);
      }
    });

    $("#clear-search").bind("click", function() {
      $("#search").val("");
    });

    $("a.sort").bind("click", function(event) {
      event.preventDefault();
      utils.locationParams([search, $(this).data("sort"), sortDirection]);
    });

    $("a.sort-direction").bind("click", function(event) {
      event.preventDefault();
      utils.locationParams([search, sort, $(this).data("sort-direction")]);
    });

    $("#view-index").hammer().on("swipeleft", function(event) {
      event.preventDefault();
      utils.page(utils.page() + 1, pages);
    }).on("swiperight", function(event) {
      event.preventDefault();
      utils.page(utils.page() - 1, pages);
    });

    $("#view-index").show().addClass("current-view");
  }

  function addBooks(books) {
    $("#items").empty();

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
  }

  this.destroy = function() {
    console.log("destroying index");
    $("#search").unbind("keydown");
    $("#clear-search").unbind("click");
    $("a.sort").unbind("click");
    $("a.sort-direction").unbind("click");
    $("#items").empty();
    $("#view-index").hammer().off("swiperight").off("swipeleft");
    $("#view-index").hide().removeClass("current-view");
  }
}
