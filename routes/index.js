const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const connection = mysql.createConnection({
    host      : 'localhost',
    user      : 'root',
    password  : 'root',
    database  : 'learning_db'
});
connection.connect();

/* GET home page. */
router.get('/', function (req, res) {
    let SQL = 'SELECT * FROM data_element';

    if (typeof req.query.sortType === 'undefined') {
        req.query.sortType = 'id-asc';
    }

    const sort_args = req.query.sortType.split('-');
    SQL += ' ORDER BY ' + sort_args[0] + ' ' + sort_args[1];

    connection.query(SQL, function (err, rows) {
        if (err) throw err;
        res.render('index', {rows: rows, sortType: req.query.sortType});
    });
});

router.post('/', function (req, res) {
    connection.query('INSERT INTO data_element(text) VALUES (?)',
        [req.body.text],function(err, result) {
            res.redirect('/');
        });
});

router.post('/delete', jsonParser, function (req, res) {
   connection.query('DELETE FROM data_element WHERE id = ?',
       [req.body.id], function (err, result) {
            console.log(req.body.id);
            res.redirect('/');
        });
});

router.post('/:id', function (req, res) {
    connection.query('UPDATE data_element SET text = ? WHERE id = ?',
        [req.body.text, req.params.id],
        function () {});
    res.redirect('/');
});

module.exports = router;
