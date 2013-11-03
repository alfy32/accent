var nav = [
  {
    name: 'Schedule',
    url: '/',
    ctrl: 'scheduleCtrl',
    tmpl: 'views/schedule.html'
  }
];

angular.module('accent').factory('nav',
  function () {
    return nav;
  }
);
