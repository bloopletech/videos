var store = null;

var utils = {};

utils.location_route = function(val) {
  if(arguments.length == 1) location.hash = "#" + val + "!" + utils.location_hash();
  else return location.hash.substr(1).split("!")[0];
};

utils.location_hash = function(val) {
  if(arguments.length == 1) location.hash = "#" + utils.location_route() + "!" + val;
  else return location.hash.substr(1).split("!")[1];
};

utils.page = function(index) {
  if(arguments.length == 1) {
    if(isNaN(index)) index = 1;
    utils.location_hash(index);
  }
  else {
    var index = parseInt(utils.location_hash()); 
    if(isNaN(index)) index = 1;
    return index;
  }
}

utils.scrollDistanceFromBottom = function() {
  return utils.pageHeight() - (window.pageYOffset + self.innerHeight);
}

utils.pageHeight = function() {
  return $("body").height();
}

var router = function() {
  var _this = this;

  var current_controller = null;
  var current_route = null;

  this.init = function() {
    $(window).bind("hashchange", function() {
      var route = utils.location_route();
      if(route == "") return;

      var parts = route.split("/");
      var controller_name = parts[0];
      var rest = parts.slice(1);
      console.log("controller_name ", controller_name);
      console.log("rest ", rest);
      console.log("hash ", utils.location_hash());

      if(route != current_route) {
        current_route = route;

        var controller = new controllers[controller_name](rest);

        if(current_controller) {
          current_controller.destroy();
          delete current_controller;
        }
        current_controller = controller;
        current_controller.init();
      }
      
      current_controller.render();
    }).trigger("hashchange");
  }
};

var controllers = {};

controllers.index = function() {
  var _this = this;

  var books = _.sortBy(store, "published_on").reverse();

  this.init = function() {
    console.log("starting index");
    $("#view-index").show();
  }

  this.render = function() {
    console.log("rendering");
    console.log(books);
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
    $("#view-index").hide();
  }
}

controllers.show = function(key) {
  var _this = this;

  var book = _.find(store, function(book) {
    return book.key == key;
  });
  console.log(book);

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
    $("#view-show").show();
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
    $("#view-show").hide();
  }
}

$(function() {
  $.getJSON("data.json").done(function(data) {
    if(data.length == 0) alert("No data.json, or data invalid.");

    store = data;

    window.router = new router();
    router.init();
    if(location.hash == "#" || location.hash == "") location.hash = "#index!1";
  });
});
