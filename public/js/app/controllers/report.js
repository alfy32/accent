angular.module('accent').controller('reportCtrl',
  function ($scope, report, date) {

    $scope.times = makeTimes();

    $scope.report = report;

    $scope.date = date;

    $scope.start = '2013-12-01';
    $scope.end = '2013-12-31';
    $scope.employee = 'Jill';
  }
);
