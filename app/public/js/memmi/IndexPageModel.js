define(["knockout", "jquery", "underscore", "memmi/Card", "memmi/Information", "memmi/CardsetInfo", "memmi/LoginModel"],
function(ko, $, _, card, information, cardsetInfo, loginModel){
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
        LoginModel: ko.observable(new loginModel("Stranger", true))
    };

    viewModel.syncCardsetInfo = function(){
        viewModel.CardsetInfo(new cardsetInfo(viewModel.CardsetInfo().Id()));   
        viewModel.getNext();
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

    viewModel.ActiveCardHistory = ko.computed(function(){
        if(viewModel.CardsetInfo() && viewModel.CardsetInfo().HistoryFetched())
            return viewModel.CardsetInfo().History().history[viewModel.ActiveCard()().CardId()];
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
        if( _.contains(viewModel.ActiveElement().classList, "slide-on") )
            viewModel.cardAction(); 
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
                var newCard = card.fromJson(arg.card);
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
            
        // slide a card off the screen if necessary.
        if( !_.contains(viewModel.ActiveElement().classList, "wait-left") )
            viewModel.slideCardOff();

        // post the appropriate info to report the card score and get the next card.
        var postObject = {};
        postObject.cardset = viewModel.CardsetInfo().Id();
        postObject.algorithm = viewModel.Algorithm();
        postObject.cardUpdate = scoreObject;
        postObject.play_index = viewModel.CardsetInfo().History()._playIndex;
        
        // apply the score object to the local history.
        viewModel.ActiveCardHistory().playIndicies.push(viewModel.CardsetInfo().History()._playIndex); 
        viewModel.CardsetInfo().History()._playIndex += 1; 
        viewModel.ActiveCardHistory().currentScore += scoreObject.score; 
        viewModel.ActiveCardHistory().scores.push(scoreObject.score); 
        viewModel.CardsetInfo().History.valueHasMutated();
        $.ajax({
            method: "POST",
            url: "/card-api/report-get-next",
            contentType: "application/json",
            data: JSON.stringify(postObject),
            success: function(arg){
                var newCard = card.fromJson(arg.card);
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

    var lastKeydown = new Date().getTime();
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
            var currentKeydown = new Date().getTime();
            if( currentKeydown - lastKeydown < 500 )
                return;
            lastKeydown = currentKeydown;
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

    viewModel.setLoginStatus = function(playerId, isAnon){
        viewModel.LoginModel(new loginModel(playerId, isAnon, viewModel.syncCardsetInfo));
    };

    return viewModel;
});
