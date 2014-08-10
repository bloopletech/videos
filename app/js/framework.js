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
          $(".current-view .navbar-content").append($("#navbar-content-target").contents().detach());
          currentController.destroy();
          delete currentController;
        }

        var controllerFunction = controllers[utils.location().controller];
        currentController = new (controllerFunction.bind.apply(controllerFunction, [null].concat(utils.location().params)));
        currentController.init();
        $("#navbar-content-target").empty().append($(".current-view .navbar-content").contents().detach());
      }

      currentController.render();
    }).trigger("hashchange");
  }
};

var controllers = {};
