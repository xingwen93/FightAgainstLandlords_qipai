/**
 * Module dependencies
 */

var pomelo = require('pomelo');
var channelUtil = require('../util/channelUtil');
var Poker = require('./poker');
var User = require('./user');
///////////////////////////////////////////////////////
function Room(roomId,name,area){
    this.area=area;
  this.channel = null;
  this.roomId = roomId;
  this.name = name;
  this.users=[];
  this.channelService = pomelo.app.get('channelService');
  this.createChannel();
  this.poker=new Poker(area);

  this.state=1;
  this.start=1;
  this.sunxu=1;
  this.beishu=1;
  this.difen=100;
  this.dizhu=0;
  this.jiao=0;
  this.jiaoob={};
  this.jiaoob[1]=1;
    this.jiaoob[2]=1;
    this.jiaoob[3]=1;

    this.zaiwanob={};
    this.zaiwanob[1]=2;
    this.zaiwanob[2]=2;
    this.zaiwanob[3]=2;

    this.qiangob={};
    this.qiangob[1]=1;
    this.qiangob[2]=1;
    this.qiangob[3]=1;
    this.qiangdizhuarr=[];
    this.chupaiarr=[];
    this.zaiwanyijuarr=[];
    this.timestamp = Date.parse(new Date());
    this.aitd=3000;
    this.td=20000;

}
Room.prototype.nextju = function() {

    this.state=1;

   // this.start=1;
    this.sunxu=this.start+1;
    if(this.sunxu>3){
        this.sunxu=1;
    }
    this.start=this.sunxu;
    this.beishu=1;
    this.difen=100;
    this.dizhu=0;
    this.jiao=0;
    this.jiaoob={};
    this.jiaoob[1]=1;
    this.jiaoob[2]=1;
    this.jiaoob[3]=1;
    this.zaiwanob={};
    this.zaiwanob[1]=2;
    this.zaiwanob[2]=2;
    this.zaiwanob[3]=2;

    this.qiangob={};
    this.qiangob[1]=1;
    this.qiangob[2]=1;
    this.qiangob[3]=1;
    this.qiangdizhuarr=[];
    this.chupaiarr=[];
    this.zaiwanyijuarr=[];
    this.timestamp = Date.parse(new Date());
    this.aitd=3000;
    this.td=20000;
};
Room.prototype.createChannel = function() {
  if(this.channel) {
    return this.channel;
  }
  var channelName = channelUtil.getRoomChannelName(this.roomId);
  this.channel = this.channelService.getChannel(channelName, true);
  if(this.channel) {
    return this.channel;
  }
  return null;
};
 Room.prototype.addPlayer = function(user) {
     this.users.push(user);
     user.sunxu=this.users.length;
     user.roomid=this.roomId;
     user.aiLogic.gameRule=this.poker.gamerule;
     if(!this.channel) {
         return false;
     }
     if(user) {
         this.channel.add(user.uid, user.sid);
         return true;
     }
     return false;
};
Room.prototype.addAiPlayer = function(user) {
    this.users.push(user);
    user.sunxu=this.users.length;
    user.roomid=this.roomId;
    user.isAI=true;
    user.aiLogic.gameRule=this.poker.gamerule;
    return false;
};
Room.prototype.removePlayer = function(sunxu) {
    for(var i=0;i< this.users.length;i++){
        var user=this.users[i];
        if(user.sunxu==sunxu){
            this.users.splice(i,1);
            if(!user.isAI) {
                this.channel.leave(user.uid, user.sid);
            }
            return;
        }
    }
}
Room.prototype.kick = function(user) {

};
Room.prototype.qiangDiZhi = function(msg) {
    var xingwei=0;
    if(msg.xuanze==1){
        this.dizhu=this.sunxu;
        if(this.jiao>0){
            this.qiangob[this.sunxu]=0;
            this.beishu=this.beishu*2;
        }else{
            this.jiao=this.sunxu;
            this.jiaoob[1]=0;
            this.jiaoob[2]=0;
            this.jiaoob[3]=0;
            this.beishu=3;
        }
    }else{
        if(this.jiao>0){
            this.qiangob[this.sunxu]=0;
        }else{
            this.jiaoob[this.sunxu]=0;
            this.qiangob[this.sunxu]=0;
        }
    }
    this.sunxu++;
    if(this.sunxu>3){
        this.sunxu=1;
    }
    if(this.jiao>0) {//抢拍
        this.state=3;
            for (var q=0;q<2;q++) {
                if (this.qiangob[this.sunxu] == 1) {
                    if(this.sunxu!=this.dizhu){
                        xingwei=2;
                        this.state=2;
                    }
                    break;
                }else {
                    this.sunxu++;
                    if(this.sunxu>3){
                        this.sunxu=1;
                    }
                }
            }

    }else{ //叫牌
        this.state=0;
        for (var j=0;j<2;j++) {
            if (this.jiaoob[this.sunxu] == 1) {
                xingwei=1;
                this.state=2;
                break;
            }else {
                this.sunxu++;
                if(this.sunxu>3){
                    this.sunxu=1;
                }
            }
        }
    }
    if(this.state==0){
        var isHavePlayer=false;
        for(var i=this.users.length-1;i>=0;i--) {
            var user = this.users[i];
            if(!user.isAI) {
                if(!!this.area.users[user.uid]){
                    isHavePlayer=true;
                }else{
                    this.users.splice(i,1);
                    this.channel.leave(user.uid, user.sid);
                }

            }
        }
        if(isHavePlayer&&this.users.length>=3){
            this.nextju();
        }else{
            this.state=7;
            if(!isHavePlayer){
                this.users=[];
            }
        }

        return;
    }
    var param = {};
    if(this.state==3){
        this.poker.dingdizhu(this.dizhu);
        for(var i=0;i<3;i++) {
            var user = this.users[i];
            user.cardList = this.poker.pokers[i];
            this.users[i].isLandlord=false;
        }
        this.users[this.dizhu-1].isLandlord=true;
        this.users[0].nextPlayer=this.users[1];
        this.users[1].nextPlayer=this.users[2];
        this.users[2].nextPlayer=this.users[0];
        this.users[0].aiLogic.init(this.poker.gamerule);
        this.users[1].aiLogic.init(this.poker.gamerule);
        this.users[2].aiLogic.init(this.poker.gamerule);

        param = {
            route: 'onRoom',
            msg: {state:this.state,data:{sunxu:this.dizhu,beishu:this.beishu,shangjia:msg.xuanze,xingwei:xingwei}}
        };
        this.state=4;
    }else{
        param = {
            route: 'onRoom',
            msg: {state:this.state,data:{sunxu:this.sunxu,beishu:this.beishu,shangjia:msg.xuanze,xingwei:xingwei}}
        };
    }
    this.channel.pushMessage(param);
};
Room.prototype.chuPaiFun = function(msg) {

    if(this.state==4){
        //验证牌
        msg.sunxu=this.sunxu;
        var bcres=0;
            bcres=this.poker.chuPaiFun(msg);
        var param;
        //验证牌

        if(bcres==3){
            this.state=5;
            param = {
                route: 'onRoom',
                msg: {state:this.state,data:{sunxu:this.sunxu,beishu:this.beishu,pai:msg.pai,pokers:this.poker.pokers}}
            };
            this.channel.pushMessage(param);
            this.state=6;
            return;
        }
        if(bcres==4){
            this.beishu=this.beishu*2;
            this.state=5;
            param = {
                route: 'onRoom',
                msg: {state:this.state,data:{sunxu:this.sunxu,beishu:this.beishu,pai:msg.pai,pokers:this.poker.pokers}}
            };
            this.channel.pushMessage(param);
            this.state=6;
            return;
        }

        this.sunxu++;
        if(this.sunxu>3){
            this.sunxu=1;
        }
        if(bcres==0){
            param = {
                route: 'onRoom',
                msg: {state:this.state,data:{sunxu:this.sunxu,beishu:this.beishu,pai:[]}}
            };
        }
        if(bcres==1){
            param = {
                route: 'onRoom',
                msg: {state:this.state,data:{sunxu:this.sunxu,beishu:this.beishu,pai:msg.pai}}
            };
        }
        if(bcres==2){
            this.beishu=this.beishu*2;
            param = {
                route: 'onRoom',
                msg: {state:this.state,data:{sunxu:this.sunxu,beishu:this.beishu,pai:msg.pai}}
            };
        }

        this.channel.pushMessage(param);
    }
};

Room.prototype.zaiwanyiju = function(msg) {
    var sx=0;
    if(msg.xuanze==1){
        this.zaiwanob[this.sunxu]=1;
    }else{
        this.zaiwanob[this.sunxu]=0;
        sx=this.sunxu;

    }
    this.sunxu++;
    if(this.sunxu>3){
        this.sunxu=1;
    }
    var param;
    if(this.zaiwanob[this.sunxu]==2){
        param = {
            route: 'onRoom',
            msg: {state:this.state,data:{sunxu:this.sunxu,xuanze:msg.xuanze}}
        };
        this.channel.pushMessage(param);
    }else{
       if(this.zaiwanob[1]==1&&this.zaiwanob[2]==1&&this.zaiwanob[3]==1){
           this.nextju();
       }else{
           this.state=7;
           param = {
               route: 'onRoom',
               msg: {state:this.state,data:{sunxu:this.sunxu,xuanze:msg.xuanze}}
           };
           this.channel.pushMessage(param);

       }

    }
    if(sx>0){
        this.removePlayer(sx);
    }
};
Room.prototype.sendInitPork = function() {
    var channelService = pomelo.app.get('channelService');
    for(var i=0;i<3;i++){
       var  user=this.users[i];
       user.sunxu=i+1;
       user.cardList=this.poker.pokers[i];
        var tuid = user.uid;
        var tsid = user.sid;
        var param = {
            route: 'onRoom',
            msg: {state:1,data:{sunxu:this.sunxu,wp:this.poker.pokers[i],dp:this.poker.pokers[3]},xuowei:i+1}
        };
        channelService.pushMessageByUids(param, [{
            uid: tuid,
            sid: tsid
        }]);
    }

};
Room.prototype.buchongRoom = function() {
    var ul=0;//this.users.length;
    for(var i=0;i<this.users.length;i++){
        if(!this.users[i].isAI){
           ul=this.users.length;
        }
    }
    var nol=this.area.noroomuser.length;
    var al=3-ul;
    if(al<=nol){
        for(var i=0;i<al;i++){
            this.addPlayer(this.area.noroomuser.shift());
        }
        for(var j=0;j<3;j++){
            var user=this.users[j];
            user.sunxu=j+1;
        }
        this.nextju();
    }else{
        var dt=Date.parse(new Date())-this.timestamp;
        if(dt>this.aitd&&(ul>0||this.area.noroomuser.length>0)){
            for(var j=0;j<al;j++){
                if(this.area.noroomuser.length>0){
                    this.addPlayer(this.area.noroomuser.shift());
                }else{
                    this.addAiPlayer(new User({}));
                }
            }
            for(var j=0;j<3;j++){
                var user=this.users[j];
                user.sunxu=j+1;
            }
            console.log('buchongRoom:',this.users);
            this.timestamp = Date.parse(new Date());
            this.nextju();
        }
    }

};
Room.prototype.aichupai = function() {
    var user=this.users[this.sunxu-1];
 //   console.log(' this.chupaiarr.push({pai:cards}   user.cardList);:',user.cardList);
    if(user.isAI&&user.sunxu==this.sunxu){
        var dt=Date.parse(new Date())-this.timestamp;
        if(dt>this.aitd){
            if(this.sunxu==this.poker.shangjiasunxu){
               var  respa = user.aiLogic.play(this.users[this.dizhu-1].cardList.length);
                if(!!respa){
                    var cards=[];
                    for(var i=0;i<respa.cardList.length;i++){
                        if(!!respa.cardList[i]){
                            cards.push(respa.cardList[i].xh)
                        }

                    }
                  //  console.log(' this.chupaiarr.push({pai:cards}cardscardscardscards);:',cards);

                    cards.sort(function(a, b) {
                        return a - b;
                    });
                    for(var i=cards.length-1;1<i;i--){
                        if(cards[i]==cards[i-1]){
                            cards.splice(i,1);
                        }
                    }

                    this.chupaiarr.push({pai:cards});
                }else{
                    this.chupaiarr.push({pai:[]});
                }
            }else{
                var res=this.poker.goujiancards(this.poker.shangjiachupai);
                var respa=user.aiLogic.follow(res,this.users[this.poker.shangjiasunxu-1].isLandlord,this.users[this.poker.shangjiasunxu-1].cardList.length);
                if(!!respa){
                    var cards=[];
                    for(var i=0;i<respa.cardList.length;i++){
                        cards.push(respa.cardList[i].xh)
                    }
                    cards.sort(function(a, b) {
                        return a - b;
                    });
                    for(var i=cards.length-1;1<i;i--){
                        if(cards[i]==cards[i-1]){
                            cards.splice(i,1);
                        }
                    }

                    this.chupaiarr.push({pai:cards});
                }else{
                    this.chupaiarr.push({pai:[]});
                }
            }

        }
    }
};
Room.prototype.update = function() {

    switch(this.state)
    {
        case 1:
            this.poker.init();
            this.sendInitPork();
            this.state=2;
            break;
        case 2:

            if(this.qiangdizhuarr.length>0){
                this.qiangDiZhi(this.qiangdizhuarr.shift());
                this.timestamp=Date.parse(new Date());
            }else{
                var dt=Date.parse(new Date())-this.timestamp;
                if(dt>this.aitd){
                    var user=this.users[this.sunxu-1];
                    if(!!user.isAI){
                        this.qiangDiZhi({xuanze:0});
                        this.timestamp=Date.parse(new Date());
                    }
                }
                var dt=Date.parse(new Date())-this.timestamp;
                if(dt>this.td){
                    this.qiangDiZhi({xuanze:0});
                    this.timestamp=Date.parse(new Date());
                }
            }
            break;
        case 3:
            break;
        case 4:
            this.aichupai();
            if(this.chupaiarr.length>0){
                this.chuPaiFun(this.chupaiarr.shift());
                this.timestamp=Date.parse(new Date());

            }else{
                var dt=Date.parse(new Date())-this.timestamp;
                if(dt>this.td){
                    this.chuPaiFun({pai:[]});
                    this.timestamp=Date.parse(new Date());
                }

            }
            break;
        case 5:

            break;
        case 6:
            if(this.zaiwanyijuarr.length>0){
                this.zaiwanyiju(this.zaiwanyijuarr.shift());
                this.timestamp=Date.parse(new Date());
            }else{
                var dt=Date.parse(new Date())-this.timestamp;
                if(dt>this.aitd){
                    var user=null;
                    for(var i=0;i<this.users.length;i++){
                         user=this.users[i];
                        if(user.sunxu==this.sunxu){
                            break;
                        }
                    }

                    if(!!user&&!!user.isAI){
                        this.zaiwanyiju({xuanze:0});
                        this.timestamp=Date.parse(new Date());
                    }
                }

                var dt=Date.parse(new Date())-this.timestamp;
                if(dt>this.td){
                    this.zaiwanyiju({xuanze:0});
                    this.timestamp=Date.parse(new Date());
                }
            }

            break;
        case 7:
            this.buchongRoom();
            break;
        default:
             break;
    }
};
///////////////////////////////////////////////////////
/**
 * Expose 'Room' constructor.
 */
module.exports = Room;

