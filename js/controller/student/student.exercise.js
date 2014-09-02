cisApp.controller('StudentExerciseCtrl', function ($rootScope, $scope, socket, $location, $state, AnswerRest, $stateParams, $timeout, PostExercisesRest, exercise) {


   /* if($state.is('student.exercise')) {
        console.log('检查习题答案');
        var _id = $stateParams.id;
        if(! _id) {
            console.log('缺失id');
        } else {
            PostExercisesRest.get();
        }
    }*/

    $scope.selected = -1;
    $scope.postting = false;
    $scope.setNeedReturn(true, 'student');

    $scope.answer = {
        content : ''
    }

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

    $scope.getAlpha = function() {
        var _answer = $scope.exercise.answer; 
        if(_answer) {
            var _content = _answer.answer;
            if(_content && _content.length > 0) {
                return _content.substring(0, 1);
            }
        }
    }

    $scope.checkOptionSelect = function(index, option) {
        $scope.selected = index; 
        $scope.answer = option;
    }

    $scope.checkAnswered = function() {
        var _answer = $scope.exercise.answer;
        return _answer == undefined || _answer == null;
    }

    $scope.checkPostAnswerDisable = function() {
        return $scope.selected == -1 || $scope.postting;
    };

    socket.on('student:answerPostSuccess', function() {
        console.log('答案提交成功，已收到成功反馈');
        var _pe = PostExercisesRest.query({
            cid : $rootScope.cid
        });
        $scope.showTips = true;
        $timeout(function() {
            $scope.showTips = false;
            _pe.$promise.then(function (postexercises) {
                $scope.$emit("refreshexercise", postexercises);
            });
            $state.go('student');
        }, 1500);
    });

    /** 提交答案 **/
    $scope.postAnswer = function() {
        $scope.postting = true;
        /*var _content = $scope.answer.content;
        var _eid     = $scope.exercise.id;
        var _cid     = $rootScope.cid;
        console.log('学生提交答案[' + _content + '], 题目id[' + _eid + '], 课程id[' + _cid + ']');
        socket.emit('student:postAnswer', {
            eid    : _eid,
            cid    : _cid,
            answer : _content
        });*/
   };
});