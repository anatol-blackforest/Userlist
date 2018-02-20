var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if(req.session.admin){
        req.session.admin = false
        res.render('login', { title: 'Login', admin: false });
    }
});

module.exports = router;
