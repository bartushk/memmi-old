define(["knockout"], function(ko){

    function CardsetInfo(name){
        this.Name = ko.observable(name || "No-Name"); 
        this.History = ko.observable({}); 
        this.HistoryFetched = ko.observable(false);
        this.TitleTemplate = ko.observable("title-standard");
    }

    CardsetInfo.prototype.fetchHistory = function(){
    
    };

    
    return CardsetInfo;
});
