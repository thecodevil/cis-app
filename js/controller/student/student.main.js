cisApp.controller('StudentMainCtrl', function ($rootScope, $scope, socket, $location, $state, AnswerRest, PostExercisesRest, $stateParams, $timeout, $window, studentService, exercises) {

    /*$scope.postexercises = [];*/
    $scope.student = {
        status : '',
        exercises : []
    };

    /*$scope.postexercise = {
        status  : '',
        title   : '',
        content : '',
        time    : ''
    };*/

    $scope.student.exercises = exercises;

    /*if($state.is('student')) {
        console.log('进入上课页面，加载预备数据');
        var _cid = $rootScope.cid;
        if(! _cid) {
            console.log('缺失课程id');
        } else {
            $scope.student.exercises = PostExercisesRest.query({cid : _cid});
        }
    }*/

    var g_exerciseStatus = ['fa-check-circle', 'fa-exclamation-circle', 'fa-times-circle'];
    /*for(var i = 0;i < 10;i++) {
        $scope.student.exercises.push({
            exerciseTitle: 'title' + i,
            createAt: '2014-08-26 11:11:11',
            exerciseContent : 'content' + i,
            status: i % 3,
            id : (i + 1)
        });
    }*/

    $scope.getExerciseStatus = function(exercise) {
        var _answer = exercise.answer;
        if(_answer) {
            return g_exerciseStatus[0];
        } else {
            return g_exerciseStatus[1];
        }
    }



    /** 状态反馈 **/
    $scope.updateStatus = function(status) {
        console.log('更新状态[' + status + ']');
        $scope.student.status = status;
        //socket.emit('student:updateStatus', {status : status});
    };

    $scope.exerciseDetail = function(exercise) {
        $state.needReturn = true;
        $rootScope.currentExercise = exercise;
        var _cid = $rootScope.cid;
        var _eid = $rootScope.currentExercise.id;
        if(! _cid || ! _eid) {
            console.log('缺失课程id,无法获取题目信息');
            return false;
        }
        var _answer = AnswerRest.queryOne({
            sno : $rootScope.entity.sno,
            eid : _eid,
            cid : _cid
        });
        _answer.$promise.then(function (answer) {
            console.log(answer)
            $rootScope.answer = answer
        });
        $state.go('student.answer');
    };

    $scope.$on("refreshexercise", function (event, postexercises) {
        $scope.postexercises = postexercises;
    });

    /** 监听业务接口 **/
    socket.on('student:doExercise', function(params) {
        var _exercise = params.exercise;
        $state.go('student.exercise',{id: _exercise.id});

        /*var _type = _exercise.type;
        $rootScope.exercise = _exercise;
        console.log('收到做题消息通知,题目id[' + _exercise.id + ', 类型=' +　_type　+ ']');
        if(_type == 2 || _type == 3) {
            $state.go('studentExercises');
        } else if(_type == 1) {
            var _optionString = _exercise.options;
            if(_optionString) {
                _optionString = _optionString.substring(1, _optionString.length);
                var _options  = _optionString.split('#');
                $rootScope.options = [];
                for(var i = 0; i < _options.length; i++) {
                    var _option = _options[i];
                    var _alpha  = _option.substring(0, 1);
                    console.log(_alpha);
                    $rootScope.options.push({
                        content : _option,
                        alpha   : _alpha
                    });
                }
            }
            $state.go('studentOptions');
        }*/
    });

    socket.on('student:answerPostSuccess', function() {
        console.log('答案提交成功，已收到成功反馈');
        var _pe = PostExercisesRest.query({
            cid : $rootScope.cid
        });
        _pe.$promise.then(function (postexercises) {
            $scope.postexercises = postexercises;
        });
        $scope.showTips = true;
        $timeout(function() {
            $scope.showTips = false;
        }, 1500);
        
    });

    socket.on('student:classOver', function(params) {
        console.log('学生收到下课消息');
        socket.emit('student:leave');
        $state.go('login');
    });

    socket.on('student:updateStatusSuccess', function() {
        $scope.valid = true;
        $timeout(function() {
            $scope.valid = false;
        }, 1500);
    });

});