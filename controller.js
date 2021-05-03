const User = require ('./models/users')
const { body, validationResult } = require("express-validator");

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

  function (req, res, next) {
    const errors = validationResult(req);

    const user = new User({
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      userName: req.body.username,
      password: req.body.password,
      membership: "no"

    })

    if(!errors.isEmpty()){
      res.render('sign-up')
    }
    else {
      user.save(function (err) {
        if (err) { return next(err); }
           //successful - redirect to new book record.
           res.redirect('/');
        });
    }
  }
];
