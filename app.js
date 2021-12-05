const express = require('express');

const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { auth, requiresAuth } = require('express-openid-connect');

//local config
dotenv.config({path:'./config/config.env'});

const app = express();

//authentication
const config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    secret: process.env.SECRET
  };
  
  // auth router attaches /login, /logout, and /callback routes to the baseURL
  app.use(auth(config));
  
  // req.isAuthenticated is provided from the auth router
  app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
  });

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

connectDB();



//Logging
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//set the ejs engine
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

//Statis folder
app.use(express.static(path.join(__dirname, 'public')));
// Routes
app.use('/',require('./routes/index'));
const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) );