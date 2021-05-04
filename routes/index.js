const express = require("express");
const router = express.Router();
const controller = require("../controller");


/* GET home page. */
router.get("/", function (req, res, next) {
  // Messages.find({}, 'title author')
  // .populate('userName')
  // .exec(function (err, results) {
  //   if (err) { return next(err); }
  //   //Successful, so render
    res.render("index", { title: "Express"} );
  // });
});

router.post("/new-message", controller.new_Message_post);
router.get("/new-message", controller.new_Message_get);
router.get("/sign-up", controller.sign_up_get);
router.post("/sign-up", controller.sign_up_post);
router.get("/log-in", controller.login_get);
router.get("/club/user/:id", controller.club_get);
router.post("/club/user/:id", controller.club_post);


module.exports = router;
