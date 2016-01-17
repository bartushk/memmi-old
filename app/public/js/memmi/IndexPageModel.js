define(["knockout", "jquery", "underscore", "memmi/Card", "memmi/Information", "memmi/CardsetInfo"],
function(ko, $, _, card, information, cardsetInfo){
    var welcomeFront = new information('text', 'Welcome to memmi.');
    var welcomeBack = new information('text', 'Memmi is an app to help you with memorization.');
    
    var flipElements = $('.flip-container');
    var element1 = $('#card1')[0];
    var element2 = $('#card2')[0];
    var viewModel = {
        CardOne: ko.observable(new card('Welcome', welcomeFront, welcomeBack, "Hello memmi")),  
        CardTwo: ko.observable(new card('Welcome', welcomeFront, welcomeBack, "Hello memmi")),  

        CardToggle: ko.observable(false),
        CardsetInfo: ko.observable(new cardsetInfo('cardset1')),
        Algorithm: ko.observable('random'),
        CardHistory: ko.observableArray(),
    };

    viewModel.ActiveCard = ko.computed(function(){
        return viewModel.CardToggle() ? viewModel.CardTwo : viewModel.CardOne;
    });

    viewModel.ActiveElement = ko.computed(function(){
        return viewModel.CardToggle() ? element2 : element1;
    });

    viewModel.cardAction = function(){
        var toAnimate = viewModel.ActiveElement();
        if( !viewModel.ActiveCard()().IsFlipped() ){
            toAnimate.classList.toggle('flip');
            toAnimate.classList.toggle('slide-on');
            toAnimate.classList.toggle('wait-left');
            viewModel.ActiveCard()().IsFlipped(true); 
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

    viewModel.reportAndNext = function(scoreObject){
        viewModel.slideCardOff();
        var postObject = {};
        postObject.cardset = viewModel.CardsetInfo().Name();
        postObject.algorithm = viewModel.Algorithm();
        postObject.cardUpdate = scoreObject;
        $.ajax({
            method: "POST",
            url: "/card-api/report-get-next",
            contentType: "application/json",
            data: JSON.stringify(postObject),
            success: function(arg){
                var newCard = card.fromJson(arg);
                viewModel.CardHistory.push(viewModel.ActiveCard()()); 
                viewModel.CardToggle(!viewModel.CardToggle());
                viewModel.ActiveCard()(newCard);
                viewModel.ActiveElement().classList.toggle('slide-on');
            },
            error: function(arg){
                console.error(arg);
            }
        });


    };

    viewModel.getNextCard = function(){
    };

    card.setScoreCallback(viewModel.reportAndNext);

    return viewModel;
});
