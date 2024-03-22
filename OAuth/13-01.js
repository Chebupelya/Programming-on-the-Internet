const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const app = express();

const GITHUB_CLIENT_ID = '03b0dd30b914e447bcd6';
const GITHUB_CLIENT_SECRET = '7963cdd987bcb90c6383595eaee5dd7a1cc3d02c';

app.use(session({
        secret: "secret-github-session",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback",
       prompt:"select_account"
    },
    function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.get('/login', (req, res) => {
    res.send(`
    <html>
      <body>
        <button><a href="/auth/github">Login with Github</a></button>
      </body>
    </html>
  `);
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/login', successRedirect: '/resource'})
);

app.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) { console.error(err); }
    });
    res.redirect('/login');
});

app.get('/resource', (req, res) => {
    console.log(req.user);
    if (req.isAuthenticated()) {

       const {id, username, profileUrl} = req.user;

        res.send(`
      <html lang="en">
        <body>
          <h1>RESOURCE</h1>
          <p>id: ${id}</p>
          <p>login: ${username}</p>
          <p>url: ${profileUrl}</p>
        </body>  
      </html>
    `);
    }
    else {
        res.redirect('/login');
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
