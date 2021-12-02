const express = require('express');

const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

//local config
dotenv.config({path:'./config/config.env'});

connectDB();

const app = express();

//Logging
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//set the ejs engine
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) );