'use strict';

angular.module('cisApp.directives', []).
directive('appVersion', ['version', function (version) {
	return function (scope, elm) {
		elm.text(version);
	};
}]);