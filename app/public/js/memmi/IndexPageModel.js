define(["knockout", "jquery", "underscore", "memmi/Card", "memmi/Information"],
function(ko, $, _, card, information){
    var welcomeFront = new information('text', 'Welcome to memmi.');
    var welcomeBack = new information('text', 'Memmi is an app to help you with memorization');
    
    var viewModel = {
        ActiveCard: ko.observable(new card('Welcome', welcomeFront, welcomeBack)),  
        CurrentCardset: ko.observable('cardset1'),
        CurrentAlgorithm: ko.observable('random'),
        CardHistory: ko.observableArray()
    };

    viewModel.cardAction = function(item, event){
        if( !viewModel.ActiveCard().IsFlipped() ){
            event.currentTarget.classList.toggle('flip');
            viewModel.ActiveCard().IsFlipped(true); 
        }else{
            viewModel.getNextCard();
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
