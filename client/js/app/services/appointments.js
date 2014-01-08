angular.module('accent').factory('appointments',
  function ($http) {
    var a = {
      appointments: {}
    };

    a.add = function (appointment) {
      post(appointment);
    };

    a.update = function (appointment) {
      post(appointment);
    };

    a.remove = function (appointment) {
      delete a.appointments[appointment.date][appointment._id];

      $http.delete('/appointments', appointment).then(function (resp) {
        if(reps.data.success) {

        }
        else {
          console.log('Failed to delete appointment: ', appointment);
        }
      })
    };

    function get(date) {
      $http.get('/appointments/' + date).then(function (resp) {
        if(resp.data.success) {
          a.appointments[date] = {};

          for(var i in resp.data.rows) {
            var appointment = resp.data.rows[i];

            a.appointments[date][appointment.id] = appointment.value;
          }
        }
        else {
          console.log("Cannot get appointments.");
        }
      });
    }

    function post(appointment) {
      $http.post('/appointments', appointment).then(function (resp) {
        if(resp.data.success) {
          appointment._id = resp.data.id;
          appointment._rev = resp.data.rev;

          a.appointments[appointment.date][appointment._id] = appointment;
        } 
        else {
          console.log("Save appointment failed.");
        }
      });
    }

    get('2014-01-06');
    get('2014-01-07');
    get('2014-01-08');

    return a;
  }
);
