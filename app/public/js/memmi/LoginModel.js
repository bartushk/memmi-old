define(["knockout", "jquery", "bcrypt", "sha512"],
function(ko, $) {
    function LoginModel(playerId, isAnon){
        this.ShowLoginForms = ko.observable(false);
        this.PlayerId = ko.observable(playerId || 'Anon');
        this.IsAnon = ko.observable(!!isAnon);
        this.WelcomeText = ko.computed(function(){
            return "Welcome, " + this.PlayerId() + "!";
        }, this);
        this.LoginName = ko.observable("");
        this.LoginPassword = ko.observable("");
    }

    LoginModel.prototype.login = function(){
        if( !this.ShowLoginForms() ){
            this.ShowLoginForms(true);    
            return;
        }
        
        

    };

    return LoginModel;
});
