cisApp.controller('LoginCtrl', function ($rootScope, $scope, socket, $location, $http, $timeout, $state, $window, conf) {

	$scope.user = {
		name    : '',
		password: '',
		role    : 0
	};

	$scope.login = function() {
		var name     = $scope.user.name;
		var password = $scope.user.password;
		var role     = $scope.user.role;

		var flag = validate(name, '', '用户名不能为空');
		if(!flag) return;

		var flag = validate(password, '', '密码不能为空');
		if(!flag) return;

		$http({
			method: 'POST',
			url: conf.HOST + '/login',
			data: {
				userId   : name,
				password : password
			}
		}).success(function(data) {
			if(data.status == 'success') {
				var token = data.token;
				$rootScope.token = token;
				$rootScope.entity = data.entity;
				if(token) {
					if(data.role == 'teacher') {
						$location.path('/courses');
					} else if(data.role == 'student') {
						$rootScope.sno = name;
						socket.connect(true, token, function(socket) {
							$state.go('student.wait');
						});
					}
				}
			} else {
				showMsg(data.msg);
				return;
			}
		});
	};


	

	function validate(str, invalidVal, msg) {
		if(str == invalidVal) {
			showMsg(msg);
			return false;
		}
		return true;
	}

	function showMsg(msg) {
		$scope.valid = true;
		$scope.msg   = msg;
		$timeout(function() {
			$scope.valid = false;
		}, 1500);
	}

});