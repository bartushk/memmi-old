define(["knockout", "jquery"],
function(ko, $) {
    function LoginModel(playerId, isAnon){
        this.PlayerId = ko.observable(playerId || 'Anon');
        this.IsAnon = ko.observable(!!isAnon);
        this.WelcomeText = ko.computed(function(){
            return "Welcome, " + this.PlayerId() + "!";
        }, this);
    }

    LoginModel.prototype.login = function(){

    };

    return LoginModel;
});
