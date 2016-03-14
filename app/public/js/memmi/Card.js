define(["knockout", "memmi/Information"], function(ko, information){
    var cardScoreCallback = function(){};

    function Card(cardId, frontInformation, backInformation, title){
        this.CardId = ko.observable(cardId || "_none");
        this.Title = ko.observable(title || "No-Title");
        this.Front = ko.observable(frontInformation || new information());
        this.Back = ko.observable(backInformation || new information());
        this.IsFlipped = ko.observable(false);
    }

    Card.prototype.scoreCard = function(score){
        var cardUpdate = {};
        cardUpdate.cardId = this.CardId();
        cardUpdate.score = score;
        cardScoreCallback(cardUpdate);
    };

    Card.setScoreCallback = function(callback){
        cardScoreCallback = callback;
    };

    Card.fromJson = function(jsonCard){
        var frontInfo = new information(jsonCard.frontInfo.type, jsonCard.frontInfo.value);
        var backInfo = new information(jsonCard.backInfo.type, jsonCard.backInfo.value);
        var newCard = new Card(jsonCard.id, frontInfo, backInfo, jsonCard.title);
        return newCard;
    };

    return Card;
});
