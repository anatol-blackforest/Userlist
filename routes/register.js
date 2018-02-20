var express = require('express');
var router = express.Router();
var crypto = require("crypto")
var multer = require("multer")
var path = require("path")
var fs = require("fs")
var MongoClient = require("mongodb").MongoClient
var url = "mongodb://localhost:27017"

var singleUpload = multer({dest: "./tmp"}).single('avatar');; 

// Форма регистрации. На серверной стороне реализована логика, возвращающая 
// пользователю страницу регистрации. И полученные данные с формы записываем в БД. 

router.get('/', function(req, res, next) {
  res.render('register', { title: 'Register' });
}).post('/', singleUpload, function(req, res, next) {
  let valid = true
  for (item in req.body){
      if (req.body[item] === "") valid = false
  }
  if (req.body["password"] !== req.body["password_v"]) valid = false
  if (valid) {
      MongoClient.connect(url, (err, client) => {
        if (err){
          console.log(err)
          res.render('register', { title: err });
          client.close()
        }else{
          const db = client.db("database")
          const collection = db.collection("users")
          let password = crypto.createHmac('sha1', 'abc').update(req.body.password).digest('hex'); 
          let target_path, tmp_path
          collection.insertOne({...req.body, password, status: (req.body && req.body.login.toLowerCase() === "admin") ? "admin" : "user", avatar: (req.file && req.file.originalname) ? `avatar_${req.body.login}${req.file.originalname.slice(req.file.originalname.lastIndexOf("."))}` : null}, (err, result) => {
              if(req.file && req.file.originalname){
                //временная и целевая папки аватаров для загрузки
                tmp_path = req.file.path;
                target_path = path.join(".", "public", "avatars", `avatar_${req.body.login}${req.file.originalname.slice(req.file.originalname.lastIndexOf("."))}`); 
              }
              if (err){
                fs.unlink(tmp_path);  
                res.render('register', { title: err });
                client.close()
              }else{
                collection.find().toArray((err, result) => {
                  if (err){
                    fs.unlink(tmp_path);  
                    res.render('register', { title: err });
                    client.close()
                  }else{
                    if(req.file && req.file.originalname){
                      // загрузка файла 
                      var src = fs.createReadStream(tmp_path); 
                      var dest = fs.createWriteStream(target_path);
                      src.pipe(dest); 
                      // обработка результатов загрузки 
                      src.on('end', function() { 
                        // удалить файл временного хранения данных
                        fs.unlink(tmp_path); 
                        res.render('register', { title: 'Done!' });
                      });
                      src.on('error', function(err) { 
                        // удалить файл временного хранения данных
                        fs.unlink(tmp_path);  
                        res.render('register', { title: err });
                      });
                    }else{
                      res.render('register', { title: "Done" });
                    }
                    client.close()
                  }
                })
              }
          })
        }
      })
  }else{
    res.render('register', { title: 'Register' });
  }
});

module.exports = router;
