define(["memmi/Information"], function(information){
  function Card(cardId, frontInformation, backInformation){
    this.cardId = cardId || "No-Card";
    this.frontInformation = frontInformation || new information();
    this.backInformation = backInformation || new information();
  }

  return Card;
});
