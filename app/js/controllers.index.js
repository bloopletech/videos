var lastControllerLocation = "";

controllers.index = function(search, sort, sortDirection) {
  var _this = this;

  function sortFor(type) {
    if(type == "publishedOn") return function(video) {
      return video.publishedOn;
    };
/*    if(type == "pages") return function(video) {
      return video.pageUrls.length;
    };*/
    if(type == "title") return function(video) {
      return video.title.toLowerCase();
    };
  }

  var videos = store;
  if(search && search != "") {
    var words = search.split(/\s+/);
    _.each(words, function(word) {
      regex = RegExp(word, "i");
      videos = _.filter(videos, function(video) {
        return video.title.match(regex);
      });
    });
  }
  if(!sort) sort = "publishedOn";
  videos = _.sortBy(videos, sortFor(sort));

  if(!sortDirection) sortDirection = "desc";
  if(sortDirection == "desc") videos = videos.reverse();

  function perPageFromWindow() {
    var windowWidth = $(window).width();
    if(windowWidth < 1000) return 16;
    else if(windowWidth > 1000 && windowWidth < 1500) return 21;
    else if(windowWidth > 1500) return 25;
  }

  var perPage = perPageFromWindow();
  var pages = utils.pages(videos, perPage);

  this.init = function() {
    console.log("starting index");

    $("#search").bind("keydown", function(event) {
      event.stopPropagation();
      if(event.keyCode == 13) {
        event.preventDefault();
        utils.location({ params: [$("#search").val(), sort, sortDirection], hash: "1" });
      }
    });

    $("#clear-search").bind("click", function() {
      $("#search").val("");
      event.preventDefault();
      location.href = "#index!1";
    });

    $(".sort button").bind("click", function(event) {
      event.preventDefault();
      utils.location({ params: [search, $(this).data("sort"), sortDirection], hash: "1" });
    });

    $(".sort button").removeClass("active");
    $(".sort button[data-sort=" + sort + "]").addClass("active");

    $(".sort-direction button").bind("click", function(event) {
      event.preventDefault();
      utils.location({ params: [search, sort, $(this).data("sort-direction")], hash: "1" });
    });

    $(".sort-direction button").removeClass("active");
    $(".sort-direction button[data-sort-direction=" + sortDirection + "]").addClass("active");

    $("#view-index").show().addClass("current-view");
    $("title").text("Videos");
  }

  function absoluteURL(url) {
	  var a = document.createElement("a");
	  a.href = url;
	  return a.href;
  }

  function addVideos(videos) {
    $("#items").empty();

    _.each(videos, function(video) {
      var item = $("<li>");
      var link = $("<a>");
      link.attr("href", "play://" + absoluteURL(video.url));
      //link.attr("target", "_blank");
      var img = $("<img>");
      img.attr("src", video.thumbnailUrl);
      link.append(img);
      item.append(link);

      item.append('<div class="info-wrapper"><div class="info"><div class="title">' + video.title + '</div></div>');

      $("#items").append(item);
    });
  }

  this.render = function() {
    console.log("rendering");
    window.scrollTo(0, 0);

    var videosPage = utils.paginate(videos, perPage);
    addVideos(videosPage);
    lastControllerLocation = location.hash;
  }

  this.destroy = function() {
    console.log("destroying index");
    $("#search").unbind("keydown");
    $("#clear-search").unbind("click");
    $(".sort button").unbind("click");
    $(".sort-direction button").unbind("click");
    $("#items").empty();
    $("#view-index").hide().removeClass("current-view");
  }
}
