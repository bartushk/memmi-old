define(["knockout", "jquery", "underscore", "memmi/Card", "memmi/Information", "memmi/CardsetInfo"],
function(ko, $, _, card, information, cardsetInfo){
    var welcomeFront = new information('text', 'Welcome to memmi.');
    var welcomeBack = new information('text', 'Memmi is an app to help you with memorization.');
    
    var flipElements = $('.flip-container');
    var element1 = $('#card1')[0];
    var element2 = $('#card2')[0];
    var viewModel = {
        CardOne: ko.observable(new card()),  
        CardTwo: ko.observable(new card()),  

        CardToggle: ko.observable(false),
        CardsetInfo: ko.observable(),
        Algorithm: ko.observable('random'),
        CardHistory: ko.observableArray(),
    };

    viewModel.setCardset = function(cardsetName){
        viewModel.CardsetInfo( new cardsetInfo(cardsetName) ); 
        viewModel.getNext();
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

    viewModel.getNext = function(){
        if( !_.contains(viewModel.ActiveElement().classList, "wait-left") )
            viewModel.slideCardOff();
        var postObject = {};
        postObject.cardset = viewModel.CardsetInfo().Id();
        postObject.algorithm = viewModel.Algorithm();
        $.ajax({
            method: "POST",
            url: "/card-api/get-next",
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

    viewModel.reportAndNext = function(scoreObject){
        if( !_.contains(viewModel.ActiveElement().classList, "wait-left") )
            viewModel.slideCardOff();
        var postObject = {};
        postObject.cardset = viewModel.CardsetInfo().Id();
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

    $(document).keydown(function(event){
        var score = null;
        switch(event.which){
            case 38:    //up
                score = 1;
                break;
            case 39:    //right
                score = 0;
                break;
            case 40:    //down
                score = -1;
                break;
        }
        if(score !== null){
            var activeCard = viewModel.ActiveCard()();
            if(activeCard.IsFlipped()){
                var scoreObject = {};
                scoreObject.cardId = activeCard.CardId();
                scoreObject.score = score;
                viewModel.reportAndNext(scoreObject);
            } else {
                viewModel.cardAction();
            }
        }
    });

    card.setScoreCallback(viewModel.reportAndNext);

    return viewModel;
});
