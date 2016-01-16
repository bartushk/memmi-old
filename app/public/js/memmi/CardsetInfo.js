define(["knockout"], function(ko){

    function CardsetInfo(name){
        this.Name = ko.observable(name || "No-Name"); 
        this.History = ko.observable({}); 
        this.HistoryFetched = ko.observable(false);
    }

    CardsetInfo.prototype.fetchHistory = function(){
    
    };

    
    return CardsetInfo;
});
