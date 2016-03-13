

var userStore = {
    'bartushk': { 'playerId': 'bartushk', 'pass': '$2a$12$hSdzwlQmqyMyRcSFYWQ9l.jDvkUpF/8rfeXcq3rR7ZOP/Pb0Rb6sq', 
                'firstName': 'Kyle', 'lastName': 'Bartush', 
                'State': 'PA', 'City': 'Pittsburgh', 'email': 'bartushk@gmail.com', 'confirmed': false }, 

    'zhuw': { 'playerId': 'zhuw', 'pass': '$2a$12$wyUtKvyjQI5ErxpPna4FJOSgt/LUQUIpLGNCHcl6r7YE2ntta63b6', 
                'firstName': 'Wanyi', 'lastName': 'Zhu', 
                'State': 'PA', 'City': 'Pittsburgh', 'email': 'wanyizhupsu@gmail.com', 'confirmed': false },

    'doodie': { 'playerId': 'doodie', 'pass': '$2a$04$UyfloHJnatTIdE3/6C3vo.NzVzm4XOFOsrPzTJBiYh7k40vgYJGNm', 
                'firstName': 'Kyle', 'lastName': 'Bartush', 
                'State': 'PA', 'City': 'Pittsburgh', 'email': 'dood@ie.com', 'confirmed': false },
};

var welcomeCardSet = {
    'id': 'welcome',
    'setId': 'welcome',
    'title': 'Welcome to memmi!',
    'createdDate': new Date().toISOString(),
    'author': 'kyle',

    'cards': {
        'cardOne': {
            'title': 'Welcome',
            'frontInfo':{'type':'html', 'value':'<h1>Welcome to memmi!</h1>Memmi is a flash card application that<br/> can' +
                ' help with memorization. <br/><br/> You can click anywhere on this card to flip it.'}, 
            'backInfo': {'type':'html', 'value': '<br/><br/><br/>After flipping a card you have to grade it. <br/><br/>' +
                'Click the red box below if you didn\'t know the answer at all. <br/>' +
                'Click the green box if you knew it very well. '}, 
            'id': 'cardOne', 'cardIndex': 0},
        'cardTwo': {
            'title': 'Navigation',
            'frontInfo':{'type':'html', 'value':'<br/><br/><br/>You can also use the arrow keys to play memmi.<br/><br/>' +
                'You can press the right, up, or down arrow to flip a card.'}, 
            'backInfo': {'type':'html', 'value': '<br/><br/><br/>You can also score a card using the arrow keys.' +
                '<br/><br/> Up = +1 (Lime Green)' +
                '<br/> Right = 0 (Lime Green)' +
                '<br/> Down = -1 (Orange)'}, 
            'id': 'cardTwo', 'cardIndex': 1},
        'cardThree': {
            'title': 'Statistics',
            'frontInfo':{'type':'html', 'value':'<br/><br/><br/>Memmi keeps tracks of statistics while you play.<br/>' +
                '<br/><br/>This helps memmi serve the most relevant card possible.'},  
            'backInfo': {'type':'html', 'value': '<br/><br/>An individual card\'s statistics are in its title bar above.' +
            'the whole card set\'s statistics below.'}, 
            'id': 'cardThree', 'cardIndex': 2},
    }

};

var cardset1 = {
    'id': 'cardset1',
    'setId': 'cardset1',
    'title': 'Cool cardset.',
    'createdDate': new Date().toISOString(),
    'author': 'kyle',

    'cards': {
        'coolCard': {
            'title': 'Cool Card Title',
            'frontInfo':{'type':'text', 'value':'Hello there.'}, 
            'backInfo': {'type':'html', 'value': '<script>console.log("xss");</script>'}, 
            'id': 'coolCard', 'cardIndex': 0},
        'nerdCard': {
            'title': 'Nerd Card Title',
            'frontInfo':{'type':'html', 'value':'<h1>Hey there html!</h1>'}, 
            'backInfo': {'type':'html', 'value':'Hello there.'}, 
            'id': 'nerdCard', 'cardIndex': 1},
        'dudeCard': {
            'title': 'Dude Card Title',
            'frontInfo':{'type':'text', 'value':'##Hello there.'}, 
            'backInfo': {'type':'html', 'value':'Hello there.'}, 
            'id': 'dudeCard', 'cardIndex': 2}
    }
};

var cardset2 = {
    'id': 'cardset2',
    'setId': 'cardset2',
    'title': 'Cool cardset.',
    'createdDate': new Date().toISOString(),
    'author': 'wanyi',

    'cards': {
        'funCard': {'title': 'Cool cards!', 'frontInfo':{}, 'backInfo': {}, 'id': 'funCard', 'cardIndex': 0},
        'boringCard': {'title': 'Cool cards!', 'frontInfo':{}, 'backInfo': {}, 'id': 'boringCard', 'cardIndex': 1},
        'dorkCard': {'title': 'Cool cards!', 'frontInfo':{}, 'backInfo': {}, 'id': 'dorkCard', 'cardIndex': 2}
    }
};


var fakePlayerHistory = {
    "kyle": {
        'cardset1': {
            'metaInfo': {'playerId':'kyle','cardSetId':'cardset1' },
            '_playIndex': 16,
            'history': {
                'coolCard': {'scores': [0,1,2,2,3,3], 'currentScore': 11, 'playIndicies': [0,3,4,10,11,15], 'cardIndex': 0 },
                'nerdCard': {'scores': [-2,-1,-1,-1,0], 'currentScore': -5, 'playIndicies': [1,2,8,9,12], 'cardIndex': 1 },
                'dudeCard': {'scores': [0,0,0,0,0], 'currentScore': 0, 'playIndicies': [5,6,7,13,14], 'cardIndex': 2 }
            },
        }
    },

    "wanyi": {
        'cardset2': {
            'metaInfo': {'playerId':'wanyi','cardSetId':'cardset2' },
            '_playIndex': 16,
            'history': {
                'funCard': {'scores': [0,1,2,2,3,3], 'currentScore': 11, 'playIndicies': [0,3,4,10,11,15], 'cardIndex': 0 },
                'boringCard': {'scores': [-2,-1,-1,-1,0], 'currentScore': -5, 'playIndicies': [1,2,8,9,12], 'cardIndex': 1 },
                'dorkCard': {'scores': [0,0,0,0,0], 'currentScore': 0, 'playIndicies': [5,6,7,13,14], 'cardIndex': 2 },
            },
        }
    },

    "doodie": {
        '__test_only': {
            '_playIndex': 1,
            'history': {
            }
        }
    }
};

var testFullCardSet = {
    'cardset1': cardset1,
    'cardset2': cardset2,
    'welcome': welcomeCardSet
};

var testCardUpdate = {
    'cardId': 'coolCard',
    'score': 10,
    'play_index': 1
};

var testBadCardUpdate = {
    'cardId': 'nerd-card',
    'score': 12,
    'play_index': 3
};

var fakeData = {
    getCardSet1: function(){ return JSON.parse(JSON.stringify(cardset1)); },
    getCardSet2: function(){ return JSON.parse(JSON.stringify(cardset2)); },
    getFullHistory: function(){ return JSON.parse(JSON.stringify(fakePlayerHistory)); },
    getCardSet1GoodUpdate: function(){ return JSON.parse(JSON.stringify(testCardUpdate)); },
    getCardSet1BadUpdate: function(){ return JSON.parse(JSON.stringify(testBadCardUpdate)); },
    getCardSetHistory: function(){ return JSON.parse(JSON.stringify(fakePlayerHistory.kyle.cardset1)); },
    getUserStore: function(){ return JSON.parse(JSON.stringify(userStore)); },
    getFullCardSet: function(){ return JSON.parse(JSON.stringify(testFullCardSet)); }
};


module.exports = fakeData;
