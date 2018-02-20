var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient
var url = 'mongodb://localhost:27017'

/* GET home page. */
router.get('/', function(req, res, next) {
  MongoClient.connect(url, (err, client) => {
     if(err){
        res.render('index', { title: 'Main page' })
        client.close()
     }else{
      const db = client.db("database")
      const collection = db.collection("users")
      collection.find().toArray((err, users) => {
          if (err) {
              res.render('index', { title: 'Main page' })
              client.close()
          }else{
              if(req.session.status){
                 res.render('index', { title: 'Main page', users, status: req.session.status, id: req.session.id })
              }else{
                 res.render('index', { title: 'Main page', users })
              }
              client.close()
          }
      })
     }
  })
});

module.exports = router;
