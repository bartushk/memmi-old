
var cardset1 = {
    'id': 'cardset1',

    'cards': {
        'coolCard': {
            'title': 'Cool Card Title',
            'frontInfo':{'type':'text', 'value':'Hello there.'}, 
            'backInfo': {'type':'html', 'value': '<script>console.log("xss");</script>'}, 
            'id': 'coolCard'},
        'nerdCard': {
            'title': 'Nerd Card Title',
            'frontInfo':{'type':'html', 'value':'<h1>Hey there html!</h1>'}, 
            'backInfo': {'type':'html', 'value':'Hello there.'}, 
            'id': 'nerdCard'},
        'dudeCard': {
            'title': 'Dude Card Title',
            'frontInfo':{'type':'text', 'value':'##Hello there.'}, 
            'backInfo': {'type':'html', 'value':'Hello there.'}, 
            'id': 'dudeCard'}
    }
};

var cardset2 = {
    'id': 'cardset2',

    'cards': {
        'funCard': {'title': 'Cool cards!', 'frontInfo':{}, 'backInfo': {}, 'id': 'funCard'},
        'boringCard': {'title': 'Cool cards!', 'frontInfo':{}, 'backInfo': {}, 'id': 'boringCard'},
        'dorkCard': {'title': 'Cool cards!', 'frontInfo':{}, 'backInfo': {}, 'id': 'dorkCard'}
    }
};


var fakePlayerHistory = {
    "kyle": {
        'cardset1': {
            '_playIndex': 16,
            'history': {
                'coolCard': {'scores': [0,1,2,2,3,3], 'currentScore': 11, 'playIndicies': [0,3,4,10,11,15], 'card_index': 0 },
                'nerdCard': {'scores': [-2,-1,-1,-1,0], 'currentScore': -5, 'playIndicies': [1,2,8,9,12], 'card_index': 1 },
                'dudeCard': {'scores': [0,0,0,0,0], 'currentScore': 0, 'playIndicies': [5,6,7,13,14], 'card_index': 2 }
            },
        }
    },

    "wanyi": {
        'cardset2': {
            '_playIndex': 16,
            'history': {
                'funCard': {'scores': [0,1,2,2,3,3], 'currentScore': 11, 'playIndicies': [0,3,4,10,11,15], 'card_index': 0 },
                'boringCard': {'scores': [-2,-1,-1,-1,0], 'currentScore': -5, 'playIndicies': [1,2,8,9,12], 'card_index': 1 },
                'dorkCard': {'scores': [0,0,0,0,0], 'currentScore': 0, 'playIndicies': [5,6,7,13,14], 'card_index': 2 },
            },
        }
    }
};

var testFullCardSet = {
    'cardset1': cardset1,
    'cardset2': cardset2
};

var testCardUpdate = {
    'cardId': 'coolCard',
    'score': 10
};

var testBadCardUpdate = {
    'cardId': 'nerd-card',
    'score': 12
};

var fakeData = {
    getCardSet1: function(){ return JSON.parse(JSON.stringify(cardset1)); },
    getCardSet2: function(){ return JSON.parse(JSON.stringify(cardset2)); },
    getFullHistory: function(){ return JSON.parse(JSON.stringify(fakePlayerHistory)); },
    getCardSet1GoodUpdate: function(){ return JSON.parse(JSON.stringify(testCardUpdate)); },
    getCardSet1BadUpdate: function(){ return JSON.parse(JSON.stringify(testBadCardUpdate)); },
    getCardSetHistory: function(){ return JSON.parse(JSON.stringify(fakePlayerHistory.kyle.cardset1)); },
    getFullCardSet: function(){ return JSON.parse(JSON.stringify(testFullCardSet)); }

};


module.exports = fakeData;
