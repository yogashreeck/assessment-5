const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const router = express.Router();

//util function to check if a string is a valid email address
const isEmail = (email) => {
  if (typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email);
};

router.post('/register', async (req, res) => {
  console.log("hello")
  try {
    console.log(req.body)
    const { firstname, lastname, email, password} = req.body;
     const params = {
      first:firstname,
      last:lastname,
      email:email,
      pass:password
      
    }
    if (!isEmail(email)) {
      throw new Error(' must be a valid email address.');
    }
    if (typeof password !== 'string') {
      throw new Error('Password must be a string.');
    }
    const user = new User(params);
    const persistedUser = await user.save();

    res.status(201).json({
      title: 'User Registration Successful',
      detail: 'Successfully registered new user',
    });
  } catch (err) {
    
    res.status(400).json({
      errors: [
        {
          title: 'Registration Error',
          detail: 'Something went wrong during registration process.',
          errorMessage: err.message,
        },
      ],
    });
  }
});

router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!isEmail(email)) {
        return res.status(400).json({
          errors: [
            {
              title: 'Bad Request',
              detail: 'Email must be a valid email address',
            },
          ],
        });
      }
      if (typeof password !== 'string') {
        return res.status(400).json({
          errors: [
            {
              title: 'Bad Request',
              detail: 'Password must be a string',
            },
          ],
        });
      }
      //queries database to find a user with the received email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error();
      }
  
      //using bcrypt to compare passwords
      const passwordValidated = await bcrypt.compare(password, user.password);
      if (!passwordValidated) {
        throw new Error();
      }
  
      res.json({
        title: 'Login Successful',
        detail: 'Successfully validated user credentials',
      });
    } catch (err) {
      res.status(401).json({
        errors: [
          {
            title: 'Invalid Credentials',
            detail: 'Check email and password combination',
            errorMessage: err.message,
          },
        ],
      });
    }
  });
  
  module.exports = router;