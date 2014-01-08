angular.module('accent').factory('hours',
  function ($http) {
    var hours = {
      start: 800,
      end: 900,
      times: []
    };

    for(var time = hours.start; time < hours.end; time += 15) {
      var hour = Math.floor(time/100);
      var min = time%100;
      var am = 'AM';

      if(hour >= 12)  am    = 'PM';
      if(hour > 12)   hour  = hour - 12;
      if(min < 10)    min   = '0' + min;

      hours.times.push({
        time: time,
        hour: hour,
        min: min,
        am: am
      });

      if(time%100 == 45)
        time += 40;
    }

    return hours;
  }
);