const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
var compression = require('compression');
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

require("dotenv").config();
//Set up default mongoose connection
const mongoose = require("mongoose");
const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.abzzp.mongodb.net/Members-only?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
const User = require("./models/users");


const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(compression())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ userName: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user);
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }
      });
      return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })
);

app.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
