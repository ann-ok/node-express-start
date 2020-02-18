const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/login', isLoggedIn, function (req, res) {
    res.render('auth/login', {title: 'Вход', errMsg: req.flash('error')[0]});
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/notes',
        failureRedirect: '/auth/login',
        badRequestMessage: 'Не все поля были заполнены',
        failureFlash: true
    })
);

router.get('/register', isLoggedIn, function (req, res) {
    res.render('auth/register', {title: 'Регистрация', errMsg: req.flash('error')[0]});
});

router.post('/register',
    passport.authenticate('local-signup',
        {
            successRedirect: '/notes',
            failureRedirect: '/auth/register',
            badRequestMessage: 'Не все поля были заполнены',
            failureFlash: true
        }
    )
);

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;

function isLoggedIn(req, res, next) {
    req.isAuthenticated()
        ? res.redirect('/notes')
        : next();
}