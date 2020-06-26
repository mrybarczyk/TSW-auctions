const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../../models/User');

/**
 * @route POST api/users/register
 * @desc Register the user
 * @access Public
 */
router.post('/register', (req, res) => {
    let { name, username, email, password, confirmpassword } = req.body;
    if (password !== confirmpassword){
        return res.status(400).json({
            msg: "Passwords do not match"
        });
    } 
    User.findOne({username: username}).then(user => {
        if (user){
            return res.status(400).json({
                msg: "Username already exists"
            });
        }
    })
    User.findOne({email: email}).then(user => {
        if (user){
            return res.status(400).json({ 
                msg: "E-mail already registered"
            });
        }
    });
    // If the data is valid
    let newUser = new User({
        name,
        username,
        password,
        email
    });
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                console.log(user);
                return res.status(201).json({
                    success: true,
                    msg: "User registered"
                });
            });
        });
    });
});

/**
 * @route POST api/users/login
 * @desc Login the user
 * @access Public
 */
router.post('/login', passport.authenticate('local'), (req, res) => {
    return res.json(req.user);
});

/**
 * @route GET api/users/profile
 * @desc User's profile
 * @access Private
 */
router.get('/profile', function (req, res) {
    if (req.session.passport === undefined) res.status(401).json({msg: "Unauthorized"});
    else return res.json(req.session.passport.user);
});


/**
 * @route GET api/users/logout
 * @desc Logging out including removing the cookie
 * @access Private
 */
router.get('/logout', function (req, res) {
    if (req.session.passport === undefined) res.status(401).json({msg: "Unauthorized"});
    else {
    req.logOut();
    req.session.destroy(function (err) {
        if (err) return res.status(500);
        else res.json({msg: "Logged out!"});
    });
}
  });

/**
 * @route POST api/users/recipent
 * @desc Message-helper
 * @access Private
 */
router.post('/recipent', function(req, res){
    try {
        let { username } = req.body;
        User.findOne({username: username}).then(user => {
            if (user){
                return res.json(user);
            }
            else return res.json({}); 
        });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;