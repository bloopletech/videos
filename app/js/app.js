var data = [];

function scrollDistanceFromBottom() {
  return pageHeight() - (window.pageYOffset + self.innerHeight);
}

function pageHeight() {
  return $("body").height();
}

var router = function() {
  var current_controller = null;
  var current_pathname = null;

  this.go = function(url) {
    history.pushState(null, null, url);
    $(window).trigger("popstate");
  }

  $(window).bind("popstate", function() {
    if(location.pathname == current_pathname) return;
    current_pathname = location.pathname;

    var parts = location.pathname.split("!");
    if(parts.length == 1) return;
    var controller_name = parts[1];
    var rest = parts.slice(2);
    console.log("controller_name ", controller_name);
    console.log("rest ", rest);

    var controller = new controllers[controller_name](rest);

    if(current_controller) current_controller.destroy();
    current_controller = controller;
    current_controller.run();
  });

  $("body").on("click", "a[data-routable]", function(event) {
    console.log("href ", this.href);
    window.router.go(this.href);
    event.preventDefault();
  });
};

var controllers = {};

controllers.index = function() {
  var _this = this;

  this.run = function() {
    console.log("starting index");

    for(var i = 0; i < 100; i++) {
      var item = $("<li>");
      var link = $("<a>");
      link.attr("href", "!show!" + i);
      link.attr("data-routable", "true");
      var img = $("<img>");
      img.attr("src", window.data[i].thumbnail_url);
      link.append(img);
      item.append(link);
      $("#items").append(item);
    }

    $("#view-index").show();
  }

  this.destroy = function() {
    console.log("destroying index");
    $("#view-index").hide();
  }
}

controllers.show = function(index) {
  var _this = this;

  var book = window.data[parseInt(index)];
  console.log(book);

  this.run = function() {
    console.log("starting show");

    function get_index()
    {
      var index = parseInt(location.hash.substr(1)); 
      if(isNaN(index)) index = 0;
      return index;
    }

    function go_next_page()
    {
      var index = get_index();
      index += 1;

      if(index >= book.page_urls.length) index = book.page_urls.length - 1;
      location.hash = "#" + index;
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

    $("#view-show").click(go_next_page);
    $("#view-show").show();
  }

  this.destroy = function() {
    console.log("destroying show");
    $(window).unbind(".show");
    $("view-show").hide();
  }
}



$(function() {
  window.router = new router();

  $.getJSON("data.json").done(function(data) {
    window.data = data;

    if(window.data.length == 0) {
      alert("No data.json, or data invalid.");
    }

    router.go("!index");
  });
});
