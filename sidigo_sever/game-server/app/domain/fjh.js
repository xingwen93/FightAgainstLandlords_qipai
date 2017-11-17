var logger = require('pomelo-logger').getLogger(__filename)

var exp = module.exports;
var FjhArr={};
var fjhid=0;
var fjreshu=3;
var fj =function fj(opts) {
    this.serverid = opts.serverid;
    this.roomid = opts.roomid;
    this.renshu = opts.renshu || 0;
};
fj.prototype.toJSON = function() {
    return {
        serverid: this.serverid,
        roomid: this.roomid,
    };
};


exp.getFjh = function(args) {
      fjreshu++;
    var fjitem=null;
    if(fjreshu<=3){
        fjitem= FjhArr[fjhid];
        fjitem.renshu=fjreshu;
	 }else {
         fjreshu=1;
         fjhid++;

		var areas=args.areas;
        if (!areas || areas.length === 0) {
            next(null, {code: 500});
            return;
        }
        var index =fjhid%areas.length;// parseInt(Math.random() * areas.length, 10);

        var res = areas[index];
		var serverid=res.id;
        console.log('var severid=res.id;',serverid);
        console.log('var severidfjreshu                                             fjreshu;',fjreshu+"                         "+fjhid);
		fjitem=new fj({serverid:serverid,roomid:fjhid,renshu:fjreshu});
        FjhArr[fjhid]=fjitem;
	 }
    console.log('fjitem.renshu;',fjitem.renshu);
	 var res=fjitem.toJSON();
	 return res;
};

exp.delFjh = function(uid) {
	logger.debug('area.delUser:', uid);
	delete users[uid];
};


