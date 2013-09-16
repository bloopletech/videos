var data = [];

$(function() {
  $.getJSON("data.json").done(function(data) {
    window.data = data;

    if(window.data.length == 0) {
      alert("No data.json, or data invalid.");
    }

    for(var i = 0; i < data.length; i++) {
      var item = $("<li>");
      var link = $("<a>");
      link.attr("href", data[i].page_urls[0]);
      link.text(data[i].title);
      item.append(link);
      $("#items").append(item);
    }
  });
});


function scrollDistanceFromBottom() {
  return pageHeight() - (window.pageYOffset + self.innerHeight);
}

function pageHeight() {
  return $("body").height();
}
