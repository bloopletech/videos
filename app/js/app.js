var lc = new Lawnchair({ record: "books", name: "book" });

function scrollDistanceFromBottom() {
  return pageHeight() - (window.pageYOffset + self.innerHeight);
}

function pageHeight() {
  return $("body").height();
}

var router = function() {
  var _this = this;

  var current_controller = null;
  var current_route = null;

  this.location_route = function(val) {
    if(arguments.length == 1) location.hash = "#" + val + "!" + this.location_hash();
    else return location.hash.substr(1).split("!")[0];
  }

  this.location_hash = function(val) {
    if(arguments.length == 1) location.hash = "#" + this.location_route() + "!" + val;
    else return location.hash.substr(1).split("!")[1];
  }

  this.go = function(url) {
    location.hash = url;
  }

  this.init = function() {
    $(window).bind("hashchange", function() {
      var route = _this.location_route();
      if(route == "") return;

      if(route == current_route) return;
      current_route = route;

      var parts = route.split("/");
      var controller_name = parts[0];
      var rest = parts.slice(1);
      console.log("controller_name ", controller_name);
      console.log("rest ", rest);

      var controller = new controllers[controller_name](rest);

      if(current_controller) current_controller.destroy();
      current_controller = controller;
      current_controller.run();
    }).trigger("hashchange");
  }
};

var controllers = {};

controllers.index = function() {
  var _this = this;

  this.run = function() {
    console.log("starting index");

    lc.where("true").desc("published_on", function(books) {
      $.each(books, function(_, book) {
        var item = $("<li>");
        var link = $("<a>");
        link.attr("href", "#show/" + book.key);
        var img = $("<img>");
        img.attr("src", book.thumbnail_url);
        link.append(img);
        item.append(link);
        $("#items").append(item);
      });
    });

    $("#view-index").show();
  }

  this.destroy = function() {
    console.log("destroying index");
    $("#view-index").hide();
  }
}

controllers.show = function(key) {
  var _this = this;

  //var book = lc.get(key);
  var book = lc.store[key]; //HACK!
  console.log(book);

  this.run = function() {
    console.log("starting show");

    function get_index()
    {
      var index = parseInt(router.location_hash()); 
      if(isNaN(index)) index = 0;
      return index;
    }

    function go_next_page()
    {
      var index = get_index();
      index += 1;

      if(index >= book.page_urls.length) index = book.page_urls.length - 1;
      router.location_hash(index);
    }

    $(window).bind('hashchange.show', function()
    {
      var index = get_index();

      $("#image").attr('src', "img/blank.png");    
      window.scrollTo(0, 0);
      $("#image").attr('src', book.page_urls[index]);

      if((index + 1) < book.page_urls.length)
      {
        preload = new Image();
        preload.src = book.page_urls[index + 1];      
      }
        
    }).trigger('hashchange.show');

    $(window).bind("keydown.show", function(event)
    {
      if((event.keyCode == 32 || event.keyCode == 13) && scrollDistanceFromBottom() <= 0)
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

  this.destroy = function() {
    console.log("destroying show");
    $(window).unbind(".show");
    $("#view-show").unbind("click");
    $("#view-show").hide();
  }
}



$(function() {
  $.getJSON("data.json").done(function(data) {
    if(data.length == 0) {
      alert("No data.json, or data invalid.");
    }

    for(var i = 0; i < data.length; i++) {
      lc.save(data[i]);
    }

    window.router = new router();
    router.init();
    router.go("index");
  });
});
