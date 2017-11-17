var area = require('../../../domain/area');
var pomelo = require('pomelo');
var area =pomelo.app.area;
var handler = module.exports;

handler.getUserInfo = function(msg, session, next) {
	var user = area.getUser(session.uid);
	console.log('user:', typeof(user), session.uid, area.users);
	if (!user) {
		next(new Error('user not exist'));
		return;
	}
	next(null, user.toJSON());
};
handler.qiangDiZhi = function(msg, session, next) {
   // msg.roomid=session.get("roomid");
    msg.uid=session.uid;
    area.qiangDiZhi(msg);
    next(null);
};
handler.chupai = function(msg, session, next) {
    // msg.roomid=session.get("roomid");
    msg.uid=session.uid;
    area.chupai(msg);
    next(null);
};
handler.zaiwanyiju = function(msg, session, next) {
    // msg.roomid=session.get("roomid");
    msg.uid=session.uid;
    area.zaiwanyiju(msg);
    next(null);
};