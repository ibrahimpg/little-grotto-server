const express = require('express');

const app = express();

const cors = require('cors');

require('dotenv').config();

const { MongoClient } = require('mongodb');

let db;

MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((cluster) => { db = cluster.db("heroku_1gfx2145"); })
  .then(() => app.listen(process.env.PORT || 8888))
  .then(() => console.log("connected..."))
  .catch(err => console.log(err));

exports.db = () => db;

const viewCandles = require('./controllers/viewCandles');
const viewUnapproved = require('./controllers/viewUnapproved');
const submitCandle = require('./controllers/submitCandle');
const approveCandle = require('./controllers/approveCandle');
const deleteCandle = require('./controllers/deleteCandle');

app.use(express.urlencoded({ extended: true })); 
// app.use(express.json());
/*
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});
*/

app.use(cors())

app.get('/view', viewCandles);
app.get('/viewunapproved', viewUnapproved);
app.post('/submit', submitCandle);
app.get('/approve/:identifier', approveCandle);
app.get('/delete/:identifier', deleteCandle);

app.use((req, res, next) => {
  const error = new Error('Route not available.');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({ error: { message: error.message } });
});
