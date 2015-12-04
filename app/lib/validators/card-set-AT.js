
function CardSetValidator(){
    this.ok = "Okay";
}

CardSetValidator.prototype.validate = function(cardSet){
    return this.ok;
};

module.exports = CardSetValidator;

