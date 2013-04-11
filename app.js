
/**
 * Module dependencies.
 */
var express = require('express')
  , action = require('./controllers/action')
  , config = require("./config")
  , goodsDao = require("./model/goodsDao")
  , ejs=require('ejs');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  // app.engine('html', cons.handlebars);
  app.register('html', ejs); //同时支持html的设置
  app.set('view engine', 'ejs');//同时支持ejs
  // app.register(".html", {
  //       compile: function(str, options){
  //           return function(locals){
  //               return str;
  //           };
  //       }
  //   }); // 指向html模板
 
  // app.set("view options", {layout: false}); // 指定index不指定layout模板.


  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', action.index);
app.post('/goods/new',action.new);
app.get('/goods/:id/delete', action.delete);
app.get('/goods/:id/goedit', action.goedit);
app.post('/goods/:id/edit', action.edit);




/*****开启数据库连接****/
goodsDao.connect(function(error){
    if (error) throw error;
});
/*********应用关闭时，断开数据库连接*********/
app.on('close', function(errno) {
    todoDao.disconnect(function(err) { });
});

/**********************************************/
app.listen(8888);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
