var util = require('util'); //加载模块
var mongoose = require('mongoose');//加载mongoose数据库中间件

var Schema = mongoose.Schema;
var dburl = require("../config").db;//数据库地址

//连接数据库
exports.connect = function(callback) {
    mongoose.connect(dburl);
}

//端口数据库连接
exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
}

//setup方法
exports.setup = function(callback) { callback(null); }

//定义商品模型
var GoodsSchema = new Schema({
	name:String,
	count:{type:String,default:'1'},
	isok:{type:Boolean,default:false}
});

//访问goods商品模型
mongoose.model('goods', GoodsSchema);
var Goods = mongoose.model('goods');

/*********************CUDR*******************/

//添加商品信息
exports.add = function(newGds,callback) {
    var newGoods  = new Goods();
    
    newGoods.name = newGds.name;
    newGoods.count = newGds.count;
    newGoods.isok = newGds.isok;


    newGoods.save(function(err){
        if(err){
            util.log("FATAL"+err);
            callback(err);
        }else{
            callback(null);
        }
    });
}

//删除
exports.delete = function(id, callback) {
    exports.findGoodsById(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            util.log(util.inspect(doc));
            doc.remove();//如果找到该元素。就删除
            callback(null);
        }
    });
}

//更新，，，，，，，，写得真丑啊 
exports.update = function(id,newGoods,callback){
     Goods.findOne({_id:id},function(err,doc){
        if(err){
             callback(err);
        }else{
            Goods.update({name:doc.name,count:doc.count,isok:doc.isok},{$set:newGoods},function(err){
                if(err)
                    callback(err);
                callback(null);
            });
        }            
      });
}

//查询所有商品
exports.allGoods = function(callback) {
    Goods.find({}, callback);
}

/*****根据ID找到对应的元素*****/
var findGoodsById = exports.findGoodsById = function(id,callback){
    Goods.findOne({_id:id},function(err,doc){
        if (err) {
            util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });
}