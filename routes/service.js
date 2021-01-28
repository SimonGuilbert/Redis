//Access the router on Express 
const router = require('express').Router();

//Access the controllers
const controller = require('../controllers/user.js');

router.post("/accessService", (req, res) => {

    controller.accessService(req, res);

});

module.exports = router;