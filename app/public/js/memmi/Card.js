define(["knockout", "memmi/Information"], function(ko, information){
  function Card(cardId, frontInformation, backInformation){
    this.CardId = ko.observable(cardId || "No-Card");
    this.Front = ko.observable(frontInformation || new information());
    this.Back = ko.observable(backInformation || new information());
    this.Flipped = ko.observable(false);
    this.ActiveSide = ko.computed(function(){
        return this.Flipped() ? this.Back() : this.Front();        
    }, this);

  }

  return Card;
});
