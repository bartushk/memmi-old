define(["knockout"], function(ko){

    function CardsetInfo(id){
        var self = this;
        this.Id = ko.observable(id || "No-Id"); 
        this.History = ko.observable({}); 
        this.HistoryFetched = ko.observable(false);
        this.fetchHistory();

        this.Statistics = ko.computed(function(){
            var statistics = [];
            if( !self.HistoryFetched() ){
                return statistics;
            }
            var totalCards = _.keys(self.History().history).length;
            statistics.push({'Title': 'Cards', 'Value': totalCards}); 

            var totalCardsPlayed = self.History()._playIndex;
            statistics.push({'Title': 'Tries', 'Value': totalCardsPlayed});
            
            var cardScores = _.map(self.History().history, function(hist){return hist.currentScore;});
            var sumScores = _.reduce(cardScores, function(prev, curr){return prev + curr;}, 0);
            var averageScore = Math.round(sumScores / totalCardsPlayed * 100) / 100;
            if(totalCardsPlayed === 0){
                averageScore = 0;
            }
            statistics.push({'Title': 'Avg Score', 'Value': averageScore});

            var cycles = totalCardsPlayed === 0 ? 0 : totalCardsPlayed / totalCards;
            cycles = Math.round(cycles * 100) / 100;
            statistics.push({'Title': 'Cycles', 'Value': cycles});

            return statistics;
        });
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
