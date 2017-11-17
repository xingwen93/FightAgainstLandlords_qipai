var _poolModule = require('generic-pool');
var mysql = require('mysql');
/*
 * Create mysql connection pool.
 */
var createMysqlPool;
createMysqlPool = function (app) {
    var mysqlConfig = app.get('mysql');
    const factory = {
        create: function () {
            return new Promise(function (resolve, reject) {

                var client = mysql.createConnection({
                    host: mysqlConfig.host,
                    user: mysqlConfig.user,
                    password: mysqlConfig.password,
                    database: mysqlConfig.database
                });
                //  client.connect();
                //  resolve(client);
                client.on('error', function () {
                    client.connect();
                });
                client.connect(function (error) {
                    if (error) {
                        console.log('sql connect error');
                    }
                    resolve(client)
                });
            });
        },
        destroy: function (client) {
            return new Promise(function (resolve) {
                client.on("end", function () {
                    resolve();
                });
                // client.disconnect();
                client.end()
            })
        }
    };

    var opts = {
        max: 10, // maximum size of the pool
        idleTimeoutMillis: 30000,
        min: 1 // minimum size of the pool
    };


    return _poolModule.createPool(factory, opts);

};

exports.createMysqlPool = createMysqlPool;
