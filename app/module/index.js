var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017';
var dbName = 'app';

function connect(callback){
    MongoClient.connect(url,function(err,client){
        if(err){
            console.log("CONNECT ERR",err);
        }else{
            var db = client.db(dbName);
            callback && callback(db);
            client.close();
        }
    })
}

module.exports = {
    connect
}