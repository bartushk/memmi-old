define(["knockout", "jquery", "bcrypt", "sha512"],
function(ko, $, bcrypt, sha512) {
    function LoginModel(playerId, isAnon, loginCallback){
        this.LoginState = ko.observable(isAnon ? "anon": "loggedIn");
        this.PlayerId = ko.observable(playerId || 'Anon');
        this.IsAnon = ko.observable(!!isAnon);
        this.LoginName = ko.observable("");
        this.LoginPassword = ko.observable("");
        this.salt = "$2a$12$ailWBc3pErR1EmyKyQtDZe";

        this.ShowPrompt = ko.computed(function(){
            return this.LoginState() == 'prompted'; 
        }, this);
        this.LoginFailed = ko.computed(function(){
            return this.LoginState() == 'loginFailed'; 
        }, this);
        this.WelcomeText = ko.computed(function(){
            return "Welcome, " + this.PlayerId() + "!";
        }, this);
        
        this.loginCallback = loginCallback || function(){};
    }

    LoginModel.prototype.login = function(){
        var self = this;
        if( this.LoginState() == "anon" || this.LoginState() == 'loginFailed'){
            this.LoginState("prompted");
            return;
        }
        this.LoginState('loggingIn');
        var username = this.LoginName();
        var shaObj = new sha512("SHA-512", "TEXT");
        shaObj.update(this.LoginPassword());
        var passHash = shaObj.getHash("B64");

        bcrypt.hash(passHash, this.salt, function(err, hash){
            var postObject = {};
            postObject.username = username;
            postObject.pass = hash;
            $.ajax({
                method: "POST",
                url: "/player-api/login",
                contentType: "application/json",
                data: JSON.stringify(postObject),
                success: function(arg){
                    self.LoginState("loggedIn");
                    self.PlayerId(arg.playerId);
                    self.IsAnon(arg.isAnon);
                    self.loginCallback();
                },
                error: function(arg){
                    self.LoginState("loginFailed");
                }
            }); 
        });
    };

    return LoginModel;
});
