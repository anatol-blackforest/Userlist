var express = require('express');
var router = express.Router();
var path = require("path")
var fs = require("fs")
var {MongoClient, ObjectId} = require("mongodb")
var url = 'mongodb://localhost:27017'

/* GET users listing. */
router.get('/:id', function(req, res) {
  MongoClient.connect(url, (err, client) => {
      if(err){
          res.redirect("/")
          client.close()
      }else{
          const db = client.db("database")
          const collection = db.collection("users")
          const obj = {_id : ObjectId(req.params.id)}
          collection.findOne(obj).then(result => {
            collection.deleteOne(obj, err => {
                if (err) {
                    client.close()
                    res.redirect("/")
                }else if(result.avatar){
                    fs.unlink(path.join(".", "public", "avatars", result.avatar), () => {
                        client.close()
                        res.redirect("/")
                    })
                }else{
                    client.close()
                    res.redirect("/")
                }
            })
          }).catch(()=> {
              client.close()
              res.redirect("/")
          })
      }
  })
});

module.exports = router;
