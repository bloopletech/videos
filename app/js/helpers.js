var helpers = {};

helpers.absoluteURL = function(url) {
  var a = document.createElement("a");
  a.href = url;
  return a.href;
};

helpers.playUrl = function(url) {
  if($.browser.android || $.browser.iphone) {
    return url;
  }
  else {
    return "play://" + helpers.absoluteURL(url);
  }
};

helpers.formatLengthNumeric = function(length) {
  var out = [];
  if(length >= 3600) {
    out.push(Math.floor(length / 3600) + "h");
    length = length % 3600;
  }
  if(length >= 60) {
    out.push(Math.floor(length / 60) + "m");
    length = length % 60;
  }
  if(length >= 1) {
    out.push(Math.floor(length) + "s");
  }
  return out.join(" ");
};

helpers.formatResolution = function(resolution) {
  if(resolution == "1080p") {
    return new Handlebars.SafeString('<span class="label label-success" title="Video Width/Height">' +
      '<span class="glyphicon ' + 'glyphicon-hd-video"></span> 1080p</span>');
  }
  else {
    return new Handlebars.SafeString('<span class="label label-default" title="Video Width/Height">' +
      resolution + '</span>');
  }
};

Handlebars.registerHelper('playUrl', helpers.playUrl);
Handlebars.registerHelper('formatLengthNumeric', helpers.formatLengthNumeric);
Handlebars.registerHelper('formatResolution', helpers.formatResolution);
