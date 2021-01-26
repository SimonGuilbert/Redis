//Access the router on Express 
const router = require('express').Router();

//Access the controllers
const controller = require('../controllers/user.js');

router.post("/connexion", (req, res) => {

    controller.connexion(req, res);

});

module.exports = router;