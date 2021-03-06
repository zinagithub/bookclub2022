const express = require('express');
const bodyParser=require("body-parser");
const session = require('express-session');
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


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Statis folder
app.use(express.static(path.join(__dirname, 'public')));


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site
/*const usersRoutes = require('./routes/users');*/

app.use(session({
    secret: 'lorem ipsum',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000 * 15}
}))

app.use('/',usersRouter);
app.use('/catalog',catalogRouter);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) );