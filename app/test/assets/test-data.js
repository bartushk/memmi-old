
var cardset1 = {
    'id': 'cardset1',

    'cards': {
        'coolCard': {
            'frontInfo':{'type':'text', 'value':'Hello there.'}, 
            'backInfo': {'type':'markdown', 'value': '```js var world = world!```'}, 
            'id': 'coolCard'},
        'nerdCard': {
            'frontInfo':{'type':'bbcode', 'value':'[b]Hello[/b]'}, 
            'backInfo': {'type':'text', 'value':'Hello there.'}, 
            'id': 'nerdCard'},
        'dudeCard': {
            'frontInfo':{'type':'markdown', 'value':'##Hello there.'}, 
            'backInfo': {'type':'text', 'value':'Hello there.'}, 
            'id': 'dudeCard'}
    }
};

var cardset2 = {
    'id': 'cardset2',

    'cards': {
        'funCard': {'frontInfo':{}, 'backInfo': {}, 'id': 'funCard'},
        'boringCard': {'frontInfo':{}, 'backInfo': {}, 'id': 'boringCard'},
        'dorkCard': {'frontInfo':{}, 'backInfo': {}, 'id': 'dorkCard'}
    }
};


var fakePlayerHistory = {
    "kyle": {
        'cardset1': {
            '_playIndex': 16,
            'history': {
                'coolCard': {'scores': [0,1,2,2,3,3], 'currentScore': 11, 'playIndicies': [0,3,4,10,11,15] },
                'nerdCard': {'scores': [-2,-1,-1,-1,0], 'currentScore': -5, 'playIndicies': [1,2,8,9,12] },
                'dudeCard': {'scores': [0,0,0,0,0], 'currentScore': 0, 'playIndicies': [5,6,7,13,14] }
            },
        }
    },

    "wanyi": {
        'cardset2': {
            '_playIndex': 16,
            'history': {
                'funCard': {'scores': [0,1,2,2,3,3], 'currentScore': 11, 'playIndicies': [0,3,4,10,11,15] },
                'boringCard': {'scores': [-2,-1,-1,-1,0], 'currentScore': -5, 'playIndicies': [1,2,8,9,12] },
                'dorkCard': {'scores': [0,0,0,0,0], 'currentScore': 0, 'playIndicies': [5,6,7,13,14] },
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
