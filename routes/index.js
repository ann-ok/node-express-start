const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/notes');
    } else {
        res.render('index', {title: 'Главная'});
    }
});

module.exports = router;