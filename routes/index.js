const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    const auth = req.isAuthenticated();
    const username = auth ? req.user[0].username : '';
    res.render('index', {
        title: 'Главная',
        auth: auth,
        username: username
    });
});

module.exports = router;