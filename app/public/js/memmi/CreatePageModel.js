define(["knockout", "jquery", "underscore", "memmi/Card", "memmi/Information", "memmi/CardSet", "memmi/LoginModel"],
function(ko, $, _, card, information, cardSet, loginModel){

    var flipElements = $('.flip-container');
    var element1 = $('#card1')[0];
    var element2 = $('#card2')[0];
    var viewModel = {
        LoginModel: ko.observable(new loginModel("Stranger", true)),
        WorkingCardSet: ko.observable(new cardSet()),
        CardToggle: ko.observable(false),
        PreviewCard: ko.observable()
    };

    viewModel.ActiveElement = ko.computed(function(){
        return viewModel.CardToggle() ? element2 : element1;
    });

    viewModel.PreviewCard(viewModel.WorkingCardSet().Cards()[0]);

    viewModel.cardAction = function(){
        var toAnimate = viewModel.ActiveElement();
        if( !viewModel.PreviewCard().IsFlipped() ){
            toAnimate.classList.toggle('flip');
            toAnimate.classList.toggle('slide-on');
            toAnimate.classList.toggle('wait-left');
            viewModel.PreviewCard().IsFlipped(true); 
        }
    };

    viewModel.slideCardOff = function(){
        var toAnimate = viewModel.ActiveElement();
        toAnimate.classList.toggle('slide-off');
        toAnimate.classList.toggle('flip');
        _.delay(function(){
            toAnimate.classList.toggle('slide-off');
            toAnimate.classList.toggle('wait-left');
        }, 600);
    };

    viewModel.swapCards = function(){
        if( !_.contains(viewModel.ActiveElement().classList, "wait-left") )
            viewModel.slideCardOff();
        _.delay(function(){
            viewModel.PreviewCard().IsFlipped(false);
            viewModel.CardToggle(!viewModel.CardToggle());
            viewModel.ActiveElement().classList.toggle('slide-on');
        }, 600);
    };

    card.setScoreCallback(viewModel.swapCards);

    viewModel.setLoginStatus = function(playerId, isAnon){
        viewModel.LoginModel(new loginModel(playerId, isAnon, viewModel.syncCardsetInfo));
        viewModel.WorkingCardSet().Author(playerId);
    };

    viewModel.ActiveElement().classList.toggle('slide-on');

    return viewModel;
});
