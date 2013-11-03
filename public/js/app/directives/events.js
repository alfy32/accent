var myApp = angular.module('accent').directive('ngEnter', function ($parse) {
  return function (scope, elem, attr) {
    var enterFn = $parse(attr['ngEnter']);
    elem.bind('keyup', function (event) {
      if(event.which === 13)
        enterFn(scope, {$event:event});
    });
 };
});

var myApp = angular.module('accent').directive('ngFocus', function ($parse) {
  return function (scope, element, attr) {
    var focusFn = $parse(attr['ngFocus']);
    element.bind('focus', function (event) {
      scope.$apply(function() {
        focusFn(scope, {$event:event});
      });
    });
  };
});

var myApp = angular.module('accent').directive('ngBlur', function ($parse) {
  return function (scope, element, attr) {
    var blurFn = $parse(attr['ngBlur']);
    element.bind('blur', function (event) {
      scope.$apply(function() {
        blurFn(scope, {$event:event});
      });
    });
  };
});

var myApp = angular.module('accent').directive('ngEnterBlur', function ($parse) {
  return function (scope, element, attr) {
    var blurFn = $parse(attr['ngEnterBlur']);
    element.bind('blur', function (event) {
      scope.$apply(function() {
        blurFn(scope, {$event:event});
      });
    });
    element.bind('keyup', function (event) {
      if(event.which === 13) {
        scope.$apply(function() {
          blurFn(scope, {$event:event});
        });
      }
    });
  };
});