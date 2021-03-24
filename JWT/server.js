const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv/config');
const User = require('./model/user');
bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'dfh2rceoui2@#&$)$efvcwefjvcev e fcejrvcerwjvncercerupceumiopokuokjnjhgth(#($)@';

// DB Connection
mongoose.connect(process.env.DB_CONNECTION,{        
     useNewUrlParser: true,
 useUnifiedTopology: true,
   useCreateIndex: true},
    () => console.log("Connected to DB"));
    
const app = express();
app.use('/', express.static(path.join(__dirname, 'static')));

//express middleware to decode the body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/api/register', async (req, res) => {
    console.log(req.body)
    const {username, password: plainTextPassword} = req.body;
    if(!username || typeof username !== 'string' ) {
        return res.json({status: 'error', error: 'Invalid Username'})
    }

    if(!plainTextPassword || typeof plainTextPassword !== 'string' ) {
        return res.json({status: 'error', error: 'Invalid Password'})
    }

    if (plainTextPassword.length < 5) {
        return res.json({status: 'error', error: 'Password too small. It should be at least 6 letters'})
    }

    const password = await bcrypt.hash(plainTextPassword, 10);
  

    try {
         const response = await User.create({
             username,
             password
         })
           // returns the mongoDB id, the username and the iat- which is the time when the token was created
         console.log("User create successfully", response)
    } catch (error) {
        console.log(JSON.stringify(error));
        if (error.code === 11000) {
            //duplicate keys
            return res.json({status: 'error', error: 'Username already exists'})
        }

        throw error;
    
    }
    res.json({status: 'ok'})
})

//login page
app.post('/api/login', async (req, res) => {
  const {username, password } = req.body;
  const user = await User.findOne({username}).lean();

  if(!user) {
      return res.json({status: 'error', error: 'invalid username/password'});
  }
  
  // if the combination is correct
  if (await bcrypt.compare(password, user.password)) {


//JWT

  //JSON Web Token is a standard used to create access tokens for an application.

  // defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.(cryptographically)
  
  // Default signing algorithm - HS256
  // For Authorization - Once the user is logged in, each subsequent request will include the JWT, allowing the user to access routes, services, and resources that are permitted with that token.

//Structure

  // Header - type of token and algorithm
  // Payload - contains the claims. the user + any additional data, like issuer(iss) and expiration time(exp)
  // Signature
  // format

    //   HMACSHA256(
    //     base64UrlEncode(header) + "." +
    //     base64UrlEncode(payload),
    //     secret)
    
  // Separated by dots

      // synchronous
      // takes in a payload- could be an object literal, buffer or string representing valid JSON.
   const token = jwt.sign(
                   { id: user._id, 
                    username: user.username
                }, JWT_SECRET
                     )
                     // the sign fn can also take in an exp time - part of the payload
                     //jwt.sign by default adds a iat (issued at claim), that has the same effect as the exp (in regards to changing the payload everytime when you generate a token)
    return  res.json({status: 'ok', data: token})
    
  }

  res.json({status: 'error', error: 'invalid username/password'});

})


// change password page
app.post('/api/change-password', async (req, res) => {
    const { token, newPassword: plainTextPassword} = req.body;


    if(!plainTextPassword || typeof plainTextPassword !== 'string' ) {
        return res.json({status: 'error', error: 'Invalid Password'})
    }

    if (plainTextPassword.length < 5) {
        return res.json({status: 'error', error: 'Password too small. It should be at least 6 letters'})
    }

    try {
        //Synchronous
        // confirms if the payload is valid
      const user = jwt.verify(token, JWT_SECRET);
      const _id = user.id;
      const password = await bcrypt.hash(plainTextPassword, 10);
      
      // allows you to update a single document that satisfies a condition
      // specifies the change to apply.
      //The $set operator allows you to replace the value of a field with a specified value
   await User.updateOne(
       {_id},
    {
         $set: {password}
    }
    )
    } catch(error) {
        res.json({status: "error", error: ";}"})
    }

   res.json({status: 'ok'});
})


app.listen(5500, () => {
    console.log('Server up at 5500');
})