/* 
 * Package Imports
*/
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHUbStrategy = require('passport-github2').Strategy;

const path = require("path");
require("dotenv").config();
const partials = require('express-partials');


const app = express();


/*
 * Variable Declarations
*/

const PORT = 3000;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

/*
 * Passport Configurations
*/
passport.use(new GitHUbStrategy({
    clientID: '4f60a68b8dd18fac7aa3',
    clientSecret: '2b63ab8ebb34a062ab2b4d3505664c23f3449a02',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  }, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});


/*
 *  Express Project Setup
*/
app.use(
  session({
    secret: 'codeacademy',
    resave: false,
    saveUninitialized: false
  })
)

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());
app.use(passport.session());


/*
 * Routes
*/

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
})

app.get('/account', (req, res) => {
  res.render('account', { user: req.user });
});

app.get('/login', (req, res) => {
  res.render('login', { user: req.user });
})

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/auth/github', passport.authenticate('github', { scope: ['user']}));

app.get(
  '/auth/github/callback', 
  passport.authenticate(
    'github', 
    { failureRedirect: '/login',
      successRedirect: '/'
   }));


/*
 * Listener
*/

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

/*
 * ensureAuthenticated Callback Function
*/

