define(["knockout", "jquery", "underscore", "memmi/Card", "memmi/Information"],
function(ko, $, _, card, information){
    var welcomeFront = new information('text', 'Welcome to memmi.');
    var welcomeBack = new information('text', 'Memmi is an app to help you with memorization');
    
    var viewModel = {
        ActiveCard: ko.observable(new card('Welcome', welcomeFront, welcomeBack)),  
    };

    return viewModel;
});
