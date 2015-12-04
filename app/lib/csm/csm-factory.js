var manager = requre('./memory-csm');
var cardSetValidator = require('../validators/card-set-AT');

module.exports = {
    getCsm : function getCSM(){
        return new manager({}, new cardSetValidator());
    }

};
