const LocalStrategy = require('passport-local').Strategy;
const models = require('../models');
const bcrypt = require('bcrypt');

module.exports = function (passport) {

    passport.use('local',
        new LocalStrategy({},
            function (username, password, done) {
                const validPassword = (password, hash) => {
                    return bcrypt.compareSync(password, hash);
                };

                models.User.findOne({
                    where: {
                        username: username
                    }
                }).then((user) => {
                    if (!user) {
                        return done(null, false, {message: 'Неверное имя пользователя'});
                    }
                    if (!validPassword(password, user.password)) {
                        return done(null, false, {message: 'Неверный пароль'});
                    }
                    return done(null, user);
                }).catch((err) => {
                    done(err);
                });
            }
        )
    );

    passport.use('local-signup',
        new LocalStrategy({},
            function (username, password, done) {
                const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

                models.User.findOrCreate({
                    where: {
                        username: username
                    },
                    defaults: {
                        password: hashedPassword
                    }
                }).then(([newUser, created]) => {
                    if (!created) {
                        return done(null, false, {
                            message: 'Такой пользователь уже существует'
                        });
                    }
                    return done(null, newUser);
                }).catch((err) => {
                    done(err, null);
                });
            }
        )
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        models.User.findByPk(id)
            .then((user) => {done(null, user)})
            .catch((err) => {done(err)});
    });
};