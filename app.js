const express = require('express');

const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
/*const connectDB = require('./config/db');
const { auth, requiresAuth } = require('express-openid-connect');*/

const User = require('./models/user');

// local config
dotenv.config({path:'./config/config.env'});

const app = express(); 
//Logging
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//set the ejs engine
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

//Statis folder
app.use(express.static(path.join(__dirname, 'public')));

const usersRoutes = require('./routes/users');
app.use('/',usersRoutes);
const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) );