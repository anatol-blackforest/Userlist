var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if(req.session.status){
        req.session.userName = false
        req.session.status = false
        req.session._id = false
        res.render('login', { title: 'Login'})
    }
})

module.exports = router;
