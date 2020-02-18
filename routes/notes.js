const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mysql = require('mysql2');

router.get('/', isLoggedIn, function (req, res) {
    let SQL = 'SELECT * FROM data_element WHERE user_id = ?';

    if (typeof req.query.sortType === 'undefined') {
        req.query.sortType = 'id-asc';
    }

    const sort_args = req.query.sortType.split('-');
    SQL += ' ORDER BY ' + sort_args[0] + ' ' + sort_args[1];

    const connection = mysql.createConnection(require('../config/dbconfig'));
    connection.connect();
    connection.query(SQL,
        [req.user[0].id],
        function (err, rows) {
            if (err) throw err;
            res.render('notes', {
                title: 'Список элементов',
                rows: rows,
                sortType: req.query.sortType,
                errMsg: req.flash('error')[0],
                auth: req.isAuthenticated(),
                username: req.user[0].username
            });
        });
    connection.end();
});

router.post('/', isLoggedIn, jsonParser, function (req, res) {
    if (req.body.text !== '') {
        const connection = mysql.createConnection(require('../config/dbconfig'));
        connection.connect();
        connection.query('INSERT INTO data_element(text, user_id) VALUES (?, ?)',
            [req.body.text, req.user[0].id],
            function (err) {
                res.redirect('/notes');
            });
        connection.end();
    } else {
        req.flash('error', 'Поле не должен быть пустым');
        res.redirect('/notes');
    }
});

router.post('/delete', isLoggedIn, jsonParser, function (req, res) {
    const connection = mysql.createConnection(require('../config/dbconfig'));
    connection.connect();
    connection.query('DELETE FROM data_element WHERE id = ? AND user_id = ?',
        [req.body.id.replace('item', ''), req.user[0].id],
        function (err) {
            res.json({error: err});
        });
    connection.end();
});

router.post('/:id', isLoggedIn, jsonParser, function (req, res) {
    const connection = mysql.createConnection(require('../config/dbconfig'));
    connection.connect();
    connection.query('UPDATE data_element SET text = ? WHERE id = ? AND user_id = ?',
        [req.body.text, req.params.id.replace('item', ''), req.user[0].id],
        function (err) {
            res.json({error: err});
        });
    connection.end();
});

module.exports = router;

function isLoggedIn(req, res, next) {
    req.isAuthenticated()
        ? next()
        : res.redirect('/');
}