define(["knockout", "jquery", "underscore", "memmi/Card", "memmi/Information", "memmi/CardsetInfo"],
function(ko, $, _, card, information, cardsetInfo){
    var welcomeFront = new information('text', 'Welcome to memmi.');
    var welcomeBack = new information('text', 'Memmi is an app to help you with memorization.');
    ko.bindingHandlers.slideOn = {
        update: function(element, valueAccessor){
            if( valueAccessor()() )
                element.classList.toggle('slide-on');
        }
    };
    
    var viewModel = {
        CardOne: ko.observable(new card('Welcome', welcomeFront, welcomeBack, "Hello memmi")),  
        SlideOne: ko.observable(false),
        CardTwo: ko.observable(new card('Welcome', welcomeFront, welcomeBack, "Hello memmi")),  
        SlideTwo: ko.observable(false),

        CardToggle: ko.observable(false),
        CardsetInfo: ko.observable(new cardsetInfo('cardset1')),
        Algorithm: ko.observable('random'),
        CardHistory: ko.observableArray(),
    };

    viewModel.ActiveCard = ko.computed(function(){
        return viewModel.CardToggle() ? viewModel.CardTwo : viewModel.CardOne;
    });

    viewModel.InactiveCard = ko.computed(function(){
        return viewModel.CardToggle() ? viewModel.CardOne : viewModel.CardTwo;
    });

    viewModel.cardAction = function(item, event){
        if( !viewModel.ActiveCard()().IsFlipped() ){
            event.currentTarget.classList.toggle('flip');
            event.currentTarget.classList.toggle('slide-on');
            event.currentTarget.classList.toggle('wait-left');
            viewModel.ActiveCard()().IsFlipped(true); 
        }else{
            event.currentTarget.classList.toggle('slide-off');
            event.currentTarget.classList.toggle('flip');
            viewModel.getNextCard();
            _.delay(function(){
                event.currentTarget.classList.toggle('slide-off');
                event.currentTarget.classList.toggle('wait-left');
            }, 600);
        }
    };

    viewModel.reportAndNext = function(){


    };

    viewModel.getNextCard = function(){
        var postObject = {};
        postObject.cardset = viewModel.CardsetInfo().Name();
        postObject.algorithm = viewModel.Algorithm();
        $.ajax({
            method: "POST",
            url: "/card-api/get-next",
            contentType: "application/json",
            data: JSON.stringify(postObject),
            success: function(arg){
                var newCard = card.fromJson(arg);
                viewModel.CardHistory.push(viewModel.ActiveCard()()); 
                viewModel.InactiveCard()(newCard);
                viewModel.CardToggle(!viewModel.CardToggle());
                if(viewModel.CardToggle()){
                    viewModel.SlideTwo(true);
                    _.delay(function(){viewModel.SlideTwo(false);}, 600);
                } else {
                    viewModel.SlideOne(!viewModel.SlideOne());
                    _.delay(function(){viewModel.SlideOne(false);}, 600);
                }
            },
            error: function(arg){
                console.error(arg);
            }
        });
    };

    card.setScoreCallback(viewModel.reportAndNext);

    return viewModel;
});
