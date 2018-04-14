const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const users = require('./api/routes/user/users');
const admin = require('./api/routes/admin/admin');
const question = require('./api/routes/questions/question');
const exam = require('./api/routes/exams/exams');
const answers = require('./api/routes/answers/answers');
const category = require('./api/routes/categories/categories');
const result = require('./api/routes/result/result');
const config = require('./config/database');
// Connect To Database
mongoose.connect(config.database);
// On Connection
mongoose.connection.on('connected', (data) => {
  console.log('Connected to database '+config.database);
});
// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

const bodyparser = require('body-parser');
const app = express();
port = process.env.PORT || 3000;

// CORS Middleware
app.use(cors());

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport').user(passport);
require('./config/passport').admin(passport);

app.use('/users', users);
app.use('/admin', admin);
app.use('/question',question);
app.use('/category',category);
app.use('/exams',exam);
app.use('/answers',answers);
app.use('/result',result);
// Set Static Folder
app.use(express.static(path.join(__dirname, './public')));

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

let listener = app.listen(port,function(){
  console.log('server running on port '+port);
});
//console.log(""+listener.address().address);