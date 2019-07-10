const express = require('express');

const router = express.Router();

const userController = require('../controllers/singupController');

const User = require('../models/singupModel');

const { body } = require('express-validator/check');


router.post('/signup',[
    body('firstname').trim().not().isEmpty(),
    body('lastname').trim().not().isEmpty(),
    body('email').isEmail().withMessage('please enter valid email')
    .custom((value,{ req })=>{
        return User.findOne({email:value})
        .then(userDoc =>{
            if(userDoc){
            return Promise.reject('email is already exist')
        }
    })
    }).normalizeEmail(),
    body('password').trim().isLength({min:5}),
    body('confirmPassword').trim().not().isEmpty(),
    
],userController.singup);

router.post('/login',userController.login);

module.exports = router;