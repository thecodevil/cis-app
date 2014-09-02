// 课程资源Rest服务
angular.module('coursesResource', ['ngResource', 'conf']).factory('CourseRest', function ($resource, conf) {
  return $resource(conf.HOST + '/courses/:id', {}, {
    query:  {method: 'GET', isArray: true},
    get  :  {method: 'GET'}
  });
});


// 学生资源Rest服务
angular.module('studentsResource', ['ngResource', 'conf']).factory('StudentRest', function ($resource, conf) {
  return $resource(conf.HOST + '/students/:id', {}, {
    query:  {method: 'GET', isArray: true, params: {
      classname: 'classname'
    }},
    get  :  {method: 'GET'}
  });
});


// 习题资源Rest服务
angular.module('exercisesResources', ['ngResource', 'conf']).factory('ExerciseRest', function ($resource, conf) {
  return $resource(conf.HOST + '/exercises/:id', {}, {
    query: {
      method: 'GET', 
      isArray: true,
      params: {
        courseId: "courseId"
      }
    },
    get: {method: 'GET'}
  });
});

// 答案资源Rest服务
angular.module('answersResource', ['ngResource', 'conf']).factory('AnswerRest', function ($resource, conf) {
  return $resource(conf.HOST + '/answers/:id', {}, {
    query: {
      method: 'GET', 
      isArray: true,
      params: {
        sno: 'sno',
        cid: 'cid'
      }
    },
    queryOne: {
      method: 'GET', 
      params: {
        sno: 'sno',
        eid: 'eid',
        cid: 'cid'
      }
    },
    get: {method: 'GET'}
  });
});

// 发布习题资源Rest服务
angular.module('postExercisesResource', ['ngResource', 'conf']).factory('PostExercisesRest', function ($resource, conf) {
  return $resource(conf.HOST + '/postexercises/:id', {}, {
    query: {
      method: 'GET', 
      isArray: true,
      params: {
        cid: 'cid'
      }
    },
    get: {method: 'GET'}
  });
});