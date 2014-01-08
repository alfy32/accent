angular.module('accent').factory('users',
  function ($http) {
    var users = {};

    users.login = function (name, pass, cb) {
      $http.post('/login', {
        name: name,
        pass: pass
      }).then(function (resp) {
        console.log('data', resp.data);
        if(resp.data.success) {
          users.user = resp.data.user;
        }
        else {
          users.user = {};
        }

        cb(resp.data.success);
      });
    };

    return users;
  }
);