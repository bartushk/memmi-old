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
        'score' : {'type': 'number'}
    }
};

var getNextSchema = {
    'id' : '/get-next',
    'type': 'object',
    'properties': {
        'cardset' : {'type': 'string'},
        'algorithm' : {'type': 'string'}
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
