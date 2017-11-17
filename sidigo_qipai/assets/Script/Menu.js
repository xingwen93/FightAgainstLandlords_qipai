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
        desk:{
            default:null,
            type:cc.Node
        },  
        qusukaishi:{
            default:null,
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {

    },

   kuaisuyouxi: function () {
                 this.desk.active=true;
                 this.qusukaishi.active=false;
            	var route = "connector.entryHandler.kuaisuyouxi";
        		cc.log("pomelo.request return data: ",route);
        			pomelo.request(route, {
        			uid:GameData.user.uid,
        			host:GameData.host,
        			token: GameData.token
        		}, function(data) {
        		  
        			if(data.error) {
        			 
        				return;
        			}
        			  cc.log("pomelo.request data.code: ", data.code); 
        		});
   }
});
