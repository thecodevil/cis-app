studentSocketService.js

app.service('studentSocketService', function(){
    this.quit= function(socket, state){
    	state.go('login');
    };     
});