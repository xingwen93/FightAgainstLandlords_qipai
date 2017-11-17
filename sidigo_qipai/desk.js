var GameData = require("GameData");
var GameRule = require("GameRule");
var User = require("user");
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
         desk:{
            default:null,
            type:cc.Node
        },
        cn:{
            default:null,
            type:cc.Node
        },
        jiaofen:{
            default:null,
            type:cc.Node
        },
         qiangfen:{
            default:null,
            type:cc.Node
        },
        chupai:{
            default:null,
            type:cc.Node
        },
        chupaibt:{
            default:null,
            type:cc.Node
        },
        buchupaibt:{
            default:null,
            type:cc.Node
        },
        gameover:{
            default:null,
            type:cc.Node
        },
         kuaisuyouxibt:{
            default:null,
            type:cc.Node
        },
   
        puker: cc.Prefab,
        dpcn:[cc.Node],
        chpcn:[cc.Node],
        numarr:[cc.Label],
        tshiarr:[cc.Label]
    },

    // use this for initialization
    onLoad: function () {
         this.desk.active=false;
        //初始化54张
        this.pkpx=[17,16,15,15,15,15,14,14,14,14,13,13,13,13,12,12,12,12,11,11,11,11,10,10,10,10,9,9,9,9,8,8,8,8,7,7,7,7,6,6,6,6,5,5,5,5,4,4,4,4,3,3,3,3];
        this.pkvl=[100,99,2,2,2,2,1,1,1,1,13,13,13,13,12,12,12,12,11,11,11,11,10,10,10,10,9,9,9,9,8,8,8,8,7,7,7,7,6,6,6,6,5,5,5,5,4,4,4,4,3,3,3,3];
        this.plhs=[0,0,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1];
        this.pllx=[0,0,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1];
        this.xianwei={};
         this.xianwei[11]=1;
         this.xianwei[12]=2;
         this.xianwei[13]=0;
         this.xianwei[21]=0;
         this.xianwei[22]=1;
         this.xianwei[23]=2;
         this.xianwei[31]=2;
         this.xianwei[32]=0;
         this.xianwei[33]=1;
        
        this.gamerule=new GameRule();
        GameData.pukers=[];
        this.A2_10JQK = 'w,A,2,3,4,5,6,7,8,9,10,J,Q,K'.split(',');
        for(var i=0;i<54;i++){
            var vl=this.pkvl[i];
            var pk=cc.instantiate(this.puker);
            if(vl==100){
                 pk.getComponent("Card").init({point:11,suit:1,pointName:"大"}); 
            }else if(vl==99){
                 pk.getComponent("Card").init({point:11,suit:2,pointName:"小"}); 
            }else{
               pk.getComponent("Card").init({point:vl,suit:this.plhs[i],pointName:this.A2_10JQK[vl],isRedSuit:true}); 
            }
           GameData.pukers.push(pk); 
          
        }
         GameData.deskthis=this;
      //   this.cn.on('mousedown',this.cnms_down,this);
      //   this.cn.on('mouseup',this.cnms_up,this);
         this.cn.on('touchstart',this.cnms_down,this);
         this.cn.on('touchend',this.cnms_up,this);
         
         
         
         this.user=new User({});
         this.user.aiLogic.gameRule=this.gamerule;
         this.initpuker();
         this.mszb=null;
     
    },
     tishibt_down:function () {
      
         if(this.promptList.length > 0){
            var promptIndex = this.promptTimes++ % this.promptList.length;
              for(var i=0;i<this.wpdata.length;i++){
               var  pk= GameData.pukers[this.wpdata[i]-1]; 
                pk.y=0;
              }
          
            var list = this.promptList[promptIndex];
            this.xuanpaiarr=[];
            for (var i = 0; i < list.length; i++) {
                var xh=list[i].xh;
                  var  pk= GameData.pukers[xh-1]; 
                  pk.y=20;
                  this.xuanpaiarr.push(xh);
            }
            
              //验证牌  
           
          
           var res=this.goujiancards(this.xuanpaiarr);
           if(!!res){
                cc.log("cardKind .cardKind.cardKind: ",res.cardKind,res.val,res.size);  
                if(this.shangjiachupai.length>0&&this.shangjiasunxu!=this.xuowei){
                    var ress=this.goujiancards(this.shangjiachupai);
                    if(!!ress&&ress.size==res.size&&res.val>ress.val&&ress.cardKind==res.cardKind){
                        this.chupaibt.active =true;
                    }else{
                        if(!!res&&res.cardKind>12&&res.cardKind>ress.cardKind){
                             this.chupaibt.active =true; 
                        }else{
                             this.chupaibt.active =false; 
                        }
                       
                    }
                }else{
                this.chupaibt.active=true;
                }
           }else{
               this.chupaibt.active =false;
                cc.log("cardKind .cardKind.cardKind: ","null ");  
                
           }
           
           //验证牌  
           
            
        }else{
              this.chupaibt.active =false;
              var route = "area.userHandler.chupai";
        		cc.log("pomelo.request return data: ",route);
        			pomelo.request(route, {
        			pai:[]
        		}, function(data) {
        		      cc.log("area.userHandler.chupai: ","area.userHandler.chupai");  
        			if(data.error) {
        				return;
        			}
        			  
        		});
            
        }
     },
      cnms_up:function (event) {
               if(this.xuowei!=this.sunxu){
                  return;
               }
               var zuobiao = event.getLocation();
               var ds=this.jisuanindex(this.mszb);
               var de=this.jisuanindex(zuobiao);
               var pk;
               var i;
               if(ds==de){
                  pk= GameData.pukers[this.wpdata[de]-1];
                         pk.y+=20;
                         if(pk.y>35){
                             pk.y=0;
                         }  
               }else if(de>ds){
                   for(i=ds;i<=de;i++){
                        pk= GameData.pukers[this.wpdata[i]-1];
                         pk.y=20;
                         
                   }
               }else{
                    for(i=de;i<=ds;i++){
                         pk= GameData.pukers[this.wpdata[i]-1];
                         pk.y=20;
                   }
               }
               this.xuanpaichuli();
      },
     cnms_down:function (event) {
          if(this.xuowei!=this.sunxu){
              return;
          }
          this.mszb=event.getLocation();
        //  this.xuanpaichuli(zuobiao);
        
     },
     jisuanindex:function(zuobiao){
          var di=parseInt((zuobiao.x-60)/this.paiju);
          if(di<0){
             di=0; 
          }
          if(di>=this.wpdata.length){
              di=this.wpdata.length-1;
          }
          return di;
     },
     xuanpaichuli:function(){
         
         this.xuanpaiarr=[];
         for(var i=0;i<this.wpdata.length;i++){
            var pk= GameData.pukers[this.wpdata[i]-1]; 
            if(pk.y>15){
                this.xuanpaiarr.push(this.wpdata[i]);
            }
         }
           cc.log("xuanpaiarr ： ",this.xuanpaiarr);
           //验证牌  
           var cards=[];
        //   for(var j=0;j<this.xuanpaiarr.length;j++){
        //       var cd={};
        //       cd.val=this.pkpx[this.xuanpaiarr[j]-1];
        //       cards.push(cd);
         //  }
           var res=this.goujiancards(this.xuanpaiarr);
           if(!!res){
                cc.log("cardKind .cardKind.cardKind: ",res.cardKind,res.val,res.size);  
                if(this.shangjiachupai.length>0&&this.shangjiasunxu!=this.xuowei){
                    var ress=this.goujiancards(this.shangjiachupai);
                    if(!!ress&&ress.size==res.size&&res.val>ress.val&&ress.cardKind==res.cardKind){
                        this.chupaibt.active =true;
                    }else{
                        if(!!res&&res.cardKind>12&&res.cardKind>ress.cardKind){
                             this.chupaibt.active =true; 
                        }else{
                             this.chupaibt.active =false; 
                        }
                       
                    }
                }else{
                this.chupaibt.active=true;
                }
           }else{
               this.chupaibt.active =false;
                cc.log("cardKind .cardKind.cardKind: ","null ");  
                
           }
           
           //验证牌  
     }, 
     goujiancards: function (xuanpaiarr){
          var cards=[];
           for(var j=0;j<xuanpaiarr.length;j++){
               var cd={};
               cd.val=this.pkpx[xuanpaiarr[j]-1];
               cards.push(cd);
           }
           var res=this.gamerule.typeJudge(cards);
           return res;
     },
     
      chupaidown: function (){
             this.chupaibt.active =false;
              var route = "area.userHandler.chupai";
        		cc.log("pomelo.request return data: ",route);
        			pomelo.request(route, {
        			pai:this.xuanpaiarr
        		}, function(data) {
        		      cc.log("area.userHandler.chupai: ","area.userHandler.chupai");  
        			if(data.error) {
        				return;
        			}
        			  
        		});
      },
        buchupaidown: function (){
               this.chupaibt.active =false;
               for(var i=0;i<this.xuanpaiarr.length;i++){
                  var pk= GameData.pukers[this.xuanpaiarr[i]-1]; 
                  pk.y=0;
               }
              this.xuanpaiarr=[];
              var route = "area.userHandler.chupai";
        		cc.log("pomelo.request return data: ",route);
        			pomelo.request(route, {
        			pai:[]
        		}, function(data) {
        		      cc.log("area.userHandler.chupai: ","area.userHandler.chupai");  
        			if(data.error) {
        				return;
        			}
        			  
        		});
      },
      chongxuanpaidown: function (){
             this.chupaibt.active =false;
               for(var i=0;i<this.xuanpaiarr.length;i++){
                  var pk= GameData.pukers[this.xuanpaiarr[i]-1]; 
                  pk.y=0;
               }
      },
    
     initpuker: function () {
          this.chpcn[0].removeAllChildren();
          this.chpcn[1].removeAllChildren();
          this.chpcn[2].removeAllChildren();
          this.cn.removeAllChildren();
          this.numarr[0].string='17';
          this.numarr[1].string='17';
          this.numarr[2].string='1';
          this.numarr[3].string='100';
          this.tshiarr[0].node.active=false;
          this.tshiarr[1].node.active=false;
          this.tshiarr[2].node.active=false;
          
          this.jiaofen.active=false;
           this.qiangfen.active=false;
          this.chupai.active=false;
           this.gameover.active=false;
          
          this.dpcn[0].getComponent("Card").reveal(false);
             this.dpcn[1].getComponent("Card").reveal(false);
                this.dpcn[2].getComponent("Card").reveal(false);
                this.paiju=40;
                this.xuanpaiarr=[];
                this.shangjiachupai=[];
                this.shangjiasunxu=0;
                this.xingwei=1;
                 this.promptList=[];
         
     },
       nextinitpuker: function () {
          this.chpcn[0].removeAllChildren();
          this.chpcn[1].removeAllChildren();
          this.chpcn[2].removeAllChildren();
          this.cn.removeAllChildren();
          this.numarr[0].string='17';
          this.numarr[1].string='17';
          this.numarr[2].string='1';
          this.numarr[3].string='100';
          this.tshiarr[0].node.active=false;
          this.tshiarr[1].node.active=false;
          this.tshiarr[2].node.active=false;
          
          this.jiaofen.active=false;
           this.qiangfen.active=false;
          this.chupai.active=false;
           this.gameover.active=false;
          
          this.dpcn[0].getComponent("Card").reveal(false);
          this.dpcn[1].getComponent("Card").reveal(false);
                this.dpcn[2].getComponent("Card").reveal(false);
                this.paiju=40;
                this.xuanpaiarr=[];
                this.shangjiachupai=[];
                this.shangjiasunxu=0;
                this.xingwei=1;
                this.promptList=[];
         
     },
         
     onEnable: function () {
          cc.log("onEnable ");
           var self=this;
            pomelo.on('heartbeat timeout', function(){
             cc.log("websocket-error             websocket-error timeout: ");
              self.numarr[3].string+="t";
            });
            pomelo.on('close', function(){//socket error
             cc.log("websocket-close             websocket-error close:   ");
              self.numarr[3].string+="c";
            });
              pomelo.on('socket error', function(){ 
             cc.log("websocket-close             websocket-error socket error:   ");
              self.numarr[3].string+="s";
            });
           pomelo.on('onRoom',this.onRoom,this);
        //   this.initpuker();
     }, 
     onDisable: function () {
           cc.log("onDisable ");
           pomelo.off('onRoom',this.onRoom,this);
     },
     onRoom:function(data) {
           GameData.deskthis.msgCHuli(data);
    },
    msgCHuli:function(data) {
        if(data.msg.state==1){  //初始化 牌p
        this.nextinitpuker();
             var wp=data.msg.data.wp;
               for(var i=0;i<wp.length;i++){
                   var pk= GameData.pukers[wp[i]-1];
                   this.cn.addChild(pk);
                   pk.x=i*this.paiju+50;
                    pk.y=0;
               }
                this.wpdata=wp;
                this.dpdata=data.msg.data.dp;
                this.sunxu=data.msg.data.sunxu
                this.xuowei=data.msg.xuowei;
                
                if(this.xuowei==this.sunxu){
                  
                        this.jiaofen.active=true;
                
                }else{
                    this.jiaofen.active=false; 
                    this.qiangfen.active=false;
                }
                
              
               cc.log("var wp=data.msg.data.wp: ",wp.length);
        }
         if(data.msg.state==2){  //叫地主 
             cc.log("data.msg.state==2",data.msg.data.sunxu);
             
              this.tshiarr[0].node.active=false;
             this.tshiarr[1].node.active=false;
             this.tshiarr[2].node.active=false;
                
                      var tw=this.xuowei*10+this.sunxu;
                      var xh=this.xianwei[tw];
                        this.tshiarr[xh].node.active=true;
                   if(this.xingwei==1){
                       if(data.msg.data.shangjia==1){
                            this.tshiarr[xh].string="叫地主";
                       }else{
                            this.tshiarr[xh].string="不叫";
                       }
                         
                   }else{
                        if(data.msg.data.shangjia==1){
                            this.tshiarr[xh].string="抢地主";
                       }else{
                            this.tshiarr[xh].string="不抢";
                       } 
                   }
                      
             this.sunxu=data.msg.data.sunxu;       
             this.xingwei=data.msg.data.xingwei;
             if(this.sunxu==4){
               this.sunxu=1;  
             }
             this.numarr[2].string=data.msg.data.beishu;
             if(this.xuowei==this.sunxu){
                   if(this.xingwei==1){
                        this.jiaofen.active=true;
                   }else{
                        this.qiangfen.active=true;
                   }
                   
                  
                }else{
                    this.jiaofen.active=false; 
                    this.qiangfen.active=false;
                }
         }
         
        if(data.msg.state==3){  //定地主 
             this.jiaofen.active=false; 
             this.qiangfen.active=false;
           this.sunxu=data.msg.data.sunxu;
            this.numarr[2].string=data.msg.data.beishu;
            
            
          this.tshiarr[0].node.active=false;
          this.tshiarr[1].node.active=false;
          this.tshiarr[2].node.active=false;
          
                if(this.xuowei==this.sunxu){
                 
                    this.user.isLandlord=true;
                }else{
                     this.user.isLandlord=false;
                }
          
            if(this.xuowei==this.sunxu){
                this.cn.removeAllChildren();
                    this.chupai.active=true;
                     this.chupaibt.active=false;
                     this.buchupaibt.active=false;
                     
                    var wp1=this.wpdata;this.wpdata;
                    wp1.push(this.dpdata[0]);
                     wp1.push(this.dpdata[1]);
                      wp1.push(this.dpdata[2]);
                      wp1.sort(function(a, b) {
                     return a - b;
                      });
                    
                   for(var i=0;i<wp1.length;i++){
                   var pk= GameData.pukers[wp1[i]-1];
                   this.cn.addChild(pk);
                   pk.x=i*this.paiju+50;
                   pk.y=0;
                   }   
                 this.user.cardList=this.wpdata;
                   this.inittishi();
            }else{
                
                      var tw=this.xuowei*10+this.sunxu;
                      var xh=this.xianwei[tw];
                      if(xh==0){
                          var n=this.numarr[0].string;
                         this.numarr[0].string=20; 
                      }
                      if(xh==2){
                          var n=this.numarr[1].string;
                         this.numarr[1].string=20;  
                      }
                     this.chupai.active=false; 
            }
            for(var i=0;i<3;i++){
                  var vl=this.pkvl[this.dpdata[i]-1];
                   var pk= this.dpcn[i];
                   if(vl==100){
                         pk.getComponent("Card").init({point:11,suit:1,pointName:"大"}); 
                    }else if(vl==99){
                         pk.getComponent("Card").init({point:11,suit:2,pointName:"小"}); 
                    }else{
                       pk.getComponent("Card").init({point:vl,suit:this.plhs[this.dpdata[i]-1],pointName:this.A2_10JQK[vl],isRedSuit:true}); 
                    }
            }
              
            
             this.dpcn[0].getComponent("Card").reveal(true);
             this.dpcn[1].getComponent("Card").reveal(true);
             this.dpcn[2].getComponent("Card").reveal(true);
        }
         
         if(data.msg.state==4){  // //出牌 
                 
                    this.tshiarr[0].node.active=false;
                   this.tshiarr[1].node.active=false;
                 this.tshiarr[2].node.active=false;
                    
                  this.numarr[2].string=data.msg.data.beishu;
                  var pai=data.msg.data.pai;
                                 var wp1=this.wpdata;
                                   for(var i=0;i<wp1.length;i++){
                                   var pk= GameData.pukers[wp1[i]-1];
                                   pk.y=0;
                                   }   
                 
                 if(pai.length>0){  //出牌处理
                          this.sunxu=data.msg.data.sunxu;
                            this.shangjiachupai=pai;  
                             this.shangjiasunxu=data.msg.data.sunxu-1;
                             if(this.shangjiasunxu<1){
                                 this.shangjiasunxu=3;
                             }
                              var tw=this.xuowei*10+this.shangjiasunxu;
                              var xh=this.xianwei[tw];
                              if(xh==0){
                                  var n=this.numarr[0].string;
                                 this.numarr[0].string=(n-pai.length); 
                              }
                              if(xh==2){
                                  var n=this.numarr[1].string;
                                 this.numarr[1].string=(n-pai.length);  
                              }
                              this.chpcn[0].removeAllChildren();
                              this.chpcn[1].removeAllChildren();
                              this.chpcn[2].removeAllChildren();
                              
                              
                            
                              
                              for(var i=0;i<this.shangjiachupai.length;i++){
                                   var pk= GameData.pukers[this.shangjiachupai[i]-1];
                                   this.cn.removeChild(pk);
                                   this.chpcn[xh].addChild(pk);
                                   if(xh==2){
                                       pk.x=(i-this.shangjiachupai.length)*this.paiju;  
                                   }else{
                                       pk.x=i*this.paiju; 
                                   }
                                  
                                   pk.y=0;
                              }
                              
                              if(this.shangjiasunxu==this.xuowei){  //自己出牌  this.wpdata
                                     for(var i=0;i<this.shangjiachupai.length;i++){
                                         var vl=this.shangjiachupai[i];
                                         for(var j=0;j<this.wpdata.length;j++){
                                             if(this.wpdata[j]==vl){
                                                this.wpdata.splice(j,1);
                                                break;
                                             }
                                         }
                                     }
                                   var wp1=this.wpdata;
                                   for(var i=0;i<wp1.length;i++){
                                   var pk= GameData.pukers[wp1[i]-1];
                                   pk.x=i*this.paiju+50;
                                   pk.y=0;
                                   }   
                                } 
                                
                        
              
                     }else{
                               var tw=this.xuowei*10+this.sunxu;
                               var xh=this.xianwei[tw];
                               this.tshiarr[xh].node.active=true;
                               this.tshiarr[xh].string="不出"; 
                     
                               this.sunxu=data.msg.data.sunxu;
                         
                     }
        
        
        
                      if(this.xuowei==this.sunxu){ 
                            if(this.shangjiasunxu==this.xuowei){
                                  this.shangjiasunxu=0; 
                                  this.shangjiachupai=[];
                                  this.chpcn[1].removeAllChildren();
                            } 
                            if(this.shangjiasunxu==0){
                                 this.buchupaibt.active=false;
                            }else{
                                 this.buchupaibt.active=true;
                            }
                             
                            // this.tshiarr[xh].node.active=false;
                             this.chpcn[1].removeAllChildren();
                             this.chupai.active=true; 
                             this.chupaibt.active=false;
                             this.inittishi();
                         
                    }else{
                         this.chupai.active=false; 
                    }
                    
            
         cc.log("data.msg.state  pai: ",data.msg.data.pai);
         }
         if(data.msg.state==5){  //结束 
           cc.log("结束结束 : ");
            this.tshiarr[0].node.active=false;
            this.tshiarr[1].node.active=false;
            this.tshiarr[2].node.active=false;
            this.chpcn[0].removeAllChildren();
            this.chpcn[1].removeAllChildren();
            this.chpcn[2].removeAllChildren();
            this.cn.removeAllChildren();
            var pai=data.msg.data.pai;
            var pokers=data.msg.data.pokers;
            for(var j=1;j<4;j++){
                var poker=data.msg.data.pokers[j-1];
                if(poker.length==0){
                   poker=pai; 
                }
               var tw=this.xuowei*10+j;
               var xh=this.xianwei[tw];
               
                for(var i=0;i<poker.length;i++){
                   var pk= GameData.pukers[poker[i]-1];
                                   this.chpcn[xh].addChild(pk);
                                   if(xh==2){
                                       if(poker.length>8){
                                           if(i>8){
                                               pk.x=(i-18)*this.paiju*0.5;
                                               pk.y=-30;   
                                           }else{
                                               pk.x=(i-9)*this.paiju*0.5;
                                               pk.y=0; 
                                           }
                                           
                                       }else{
                                         pk.x=(i-poker.length)*this.paiju*0.5;
                                         pk.y=0;  
                                       }
                                       
                                   }else if(xh==1){
                                       pk.x=i*this.paiju*0.5; 
                                         pk.y=0;
                                   }else{
                                       
                                       if(poker.length>8){
                                           if(i>8){
                                                 pk.x=(i-9)*this.paiju*0.5;  
                                               pk.y=-30;   
                                           }else{
                                                pk.x=i*this.paiju*0.5;  
                                               pk.y=0; 
                                           }
                                           
                                       }else{
                                          pk.x=i*this.paiju*0.5;  
                                          pk.y=0;
                                       }
                                       
                                       
                                       
                                       
                                   }
                                  
                                 
                              }    
             }    //显示结束
              this.sunxu=data.msg.data.sunxu;
            if(this.xuowei==this.sunxu){ 
                         
               this.gameover.active=true; 
            }              
              
             this.chupai.active=false;         
                 
         }
          if(data.msg.state==6){  //结束 
              this.sunxu=data.msg.data.sunxu;
              if(this.xuowei==this.sunxu){ 
               this.gameover.active=true; 
               }else{
                 this.gameover.active=false;  
              }            
              if(data.msg.data.xuanze==0){ 
                  var sx=this.sunxu-1;
                  if(sx<1){
                     sx=3; 
                  }
                   if(this.xuowei==sx){ 
                      this.desk.active=false;  
                      this.kuaisuyouxibt.active=true;  
                  }
              }
          }
           if(data.msg.state==7){  //结束 
                if(data.msg.data.xuanze==0){ 
                     this.sunxu=data.msg.data.sunxu;
                      var sx=this.sunxu-1;
                      if(sx<1){
                         sx=3; 
                      }
                       if(this.xuowei==sx){ 
                          this.desk.active=false;  
                          this.kuaisuyouxibt.active=true;  
                      }
                  }
             this.gameover.active=false;  
           }
    },
    inittishi:function(){
         this.promptTimes=0;
          var cards = [];
          var cardList=this.shangjiachupai;
            for(var j=0;j<cardList.length;j++){
                var cd={};
                cd.val=this.pkpx[cardList[j]-1];
                cd.xh=cardList[j];
                cd.type=this.pllx[cardList[j]-1];
                cards.push(cd);
            }
         var res=this.gamerule.typeJudge(cards);
         this.promptList = this.user.aiLogic.prompt(res); 
        	cc.log(" this.promptList data: ", this.promptList);
    },
    bujiaodizhu: function (){
                  cc.log("bujiaodizhu: ","bujiaodizhu");
                var route = "area.userHandler.qiangDiZhi";
        		cc.log("pomelo.request return data: ",route);
        			pomelo.request(route, {
        			xuanze:0
        		}, function(data) {
        			if(data.error) {
        				return;
        			}
        			  
        		});
        	 this.jiaofen.active=false; 
             this.qiangfen.active=false;
    },
    jiaodizhu: function(){
         cc.log("jiaodizhu:","jiaodizhu");  
           var route = "area.userHandler.qiangDiZhi";
        		cc.log("pomelo.request return data: ",route);
        			pomelo.request(route, {
        			xuanze:1
        		}, function(data) {
        		     
        			if(data.error) {
        				return;
        			}
        		});
        		 this.jiaofen.active=false; 
                 this.qiangfen.active=false;
    },
    zaiwanyiju: function(){
          var route = "area.userHandler.zaiwanyiju";
        		cc.log("pomelo.request return data: ",route);
        			pomelo.request(route, {
        			xuanze:1
        		}, function(data) {
        		     
        			if(data.error) {
        				return;
        			}
        		});
        		  this.gameover.active=false;
    },
    tuichuzaiwanyiju: function(){
           var route = "area.userHandler.zaiwanyiju";
        		cc.log("pomelo.request return data: ",route);
        			pomelo.request(route, {
        			xuanze:0
        		}, function(data) {
        		   
        			if(data.error) {
        				return;
        			}
        		});
        		 this.gameover.active=false;
    }
    
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
