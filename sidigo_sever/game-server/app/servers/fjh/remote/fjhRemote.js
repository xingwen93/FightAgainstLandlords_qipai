var logger = require('pomelo-logger').getLogger(__filename);
var fjh = require('../../../domain/fjh');
var remote = module.exports;
remote.fjh = function(args, cb) {
    var res=fjh.getFjh(args);
    cb(null,res);
};


