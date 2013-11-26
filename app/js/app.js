var store = null;

$(function() {
  $(document).on("dragstart", "a, img", false);

  $("#page-back").click(function(e) {
    e.stopPropagation();
    utils.page(utils.page() - 1);
  });
  $("#page-back-10").click(function(e) {
    e.stopPropagation();
    utils.page(utils.page() - 10);
  });
  $("#page-next").click(function(e) {
    e.stopPropagation();
    utils.page(utils.page() + 1);
  });
  $("#page-next-10").click(function(e) {
    e.stopPropagation();
    utils.page(utils.page() + 10);
  });
  $("#page-home").click(function(e) {
    e.stopPropagation();
    if(lastControllerLocation != "") {
      location.hash = lastControllerLocation;
    }
    else {
      window.close();
    }
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
