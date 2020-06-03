var express = require('express');
var router = express.Router();
var model = require('../module');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//
router.post('/regist',function(req,res,next){
  var data = {
    username:req.body.name,
    passward:req.body.p1,
    passward:req.body.p2
  }
  // shujuxiaoyan
  model.connect(function(db){
    db.collection('users').insertOne(data,function(err,ret){
      if(err){
        console.log('fail');
        res.redirect('/regist');
      }else{
        res.redirect('/login');
      }
    })
  })
})

router.post('/login',function(req,res,next){
  var data = {
    username:req.body.name,
    passward:req.body.p1
  }
  model.connect(function(db){

    db.collection('users').find(data.username).toArray(function(err,docs){
      if(err){
        res.redirect('/login')
      }else{
        var n;
        for(let i=0;i<docs.length;i++){
          if(docs[i].username == data.username){
            n = docs[i];
            console.log(n.passward);
            console.log(data.passward);
            if(n.passward == data.passward){
              console.log("______________________");
              if(docs.length>0){
                // session       

                req.session.username = data.username;
                res.redirect('/')

              }else{
                res.redirect('/login')
              }
            }else{
              res.redirect('/login')
            }
          }
        }
      }
    })
  })
  console.log('LOGIN',data);
})





// logout
router.get('/logout',function(req,res,next){
  req.session.username = null;
  res.redirect('/logout');
})






module.exports = router;
