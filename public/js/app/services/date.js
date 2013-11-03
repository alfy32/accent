angular.module('accent').factory('date', function (nav) {
  	
  	var pageDate = {
  		value: new Date()
  	};

    getDate();

  	function getDate() {
		var date = new Date();
		var day = dayToNumber(JSDateToDay(date));

		var dayStr = window.location.hash.split('/')[1];

		if(dayStr) {
			var offset = dayToNumber(dayStr) - day;	
			date.setDate(date.getDate() + offset);
		}

		pageDate.value = date;
		clearActive(nav);
		var index = dayToNumber(JSDateToDay(pageDate.value));
		nav[index].active = "active";
	}	

	

    return {
    	pageDate: pageDate,
    	updatePageDate: getDate
    };
});

function clearActive(nav) {
	for(var key in nav) {
		nav[key].active = '';
	}
}

function dayToNumber(day) {
	switch(day) {
	case "monday":
		return 1;
		break;
	case "tuesday":
		return 2;
		break;
	case "wednesday":
		return 3;
		break;
	case "thursday":
		return 4;
		break;
	case "friday":
		return 5;
		break;
	case "saturday":
		return 6;
		break;
	case "sunday":
		return 7;
		break;
	}
}

function JSDateToDay(date) {
	var number = date.getDay();
	switch(number) {
	case 1:
		return "monday";
		break;
	case 2:
		return "tuesday";
		break;
	case 3:
		return "wednesday";
		break;
	case 4:
		return "thursday";
		break;
	case 5:
		return "friday";
		break;
	case 6:
		return "saturday";
		break;
	case 0:
		return "sunday";
		break;
	}
}