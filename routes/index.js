const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const connection = mysql.createConnection({
    host      : process.env.DB_HOST,
    user      : process.env.DB_USER,
    password  : process.env.DB_PASSWORD,
    database  : process.env.DB_DATABASE
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

    connection.query(SQL, function (error, rows) {
        if (error) throw error;
        res.render('index', {title: 'Главная',
            rows: rows,
            sortType: req.query.sortType
        });
    });
});

router.post('/', function (req, res) {
    connection.query('INSERT INTO data_element(text) VALUES (?)',
        [req.body.text],function(error) {
            res.json({error: error});
        });
});

router.post('/delete', jsonParser, function (req, res) {
   connection.query('DELETE FROM data_element WHERE id = ?',
       [req.body.id], function (error) {
            res.json({error: error});
        });
});

router.post('/:id', function (req, res) {
    connection.query('UPDATE data_element SET text = ? WHERE id = ?',
        [req.body.text, req.params.id.replace('item', '')],
        function (error) {
            res.json({error: error});
        });
});

module.exports = router;
