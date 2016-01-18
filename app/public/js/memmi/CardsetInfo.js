define(["knockout"], function(ko){

    function CardsetInfo(id){
        this.Id = ko.observable(id || "No-Id"); 
        this.History = ko.observable({}); 
        this.HistoryFetched = ko.observable(false);
        this.fetchHistory();
    }

    CardsetInfo.prototype.fetchHistory = function(){
        var self = this;
        var postObject = {};
        postObject.cardset = this.Id();
        $.ajax({
            method: "POST",
            url: "/player-api/history",
            contentType: "application/json",
            data: JSON.stringify(postObject),
            success: function(arg){
               self.History(arg); 
               self.HistoryFetched(true);
            },
            error: function(arg){
                console.error(arg);
            }
        });
    };

    
    return CardsetInfo;
});
