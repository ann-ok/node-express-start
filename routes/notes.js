const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const models = require('../models');

router.get('/', isLoggedIn, function (req, res) {
    if (typeof req.query.sortType === 'undefined') {
        req.query.sortType = 'id-asc';
    }
    const sort_args = req.query.sortType.split('-');

    models.Element.findAll({
        where: {
            user_id: req.user.id
        },
        order: [
          [sort_args[0], sort_args[1]]
        ],
    }).then((elements) => {
        res.render('notes', {
            title: 'Список элементов',
            elements: elements,
            sortType: req.query.sortType,
            errMsg: req.flash('error')[0],
            auth: req.isAuthenticated(),
            username: req.user.username
        });
    }).catch((err) => {
        throw err;
    });
});

router.post('/', isLoggedIn, jsonParser, function (req, res) {
    if (req.body.text !== '') {
        models.Element.create({
            text: req.body.text,
            user_id: req.user.id
        }).then(() => {
            res.redirect('/notes');
        }).catch((err) => {
            throw err;
        });
    } else {
        req.flash('error', 'Поле не должен быть пустым');
        res.redirect('/notes');
    }
});

router.post('/delete', isLoggedIn, jsonParser, function (req, res) {
    models.Element.destroy({
        where: {
            id: req.body.id.replace('item', ''),
            user_id: req.user.id
        }
    }).then(() => {
        res.json({error: null});
    }).catch((err) => {
        res.json({error: err});
    });
});

router.post('/:id', isLoggedIn, jsonParser, function (req, res) {
    models.Element.update({ text: req.body.text }, {
        where: {
            id: req.body.id.replace('item', ''),
            user_id: req.user.id
        }
    }).then(() => {
        res.json({error: null});
    }).catch((err) => {
        res.json({error: err});
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    req.isAuthenticated()
        ? next()
        : res.redirect('/auth/login');
}