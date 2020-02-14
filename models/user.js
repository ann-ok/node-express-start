const mysql = require("mysql2");
const bcrypt = require('bcrypt');

module.exports = class User {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    static findOne(data, done) {
        const connection = mysql.createConnection(require('../config/dbconfig'));
        connection.connect();
        connection.query('SELECT * FROM user WHERE username = ?',
            [data.username],
            function (err, rows) {
                if (err) throw err;
                if (!rows.length) done(err, null);
                else done(err, new User(rows[0].id, rows[0].username, rows[0].password));
            }
        );
        if (connection)
        connection.end();
    }

    static create(username, password, done) {
        const SQL = 'INSERT INTO user(username, password) VALUES (?, ?)';
        const connection = mysql.createConnection(require('../config/dbconfig'));
        connection.connect();
        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        connection.query(SQL, [username, hashedPassword], function (error, result) {
            if (error) done(error, null);
            else {
                const user = new User(result.insertId, username, hashedPassword);
                done(error, user);
            }
        });
        connection.end();
    }

    validPassword(password) {
        return bcrypt.compareSync(password, this.password);//this.password === password;
    }

    static findById(id, done) {
        const connection = mysql.createConnection(require('../config/dbconfig'));
        connection.connect();
        connection.query('SELECT * FROM user WHERE id = ?',
            [id],
            done
        );
        connection.end();
    }
};