angular.module('accent').controller('scheduleCtrl',
  function ($scope, appointments) {

  	$scope.times = makeTimes();

  	$scope.employee = makeEmployee();

  	$scope.cols = makeCols($scope.employee);

  	$scope.appointments = makeAppointment($scope.employee, $scope.times, $scope);

  	appointments.get(function (data) {
  		for(var key in data) {
  			if(data[key] && data[key].id) {
  				addAppointment($scope.appointments, data[key]);
  			}
  		}
  	});

  	$scope.enter = function(employee, hour, min) {
  		var appointment = $scope.appointments[employee][getTimeLabel(hour, min)];

  		if(appointment.taken && appointment.child) {
        appointment.label = appointment.child ? 'x' : appointment.label;
      } else {

	  		clearChildren(appointment);

	  		if(appointment.label) {

		  		appointment.name = appointment.label;
		  		appointment.time = getTimeLabel(hour, min);
		  		appointment.employee = employee;
		  		appointment.taken = true;
		  		appointment.child = false;
		  		
		  		checkNameForBlocks(appointment);

		  		addChildren($scope.appointments, appointment);
		  	} else {
		  		appointment.taken = false;
		  	}
		  }
  	};

  	$scope.enterBlur = function(employee, hour, min) {
  		var appointment = $scope.appointments[employee][getTimeLabel(hour, min)];

      if(!appointment.child && appointment.label) {

	  		appointments.save(appointment, function (data) {
	  			if(data.success) {
	  				appointment.id = data.id
	  			} 
	  		});
	  	}
  	};

  }
);

function checkNameForBlocks(appointment) {
	var name = appointment.name;
	var blocks = +appointment.blocks || 2;

	if(name.match(/\b15\b/)) {  
		name = name.replace(/\s+15\b|\b15\b/, '');
		blocks = 1;
	} else if(name.match(/\b30\b/)) {  
		name = name.replace(/\s+30\b|\b30\b/, '');
		blocks = 2;
	} else if(name.match(/\b45\b/)) {  
		name = name.replace(/\s+45\b|\b45\b/, '');
		blocks = 3;
	} else if(name.match(/\bhr\b/)) { 
		name = name.replace(/\s+hr\b|\bhr\b/, '');
		blocks = 4;
	} else if(name.match(/\b2hr\b/)) {  
		name = name.replace(/\s+2hr\b|\b2hr\b/, '');
		blocks = 8;
	} else if(name === '') {
		blocks = 0;
	} 

  appointment.name = name;
	appointment.label = name;
	appointment.blocks = blocks;
}

function clearChildren(appointment) {
	if(appointment.children) {
		for(var key in appointment.children) {
			var child = appointment.children[key];

			child.label = '';
			child.taken = false;
  		}
	}

	appointment.children = [];
}

function addChildren(appointments, appointment) {
	var blocks = appointment.blocks;
	var time = appointment.time.split(":");
	var hour = +time[0];
	var min = +time[1];

	appointment.children = [];

	for(var i = 1; i < blocks; i++) {
		min = min + 15;
		if(min >= 60) {
			min = 0;
			hour++;
			if(hour > 12)
				hour = 1;
		}
		var a = appointments[appointment.employee][getTimeLabel(hour, min)];

		if(i > 1 && a.taken === true) {
			alert("You are trying to overlap another appointment. I will stop at " 
					+ i + " appointment blocks. Instead of " + blocks + ".");
		
			appointment.blocks = i;
			break;
		}

		a.label = 'x';
		a.taken = true;
		a.child = true;

		appointment.children.push(a);
	}
}

function addAppointment(appointments, appointment) {
	addChildren(appointments, appointment);

	appointments[appointment.employee][appointment.time] = appointment;
}

function getTimeLabel(hour, min) {
	return pad2Digits(hour) + ":" + pad2Digits(min);
}

function pad2Digits(num) {
	num = +num;
	return num < 10 ? "0" + num : "" + num;
}

function makeAppointment(employees, times, scope) {
	appointment = {};

	for(var key in employees) {
		var employee = employees[key].name;
		appointment[employee] = {};
		for(var key in times) {
			var time = times[key].label;
			appointment[employee][time] = {};

		
		}
	}

  	return appointment;
}

function makeTimes() {
	var times = [];

	timesLoops(times, 8, 11, 'AM');
	timesLoops(times, 12, 12, 'PM');
	timesLoops(times, 1, 5, 'PM');	

  	return times;
}
function timesLoops(times, start, end, am) {

	var min = ['00','15','30','45'];

	for(var hour = start; hour <= end; hour++) {

  		var hourStr = hour < 10 ? "0" + hour : "" + hour;

  		for(var key in min) {

  			var minStr = min[key];

  			times.push({
	  			clazz: minStr == '00' ? 'td-top' : '',
	  			hour: hour,
	  			min: minStr,
	  			label: hourStr + ":" + minStr,
	  			am: am
	  		});
  		}
  	}
}

function makeEmployee() {
	var employee = [
		{
			name: 'Jill',
		},
		{
			name: 'Mary',
		},
		{
			name: 'Marva',
		},
		{
			name: 'Sindy',
		},
		{
			name: '',
		},
		{
			name: '',
		},
		{
			name: 'Kortney',
		},
		{
			name: '',
		}
	];

	return employee;
}

function makeCols(employees) {
	var cols = [];

	for(var i = 0; i < 8; i++) {
		cols.push({
			employee: employees[i].name
		});
	}

	return cols;
}
