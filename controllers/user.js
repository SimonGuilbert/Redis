// -------------------------------------------------------------- //
// -------------------- FONCTIONS CRUD -------------------------- //
// -------------------------------------------------------------- //

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
        console.log("NOUVEL UTILISATEUR");
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

// -------------------------------------------------------------- //
// ------------------------- CONNEXION -------------------------- //
// -------------------------------------------------------------- //

function connexionUser(req, res) {

let User = require("../models/user");

const secret = "secret";

User.findOne({ email: req.body.email }, function(err, user) {
    if (err) throw err;

    // check of password
    user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) throw err;
        else if (isMatch) {
            console.log('Connexion OK');
            // token
            const jwt = require('jsonwebtoken')
            const token = jwt.sign({ _id: user._id, admin: true }, secret, { expiresIn: '1 week' })
            //send back the created User
            res.json("Connecté en tant que "+req.body.email+". Token de connexion pour accéder au service : "+token);
        } else {
            console.log('Identifiants de connexion incorrects');
            //send back the created User
            res.json("Mot de passe incorrect. Veuillez réessayer");
        }
            
    });
});
}

// -------------------------------------------------------------- //
// -------------------- ACCES AU SERVICE ------------------------ //
// -------------------------------------------------------------- //

function accessService(req, res) {
    
    const jwt = require('jsonwebtoken')
    const secret = "secret";
    const token = req.header('Authorization').replace('Bearer ', '')

    try{
        const payload = jwt.verify(token, secret) 
        
        // Redis
        const redis = require("redis");
        const client = redis.createClient();

        client.on("error", function(error) {
        console.error(error);
        });

        client.get('nb_connexions', function(err, reply) {
            if (reply == null){
                client.set('nb_connexions', 1);
                client.expire('nb_connexions', 10);
                res.json("Bienvenue ! Vous pouvez maintenant accéder à la ressource 'numéro de téléphone de Emmanuel Macron' : 0635274865. Nombre de personnes connectées : 1");
            } else if (parseInt(reply) < 10) {
                client.incr('nb_connexions')
                const newNB = parseInt(reply)+1;
                res.json("Bienvenue ! Vous pouvez maintenant accéder à la ressource 'numéro de téléphone de Emmanuel Macron' : 0635274865. Nombre de personnes connectées : "+newNB);
            } else {
                res.json("Désolé, notre serveur est surchargé. Réessayez dans quelques secondes")
            }
        });

    } catch(error) {
        console.error(error.message)
        res.json("Votre token n'a pas été reconnu : il a peut-être expiré. Veuillez réessayer en vous connectant http://localhost:3000/api/v1/connexion");
    }
}

module.exports.create = createUser;
module.exports.reads = readUsers;
module.exports.read = readUser;
module.exports.delete = deleteUser;
module.exports.connexion = connexionUser;
module.exports.accessService = accessService;