var config = require('../config');
var db = require('../model/goodsDao');


exports.index = function (req, res, next) {
    db.allGoods(function (err, goods) {
        if (err) {
            return next(err);
        }else{
        	//查询成功！
        	res.render('index', {config:config , goods:goods});
        }
    });
};

exports.new = function(req, res,next){
	var name = req.body.goodsname || ''; //获取商品名称
    var count = req.body.goodscount || '';
    var isok = req.body.isok || '';
    name = name.trim();//去掉空格
    count = count.trim();
    isok = Boolean(isok.trim());      //转换函数;

    var newGoods = {name:name,count:count,isok:isok};

    if (!name) {
        return res.render('error', {config:config , message: '请输入商品名称'});//没有取到相应的值，回到错误页面
    }

    //取到相应的值，则添加一条数据，如果添加成功回到首页
    db.add(newGoods, function (err, row) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
}

/**
删除一则数据
**/
exports.delete = function (req, res, next) {
    var id = req.params.id;
    db.delete(id, function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');//返回主页
    });
};

/********跳转到信息编辑页面******/
exports.goedit = function(req,res,next){
    var id = req.params.id;

    db.findGoodsById(id,function(err,goods){
        if(err){
            return res.render('error', {config:config , message: '获取该商品的编号有误'});
        }
        return res.render('edit',{config:config , goods:goods});
    });
    
};

/*******修改数据*****/
exports.edit = function(req,res,next){
    var name = req.body.goodsname || ''; //获取商品名称
    var count = req.body.goodscount || '';
    var isok = req.body.isok || '';
    name = name.trim();//去掉空格
    count = count.trim();
    isok = Boolean(isok.trim());      //转换函数;

    var newGoods = {name:name,count:count,isok:isok};

    var id = req.params.id;//获取商品编号
    db.update(id,newGoods,function(err){
         if(err)
            return res.render('error', {config:config , message: '更新数据失败'});
        else
            return res.render('error', {config:config , message: '更新数据成功！'}) ;
    });

}