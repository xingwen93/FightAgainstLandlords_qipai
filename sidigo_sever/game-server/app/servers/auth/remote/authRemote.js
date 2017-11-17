var logger = require('pomelo-logger').getLogger(__filename)
var accountDao = require('../../../dao/accountDao.js');
//var area = require('../../../domain/area');
var userDao = require('../../../dao/userDao.js');
var User = require('../../../domain/user');
var remote = module.exports;
remote.auth = function(args, cb) {
	var username = args.username;
	var host = args.host || 0;
	queryUid(username, host, function(id) {
		if (id === null) {
			cb(null, null);
			return;
		}
		cb(null, id);
	});
};

remote.getUserInfo = function(args, cb) {
    logger.debug('remote.userEnter:', args.uid);
    getUser(args.uid, function(res) {
        logger.debug('getUser:', res);
        if (res === null) {
            cb(new Error('get user failed.'));
            return;
        }
        cb(null,res.toJSON());
    });
};
var getUser = function(uid, cb) {
    userDao.getUser(uid, function(err, res) {
        console.log('userDao.getUser:', res);
        if (res === null) {
            var user = new User({uid: uid});
            userDao.createUser(user, function(err) {
                logger.info(err)
                if (err === null) {
                    cb(user)
                } else {
                    cb(null)
                }
            });
        } else {
            cb(new User(res));
        }
    });
};

var queryUid = function(username, host, cb) {
	accountDao.getUserId(username, host, function(err, uid) {
		if (uid === null) {
			accountDao.createAccount(username, host, function(err, uid) {
				logger.info(err, uid)
				cb(uid)	
			});
		} else {
			cb(uid);
		}
	});
};
