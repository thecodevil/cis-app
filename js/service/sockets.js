angular.module('cisApp.socket', ['conf'])
    .value('version', '0.1')
    .factory('socket', function ($rootScope, conf) {
        var socket 
        return {
            connect :function(flag, token, callback) {
                socket = io.connect(conf.HOST, {
                    'force new connection': flag,
                    query: token ? 'token=' + token : undefined
                  });
                callback(socket);
            },

            once : function (eventName, callback) {
                if(socket == undefined) return;
                socket.once(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            on: function (eventName, callback) {
                if(socket == undefined) return;
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                if(socket == undefined) return;
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            },
            disconnect: function (callback) {
                if(socket == undefined) return;
                socket.disconnect(function () {
                    socket = undefined;
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    });