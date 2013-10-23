var store = null;

$(function() {
  $("#page-back").click(function() {
    utils.page(utils.page() - 1);
  });
  $("#page-next").click(function() {
    utils.page(utils.page() + 1);
  });
  $("#page-home").click(function() {
    location.hash = lastControllerLocation;
  });

  $(window).keydown(function(event) {
    if(event.keyCode == 39 || ((event.keyCode == 32 || event.keyCode == 13)
      && utils.scrollDistanceFromBottom() <= 0)) {
      event.preventDefault();
      utils.page(utils.page() + 1);
    }
    else if(event.keyCode == 8 || event.keyCode == 37) {
      event.preventDefault();
      utils.page(utils.page() - 1);
    }
  });

  $.getJSON("data.json").done(function(data) {
    if(data.length == 0) alert("No data.json, or data invalid.");

    store = data;

    window.router = new router();
    router.init();
    if(location.hash == "#" || location.hash == "") location.hash = "#index!1";
  });
});
