var logger = require('pomelo-logger').getLogger(__filename)
var pomelo = require('pomelo');
var Timer = require('./timer');
var Room = require('./room');
var User = require('./user');
var Instance = function(serverid) {
    this.start="init"+serverid;
    this.users = {};
    this.rooms={};
    this.noroomuser=[];
    this.roomid=1;
    logger.debug('area.start:', this.start)
    this.timer = new Timer({
        area : this,
        interval : 100
    });
    this.init();
    this.timestamp = Date.parse(new Date());
    this.td=3000;
};
module.exports = Instance;
Instance.prototype.init = function(area){
    this.timer.run();
};
Instance.prototype.addUser = function(user) {
	logger.info('area.addUser:%s', user.uid);
	this.users[user.uid] = user;
    for(var i=0;i<this.noroomuser.length;i++){
        var usert=this.noroomuser[i];
        if(usert.uid===user.uid){
            this.noroomuser.splice(i,1);
            break;
        }

    }
    this.noroomuser.push(user);
};

Instance.prototype.delUser = function(uid) {
	logger.info('area.delUser:%s', uid);
	delete this.users[uid];
	for(var i=0;i<this.noroomuser.length;i++){
         var user=this.noroomuser[i];
         if(user.uid===uid){
             this.noroomuser.splice(i,1);
             break;
		 }

	}
};

Instance.prototype.getUser = function(uid) {
	return this.users[uid];
};
Instance.prototype.qiangDiZhi = function(msg) {
    console.log('qiangDiZhi .this.roomid:');
    var user=this.users[msg.uid];
    if(user.sunxu!==this.rooms[user.roomid].sunxu){
        return;
    }
    this.rooms[user.roomid].qiangdizhuarr.push(msg);
};
Instance.prototype.chupai = function(msg) {
    console.log('chupai .this.roomid:');
    var user=this.users[msg.uid];
    if(user.sunxu!==this.rooms[user.roomid].sunxu){
        return;
    }
    this.rooms[user.roomid].chupaiarr.push(msg);
};
Instance.prototype.zaiwanyiju = function(msg) {
    console.log('zaiwanyiju .this.roomid:');
    var user=this.users[msg.uid];
    if(user.sunxu!==this.rooms[user.roomid].sunxu){
        return;
    }
    this.rooms[user.roomid].zaiwanyijuarr.push(msg);
};
Instance.prototype.createRoom = function() {
     var nru=this.noroomuser.length;
     var rl=parseInt(nru/3);
    for(var i=0;i<rl;i++){
    	var room=new Room(this.roomid,"doudizhu"+this.roomid,this);
    	this.rooms[this.roomid]=room;
        this.roomid++;
        console.log('this.roomid.this.roomid:',this.roomid);
        for(var j=0;j<3;j++){
         room.addPlayer(this.noroomuser.shift());
        }
    }
    var dt=Date.parse(new Date())-this.timestamp;
    if(dt>this.td&&this.noroomuser.length>0){
        var room=new Room(this.roomid,"doudizhu"+this.roomid,this);
        this.rooms[this.roomid]=room;
        this.roomid++;
        for(var j=0;j<3;j++){
            if(this.noroomuser.length>0){
                room.addPlayer(this.noroomuser.shift());
            }else{
                room.addAiPlayer(new User({}));
            }

        }
        this.timestamp = Date.parse(new Date());
    }

};
Instance.prototype.updateRoom = function() {
    for(var roomid in this.rooms){
             var room=this.rooms[roomid];
             room.update();
       }
};
Instance.prototype.buchongRoom = function() {
    for(var roomid in this.rooms){
        var room=this.rooms[roomid];
        room.buchongRoom();
    }
};
Instance.prototype.timeUpdate = function() {
    //logger.debug('timeUpdate',this.start);
    this.updateRoom();
	this.createRoom();

};


