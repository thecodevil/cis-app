cisApp.controller('CourseDetailCtrl', function ($rootScope, $scope, course) {
    $rootScope.course = course;
    $scope.setNeedReturn(true, 'courses');
    $scope.beginClass = function() {
        $state.go('teacher');
    };
});