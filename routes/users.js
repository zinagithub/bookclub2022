const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const User = require('../models/user');
const Book = require('../models/book');
const BookInstance = require('../models/bookinstance');
const Genre = require('../models/genre');
var async = require('async');
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
    
    async.parallel({
        genre: function(callback) {
            Genre.find({})
              .exec(callback);
        },

        books: function(callback) {
            Book.find({})
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('index', {genre: results.genre, books: results.books});
    });

  });

  router.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });  

module.exports = router;