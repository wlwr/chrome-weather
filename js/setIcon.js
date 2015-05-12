var weather = new Weather();
weather.setIcon();

setInterval(function() {
  weather.setIcon();
}, 1000000);