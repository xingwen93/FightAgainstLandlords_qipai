module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;

};
var id=0;
Handler.prototype.queryEntry = function(msg, session, next) {
	//console.log("luo:", msg, session);
	var connectors = this.app.getServersByType('connector');
    this.id++;
	if (!connectors || connectors.length === 0) {
		next(null, {code: 500});
		return;
	}
     id++;
	if( id>=connectors.length){
        id=0;
	}
	var index = id;// parseInt(Math.random() * connectors.length, 10);
	var res = connectors[index];
    console.log('Handler.prototype.queryEntry',index);
	next(null, {code: 0, host: res.host, port: res.clientPort});
};

