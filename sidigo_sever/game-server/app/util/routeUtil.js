var exp = module.exports;

exp.area = function(session, msg, app, cb) {
    var areas = app.getServersByType('area');
    if (!areas || areas.length === 0) {
        next(null, {code: 500});
        return;
    }
    var index = parseInt(Math.random() * areas.length, 10);

    var res = areas[session.rid];
	var serverId =session.get('areaServerId');//res.id;
	if(!serverId) {
		cb(new Error('can not find server info for type: ' + msg.serverType));
		return;
	}
	cb(null, serverId);
};

exp.connector = function(session, msg, app, cb) {
	if(!session) {
		cb(new Error('fail to route to connector server for session is empty'));
		return;
	}

	if(!session.frontendId) {
		cb(new Error('fail to find frontend id in session'));
		return;
	}

	cb(null, session.frontendId);
};
