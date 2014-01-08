
/* jshint node: true*/
'use strict';

var config  = require('config');
var request = require('request');

var cc = config.couch;
var couchUrl = 'http://' + cc.host + ':' + cc.port + '/' + cc.db.appointments;

module.exports = function (app) {
  app.get('/appointments/:date/:employee?', /*app.mw.loggedIn,*/ getAppointments);
  app.post('/appointments', postAppointment);
  app.delete('/appointments', deleteAppointment);
};

function getAppointments(req, res) {
  var employee = req.route.params.employee;
  var date = req.route.params.date;

  if(!date)
    return _fail(res, "Date is required in the url");

  var doc,key;
  
  if(!employee) {
    doc = '_design/appointments/_view/date';
    key = '"' + date + '"';
  }
  else {
    doc = '_design/appointments/_view/employee-date';
    key = '["' + employee + '","' + date + '"]';
  }

  request(couchUrl + '/' + doc + '?key=' + key, function (err, resp, body) {
    if (err) return _fail(res, err);

    body = JSON.parse(body);

    if (body.error) {
      return _fail(res, 'Database error: ' + body.error);
    }

    res.send({
      success: true,
      rows: body.rows
    });
  });
}

function postAppointment(req, res) {
  var appointment = req.body;

  request({
    url: couchUrl,
    method: 'POST',
    json: appointment
  }, function (err, resp, body) {
    if(err) return _fail(res, err);

    try {
      body = JSON.parse(body);
    } catch(e) {}

    if(body.error) {
      return _fail(res, 'Database error: ' + body.error);
    }

    body.success = body.ok;

    res.send(body);
  });
}

function deleteAppointment(req, res) {
  var id = req.body.id || req.body._id;
  var rev = req.body.rev || req.body._rev;

  if(!id || !rev)
    return _fail(res, "body must have id and rev");

  request({
    url: couchUrl + '/' + id + '?rev=' + rev,
    method: 'DELETE',
    json: {
      id: id,
      rev: rev
    }
  }, function (err, resp, body) {
    if(err) return _fail(res, err);

    try {
      body = JSON.parse(body);
    } catch(e) {}

    if(body.error) {
      return _fail(res, body.error);
    }

    res.send({
      success: true
    });
  });
}

function _fail(res, err) {
  res.send({
    success: false,
    err: err
  });
}