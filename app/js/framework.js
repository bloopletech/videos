var utils = {};

utils.locationRoute = function(val) {
  if(arguments.length == 1) location.hash = "#" + val + "!" + utils.locationHash();
  else return location.hash.substr(1).split("!")[0];
};

utils.locationController = function(val) {
  if(arguments.length == 1) location.hash = "#" + [val].concat(utils.locationParams()).join("/") + "!" + utils.locationHash();
  else return utils.locationRoute().split("/")[0];
};

utils.locationParams = function(array) {
  if(arguments.length == 1) location.hash = "#" + [utils.locationController()].concat(array).join("/") + "!" + utils.locationHash();
  return utils.locationRoute().split("/").slice(1);
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

utils.paginate = function(array, perPage) {
  var page = utils.page();
  return array.slice((page - 1) * perPage, page * perPage);
}

var router = function() {
  var _this = this;

  var currentController = null;
  var currentRoute = null;

  this.init = function() {
    $(window).bind("hashchange", function() {
      var route = utils.locationRoute();
      if(route == "") return;

      if(route != currentRoute) {
        console.log("changing route from ", currentRoute, " to ", route);
        currentRoute = route;

        if(currentController) {
          currentController.destroy();
          delete currentController;
        }

        var controllerFunction = controllers[utils.locationController()];
        currentController = new (controllerFunction.bind.apply(controllerFunction, [null].concat(utils.locationParams())));
        currentController.init();
      }
      
      currentController.render();
    }).trigger("hashchange");
  }
};

var controllers = {};
