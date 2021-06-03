const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv/config');
const User = require('./model/user');
bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const JWT_SECRET = 'dfh2rceoui2@#&$)$efvcwefjvcev e fcejrvcerwjvncercerupceumiopokuokjnjhgth(#($)@';

mongoose.connect(process.env.DB_CONNECTION,{        
     useNewUrlParser: true,
 useUnifiedTopology: true,
   useCreateIndex: true},
    () => console.log("Connected to DB"));
    
const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.post('/api/register', async (req, res) => {
    const {username, password: plainTextPassword} = req.body;
    const re = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
    const rePass = /^(?=.*[a-z])/;
    if(!re.test(username) ) {
        return res.json({status: 'error', error: 'Invalid Username. Try Again '})
    }

    if(!rePass.test(plainTextPassword)) {
        return res.json({status: 'error', passError: 'Invalid password'})
    }

    if (plainTextPassword.length < 5) {
        return res.json({status: 'error', passError: 'Password too small. It should be at least 6 letters'})
    }

    const password = await bcrypt.hash(plainTextPassword, 10);
  

    try {
         const response = await User.create({
             username,
             password
         })
         console.log("User create successfully", response)
    } catch (error) {
        console.log(JSON.stringify(error));
        if (error.code === 11000) {
            return res.json({status: 'error', error: 'Username already exists'})
        }

        throw error;
    
    }
    res.json({status: 'ok', success: 'true'})
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({username}).lean();

  if(!user) {
      return res.json({status: 'error', error: 'Invalid username/password'});
  }
  if (await bcrypt.compare(password, user.password)) {

   const token = jwt.sign(
                   { id: user._id, 
                    username: user.username
                }, JWT_SECRET
                     )

    return  res.json({status: 'ok', data: token})
    
  }

  res.json({status: 'error', error: 'invalid username/password'});

})

app.post('/api/change-password', async (req, res) => {
    const { username ,token, newPassword: plainTextPassword, confirmPassword} = req.body;
    const rePass = /^(?=.*[a-z])/;
    const user = await User.findOne({username}).lean();

    if(!user) {
        return res.json({status: 'error', error: 'Invalid username'});
    }

    if(!rePass.test(plainTextPassword)) {
        return res.json({status: 'error', passError: 'Invalid password'})
    }

    if(plainTextPassword !== confirmPassword){
        return res.json({status: 'error', passError: 'Passwords do not match'})
    }


    if (plainTextPassword.length < 5) {
        return res.json({status: 'error', passError: 'Password too small. It should be at least 6 letters'})
    }

    try {
      const user = jwt.verify(token, JWT_SECRET);
      const _id = user.id;
      const password = await bcrypt.hash(plainTextPassword, 10);
 
   await User.updateOne(
       {_id},
    {
         $set: {password}
    }
    )
    } catch(error) {
        res.json({status: "error", error: "error setting password"})
    }

   res.json({status: 'ok', success: 'Password changed successfully', data: token});
})


app.listen(5000, () => {
    console.log('Server up at 5000');
})