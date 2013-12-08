angular.module('accent').factory('report',
  function ($http) {
    
    var report = {};

    $http.get('/westhost-appointments').then(function(resp) {
      if(resp.data.success) {
        report.appointments = resp.data.appointments;
        console.log(resp.data)
      } else {
        console.log('Failed to get westhost appointments.');
      }
    });

    return report;
  }
);