
/* jshint node: true*/
'use strict';

var config  = require('config');
var request = require('request');

var cc = config.couch;
var couchUrl = 'http://' + cc.host + ':' + cc.port + '/' + cc.db.appointments;

module.exports = function (app) {
  app.get('/appointments/:employee/:date', app.mw.loggedIn, getAppointments);
  app.post('/appointments', postAppointments);
};

function getAppointments (req, res) {
  var employee = req.route.params.employee;
  var date = req.route.params.date;

  if(!employee || !date) {
    return res.send({
      success: false,
      err: "Emplolyee and date are required"
    });
  }

  
}

function postAppointments (req, res) {
  var appointment = req.body;

  if(appointment.client) {

    if(appointment.id === undefined) {
      appointment.id = appointmentId++;
    }

    appointments[appointment.id] = appointment;   

    res.send({
      success: true,
      id: appointment.id
    });

  } else {
    res.send({
      success: false,
      msg: "The object was empty."
    });
  }
}