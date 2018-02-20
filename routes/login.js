var express = require('express');
var router = express.Router();
var fs = require("fs")
var crypto = require("crypto")
var MongoClient = require("mongodb").MongoClient
var url = "mongodb://localhost:27017"

router.get('/', function(req, res, next) {
    if(req.session.admin){
        res.render('login', { title: 'Hello, My Lord, Your Great Majesty - Administrator!', admin: true });
    }else{
        res.render('login', { title: 'Login' });
    }
}).post('/', function(req, res, next) {
  let valid = true
  for (item in req.body){
      if (req.body[item] === "") valid = false
  }
  if (valid) {
      MongoClient.connect(url, (err, client) => {
        const db = client.db("database")
        const collection = db.collection("users")
        let password = crypto.createHmac('sha1', 'abc').update(req.body.password).digest('hex'); 
        collection.find().toArray((err, resultAll) => {
           if(err)client.close()
           collection.findOne({...req.body, password})
            .then(result => {
                if(result.status === "admin" && !req.session.admin){
                   req.session.admin = true
                   res.render('login', { title: `Hello, My Lord, Your Great Majesty - Administrator!`, admin: true });
                }else{
                   res.render('login', { title: `Hello, ${result.login}!` });
                }
                client.close()
            }).catch(() => {
              client.close()
              res.render('login', { title: 'Incorrect password or user not found!' });
            })
        })
      })
      fs.appendFile(
        "logins.txt", 
        `Date: ${new Date().toLocaleString()}, user: ${req.body.login}, ip: ${req.ip}\n`,
        () => console.log("Login writed!")
      )
  }else{
    res.render('login', { title: 'Login' });
  }
});

module.exports = router;
