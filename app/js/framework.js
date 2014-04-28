var utils = {};

utils.location = function(changes) {
  if(arguments.length == 1) {
    var output = _.extend(utils.location(), changes);
    location.hash = "#" + [output.controller].concat(output.params).join("/") + "!" + output.hash;
  }
  else {
    var route_hash = location.hash.substr(1).split("!");
    var route = route_hash[0];
    var controller = route.split("/")[0];
    var params = route.split("/").slice(1);
    var hash = route_hash.slice(1).join("!");
    return {
      route: route, //Don't set this
      controller: controller,
      params: params,
      hash: hash
    };
  }
}

utils.page = function(index, max) {
  if(arguments.length == 2) {
    if(isNaN(index) || index < 1) index = 1;
    if(index > max) index = max;
    utils.location({ hash: index });
  }
  else if(arguments.length == 1) {
    utils.location({ hash: index });
  }
  else {
    var index = parseInt(utils.location().hash);
    if(isNaN(index) || index < 1) index = 1;
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

utils.pages = function(array, perPage) {
  return Math.ceil(array.length / (perPage + 0.0));
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
    _.each(controllers, function(controller) {
      controller.setup();
    });

    $(window).bind("hashchange", function() {
      var route = utils.location().route;
      if(route == "") return;

      if(route != currentRoute) {
        console.log("changing route from ", currentRoute, " to ", route);
        currentRoute = route;

        if(currentController) {
          currentController.destroy();
          delete currentController;
        }

        var controllerFunction = controllers[utils.location().controller];
        currentController = new (controllerFunction.bind.apply(controllerFunction, [null].concat(utils.location().params)));
        currentController.init();
      }
      
      currentController.render();
    }).trigger("hashchange");
  }
};

var controllers = {};
