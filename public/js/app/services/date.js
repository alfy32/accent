angular.module('accent').factory('date', 
  function (nav) {

    var date = {
      currentJSON: currentJSON,
      dayToNumber: dayToNumber,
      numberToDay: numberToDay,
      jsDateToDay: jsDateToDay,
      dateToJson: dateToJson,
      jsonToDate: jsonToDate,
      clearTime: clearTime,
      getDate: getDate
    };

    date.current = clearTime(new Date());

    date.firstDayOfWeek = 'Sunday';

    date.lastWeek = function() {
      date.current.setDate(date.current.getDate() - 7);
    }

    date.nextWeek = function() {
      date.current.setDate(date.current.getDate() + 7);
    }

    date.days = [
      'sunday', 'monday','tuesday', 'wednesday', 
      'thursday', 'friday', 'saturday'
    ];

    function currentJSON() {
      return dateToJson(date.current);
    }

    function dayToNumber(day) { 
      return date.days.indexOf(day.toLowerCase()) 
    }
    
    function numberToDay(number) {
      return date.days[number];
    }

    function jsDateToDay(iDate) {
      return date.days[iDate.getDay()];
    }

    function dateToJson(iDate) {
      return iDate.getFullYear() + 
             '-' + pad2Digits(iDate.getMonth()+1) + 
             '-' + pad2Digits(iDate.getDate());
    }

    function jsonToDate(dateString) {
      if(dateString.match(/\d{4}-\d{2}-\d{2}/)) {

        var splitDate = dateString.split('-');
        var newDate = new Date();

        newDate.setFullYear(splitDate[0]);
        newDate.setMonth(+splitDate[1] - 1);
        newDate.setDate(splitDate[2]);

        date.clearTime(newDate);

        return newDate;

      } else {
        return "Invalid date format";
      }
    }

    function clearTime(iDate) {
      iDate.setHours(0);
      iDate.setMinutes(0);
      iDate.setSeconds(0);
      return iDate;
    }

    function getDate(theDate, dayOfWeek) {
      var newDate = clearTime(new Date(theDate));
      var dayNumber = dayToNumber(dayOfWeek);

      var sunday = newDate.getDate() - newDate.getDay();

      if(dayToNumber(dayOfWeek) < dayToNumber(date.firstDayOfWeek))
        sunday += 7;

      if(newDate.getDay() < dayToNumber(date.firstDayOfWeek))
        sunday -= 7;

      newDate.setDate(sunday + dayNumber);

      return newDate;
    }

    return date;
  }
);

function pad2Digits(value) {
  if(+value < 10) {
    return '0' + value;
  }

  return '' + value;
}