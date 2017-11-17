var GameData = require("GameData");
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
        uid: {
            default:null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {
       cc.log("Game onLoad: ", GameData.token);
        this.desk = this.getComponent('desk');
        var that = this;
         that.serverIp = "192.168.1.102";
         that.serverPort = "3014";
        
      that.queryEntry(GameData.token, function(host, port) {
        	pomelo.init({
        		host: host,
        		port: port,
        		log: true
        	}, function() {
        		var route = "connector.entryHandler.entry";
        		cc.log("pomelo.request return data: ",route);
        			pomelo.request(route, {
        			username:GameData.username,
        			host:GameData.host,
        			token: GameData.token
        		}, function(data) {
        		  
        			if(data.error) {
        			 
        				return;
        			}
        			GameData.user=data.msg;
        			that.uid.string=data.msg.uid;  //用户uid
        		   cc.log("pomelo.request return data: ", data.code);
        		    cc.log("pomelo.request return data: ", data.msg.uid);
        		});
        	
        	});
        });
    },
     queryEntry: function(token, callback) {
        var that = this;
        
    	var route = 'gate.gateHandler.queryEntry';
    	pomelo.init({
    		host: that.serverIp,
    		port: that.serverPort,
    		log: true
    	}, function() {
    		pomelo.request(route, {
    			token: token
    		}, function(data) {
    		    cc.log("pomelo.request return data: ", data.port);
    		    
    			pomelo.disconnect();
    			if(data.code === 500) {
    				that.showError(LOGIN_ERROR);
    				return;
    			}
    			// 返回的data.host为"127.0.0.1"，
    // 			测试时需要改成本机ip否则Android手机连接不上
    // 			callback(data.host, data.port);
                callback(that.serverIp, data.port);
    		});
    	});
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
