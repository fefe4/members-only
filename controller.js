const User = require("./models/users");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const Message = require("./models/messages");


require("dotenv").config();

exports.sign_up_get = function (req, res) {
  res.render("sign-up", { title: "sign up" });
};

exports.sign_up_post = [
  //validate-sanitize form
  //first name
  body("firstname", "first name, can not be empty")
    .trim()
    .isLength({ min: 3 })
    .withMessage("must be at least 3 characters long")
    .escape(),

  //last name
  body("lastname", "last name, can not be empty")
    .trim()
    .isLength({ min: 3 })
    .withMessage("must be at least 3 characters long")
    .escape(),

  //username
  body("username", "username, can not be empty ")
    .trim()
    .isLength({ min: 3 })
    .withMessage("must be at least 3 characters long")
    .escape(),

  //password
  body("password", "password can not be empty")
    .trim()
    .isLength({ min: 3 })
    .withMessage("must be at least 3 characters long")
    .matches(/[0-9]/)
    .withMessage("must contain a number")
    .matches(/[A-Z]/)
    .withMessage("must contain a capital letter")
    .escape(),

  body(
    "confirmPassword",
    "confirmPassword field must have the same value as the password field"
  )
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .escape(),

  function (req, res, next) {
    const errors = validationResult(req);
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      const user = new User({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        userName: req.body.username,
        password: hashedPassword,
        membership: "no",
      });
      if (!errors.isEmpty()) {
        res.render("sign-up");
      } else {
        user.save(function (err) {
          if (err) {
            return next(err);
          }
          //successful - redirect to membership authentication.
          res.redirect(`/club${user.url}`);
        });
      } // otherwise, store hashedPassword in DB
    });
  },
];

exports.club_get = function (req, res) {
  res.render("club");
};

exports.club_post = [
  body("code").trim().equals(process.env.CODE).escape(),

  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect("/club/");
    } else {
      async.parallel(
        {
          user: function (callback) {
            User.findById(req.params.id).exec(callback);
          },
        },
        function (results, err) {
          if (err) {
            return next(err);
          }
          const user = new User({
            firstName: results.user.firstname,
            lastName: results.user.lastname,
            userName: results.user.username,
            password: results.user.password,

            membership: "member",
          });

          User.findByIdAndUpdate(
            req.params.id,
            user,
            {},
            function (err, theuser) {
              if (err) {
                return next(err);
              }
              // Successful - redirect to book detail page.
              res.redirect(`club/${theuser.url}`);
            }
          );
        }
      );
    }
  },
];

exports.login_get = function (req, res) {
  res.render("login-form");
};

exports.new_Message_get = function (req, res) {
  res.render("newmessage");
};


exports.new_Message_post =  [
  body("message", "message must not be empty").trim().escape(),
  body("user", "s").escape(),

  function (req, res, next) {
    User.findOne({ 'userName': req.body.user })
    .exec( function(err, found_userName){
      console.log(found_userName)
      if (err) {return next(err)}
      else {
        
        const errors = validationResult(req);
        const message = new Message({
          message: req.body.message,
          userName: found_userName._id,

        });
        if (!errors.isEmpty()) {}
        else {
          message.save(function (err) {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.send("pepe");
          });
        }
      }
    })
  
  }];

