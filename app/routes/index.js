var express = require('express');
var router = express.Router();
var model = require('../module');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  var username = req.session.username || '';
  var page = req.query.page || 1;
  var data = {
    total : 0,
    cur : page,
    li : []
  }
  var pagesize = 2;
  model.connect(function(db){
    // 
    db.collection('articles').find().toArray(function(err,docs){
      console.log('article:',docs);
      data.total = Math.ceil(docs.length / pagesize);
      // search now page
      model.connect(function(db){
        db.collection('articles').find().sort({_id:-1}).limit(pagesize).skip((page-1)*pagesize).toArray(function(err,docs2){
          if(docs2.length == 0){
            res.redirect('/?page='+((page-1) || 1))
          }else{
            docs2.map(function(ele,index){
              ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss')
            })
            data.list = docs2;
          }
          res.render('index', { username:username,data:data});
        });
      })
    })
  })
});

// 
router.get('/regist',function(req,res,next){
  res.render('regist',{});
})

// 
router.get('/login',function(req,res,next){
  res.render('login',{});
})

//
router.get('/write',function(req,res,next){
  var username = req.session.username || '';
  var id = parseInt(req.query.id);
  var page = req.query.page;
  var item = {
    title:'',
    content:''
  }
  if(id){
    model.connect(function(db){
      db.collection('articles').findOne({id:id},function(err,docs){
        if(err){
          console.log('search fail');
        }else{
          item = docs;
          item['page'] = page;
          console.log(item);
          res.render('write',{username:username,item:item});
        }
      })
    })
  }else{
    res.render('write',{username:username,item:item});
  }
})

// 详情

router.get('/detail',function(req,res,next){
  var id = parseInt(req.query.id);
  var username = req.session.username || '';
  model.connect(function(db){
    db.collection('articles').findOne({id:id},function(err,docs){
      if(err){
        console.log(" Search-Fail",err);
      }else{
        var item = docs;
        item['time'] = moment(item.id).format('YYYY-MM-DD HH:mm:ss');
        res.render('detail',{item:item,username:username});
      }
    })
  })
})


module.exports = router;
