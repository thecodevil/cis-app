var cisApp = angular.module('cisApp', [
  'ui.router',
  'ngAnimate',
  'conf',
  'cisApp.filters', 
  'cisApp.directives',
  'cisApp.socket',
  'ngResource',
  'coursesResource',
  'studentsResource',
  'exercisesResources',
  'answersResource',
  'postExercisesResource'
  ]).run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  });

angular.module('conf', []).constant('conf', {
  HOST : 'http://192.168.0.176:3000',
  TITLE : '互动课堂'
});

cisApp.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');

    $stateProvider
    .state('login', {
      url: '/login',
      templateUrl:'partials/login.html',
      controller:'LoginCtrl'
    })
    .state('student', {
      url: '/student',
      views: {                                                                           
        '': {
          templateUrl:'partials/student/template.html',
          controller:'StudentRootCtrl'
        },
        'main@student': {
          templateUrl:'partials/student/index.html',
          controller:'StudentMainCtrl',
          resolve: {
                exercises: function(PostExercisesRest, $rootScope) {
                    var _cid = $rootScope.cid;
                    console.log(_cid);
                    return PostExercisesRest.query({cid : 1}).$promise;
                }
          }
        }
      }
    })
    .state('student.wait', {
      url: '/wait',
      views: {
        'main@student': {
          templateUrl:'partials/student/wait.html',
          controller:'StudentWaitCtrl'
        }
      }
    })
    .state('student.exercise', {
      url: '/exercise/:id',
      views: {        
        'main@student': {
          templateUrl:'partials/student/exercise.html',
          controller:'StudentExerciseCtrl',
          resolve: {
                exercise: function(PostExercisesRest, $stateParams) {
                    var id = $stateParams.id;
                    return PostExercisesRest.get({id : id}).$promise;
                }
          }
        }
      }
    })
    .state('teacher', {
      url: '/teacher',
      views: {
        '': {
          templateUrl:'partials/teacher/index.html',
          controller:'TeacherCtrl'
        },
        'main@teacher': {
          templateUrl:'partials/teacher/index_flat.html'
        }
      }
    })
    .state('teacher.listview', {
      url: '/listview',
      views: {
        'main@teacher': {
          templateUrl:'partials/teacher/index_list.html'
        }
      }
    })
    .state('teacher.answerlist', {
      url: '/listview',
      views: {
        'main@teacher': {
          templateUrl:'partials/teacher/answer-list.html'
        }
      }
    })
    .state('teacher.students', {
      url: '/students',
      views: {
        'main@teacher': {
          templateUrl:'partials/teacher/students.html'
        }
      }
    })
    .state('teacher.exercises', {
      url: '/exercises',
      views: {
        'main@teacher': {
          templateUrl:'partials/teacher/exercises-list.html'
        }
      }
    })
    .state('teacher.exercises.detail', {
      url: '/detail',
      views: {
        'main@teacher': {
          templateUrl:'partials/teacher/exercises-detail.html'
        }
      }
    })
    .state('courses', {
      url: '/courses',
      views: {
        '': { templateUrl: 'partials/courses/template.html', controller: 'CourseRootCtrl' },
        'main@courses': { templateUrl:'partials/courses/list.html', controller: 'CourseListCtrl',
          resolve: {
            courses: function(CourseRest) { return CourseRest.query().$promise; }
          }
        }
      }
    })
    .state('courses.detail', {
      url: '/:id',
      views: {
        'main@courses': { templateUrl: 'partials/courses/detail.html', controller: 'CourseDetailCtrl',
          resolve: {
            course: function(CourseRest, $stateParams) { return CourseRest.get({id: $stateParams.id}).$promise; }
          }
        }
      }
    })
    .state('courses.students', {
      url: '/students',
      views: {
        'main@courses': { 
          templateUrl: 'partials/courses/students.html',
          controller: function($rootScope, $scope, students) {
                        $scope.setNeedReturn(true, 'courses.detail', {
                          id : $rootScope.course.id
                        });
                        $scope.students = students;
                    },
          resolve: {
            students: function(StudentRest, $rootScope) { return StudentRest.query({classname: $rootScope.course.classname}).$promise; }
          }
        }
      }
    })
    .state('courses.exercises', {
      url: '/exercises',
      views: {
        'main@courses': {
          templateUrl: 'partials/courses/exercises.html',
          controller: function($rootScope, $scope, exercises) {
                        $scope.setNeedReturn(true, 'courses.detail', {
                          id : $rootScope.course.id
                        });
                        $scope.exercises = exercises;
                    },
          resolve: {
            exercises: function(ExerciseRest, $rootScope) { return ExerciseRest.query({courseId: $rootScope.course.id}).$promise; }
          }
        }
      }
    })
    .state('courses.exercisesdetail', {
      url: '/exercises/:id',
      views: {
        'main@courses': {
          templateUrl: 'partials/courses/exercisedetail.html',
          controller: function($rootScope, $scope, exercise, $stateParams) {
                        $scope.setNeedReturn(true, 'courses.exercises');
                        $scope.exercise = exercise;
                        var _optionString = exercise.options;
                        if(_optionString) {
                            _optionString = _optionString.substring(1, _optionString.length);
                            var _options  = _optionString.split('#');
                            $scope.options = [];
                            for(var i = 0; i < _options.length; i++) {
                                var _option = _options[i];
                                var _alpha  = _option.substring(0, 1);
                                $scope.options.push({
                                    content : _option,
                                    alpha   : _alpha
                                });
                            }
                        }
                    },
          resolve: {
            exercise: function(ExerciseRest, $stateParams) { console.log('123');return ExerciseRest.get({id: $stateParams.id}).$promise; }
          }
        }
      }
    });
  }]);

