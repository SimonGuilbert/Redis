function createUser(req, res) {
    let passwordString = req.body.password;
    let User = require('../models/user');
    let newUser = User ({
        name : req.body.name,
        firstname : req.body.firstname,
        email : req.body.email,
        password : req.body.password
    });
  
    newUser.save()
    .then((savedUser) => {
 
    // fetch user and test password verification
    User.findOne({ _id: savedUser.id }, function(err, user) {
        if (err) throw err;

        // test a matching password
        user.comparePassword(passwordString, function(err, isMatch) {
            if (err) throw err;
            console.log('Test match avec le bon mot de passe : ', isMatch);
        });

        // test a failing password
        user.comparePassword("n'importe quoi", function(err, isMatch) {
            if (err) throw err;
            console.log('Test match avec un mauvais mot de passe : ', isMatch);
        });
    });

        //send back the created User
        res.json(savedUser);
            
    }, (err) => {
        res.status(400).json(err)
    });
}

function readUsers(req, res) {

    let User = require("../models/user");

    User.find({})
    .then((users) => {
        res.status(200).json(users);
    }, (err) => {
        res.status(500).json(err);
    });
 }

function readUser(req, res) {

    let User = require("../models/user");

    User.find({_id : req.params.id})
    .then((user) => {
        res.status(200).json(user);
    }, (err) => {
        res.status(500).json(err);
    });
 }


function deleteUser(req, res) {

    let User = require("../models/user");

    User.findOneAndRemove({_id : req.params.id})
    .then((deletedUser) => {
        res.status(200).json(deletedUser);
    }, (err) => {
        res.status(500).json(err);
    });
 }

function connexionUser(req, res) {

let User = require("../models/user");

User.findOne({ email: req.body.email }, function(err, user) {
    if (err) throw err;

    // check of password
    user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) throw err;
        else if (isMatch) {
            console.log('Connexion OK');
            //send back the created User
            res.json("Connecté en tant que "+req.body.email);
        } else {
            console.log('Identifiants de connexion incorrects');
            //send back the created User
            res.json("Mot de passe incorrect. Veuillez réessayer");
        }
            
    });
});

}

module.exports.create = createUser;
module.exports.reads = readUsers;
module.exports.read = readUser;
module.exports.delete = deleteUser;
module.exports.connexion = connexionUser;