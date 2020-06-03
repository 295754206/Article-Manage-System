var express = require('express');
var router = express.Router();
var model = require('../module');

/* GET users listing. */

router.post('/add', function(req,res,next){
    var id = parseInt(req.body.id);
    if(id){ // editor
        var page = req.body.page;
        var title = req.body.title;
        var content = req.body.content;
        model.connect(function(db){
            db.collection('articles').updateOne({id:id},{$set:{
                title:title,
                content:content
            }},function(err,ret){
                if(err){
                    console.log('editor fail',err);
                }else{
                    console.log('editor Ok');
                    res.redirect('/?page='+page);
                }
            })
        })
    }else{  // add
        var data = {
            title:req.body.title,
            content:req.body.content,
            id:Date.now(),
            username:req.session.username||'未知用户'
        }
        model.connect(function(db){
            db.collection('articles').insertOne(data,function(err,ret){
                if(err){
                    console.log('文章发布失败',err);
                    res.redirect('/write')
                }else{
                    res.redirect('/')
                }
            })
        })
    }
})

// delete
router.get('/delete',function(req,res,next){
    var id = parseInt(req.query.id);
    var page = req.query.page;
    model.connect(function(db){
        db.collection('articles').deleteOne({id:id},function(err,ret){
            if(err){
                console.log('delete OK');
            }else{
                console.log('delete Fail');
            }
            res.redirect('/?page='+page);
        })
    })
})

module.exports = router;
