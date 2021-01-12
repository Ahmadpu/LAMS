// Required Dependencies

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const http = require('http');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const validator = require('express-validator');
require('dotenv').config();

// Container

const container = require('./container');

// Implementing Main App

container.resolve(function (_ , user, admin) {

  mongoose.Promise = global.Promise;
  mongoose.connect("mongodb://localhost:27017/fyp", {useNewUrlParser: true, useUnifiedTopology: true});

  var app = initializeApp();
  
  function initializeApp() {
    var app = express();
    var server = http.createServer();
    var port_number = server.listen(process.env.PORT || 3000);
    app.listen(port_number);

    configureApp(app);
  }

  function configureApp(app) {
    require('./passports/passport-facebook');
    require('./passports/passport-google');
    require('./passports/passport-local');
        
    app.use(express.static(path.join(__dirname, "/public")));
    app.use("*/assets", express.static(path.join(__dirname, "/public/assets")))
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
		
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser());
    app.use(cookieParser());

    app.use(validator());

    app.use(session({
      secret: 'addyourownsecret',
      saveUninitialized: true,
      resave: true,
      store: new MongoStore({ mongooseConnection: mongoose.connection })
    }));

    app.use(flash());
        
    app.use(passport.initialize());
    app.use(passport.session());

    // App Routing 
    var router = require('express-promise-router')();
    user.setRouting(router);
    admin.setRouting(router);
    //lawyer.setRouting(router);
    app.use(router);

    app.locals._ = _;
  }
});
