const express = require('express');

const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { auth, requiresAuth } = require('express-openid-connect');

const User = require('./models/user');

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
  
//Logging
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//set the ejs engine
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

//Statis folder
app.use(express.static(path.join(__dirname, 'public')));

  // auth router attaches /login, /logout, and /callback routes to the baseURL
  app.use(auth(config));
  
  connectDB();

  // req.isAuthenticated is provided from the auth router
  app.get('/', (req, res) => {
    let obj = req.oidc.user;
    if(req.oidc.isAuthenticated()){
        var member = new User({
            nickname: req.oidc.user.nickname,
            email : req.oidc.user.email,
            picture : req.oidc.user.picture,
            sub : req.oidc.user.sub
        });
    
        User.findOne(
            {email: member.email},
            function(err, obj){
                if (obj===null){
                    member.save( err => {
                        if (!err){
                            console.log('User saved');
                        }
                        else {
                            console.log('User Not Saved')
                        }
                    })
                }else{
                    console.log("Member already exist");
                }
            }
        );
        
    }
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
    
  });
  

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// Routes
app.use('/',require('./routes/index'));
const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) );