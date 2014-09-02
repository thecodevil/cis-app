cisApp.controller('CourseCtrl', function ($rootScope, $scope, socket, $location, $stateParams, CourseRest, $state, StudentRest, $window, courses) {
   

    $scope.courses = courses;

    $scope.loadStudents = function() {
        console.log('load students');
    }

    $scope.toExercisesPage = function(classname) {
        $state.go('teacher.exercises');
    };

    $scope.beginClass = function() {
        $state.go('teacher');
    };

    $scope.returnTo = function() {
        if($state.is('courses.detail')) {
            $state.needReturn = false;
            $window.history.back();
        }
        if($state.is('courses.students')) {
            $state.needReturn = true;
            $window.history.back();
        }
        if($state.is('courses.exercises')) {
            $state.needReturn = true;
            $window.history.back();
        }
    }

    if($state.is("courses.detail")) {
        console.log('detail')
        console.log($stateParams.id)
        $scope.result = CourseRest.get({id: $stateParams.id});
        $scope.result.$promise.then(function (result) {
            $rootScope.courseId  = result.course.id;
            $rootScope.classname = result.course.classname;
            $rootScope.exercises = result.exercises;
        });
    }   

    if($state.is("courses.students")) {
        console.log('students ' + $stateParams.id)
        $scope.students = StudentRest.query({
            classname : $rootScope.classname
        });
    }
    
});