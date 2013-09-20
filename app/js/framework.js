var utils = {};

utils.location_route = function(val) {
  if(arguments.length == 1) location.hash = "#" + val + "!" + utils.location_hash();
  else return location.hash.substr(1).split("!")[0];
};

utils.location_hash = function(val) {
  if(arguments.length == 1) location.hash = "#" + utils.location_route() + "!" + val;
  else return location.hash.substr(1).split("!").slice(1);
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
  return $(".current-view").height();
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
        //open a new tab
      }
      
      current_controller.render();
    }).trigger("hashchange");
  }
};

var controllers = {};
