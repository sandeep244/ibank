const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const accountRoutes = require('./routes/accounts');

const userRoutes = require('./routes/users');

const app = express();

const mongodb = 'mongodb+srv://' + process.env.MONGO_ATLAS_USER + ':' + process.env.MONGO_ATLAS_PW  + '@cluster0-0qxzu.mongodb.net/i-bank?retryWrites=true&w=majority';

mongoose.connect(mongodb)
.then(() => {
  console.log('Connected to Database!');
})
.catch(() => {
  console.log('Not connected to database');
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});

app.use("/api/accounts",accountRoutes);

app.use("/api/users",userRoutes);

module.exports = app;
