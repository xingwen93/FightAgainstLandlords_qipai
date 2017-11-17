var AILogic = require('AILogic');

var User=function(opts) {
	this.uid = opts.uid || 0;
	this.nickname = opts.nickname || '';
	this.yuanbao = opts.yuanbao || 0;
	this.freeYuanbao = opts.freeYuanbao || 0;
	this.gold = opts.gold || 0;
	this.clvl = opts.clvl || 1;
	this.levelId = opts.levelId || 1;
	this.round = opts.round || 0;
    this.isLandlord = false;
    this.isAI = false;
    //牌组
    this.cardList = [];
    //下一家
    this.nextPlayer = null;
    this.aiLogic=new AILogic(this);
};
module.exports = User;
