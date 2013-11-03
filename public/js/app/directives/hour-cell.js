angular.module('accent').directive('hourCell',
  function () {

    return {
      templateUrl: 'views/hour-cell.html',
      controller: 'hourCellCtrl'
    };
  }
);