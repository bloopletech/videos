var lastControllerLocation = "";

controllers.index = function(search, sort, sortDirection) {
  var _this = this;

  function sortFor(type) {
    if(type == "publishedOn") return function(video) {
      return video.publishedOn;
    };
    if(type == "length") return function(video) {
      return video.length;
    };
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
        return video.title.match(regex) || video.resolution.match(regex);
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

  function formatLengthNumeric(length) {
    var out = [];
    if(length >= 3600) {
      out.push(Math.floor(length / 3600) + "h");
      length = length % 3600;
    }
    if(length >= 60) {
      out.push(Math.floor(length / 60) + "m");
      length = length % 60;
    }
    if(length >= 1) {
      out.push(Math.floor(length) + "s");
    }
    return out.join(" ");
  }

  function formatLength(length) {
    return '<span class="label label-default" title="Video Length"><span class="glyphicon glyphicon-expand"></span> ' + 
      formatLengthNumeric(length) + '</span>';
  }

  function formatResolution(resolution) {
    if(resolution == "1080p") {
      return '<span class="label label-success" title="Video Width/Height"><span class="glyphicon ' +
        'glyphicon-hd-video"></span> 1080p</span>';
    }
    else {
      return '<span class="label label-default" title="Video Width/Height">' + resolution + '</span>';
    }
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

      item.append('<div class="info-wrapper"><div class="info"><div class="title">' + video.title + '</div>' +
        '<div class="labels">' + formatLength(video.length) + ' ' + formatResolution(video.resolution) +
        '</div></div>');

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
