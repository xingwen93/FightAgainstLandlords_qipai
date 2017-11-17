var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
var sync = require('pomelo-sync-plugin');
var area = require('./app/domain/area');
var logger = require('pomelo-logger').getLogger(__filename)
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'sidigo_qipai');
// configure for global
app.configure('production|development', function() {
    app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
});

// Configure database
app.configure('production|development', 'connector|area|auth', function() {
    var dbclient = require('./app/dao/mysql/mysql').init(app);
    app.set('dbclient', dbclient);
    // app.load(pomelo.sync, {path:__dirname + '/app/dao/mapping', dbclient: dbclient});
  //  app.use(sync, {sync: {path:__dirname + '/app/dao/mapping', dbclient: dbclient}});
});

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 600,
      disconnectOnTimeout: true,
      useDict : true,
      useProtobuf : true,
      handshake : function(msg, cb){
      cb(null, {});
    }

    });
});
app.configure('production|development', 'gate', function() {
	app.set('connectorConfig', {
		connector: pomelo.connectors.hybridconnector,
		useProtobuf: true
	});
});
app.configure('production|development', 'area', function(){
    var server = app.curServer;
    logger.debug('server:',server.id);
    app.area = new area(server.id);
});

app.route('area', routeUtil.area);
// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
