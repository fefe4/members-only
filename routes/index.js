const express = require('express');
const router = express.Router();
const controller =  require('../controller')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sign-up', controller.sign_up_get)
router.post('/sign-up', controller.sign_up_post)
router.get ('/club', controller.club_get)

module.exports = router;
