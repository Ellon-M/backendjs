const fs = require('fs');
const path = require('path');
const User = require('mongoose').model('User');
const JwtStrategy = require('passport.jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;  //subclass on extracting the jwt from the http header



const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// options to implement the jwt strategy
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // pass in the public key generated
    // we pass in the public and not the private - since this is the verify piece of the JWT.  
    // identities are verified by the public key - passport is the verification step of this process
    secretOrKey: PUB_KEY,

    // an asymmetric algorithm that uses a public/private key pair as opposed to the HS256 that uses one secret key and a hashing function

    // This algorithm is used when you don't have control over the client, or you have no way of securing the secret key 
    algorithms: ['RS256']
};


//strategy


const strategy = new JwtStrategy(options, (payload, done) => {
   
       User.findOne({_id: payload.sub})  // sub - principal subject identifer of the JWT
       .then((user) => {
           if(user) {
               return done(null, user);
           } else {
               return done(null, false);
           }
       })
       .catch(err => done(err, null));
});
  
module.exports = (passport) => {
passport.use(strategy);
}