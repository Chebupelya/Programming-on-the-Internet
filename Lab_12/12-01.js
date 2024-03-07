import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { passport } from "./src/Sessions/Passport/config.js"

const PORT = 3000;

const app = express();

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'secret'
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
    res.render("elogin");
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/resource',
    failureRedirect: '/login'
}));

app.get('/resource', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render("resource", {user: req.user});
    } else{
        return res.status(401).send({err: `User is not authenticated`});
    }
});

app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            console.error(err);
        }
    });
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});