define(["knockout", "memmi/Information"], function(ko, information){
    function Card(cardId, frontInformation, backInformation){
        this.CardId = ko.observable(cardId || "No-Card");
        this.Front = ko.observable(frontInformation || new information());
        this.Back = ko.observable(backInformation || new information());
        this.IsFlipped = ko.observable(false);
        this.CardTitle = ko.computed(function(){
            var appendText = this.IsFlipped() ? ' - Back' : ' - Front';
            return this.CardId() + appendText;
        }, this);

    }

    Card.fromJson = function(jsonCard){
        var frontInfo = new information(jsonCard.frontInfo.type, jsonCard.frontInfo.value);
        var backInfo = new information(jsonCard.backInfo.type, jsonCard.backInfo.value);
        var newCard = new Card(jsonCard.id, frontInfo, backInfo);
        return newCard;
    };

    return Card;
});
