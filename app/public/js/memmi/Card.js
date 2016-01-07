define(["knockout", "memmi/Information"], function(ko, information){
    function Card(cardId, frontInformation, backInformation){
        this.CardId = ko.observable(cardId || "No-Card");
        this.Front = ko.observable(frontInformation || new information());
        this.Back = ko.observable(backInformation || new information());
        this.Flipped = ko.observable(false);

        this.ActiveSide = ko.computed(function(){
            return this.Flipped() ? this.Back() : this.Front();        
        }, this);

        this.InfoTemplate = ko.computed(function(){
            return 'info-' + this.ActiveSide().Type();
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
