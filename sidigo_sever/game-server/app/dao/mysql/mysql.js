// mysql CRUD
var sqlclient = module.exports;

var _pool;

var NND = {};

/*
 * Init sql connection pool
 * @param {Object} app The app for the server.
 */
NND.init = function(app){
	_pool = require('./dao-pool').createMysqlPool(app);
};

/**
 * Excute sql statement
 * @param {String} sql Statement The sql need to excute.
 * @param {Object} args The args for the sql.
 * @param {fuction} cb Callback function.
 * 
 */
NND.query = function (sql, args, cb) {
    const resourcePromise = _pool.acquire();
    resourcePromise.then(function (client) {
        client.query(sql, args, function (err, res) {
            if (err) {
                _pool.destroy(client);
                cb(err, res);
            }
            else {
                _pool.release(client);
                cb(err,res);
            }
        });
    }, function () {
        console.log("reject");
    }).catch(function (err) {
// handle error - this is generally a timeout or maxWaitingClients
// error
        console.log("errr... query", err);
        cb(err);
    });
};

/**
 * Close connection pool.

NND.shutdown = function(){
	_pool.destroyAllNow();
};
 */
NND.shutdown = function () {
    _pool.drain().then(function () {
        _pool.clear();
    });
};

/**
 * init database
 */
sqlclient.init = function(app) {
	if (!!_pool){
		return sqlclient;
	} else {
		NND.init(app);
		sqlclient.insert = NND.query;
		sqlclient.update = NND.query;
		sqlclient.delete = NND.query;
		sqlclient.query = NND.query;
		return sqlclient;
	}
};

/**
 * shutdown database
 */
sqlclient.shutdown = function(app) {
	NND.shutdown(app);
};






