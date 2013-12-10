angular.module('accent').factory('report',
  function ($http, date) {
    
    var report = {};

    var jan1 = date.getFirstDayOfYear();

    jan1.setMonth(11);
    // jan1.setDate(8);

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
          if(!report[start])
            report[start] = {};
          
          for(var i in resp.data.appointments) {
            var appointment = resp.data.appointments[i];

            var time = normalizeTime(appointment.startTime);
            var dayOfWeek = date.jsonToDate(appointment.date).getDay();

            var clientStrings = appointment.client.split(' ');

            var client = '';
            
            var MAX_LEN = 20;
            var i = 0;

            for(; i < clientStrings.length && client.length + clientStrings[i].length < MAX_LEN; i++) {
              client += ' ' + clientStrings[i];
            }



            // if(client.length >= MAX_LEN) {
            //   client = client.substr(0,MAX_LEN);
            // }

            if(!report[start][date.days[dayOfWeek]])
              report[start][date.days[dayOfWeek]] = {}

            report[start][date.days[dayOfWeek]][time] = {
              date: appointment.date,
              time: time,
              blocks: appointment.endTime,
              client: client,
              employee: appointment.employee,
              clientFull: appointment.client
            };
          }
        } else {
          console.log('Failed to get westhost appointments.', resp.data.err);
        }
      });
        
    }

    function normalizeTime(time) {
      var time = time.split(':');
      var hour = ((time[0]-1)%12+1);
      var min = time[1];

      if(hour < 10) hour = '0' + hour;
      
      return hour + ':' + min;
    }
    

    return report;
  }
);

function jsonTimeToMin(time) {
  var splitTime = time.split(':');
}