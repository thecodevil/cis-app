cisApp.controller('CourseRootCtrl', function ($scope, socket, $state, $window) {
    
    $scope.quit = function() {
        console.log('教师退出应用');
    };
    
    $scope.returnTo = function() {
        $scope.needReturn = false;
        if($scope.toState == '') {
        	$window.history.back();	
        } else {
			$state.go($scope.toState, $scope.stateParams);
        }
    };

    $scope.setNeedReturn = function(flag, toState, params) {
    	$scope.toState = toState;
        $scope.stateParams = params;
    	$scope.needReturn = flag;
    }
});