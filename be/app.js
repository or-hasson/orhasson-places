const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
require('dotenv').config({path: __dirname + '/.env'});
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use(express.static(path.join('public')));


app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);
app.use(morgan('dev'));


app.use((req, res, next) =>{
  res.sendFile(path.resolve(__dirname,'public','index.html'));
});


app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect(
      `mongodb+srv://${process.env['DB_MONGO_USER']}:${process.env['DB_MONGO_PASSWORD']}@orhasson-z3mq0.mongodb.net/${process.env['DB_MONGO_DATABASE']}?retryWrites=true&w=majority`,{ useNewUrlParser: true ,useCreateIndex: true,useUnifiedTopology:true })
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch(err => {
    console.log(err);
  });
