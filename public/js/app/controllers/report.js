angular.module('accent').controller('reportCtrl',
  function ($scope, report) {

    $scope.times = makeTimes();

    $scope.report = report;
  }
);

function makeTimes() {
  var times = [];
  var min = ['00','15','30','45'];

  function timesLoops(times, start, end, am) {
    for(var hour = start; hour <= end; hour++) {
      for(var key in min) {
        times.push({
          class: min[key] == '00' ? 'td-top' : '',
          hour: hour,
          min: min[key],
          label: getTimeLabel(hour, min[key]),
          am: am
        });
      }
    }
  }

  timesLoops(times, 8, 11, 'AM');
  timesLoops(times, 12, 12, 'PM');
  timesLoops(times, 1, 5, 'PM');

  return times;
}
