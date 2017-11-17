var async = require('async');
var roomManager = require('../../../services/roomManager');
module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
    console.log('login');
    var uid, self = this,info="";
    async.waterfall([
        function(cb) {
            self.app.rpc.auth.authRemote.auth(session, msg, cb);
        }, function(id, cb) {
            if (id === null) {
                next(null, {code: 500});
                return;
            }
            uid = id;
            self.app.get('sessionService').kick(uid, cb);
        }, function(cb) {
            session.bind(uid, cb);
        }, function(cb) {
            var areaServers = self.app.getServersByType('area');
            if (!areaServers || areaServers.length === 0) {
                next(null, {code: 500});
                return;
            }
            var index = parseInt(Math.random() * areaServers.length, 10);
            var res = areaServers[index];

            console.log('session.id:',self.app.get('serverId'));
            session.set('sid',self.app.get('serverId'));
            session.on('closed', onUserLeave.bind(null, self.app));
            session.pushAll(cb);
           // self.app.rpc.area.userRemote.userEnter(session, {'uid': uid}, cb);

        }, function(cb) {
            self.app.rpc.auth.authRemote.getUserInfo(session, {'uid': uid}, cb);
        }
    ], function(err,res) {
        if (err) {
            next(err, {code: 500});
        }
        next(null, {code: 0, msg:res});
    });
};/**
 * 玩家  快速开始 进入游戏.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */

Handler.prototype.kuaisuyouxi = function(msg,session, next) {
    console.log('kuaisuyouxi');
    var roomid,serverid,self = this,info="";
    async.waterfall([
        function(cb) {
            var serverId =session.get('areaServerId');
            if(!!serverId){
                self.app.rpc.area.userRemote.userLeave(session, {'uid': session.uid}, cb);
            }else{
                cb(null);
            }

        },
        function(cb) {
            var areas= self.app.getServersByType('area');
            msg.areas=areas;
            self.app.rpc.fjh.fjhRemote.fjh(session, msg, cb);
        }, function(res, cb) {
            if (res === null) {
                next(null, {code: 500});
                return;
            }
            roomid = res.roomid;
            serverid = res.serverid;
            console.log('areaServerId.id:',!!session.get('areaServerId'));
            session.set('roomid',roomid);
            session.set('areaServerId',serverid);
            session.pushAll(cb);
        }, function(cb) {
            self.app.rpc.area.userRemote.userEnter(session, {'uid': session.uid,"sid":session.get('sid')}, cb);
        }
    ], function(err) {
        if (err) {
            next(err, {code: 500});
        }
        console.log('areaServerIdareaServerId.id:',session.get('areaServerId'));
        next(null, {code: 0});
    });
};
var onUserLeave = function(app, session, reason) {
    console.log('onUserLeave:', session.uid);
    if (!session || !session.uid||!session.get('areaServerId')) {
        return;
    }
    console.log('onUserLeave:', session.uid);
    app.rpc.area.userRemote.userLeave(session, {uid: session.uid}, function(err) { });
};