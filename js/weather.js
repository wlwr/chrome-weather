function Weather() {
  this.city = this.getCity();
  this.url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q='+this.city+',china&lang=zh_cn';
}

Weather.prototype.setCity = function(city) {
  localStorage.city = city;
}

Weather.prototype.getCity = function() {
  return localStorage.city || 'guangzhou';
}

Weather.prototype.makeRequest = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  var _this = this;
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
          callback(xhr.responseText, _this);
      }
  }
  xhr.send();
}

Weather.prototype.setIcon = function() {
  this.makeRequest(this.url, this.renderIcon);
}


Weather.prototype.renderIcon = function(res, _this) {
  res = JSON.parse(res);
  if (res.cod == 200) {
    var todayWeather = res.list[0].weather[0];
    chrome.browserAction.setIcon({path: 'img/weather/' + todayWeather.icon + '.png'});
  } 
}

Weather.prototype.setPopup = function() {
  this.makeRequest(this.url, this.renderPopup);
}

Weather.prototype.renderPopup = function(res, _this) {
  res = JSON.parse(res);
  if (res.cod == 200) {
    var list = res.list;
    var html = '';
    for (var i = 0, l = list.length; i < l; i++) {
      var item = list[i];
      html += '<div class="item">'
      html += '<p>' + _this.timeFormat('星期X', item['dt']) + (i == 0 ? ' (今天)' : '') + '</p>';
      html += '<img src="img/weather/' + item.weather[0].icon + '.png">';
      html += '<p>' + Math.round(list[i].temp.min-273.15)+' ～ ' + Math.round(list[i].temp.max-273.15) + ' °C </p>'; 
      html += '<p class="desc">' + item.weather[0].description + '</p></div>';
    };
    document.getElementById('weather-list').innerHTML = html;
  } 
}

Weather.prototype.timeFormat = function(format, timestamp) {
  var t = timestamp ? new Date(timestamp * 1000) : new Date();
  var i, f = {},
    week = ['', '一', '二', '三', '四', '五', '六', '日'];
  f.Y = t.getFullYear();
  f.n = t.getMonth() + 1;
  f.m = f.n < 10 ? '0' + f.n.toString() : f.n;
  f.j = t.getDate();
  f.d = f.j < 10 ? '0' + f.j.toString() : f.j;
  f.G = t.getHours();
  f.H = f.G < 10 ? '0' + f.G.toString() : f.G;
  i = t.getMinutes();
  f.i = i < 10 ? '0' + i.toString() : i;
  i = t.getSeconds();
  f.s = i < 10 ? '0' + i.toString() : i;
  f.N = t.getDay() === 0 ? 7 : t.getDay();
  f.X = week[f.N];
  for (i in f) {
    format = format.replace(i, f[i]);
  }
  return format;
}
