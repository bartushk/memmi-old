


var cardset1 = {
    'id': 'cardset1',

    'cards': {
        'coolCard': {},
        'nerdCard': {},
        'dudeCard': {}
    }
};

var cardset2 = {
    'id': 'cardset2',

    'cards': {
        'funCard': {},
        'boringCard': {},
        'dorkCard': {}
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
                'catCard': {'scores': [], 'currentScore': 0, 'playIndicies': [] }
            },
        }
    }
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
    getCardHistory: function(){ return JSON.parse(JSON.stringify(fakePlayerHistory)); },
    getCardSet1GoodUpdate: function(){ return JSON.parse(JSON.stringify(testCardUpdate)); },
    getCardSet1BadUpdate: function(){ return JSON.parse(JSON.stringify(testBadCardUpdate)); },
};





module.exports = fakeData;
