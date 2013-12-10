angular.module('accent').factory('report',
  function ($http, date) {
    
    var report = {};

    var jan1 = date.getFirstDayOfYear();
    
    var sunday = date.getDate(jan1, 'sunday');
    var nextSunday = date.addDays(new Date(sunday), 7);

    while(sunday.getFullYear() < 2014) {
      getApointments(date.dateToJson(sunday), date.dateToJson(nextSunday), 'Jill');

      date.addDays(sunday, 7);
      date.addDays(nextSunday, 7);
    }

    function getApointments(start, end, employee) {
      var url = '/westhost-appointments';

      if(employee) {
        url += '/'+employee;
      }

      $http.get(url + '?start=' + start + '&end=' + end).then(function(resp) {
        if(resp.data.success) {
          report[start] = resp.data.appointments;
          console.log(start, resp.data.appointments)
        } else {
          console.log('Failed to get westhost appointments.', resp.data.err);
        }
      });
        
    }
    

    return report;
  }
);