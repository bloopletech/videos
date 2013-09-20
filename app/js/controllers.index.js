controllers.index = function() {
  var _this = this;

  var books = _.sortBy(store, "published_on").reverse();

  this.init = function() {
    console.log("starting index");
    $("#view-index").show().addClass("current-view");
  }

  this.render = function() {
    console.log("rendering");
    console.log(books);
    $("#items").empty();
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

  this.destroy = function() {
    console.log("destroying index");
    $("#items").empty();
    $("#view-index").hide().removeClass("current-view");
  }
}
