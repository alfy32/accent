angular.module('accent').directive('header',
  function () {

    return {
      templateUrl: 'views/header.html',
      controller: 'headerCtrl'
    };
  }
);
