const express = require('express');
const {BasicStrategy} = require('passport-http');
const auth = require('./auth');
const session = require('express-session');
const passport = require("passport");

function hasCredentials(username, password) {
    return auth.some(user => user.username === username && user.password === password);
}

passport.use('basic', new BasicStrategy (

    (username, password, done) => {

        const userHasCredential = hasCredentials(username, password);

        return done(null, userHasCredential ? username : false);

    }
));
const app = express();

app.use(passport.initialize({}));

app.use(session({
    secret: 'cookie_secret',
    resave: false,
    saveUninitialized: false
}));

app.get('/login',
    (req, res, next) => {

        if (req.session.logout && req.headers.authorization) {
            req.session.logout = false;
            delete req.headers.authorization;
        }

        next();

    }, passport.authenticate('basic', {session: false, successRedirect: '/resource'}),
);

app.get('/logout', (req, res) => {
    req.session.logout = true;
    res.redirect('/login');
});


app.get('/resource',
    passport.authenticate('basic', {session: false, failureRedirect: "/login"}),
    (req, res) => {
        console.log(res)
        res.send('RESOURCE');
    }
);

app.use((req, res) => {
    res.status(404).send('Not found');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});