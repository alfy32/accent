angular.module('accent').factory('appointments',
  function ($http) {

    function save(appointment, cb) {
      var a = {
        label: appointment.label,
        name: appointment.name,
        time: appointment.time,
        employee: appointment.employee,
        blocks: appointment.blocks,
        id: appointment.id
      };

      $http.post('/appointments', a).then(function (resp) {
        cb(resp.data);
      });
    }

    function get(cb) {
      $http.get('/appointments').then(function (resp) {
        cb(resp.data);
      });
    }





    function set(foodItems, cb) {
      $http.post('/foodItems', foodItems).then(function (resp) {
        if(resp.data === "ok") {
          cb("Saved Successfully.");
        } else {
          cb(resp);
        }
      });
    }

    function update(foodItem, cb) {
      $http.put('/foodItem/'+foodItem._id, foodItem).then(function (resp) {
        cb(resp.data);
      })
    }

    function create(foodItem, cb) {
      $http.post('/foodItem', foodItem).then(function (resp) {
        cb(resp.data);
      })
    }

    function remove(id, cb) {
      $http.delete('/foodItem/' + id).then(function (resp) {
        cb(resp.data);
      })
    }

    return {
      save: save,
      get: get
    };
  }
);
