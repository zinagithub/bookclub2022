const {TextDecoder, TextEncoder} = require("util");

const express = require('express');
//Logging
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

//local config
dotenv.config({path:'./config/config.env'});

connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) );