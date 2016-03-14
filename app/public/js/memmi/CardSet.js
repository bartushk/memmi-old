define(["knockout", "memmi/Card", "memmi/Information"], 
function(ko, card, information){

    function CardSet(title, author){
        this.Title = ko.observable(title || "No Title");
        this.Author = ko.observable(author || "Anon");
        this.Cards = ko.observableArray([ new card() ]);
    }

    CardSet.prototype.fromJson = function(){
        var newCardSet = new CardSet();
        return newCardSet; 
    };

    return CardSet;
});
