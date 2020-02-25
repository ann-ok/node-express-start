const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', isLoggedIn, function (req, res) {
    const auth = req.isAuthenticated();
    const username = auth ? req.user.username : '';
    models.User.findOne({
        where: {
            id: req.user.id
        },
        include: [ models.Element ]
    }).then((user) => {
        let image = user.image;
        if (!image || image === '')
            image = 'default.png';
        res.render('profile', {
            title: 'Профиль',
            auth: auth,
            username: username,
            image: './uploads/' + image,
            itemsCount: user.Elements.length,
            error: req.flash('error')[0]
        });
    }).catch((err) => {
        throw err;
    });
});

router.post('/upload', isLoggedIn, function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        req.flash('error', 'Файлы не были загружены.');
        return res.redirect('/profile');
    }

    const avatar = req.files.avatar;
    if (!avatar.mimetype.includes('image')) {
        req.flash('error', 'Можно загружать только изображения.');
        return res.redirect('/profile');
    }
    const username = req.user.username;
    const filename = username + avatar.name.substring(avatar.name.lastIndexOf('.'));
    avatar.mv('./public/uploads/' + filename, function (err) {
        if (err) {
            req.flash('error', 'Ошибка.');
            return res.redirect('/profile');
        } else {
            models.User.update({ image: filename }, {
                where: {
                    id: req.user.id
                }
            }).then(() => {
                res.redirect('/profile');
            }).catch((err) => {
                throw err;
            });
        }
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    req.isAuthenticated()
        ? next()
        : res.redirect('/auth/login');
}