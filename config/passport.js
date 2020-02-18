const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = function (passport) {
    passport.use('local',
        new LocalStrategy({},
            function (username, password, done) {
                User.findOne({username: username}, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {message: 'Неверное имя пользователя'});
                    }
                    if (!user.validPassword(password)) {
                        return done(null, false, {message: 'Неверный пароль'});
                    }
                    return done(null, user);
                });
            }
        )
    );

    passport.use('local-signup',
        new LocalStrategy({},
            function (username, password, done) {
                User.findOne({username: username}, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, {message: 'Такой пользователь уже существует'});
                    }
                    User.create(username, password, function (err, user) {
                        return done(null, user);
                    });
                });
            }
        )
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            err
                ? done(err)
                : done(null, user);
        });
    });
};