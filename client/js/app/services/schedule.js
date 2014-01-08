angular.module('accent').factory('schedule',
  function ($http, hours, appointments) {
    var s = {
      items: {}
    };

    var employees = [
      'Jill','Mary','Marva','Sindy', 
      '','','Kortney',''      
    ];

    for(var i in employees) {
      var employee = employees[i];

      s.items[employee] = {};

      for(var j in hours.times) {
        var time = hours.times[j].time;

        s.items[employee][time] = {};
      }
    }

    return s;
  }
);