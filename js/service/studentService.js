cisApp.service('studentService', function(){
    this.quit= function(socket, state){
    	state.go('login');
    };     
});