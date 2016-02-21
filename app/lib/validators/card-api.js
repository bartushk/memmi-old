var Validator = require('jsonschema').Validator;
var v = new Validator();

var apiEndpoints = {};

/*
 * Json schemas for each card-api endpoint used for
 * validating input from a user.
 *
*/ 
 

var cardUpdateSchema = {
    'id' : '/cardUpdate',
    'type': 'object',
    'properties': {
        'cardId' : {'type': 'string'},
        'score' : {'type': 'number'},
        'play_index': {'type': 'number'}
    },
    'required': ['cardId', 'score', 'play_index']
};

var getNextSchema = {
    'id' : '/get-next',
    'type': 'object',
    'properties': {
        'cardset' : {'type': 'string'},
        'algorithm' : {'type': 'string'},
        'prevCard' : {'type': 'string'}
    },
    'required': ['cardset', 'algorithm']
};


var reportSchema = {
    'id' : '/get-next',
    'type': 'object',
    'properties': {
        'cardset' : {'type': 'string'},
        'cardUpdate': {'$ref': '/cardUpdate'}
    },
    'required': ['cardset', 'cardUpdate']
};

var reportGetNextSchema = {
    'id' : '/get-next',
    'type': 'object',
    'properties': {
        'cardset' : {'type': 'string'},
        'algorithm' : {'type': 'string'},
        'prevCard' : {'type': 'string'},
        'cardUpdate': {'$ref': '/cardUpdate'}
    },
    'required': ['cardset', 'cardUpdate',  'algorithm']
};


apiEndpoints['get-next'] = getNextSchema;
apiEndpoints.report = reportSchema;
apiEndpoints['report-get-next'] = reportGetNextSchema;

v.addSchema(cardUpdateSchema, '/cardUpdate');

module.exports = function(endpointName, toValidate){
    return v.validate(toValidate, apiEndpoints[endpointName]).errors.length === 0;
};
