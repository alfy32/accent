var request = require('request');

module.exports = function (app) {
  app.get('/westhost-appointments', getWesthostAppointments);
  app.get('/westhost-appointments/:employee', getWesthostAppointments);
};

function getWesthostAppointments(req, res) {
  var start = req.query.start;
  var end = req.query.end;

  var employee = req.params.employee;  

  var url = 'http://accent.westhostsite.com/data/json.php';

  if(!start || !end) {
    return res.send({
      success: false,
      err: 'Start and end date are required.'
    });
  }

  url += '?start='+start+'&end='+end;

  if(employee)
    url += '&employee=' + employee;

  request(url, function(err, resp, data) {
    if(err) {
      return res.send({
        success: false,
        err: err
      });
    }

    res.send(JSON.parse(data));
  });
};