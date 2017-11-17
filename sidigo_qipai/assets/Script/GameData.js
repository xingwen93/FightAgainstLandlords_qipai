cc.Class({
   
    ctor: function () {
        cc.log("Shape");    // 实例化时，父构造函数会自动调用，
         this.url = "";  //实例变量 
         this.id = 0;
    },
    print: function (str) {
        cc.log(str);
    },
    statics: { 
        // 声明静态变量
        count: 0,
        username:"nihaoyawo",
        host:"xindiguo",
        token:"token_test",
        user:null,
        pukers:[],
        // 声明静态方法
        getBounds: function () {
            // ...
           cc.log('getBounds');
        }
    }
    
});
