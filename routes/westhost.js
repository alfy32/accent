var request = require('request');

module.exports = function (app) {
  app.get('/westhost-appointments', getWesthostAppointments);
};

function getWesthostAppointments(req, res) {
  request('http://accent.westhostsite.com/data/json.php', function(err, resp, data) {
    if(err) {
      return res.send({
        success: false,
        err: err
      });
    }

    res.send({
      success: true,
      appointments: JSON.parse(data)
    });
  });
};