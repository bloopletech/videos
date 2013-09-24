var utils = {};

utils.locationRoute = function(val) {
  if(arguments.length == 1) location.hash = "#" + val + "!" + utils.locationHash();
  else return location.hash.substr(1).split("!")[0];
};

utils.locationHash = function(val) {
  if(arguments.length == 1) location.hash = "#" + utils.locationRoute() + "!" + val;
  else return location.hash.substr(1).split("!").slice(1).join("!");
};

utils.page = function(index, max) {
  if(arguments.length == 2) {
    if(isNaN(index)) index = 1;
    if(index > max) index = max;
    utils.locationHash(index);
  }
  else if(arguments.length == 1) {
    utils.locationHash(index);
  }
  else {
    var index = parseInt(utils.locationHash());
    if(isNaN(index)) index = 1;
    return index;
  }
}

utils.scrollDistanceFromBottom = function() {
  return utils.pageHeight() - (window.pageYOffset + self.innerHeight);
}

utils.pageHeight = function() {
  return $(".current-view").height();
}

utils.nearBottomOfPage = function() {
  return utils.scrollDistanceFromBottom() < 250;
}

var router = function() {
  var _this = this;

  var currentController = null;
  var currentRoute = null;

  this.init = function() {
    $(window).bind("hashchange", function() {
      var route = utils.locationRoute();
      if(route == "") return;

      var parts = route.split("/");
      var controllerName = parts[0];
      var rest = parts.slice(1);
      console.log("controllerName ", controllerName);
      console.log("rest ", rest);
      console.log("hash ", utils.locationHash());

      if(route != currentRoute) {
        console.log("changing route from ", currentRoute, " to ", route);
        currentRoute = route;

        var controller = new controllers[controllerName](rest);

        if(currentController) {
          currentController.destroy();
          delete currentController;
        }
        currentController = controller;
        currentController.init();
        //open a new tab
      }
      
      currentController.render();
    }).trigger("hashchange");
  }
};

var controllers = {};
