var nav = [
  {
    name: 'Login',
    url: '/',
    ctrl: 'loginCtrl',
    tmpl: 'views/login.html'
  },
  {
    name: 'Schedule',
    url: '/schedule',
    ctrl: 'scheduleCtrl',
    tmpl: 'views/schedule.html'
  },
  {
    name: 'Tax Report',
    url: '/tax-report',
    ctrl: 'reportCtrl',
    tmpl: 'views/report.html'
  }
];

angular.module('accent').factory('nav',
  function () {
    return nav;
  }
);
