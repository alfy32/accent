angular.module('accent').controller('reportCtrl',
  function ($scope, report, date) {

    $scope.times = makeTimes();

    $scope.report = report;

    $scope.date = date;
  }
);
