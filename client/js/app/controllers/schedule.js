angular.module('accent').controller('scheduleCtrl',
  function ($scope, appointments) {

    $scope.who = makeWho();
  	$scope.times = makeTimes();
  	$scope.employees = makeEmployees();
  	$scope.cols = makeCols($scope.employees);
  	$scope.schedule = makeSchedule($scope.employees, $scope.times, $scope);

  	appointments.get(function (data) {
  		for(var key in data) {
  			if(data[key] && data[key].id) {
  				addAppointment($scope.schedule, data[key]);
  			}
  		}
  	});

  	$scope.change = function(employee, time) {
  		var scheduleItem = $scope.schedule[employee][time.label];

      if(scheduleItem.taken && scheduleItem.child) {
        scheduleItem.label = 'x';
      } else {

        clearChildren(scheduleItem);

        if(scheduleItem.label) {
          var blocks = checkLabelForBlocks(scheduleItem);
          scheduleItem.employee = employee;
          scheduleItem.time = time.label;

          if(scheduleItem.appointment) {
            updateAppointment(scheduleItem, blocks);
          } else {
            makeAppointment(scheduleItem, blocks);
          }
          scheduleItem.taken = true;
          scheduleItem.child = false;

          addChildren($scope.schedule, scheduleItem);
        } else {
          scheduleItem.taken = false;
        }
      }
  	};

    $scope.enterBlur = function(employee, time) {
      var scheduleItem = $scope.schedule[employee][time.label];

      if(!scheduleItem.child && scheduleItem.label) {
        appointments.save(scheduleItem.appointment);
      }
    };

    $scope.click = function(employee, time) {
      var scheduleItem = $scope.schedule[employee][time.label];

      if(scheduleItem.taken) {
        if(scheduleItem.child) {
          var parent = $scope.schedule[scheduleItem.parent.employee][scheduleItem.parent.time];
         
          showEditAppointmentModal($scope, parent);

        } else {
          showEditAppointmentModal($scope, scheduleItem);
        }
      }
    };

    $scope.modalSave = function() {
      var label = $scope.editItem.label;
      var employees = makeArray($scope.editItemEmployees);
      var time = $scope.editItem.time;
      var appointment = $scope.editItem.appointment;

      var error = appointmentConflict($scope.schedule, $scope.editItem, employees, time);

      if(error) {
        $scope.editItemError = error;

      } else {
        removeAppointment($scope.schedule, appointment);

        appointment.client = label;
        appointment.employees = employees;
        appointment.time = time;

        addAppointment($scope.schedule, appointment);

        appointments.save(appointment);

        jQuery('#editAppointmentModal').modal('hide');

      }
    };

    jQuery('#editAppointmentModal').on('shown.bs.modal', function() {
      jQuery('#modal-main').focus();
    });

  }
);

function showEditAppointmentModal(scope, scheduleItem) {
  scope.editItem = scheduleItem;
  scope.editItemEmployees = scheduleItem.appointment.employees.join(',');

  scope.editItem.label = scheduleItem.appointment.client;

  jQuery('#editAppointmentModal').modal();
}

function appointmentConflict(schedule, scheduleItem, employees, time) {
  if(!validTime(time))
    return "The start time is not valid.";

 
  return false;
}

function validTime(time) {
  return (
    time.match(/\d{2}:00/) ||
    time.match(/\d{2}:15/) ||
    time.match(/\d{2}:30/) ||
    time.match(/\d{2}:45/)
  ) && (
    (time >= '08:00' && time < '13:00') || 
    (time >= '01:00' && time < '06:00')
  );
}

function makeArray(employeeList) {
  return trimArray(employeeList.split(','));
}

function getDate() {
  return "2013-11-09";
}

function addEmployeeToAppointment(appointment, employee) {
  if(appointment.employees) {
    appointment.employees.push(employee);
  } else {
    appointment.employees = [employee];
  }
}

function updateAppointment(scheduleItem, blocks) {
  scheduleItem.appointment.blocks = blocks;
  scheduleItem.appointment.client = scheduleItem.label;
}

function makeAppointment (scheduleItem, blocks) {
  scheduleItem.appointment = {
    employees: [scheduleItem.employee],
    repeat: false,
    date: getDate(),
    time: scheduleItem.time,
    blocks: blocks,
    client: scheduleItem.label
  };
}

function trimArray(arr) {
  for(var key in arr) {
    arr[key] = arr[key].trim();
  }
  return arr;
}

function checkLabelForBlocks(scheduleItem) {
  var blocks = 2;
  if(scheduleItem.appointment && scheduleItem.appointment.blocks) {
    blocks = +scheduleItem.appointment.blocks;
  }

	var label = scheduleItem.label;

	if(label.match(/\b15\b/)) {  
		label = label.replace(/\s+15\b|\b15\b/, '');
		blocks = 1;
	} else if(label.match(/\b30\b/)) {  
		label = label.replace(/\s+30\b|\b30\b/, '');
		blocks = 2;
	} else if(label.match(/\b45\b/)) {  
    label = label.replace(/\s+45\b|\b45\b/, '');
    blocks = 3;
  } else if(label.match(/\b60\b/)) {  
    label = label.replace(/\s+60\b|\b60\b/, '');
    blocks = 4;
  } else if(label.match(/\bhr\b/)) { 
		label = label.replace(/\s+hr\b|\bhr\b/, '');
		blocks = 4;
	} else if(label.match(/\b2hr\b/)) {  
		label = label.replace(/\s+2hr\b|\b2hr\b/, '');
		blocks = 8;
	} else if(label === '') {
		blocks = 0;
	} 

  scheduleItem.label = label;
	return blocks;
}

function clearChildren(scheduleItem) {
	if(scheduleItem.children) {
		for(var key in scheduleItem.children) {
			var child = scheduleItem.children[key];

			child.label = '';
			child.taken = false;
  	}
	}

	scheduleItem.children = [];
}

function addChildren(schedule, scheduleItem) {
  var appointment = scheduleItem.appointment;
	var blocks = appointment.blocks;
	var time = appointment.time.split(":");
	var hour = +time[0];
	var min = +time[1];

  clearChildren(scheduleItem);

	for(var i = 1; i < blocks; i++) {
		min = min + 15;
		if(min >= 60) {
			min = 0;
			hour++;
			if(hour > 12)
				hour = 1;
		}
    
    time = getTimeLabel(hour, min);
		var item = schedule[scheduleItem.employee][time];

		if(item.taken === true) {
			alert("You are trying to overlap another appointment. I will stop at " 
					+ i + " appointment blocks. Instead of " + blocks + ".");
		
			appointment.blocks = i;
			break;
		} else {

  		item.label = 'x';
  		item.taken = true;
  		item.child = true;
      item.parent = {
        employee: scheduleItem.employee,
        time: appointment.time
      };

  		scheduleItem.children.push(item);
    }    
	}
}

function findWordsAfter15Chars(string) {
  var maxLength = 15;

  words = string.split(' ');
  
  var finalWords = [];
  var string = '';
  
  for(var key in words) {
    if(words[key].length + string.length > maxLength) {
      finalWords.push(string.trim());
      string = "";
    }

    string += words[key] + " ";
  }

  finalWords.push(string.trim());

  return finalWords;
}

function addAppointment(schedule, appointment) {
  for(var key in appointment.employees) {
    var employee = appointment.employees[key];

    var scheduleItem = {
      appointment: appointment,
      employee: employee,
      time: appointment.time,
      label: appointment.client,
      child: false,
      taken: true
    };

    schedule[employee][appointment.time] = scheduleItem;

    addChildren(schedule, scheduleItem);

    var labelArray = findWordsAfter15Chars(scheduleItem.label);

    if(labelArray.length > 1) {
      for(var index in labelArray) {
        if(index == 0) {
          scheduleItem.label = labelArray[index];
        } else {
          if(scheduleItem.children[index-1]) {
            scheduleItem.children[index-1].label = labelArray[index];
          }
        }
      }
    }
  }
}

function removeAppointment(schedule, appointment) {
  for(var key in appointment.employees) {
    var employee = appointment.employees[key];

    var scheduleItem = schedule[employee][appointment.time];

    removeScheduleItem(schedule, scheduleItem);
  }
}

function removeScheduleItem(schedule, scheduleItem) {
  if(scheduleItem.children) {
    clearChildren(scheduleItem);
  }

  scheduleItem.taken = false;
  scheduleItem.label = '';
}

function getTimeLabel(hour, min) {
	return pad2Digits(hour) + ":" + pad2Digits(min);
}

function pad2Digits(num) {
	num = +num;
	return num < 10 ? "0" + num : "" + num;
}

function makeSchedule(employees, times, scope) {
	schedule = {};

  angular.forEach(employees, function (employee, key) {
    schedule[employee.name] = {};
    angular.forEach(times, function (time, key) {
      schedule[employee.name][time.label] = {};
    });
  });

  return schedule;
}

function makeTimes() {
	var times = [];
  var min = ['00','15','30','45'];

  function timesLoops(times, start, end, am) {
    for(var hour = start; hour <= end; hour++) {
      for(var key in min) {
        times.push({
          class: min[key] == '00' ? 'td-top' : '',
          hour: hour,
          min: min[key],
          label: getTimeLabel(hour, +min[key]),
          am: am
        });
      }
    }
  }

	timesLoops(times, 8, 11, 'AM');
	timesLoops(times, 12, 12, 'PM');
	timesLoops(times, 1, 5, 'PM');

  return times;
}


function makeEmployees() {
	return [
		{ name: 'Jill'    },
		{ name: 'Mary'    },
		{ name: 'Marva'   },
		{ name: 'Sindy'   },
		{ name: ''        },
		{ name: ''        },
		{ name: 'Kortney' },
		{ name: ''        }
	];
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


function makeWho() {
  return [
    {col: 0,    class: "td",    span: 1},
    {col: "hr", class: "hour",  span: 4},
    {col: 1,    class: "td",    span: 1},
    {col: 2,    class: "td",    span: 1},
    {col: "hr", class: "hour",  span: 4},
    {col: 3,    class: "td",    span: 1},
    {col: 4,    class: "td",    span: 1},
    {col: "hr", class: "hour",  span: 4},
    {col: 5,    class: "td",    span: 1},
    {col: 6,    class: "td",    span: 1},
    {col: "hr", class: "hour",  span: 4},
    {col: 7,    class: "td",    span: 1}
  ];
}