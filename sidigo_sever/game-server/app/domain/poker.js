/**
 * Created by v on 2017/7/16.
 */
var logger = require('pomelo-logger').getLogger(__filename);
var GameRule = require('./GameRule');
var Instance = function(area) {
    this.area=area;
    this.pokers=[];
    this.pkpx=[17,16,15,15,15,15,14,14,14,14,13,13,13,13,12,12,12,12,11,11,11,11,10,10,10,10,9,9,9,9,8,8,8,8,7,7,7,7,6,6,6,6,5,5,5,5,4,4,4,4,3,3,3,3];
    this.pai=[];
    this.gamerule=new GameRule();
}
module.exports = Instance;
Instance.prototype.init = function(){
    this.pokers=[];
    var arr0=[];
    var arr1=[];
    var arr2=[];
    var arrz=[];
    for(var i=1;i<55;i++){
        arrz.push(i);
    }
    for(var j=0;j<17;j++){
        var index = parseInt(Math.random() * arrz.length, 10);
        arr0.push(arrz[index]);
        arrz.splice(index,1);
        index = parseInt(Math.random() * arrz.length, 10);
        arr1.push(arrz[index]);
        arrz.splice(index,1);
        index = parseInt(Math.random() * arrz.length, 10);
        arr2.push(arrz[index]);
        arrz.splice(index,1);
    }
   // logger.debug(' arr0', arr0.toString());
    arr0.sort(function(a, b) {
        return a - b;
    });
    arr1.sort(function(a, b) {
        return a - b;
    });
    arr2.sort(function(a, b) {
        return a - b;
    });
    arrz.sort(function(a, b) {
        return a - b;
    });
   // logger.debug(' arr0.sort()', arr0.toString());
  //  logger.debug(' arr1.sort()', arr1.toString());
  //  logger.debug(' arr2.sort()', arr2.toString());
  //  logger.debug(' arrz.sort()', arrz.toString());
    this.pokers.push(arr0);
    this.pokers.push(arr1);
    this.pokers.push(arr2);
    this.pokers.push(arrz);

    this.shangjiachupai=[];
    this.shangjiasunxu=1;
};
Instance.prototype.dingdizhu = function(sunxu){
    this.shangjiasunxu=sunxu;
    var arrdp=this.pokers[3];
    var arrdz=this.pokers[sunxu-1];
    arrdz.push(arrdp[0]);
    arrdz.push(arrdp[1]);
    arrdz.push(arrdp[2]);
    arrdz.sort(function(a, b) {
        return a - b;
    });
  //  logger.debug(' arrdz.sort()', arrdz.toString());
};
Instance.prototype.chuPaiFun=function(msg){
     var bmsg=0;   //没有

    //验证牌
    if(msg.pai.length<=0&&this.shangjiasunxu==msg.sunxu){
        var arrdz=this.pokers[msg.sunxu-1];
        msg.pai.push(arrdz[arrdz.length-1]);
    }
    if(msg.pai.length<=0){
        return bmsg;
    }

    var xuanpaiarr=msg.pai;
   // logger.debug('  var xuanpaiarr=msg.pai; arrdz.sort()',xuanpaiarr);
    var ih=this.haveCards(xuanpaiarr,msg.sunxu);
   // logger.debug('  var xuanpaiarr=msg.pai; arrdz.sort() ih',ih);
    if(ih==0){
        return bmsg;
    }

    var res=this.goujiancards(xuanpaiarr);
  //  logger.debug('  var xuanpaiarr=msg.pai; arrdz.sort() res',res);
    if(!!res){

        if(this.shangjiachupai.length>0&&this.shangjiasunxu!=msg.sunxu){
            var ress=this.goujiancards(this.shangjiachupai);
            if(!!ress&&ress.size==res.size&&res.val>ress.val&&ress.cardKind==res.cardKind){
                //this.chupaibt.active =true;
                bmsg=1;
            }else{
                if(!!res&&res.cardKind>12&&res.cardKind>ress.cardKind){
                   // this.chupaibt.active =true;
                    bmsg=1;
                }else{
                  //  this.chupaibt.active =false;
                }

            }
        }else{
           // this.chupaibt.active=true;
            bmsg=1;
        }
    }else{
       // this.chupaibt.active =false;


    }
    if(bmsg>0){
        this.shangjiachupai=xuanpaiarr;
        this.shangjiasunxu=msg.sunxu;
        var yp=this.removeCards(xuanpaiarr,msg.sunxu);
        if(res.cardKind>12){
            bmsg=2;
        }
        if(yp==0){
            if(bmsg==2){
                bmsg=4;
            }else{
                bmsg=3;
            }

        }
    }
    //验证牌
   return bmsg;

};
Instance.prototype.removeCards=function(xuanpaiarr,sunxu){
    var arrdz=this.pokers[sunxu-1];
    var k=0;
    for(var i=0;i<xuanpaiarr.length;i++){
        var vl=xuanpaiarr[i];
        for(var j=k;j<arrdz.length;j++){
            if(arrdz[j]==vl){
                arrdz.splice(j,1);
                k=j;
                break;
            }
        }
    }
    return arrdz.length;
};
Instance.prototype.haveCards=function(xuanpaiarr,sunxu){
    var arrdz=this.pokers[sunxu-1];
    var k=0;
    for(var i=0;i<xuanpaiarr.length;i++){
        var vl=xuanpaiarr[i];
        var ih=0;
       for(var j=k;j<arrdz.length;j++){
           if(arrdz[j]==vl){
               ih=1;
               k=j+1;
               break;
           }
       }
       if(ih==0){
          return 0;
       }
    }
    return 1;

};
Instance.prototype.goujiancards=function(xuanpaiarr){
    var cards=[];
    for(var j=0;j<xuanpaiarr.length;j++){
        var cd={};
        cd.val=this.pkpx[xuanpaiarr[j]-1];
        cd.xh=xuanpaiarr[j];
        cards.push(cd);
    }
    var res=this.gamerule.typeJudge(cards);
    return res;
};
