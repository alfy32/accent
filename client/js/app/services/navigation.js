var nav = [
  {
    name: 'Schedule',
    url: '/',
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
