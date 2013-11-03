module.exports = function (app) {
	app.get('/appointments', getAppointments);
	app.post('/appointments', postAppointments);
};

var appointments = {};

var appointmentId = 1;

function getAppointments (req, res) {
  res.send(appointments);
}

function postAppointments (req, res) {
	var appointment = req.body;

  if(appointment.label) {

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