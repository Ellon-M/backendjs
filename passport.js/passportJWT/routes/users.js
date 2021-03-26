const mongoose = require('mongoose');
const { authenticate } = require('passport');
const router = require('express').Router();   
const User = mongoose.model('User');
const passport = require('passport');
const utils = require('../lib/utils');

// Register route
router.post('/register', function(req, res, next){
  const saltHash = utils.genPassword(req.body.password);

  const salt = salthash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
      username: req.body.username,
      hash: hash,
      salt: salt

  });

  newUser.save()  
        .then((user) => {
          
            const jwt = utils.issueJWT(user);

            // use postman to see the json response for this route
            res.json({success: true, user: user, token: jwt.token , expiresIn: jwt.expires });
        })
        .catch(err => next(err));

  });

// Login Route
router.post('/login', function(req, res, next){

    // check if the user given in the login form is in the database 

      User.findOne({username: req.body.username})
      .then((user) => {

        // if user does not exist
        // return a message to say that the user does not exist
          if(!user) {
              res.status(401).json({success: false, msg: "Could not find user"});
          }
        // if the user inputs a password

        // takes in the plain text password that the user gave in the login form the validates it, with the function below
        // check if true or false


          const isValid = utils.validPassword(req.body.password, user.hash, user.salt)

          if (isValid) {
              
            // just like in register
              const tokenObject = utils.issueJWT(user);

              res.status(401).json({success: true, user: user, token: tokenObject.token, expiresIn: tokenObject.expires});

          }
          else {
            // if the password is invalid
            res.status(401).json({success: false, msg: "You entered the wrong username/password"});

          }
      })
      .catch((err) => {
          next(err);
      })    
});


// passport middleware testing

// you can input a success response and use postman to confirm
// this will act as a login route, so first a token has to be generated after login
// use postman on the login route to get the token first, then
// paste the token on the authorization header exactly as it is - into the value
// The passport jwt middleware expects the token, and will take its value, run it through the verification, using the JWT library and authenticate correctly.

// Also the jwt has to be stored in localstorage, after issuing.... 

// this is just testing, since there is no frontend UI to use

// every route (such as login) that you want to protect, you must pass the passport.authenticate syntax as below

// This is different from the local strategy for passport, where the syntax is only called once, on the login route, and funtions such as (isLoggedIn, or isAuthenicated) are used. Here, sessions were used as another way of storing login info

// However, In this strategy, this syntax HAS to be called everytime, since JWTs are by default stateless.. 

// Stateful vs Stateless Authentication

// In stateful auth, tokens are issued and stored in a single service for future checking and revocation. Clients aand resource servers know a single point of truth for token verification and information gathering.

// Its drawbacks are: 
//    Basically no service can operate without having a    synchronous dependency towards the central token store,

//    The token overlord becomes an infrastructural bottleneck and single point of failure.

// Stateful authentication introduces not just another dependency for all your single-purpose services (network latency!) but also makes them heavily rely on it.   


// In stateless auth, components of a system are allowed to decentrally verify and inspect tokens. An ability to delegate token verification. This partially gets rid of the direct coupling to a central token.  

// It brings:
//     Less latency through local, decentralized token     verification

// Also, stateless authentication is able to absolve from the need to keep track of issued tokens and for that reason removes state (and hence reduces storage) dependencies from your system.  

// For JWTs, 
// you can statelessly verify if the user is authenticated by simply checking if the expiration in the payload hasn’t expired and if the signature is valid

// Instead of storing the token-to-principal relationship in a stateful manner, signed JWTs allow decentralized clients to securely store and validate access tokens without calling a central system for every request

// With tokens not being opaque but locally introspectable, clients could also retrieve addition information (if present) about the corresponding identity directly from the token without the need of calling another remote API.

// So, The purpose of JWT is to obviate the need for a centralistic approach - which can be described as an additional burden

router.get('/protected', passport.authenticate('jwt', {session: false}), (req, res, next) => {
});

module.exports = router;