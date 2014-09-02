cisApp.controller('StudentRootCtrl', function ($scope, socket, $state, $window) {

	$scope.toState = '';
	
    $scope.quit = function() {
        console.log('学生点击退出按钮,发送退出消息给教师');
        socket.emit('student:leave');
        $state.go('login');
    };
    
    $scope.returnTo = function() {
        $scope.needReturn = false;
        console.log($scope.toState);
        if($scope.toState == '') {
        	$window.history.back();	
        } else {
        	console.log('go to state')
			$state.go($scope.toState);
        }
    };

    $scope.setNeedReturn = function(flag, toState) {
    	$scope.toState = toState;
    	$scope.needReturn = flag;
    }
});