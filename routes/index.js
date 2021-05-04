const express = require("express");
const router = express.Router();
const controller = require("../controller");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/sign-up", controller.sign_up_get);
router.post("/sign-up", controller.sign_up_post);
router.get("/log-in", controller.login_get);
router.get("/club/user/:id", controller.club_get);
router.post("/club/user/:id", controller.club_post);

module.exports = router;
