const { validationResult } = require('express-validator/check');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/singupModel');

exports.singup = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    bcrypt.hash(password, 12)
        .then(hashPassword => {
            const user = new User({
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: hashPassword
            })
            return user.save()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        message: 'user created',
                        userId: result._id
                    })
                })
        });
}

exports.login = (req,res,next) =>{
    const mobileno = req.body.mobileno;
    const password = req.body.password;
    let loadedUser;
    User.findOne({mobileno: mobileno})
    .then(user =>{
        if(!user){
           const error = new Error('A user with this email could not be found.');
           error.statusCode = 401;
           throw error;
        }
        loadedUser = user;
       return bcrypt.compare(password,user.password);
    })
    .then(isEqual =>{
        if(!isEqual){
          const error = new Error('wrong password.');
          error.statusCode = 401;
          throw error;
        }
        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId:loadedUser._id.toString()
            },
            'secret',
            {expiresIn : '5h'}
        )
        res.status(200).json({token: token, userId: loadedUser._id.toString()})
    })
   
}