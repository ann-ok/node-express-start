const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

router.get('/', isLoggedIn, function (req, res) {
    const auth = req.isAuthenticated();
    const username = auth ? req.user[0].username : '';
    let SQL = 'SELECT * FROM user WHERE id = ?';
    const connection = mysql.createConnection(require('../config/dbconfig'));
    connection.connect();
    connection.query(SQL, [req.user[0].id], function (err, rows1) {
        if (err) throw err;
        let image = rows1[0].image;
        if (!image || image === '')
            image = 'default.png';

        const listCountSQL = 'SELECT COUNT(*) FROM data_element WHERE user_id = ?';
        connection.query(listCountSQL, [req.user[0].id], function (err, rows2) {
            if (err) throw err;
            res.render('profile', {
                title: 'Профиль',
                auth: auth,
                username: username,
                image: './uploads/' + image,
                itemsCount: rows2[0]['COUNT(*)'],
                error: req.flash('error')[0]
            });
        });
        connection.end();
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
    const username = req.user[0].username;
    const filename = username + avatar.name.substring(avatar.name.lastIndexOf('.'));
    avatar.mv('./public/uploads/' + filename, function (err) {
        if (err) {
            req.flash('error', 'Ошибка.');
            return res.redirect('/profile');
        } else {
            const SQL = "UPDATE user SET image = ? WHERE id = ?";
            const connection = mysql.createConnection(require('../config/dbconfig'));
            connection.connect();
            connection.query(SQL, [filename, req.user[0].id], function (err) {
                if (err) throw err;
                return res.redirect('/profile');
            });
            connection.end();
        }
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    req.isAuthenticated()
        ? next()
        : res.redirect('/');
}