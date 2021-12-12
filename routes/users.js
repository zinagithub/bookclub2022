const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const User = require('../models/user');
const { auth, requiresAuth } = require('express-openid-connect');
const router = express.Router();

//authentication
const config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    secret: process.env.SECRET
  };

  router.use(auth(config));
  connectDB();
  router.get('/', (req, res) => {
    let obj = req.oidc.user;
    
    if(req.oidc.isAuthenticated()){
        var member = new User({
            nickname: req.oidc.user.nickname,
            email : req.oidc.user.email,
            picture : req.oidc.user.picture,
            sub : req.oidc.user.sub
        });
        res.locals.user = member || null;
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
        
    }else {
        res.locals.user = null;
    }
    
    console.log(res.locals.user);
    res.render("index");
  });
  router.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });  

module.exports = router;