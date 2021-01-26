//Access the router on Express 
const router = require('express').Router();

//Access the controllers
const controller = require('../controllers/user.js');

//CREATE
router.post("/createUser", (req, res) => {

    controller.create(req, res);

});

//READ
router.get("/users", (req, res) => {
    
    controller.reads(req, res);

});

router.get("/user/:id", (req, res) => {
    
    controller.read(req, res);

});

//DELETE
router.delete("/user/:id", (req, res) => {
    
    controller.delete(req, res);

});

module.exports = router;