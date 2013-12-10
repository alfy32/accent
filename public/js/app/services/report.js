angular.module('accent').factory('report',
  function ($http, date) {
    
    var report = {
      appointments: {}
    };

    // var jan1 = date.getFirstDayOfYear();

    // jan1.setMonth(11);
    // jan1.setDate(8);

    // var sunday = date.getDate(jan1, 'sunday');
    // var nextSunday = date.addDays(new Date(sunday), 7);

    // while(sunday.getFullYear() < 2014) {
    //   getApointments(date.dateToJson(sunday), date.dateToJson(nextSunday), employee);

    //   date.addDays(sunday, 7);
    //   date.addDays(nextSunday, 7);
    // }

    report.getApointments = function(start, end, employee) {
      report.appointments = {};

      var url = '/westhost-appointments';

      if(employee) {
        url += '/'+employee;
      }

      $http.get(url + '?start=' + start + '&end=' + end).then(function(resp) {
        if(resp.data.success) {
          
          for(var i in resp.data.appointments) {
            var appointment = resp.data.appointments[i];
            start = date.getDate(appointment.date, 'sunday');
            start = date.dateToJson(start);
            
            if(!report.appointments[start])
              report.appointments[start] = {};

            var time = normalizeTime(appointment.startTime);
            var dayOfWeek = date.jsonToDate(appointment.date).getDay();

            var clientStrings = appointment.client.split(' ');

            var client = '';
            
            var MAX_LEN = 150;
            var i = 0;

            for(; i < clientStrings.length && getTextWidth(client + ' ' + clientStrings[i]) < MAX_LEN; i++) {
              client += ' ' + clientStrings[i];

              client = client.trim();
            }

            var leftOverIndex = -1;
            var leftOver = [];

            for(; i < clientStrings.length; i++) {
              if(leftOverIndex < 0 || getTextWidth(leftOver[leftOverIndex] + ' ' + clientStrings[i]) > MAX_LEN)
                leftOver[++leftOverIndex] = '';

              leftOver[leftOverIndex] += ' ' + clientStrings[i];

              leftOver[leftOverIndex] = leftOver[leftOverIndex].trim();
            }

            if(!report.appointments[start][date.days[dayOfWeek]])
              report.appointments[start][date.days[dayOfWeek]] = {}

            report.appointments[start][date.days[dayOfWeek]][time] = {
              appointment: appointment,
              date: appointment.date,
              time: time,
              blocks: appointment.endTime,
              client: client,
              employee: appointment.employee,
              title: appointment
            };

            if(leftOver.length) {
              var splitTime = time.split(':');
              var min = 15 + time[1];
              if(time)
              var time = time
            }

            for(var i = 0; i < leftOver.length; i++) {
              time = add15min(time);
              report.appointments[start][date.days[dayOfWeek]][time] = {
                appointment: appointment,
                date: appointment.date,
                time: time,
                blocks: appointment.endTime,
                client: leftOver[i],
                employee: appointment.employee,
                title: appointment
              };
            }

            time = add15min(time);

            while(unnormalizeTime(time) < appointment.endTime && 
                  !report.appointments[start][date.days[dayOfWeek]][time]) {
              console.log(unnormalizeTime(time), appointment.endTime)
              report.appointments[start][date.days[dayOfWeek]][time] = {
                appointment: appointment,
                date: appointment.date,
                time: time,
                blocks: appointment.endTime,
                client: 'x',
                employee: appointment.employee,
                title: appointment
              };
              time = add15min(time);
            }
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

    function unnormalizeTime(time) {
      var time = time.split(':');
      var hour = time[0];
      var min = time[1];

      if(hour < 7) hour = +hour+12
      if(hour < 10) hour = '0' + +hour;
      
      return hour + ':' + min + ':00';
    }
    

    return report;
  }
);

function jsonTimeToMin(time) {
  var splitTime = time.split(':');
}

function getTextWidth(text) {
  var div = $('<div>');

  div.css('display', 'inline-block');
  div.hide();

  $('body').append(div);

  div.text(text);

  var width = div.width();

  div.remove();

  return width;
}

function add15min(time) {
  time = time.split(':');
  var hr = time[0];
  var min = time[1];

  min = +min + 15;

  if(min >= 60) {
    min = '00';
    hr = +hr + 1;
  }

  if(+hr > 12) hr = '01';
  if(+hr < 10) hr = '0' + +hr;

  return hr + ':' + min
}