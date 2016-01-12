define(["knockout", "jquery", "underscore", "memmi/Card", "memmi/Information"],
function(ko, $, _, card, information){
    var welcomeFront = new information('text', 'Welcome to memmi.');
    var welcomeBack = new information('text', 'Memmi is an app to help you with memorization');
    
    var viewModel = {
        CardOne: ko.observable(new card('Welcome', welcomeFront, welcomeBack)),  
        CardTwo: ko.observable(new card('Welcome', welcomeFront, welcomeBack)),  
        CardToggle: ko.observable(false),
        CurrentCardset: ko.observable('cardset1'),
        CurrentAlgorithm: ko.observable('random'),
        CardHistory: ko.observableArray(),
    };

    viewModel.ActiveCard = ko.computed(function(){
        return viewModel.CardToggle() ? viewModel.CardTwo() : viewModel.CardOne();
    });

    viewModel.UnactiveCard = ko.computed(function(){
        return viewModel.CardToggle() ? viewModel.CardOne() : viewModel.CardTwo();
    });

    viewModel.cardAction = function(item, event){
        if( !viewModel.ActiveCard().IsFlipped() ){
            event.currentTarget.classList.toggle('flip');
            viewModel.ActiveCard().IsFlipped(true); 
        }else{
            event.currentTarget.classList.toggle('slide-off');
            event.currentTarget.classList.toggle('flip');
            _.delay(function(){
                event.currentTarget.classList.toggle('slide-off');
                event.currentTarget.classList.toggle('wait-left');
                event.currentTarget.classList.toggle('slide-on');
            }, 600);
        }
    };

    viewModel.getNextCard = function(){
        var postObject = {};
        postObject.cardset = viewModel.CurrentCardset();
        postObject.algorithm = viewModel.CurrentAlgorithm();
        $.ajax({
            method: "POST",
            url: "/card-api/get-next",
            contentType: "application/json",
            data: JSON.stringify(postObject),
            success: function(arg){
               var newCard = card.fromJson(arg);
               viewModel.CardHistory.push(viewModel.ActiveCard()); 
               viewModel.ActiveCard(newCard);
            },
            error: function(arg){
                console.error(arg);
            }
        });
    };

    return viewModel;
});
