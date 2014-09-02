cisApp.controller('TeacherCtrl', function ($rootScope, $scope, socket, $location, $state, $http, conf, $window, AnswerRest) {

    $scope.flatView  = true;
    $scope.exercises = $rootScope.exercises;

    var g_socket;
    var g_studentsMap = {};
    $scope.numOfStudent = 0;
    $scope.numOfOnlineStudent = 0;

    $scope.numOfStatus1 = 0;
    $scope.numOfStatus2 = 0;
    $scope.numOfStatus3 = 0;
    $scope.numOfStatus4 = 0;
    if($state.is("teacher.exercises") || $state.is("teacher.exercises.detail")) {
        $state.currentView = 'exercises'
    }
    if($state.is("teacher") || $state.is("teacher.listview")) {
        $state.currentView = 'home'
    }
    if($state.is("teacher.students")) {
        $state.currentView = 'students'
    }

    $scope.returnTo = function() {
        if($state.is('teacher.exercises.detail')) {
            $state.needReturn = false;
            $state.go('teacher.exercises');
        } else if($state.is('teacher.answerlist')) {
            $state.needReturn = false;
            $state.go('teacher.listview');
        }
    }

    $scope.classOver = function() {
        console.log('教师下课');
        g_socket.emit('teacher:classOver');
        $state.go('login');
    };

    $scope.exit = function() {
        console.log('教师退出应用');
    };

    $scope.toExerciseDetailPage = function(exercise) {
        $rootScope.currentExercise = exercise;
        $state.go('teacher.exercises.detail');
    };

    $scope.toStudentAnswerList = function(student) {
        $state.needReturn = true;
        var _cid = $rootScope.courseId;
        var _answer = AnswerRest.query({
            sno : student.sno,
            cid : _cid
        });
        _answer.$promise.then(function (answer) {
            $rootScope.perStudentAnswers = answer
        });
        $state.go('teacher.answerlist');
    };

    $scope.toFlatStatus = function() {
        $state.currentView = 'home';
        $scope.flatView = false;
        $scope.listView = true;
        $state.go('teacher');
    };

    $scope.toListStatus = function() {
        $state.currentView = 'home';
        $scope.flatView = true;
        $scope.listView = false;
        $state.go('teacher.listview');
    };

    $scope.doExercise = function() {
        console.log('教师发送题目[' + $rootScope.currentExercise.id + ', ' + $rootScope.currentExercise.title + ']');
        $state.go('teacher.listview');
        $state.needReturn = false;
        $state.currentView = 'home';
        g_socket.emit('teacher:postExercise', {
            exercise : $rootScope.currentExercise,
            cid      : $rootScope.courseId
        })
    };

    $scope.postOpenQuestion = function() {
        console.log('教师广播开放问题');
        $state.go('teacher.answers');
        g_socket.emit('teacher:postOpenQuestion', {
            cid      : $rootScope.courseId
        });
    };

    function init() {
        $http({
            method: 'GET',
            url: conf.HOST + '/students?classname=' + $rootScope.classname
        }).success(function(data) {
            $scope.students = [];
            for(var i = 0; i < data.length; i++) {
                var element = data[i];

                var _student = {
                    sno    : element.sno,
                    name   : element.name,
                    status : 'fa-user-offline',
                    currentAnwer : ''
                };
                $scope.students.push(_student);
                $scope.numOfStudent ++;
                g_studentsMap[_student.sno] = _student;
            }

            socket.connect(true, $rootScope.token, function(socket) {
                g_socket = socket;
                //$rootScope.socket = socket;
                onListen(socket);
            });
            
        });
       
    };

    init();
   
    function getLen(num) {
        num = 10 * num;
        if(num == 0) {
            return '3px';
        }
        return num + 'px';
    };

    function onListen(socket) {
        socket.once('connect', function() {
            socket.emit('teacher:onCourseBegin', {
                courseId: $rootScope.courseId
            });
        });

        socket.on('teacher:studentLeave', function(params) {
            console.log('教师接收到学生[' + params.sno + ']的退出消息通知');
            $scope.$apply(function () {
               $scope.numOfOnlineStudent --;
               var _currentStatus = g_studentsMap[params.sno].status;
               if(_currentStatus == 'fa-thumbs-o-up') {
                    $scope.status1width = getLen(-- $scope.numOfStatus1);
                } else if(_currentStatus == 'fa-question-circle') {
                    $scope.status2width = getLen(-- $scope.numOfStatus2);
                } else if(_currentStatus == 'fa-angle-double-down') {
                    $scope.status3width = getLen(-- $scope.numOfStatus3);
                } else if(_currentStatus == 'fa-angle-double-up') {
                    $scope.status4width = getLen(-- $scope.numOfStatus4);
                }
               g_studentsMap[params.sno].status = 'fa-user-offline';

            });
        });

        // 监听学生成功参入课堂成功信息，更新[在线人数]和[学生在线状态]
        socket.on('teacher:applyToJoinClass', function(params) {
            var _sno = params.sno;
            console.log('教师接收到学生[' + _sno + ']的申请');
            socket.emit('teacher:inviteStudent', {
                sno : _sno
            });
        });

        // 监听学生成功参入课堂成功信息，更新[在线人数]和[学生在线状态]
        socket.on('teacher:studentJoinedSuccess', function(params) {
            $scope.$apply(function () {
               $scope.numOfOnlineStudent ++;
               g_studentsMap[params.sno].status = 'fa-user';
            });
        });

        // 监听学生更新状态的信息，更新[学生状态]
        socket.on('teacher:updateStatus', function(params) {
            var _status = params.status;
            $scope.$apply(function () {
                var _currentStatus = g_studentsMap[params.sno].status;
                if(_currentStatus == _status) {return false;}
                
                if(_currentStatus == 'fa-thumbs-o-up') {
                    $scope.status1width = 10 * (-- $scope.numOfStatus1) + 'px';
                } else if(_currentStatus == 'fa-question-circle') {
                    $scope.status2width = 10 * (-- $scope.numOfStatus2) + 'px';
                } else if(_currentStatus == 'fa-angle-double-down') {
                    $scope.status3width = 10 * (-- $scope.numOfStatus3) + 'px';
                } else if(_currentStatus == 'fa-angle-double-up') {
                    $scope.status4width = 10 * (-- $scope.numOfStatus4) + 'px';
                }

                if(_status == 'fa-thumbs-o-up') {
                    $scope.status1width = 10 * (++ $scope.numOfStatus1) + 'px';
                } else if(_status == 'fa-question-circle') {
                    $scope.status2width = 10 * (++ $scope.numOfStatus2) + 'px';
                } else if(_status == 'fa-angle-double-down') {
                    $scope.status3width = 10 * (++ $scope.numOfStatus3) + 'px';
                } else if(_status == 'fa-angle-double-up') {
                    $scope.status4width = 10 * (++ $scope.numOfStatus4) + 'px';
                }
                g_studentsMap[params.sno].status = _status;
            });
            
        });

        // 监听学生提交的答案信息
        socket.on('teacher:postAnswer', function(params) {
            /*$scope.$apply(function () {
               g_studentsMap[params.sno].status = params.status;
            });*/
            var _sno    = params.sno;
            var _answer = params.answer;
            console.log('收到学生[' + _sno + ']的答案[' + _answer + ']');
            $scope.$apply(function () {
               g_studentsMap[_sno].currentAnwer = _answer;
            });
            // 反馈给学生已经收到提交的答案
            socket.emit('teacher:feedback2student', {
                sno : _sno
            });
        });

        socket.on('disconnect', function(params) {
            console.log('与服务器断开连接');
            socket.disconnect();
            $window.location.href = "#/login";
            $window.location.reload();
        });
    };
});