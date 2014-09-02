cisApp.controller('StudentWaitCtrl', function ($rootScope, $scope, socket, $location, $state, $window) {


    if($state.is("student.wait")) {
        console.log('wait')
    }

    /** 系统监听接口 **/
    socket.once('connect', function() {
    	console.log('与服务器成功建立连接');
        socket.emit('student:applyToJoinClass');
    });

    socket.on('reconnect', function() {
        console.log('重新与服务器建立连接');
        socket.emit('student:applyToJoinClass');
    });

    /** 断开后刷新页面,才能真正把socket断掉 **/
    socket.on('disconnect', function(params) {
    	console.log('与服务器断开连接');
        socket.disconnect();
        $window.location.href = "#/login";
        $window.location.reload();
    });

    /** 业务监听接口 **/
    socket.on('student:onInvite', function() {
        console.log('收到教师邀请进入课堂');
        socket.emit('student:acceptInvitation');
    });

    socket.on('student:joinedSuccess', function(params) {
    	console.log('成功加入课堂[' + params.cid + ']');
        $rootScope.cid = params.cid;
        $state.go('student');
    });

});