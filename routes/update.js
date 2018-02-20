var express = require('express');
var router = express.Router();
var {MongoClient, ObjectId} = require("mongodb")
var url = "mongodb://localhost:27017"

/* GET users listing. */
router.post('/:id', function(req, res) {
    if(req.body && req.body.login){
        MongoClient.connect(url, (err, client) => {
            const db = client.db("database")
            const collection = db.collection("users")
            collection.findOneAndUpdate(
                {_id : ObjectId(req.params.id)},
                {$set : {login: req.body.login, status: req.body.status}},
                () => {
                    client.close()
                    res.redirect("/")                   
                }
            )
        })
    }else{
        res.redirect("/")
    }

});

module.exports = router;
