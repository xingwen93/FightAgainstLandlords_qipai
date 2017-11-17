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
         username: cc.EditBox
    },

    // use this for initialization
    onLoad: function () {
         cc.director.preloadScene('table', function () {
            cc.log('Next scene preloaded');
        });
    },
    loginGame: function () {
        /**
         var xhr = new XMLHttpRequest();
         xhr.onreadystatechange = function () {
             if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                 var response = xhr.responseText;
                 console.log(response);
                 GameData.token=response;
                 cc.director.loadScene('table');
                cc.log("loginGame");
             }
         };
         var url="http://localhost:3001/login.html";
         xhr.open("GET", url, true);
         xhr.send();
         */
         GameData.username=this.username.string;
          cc.director.loadScene('table');
       
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
