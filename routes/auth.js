const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




router.post('/register', async (req, res) => {

    //validate the user 

    const { error } = registerValidation(req.body);
    if (error) { return res.status(400).send(error.details[0].message) }
    else {
        const emailExist = await User.findOne({ email: req.body.email })
        if (emailExist) { return res.status(400).send('Email already exist'); }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password,salt);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        });
        try {
            const savedUser = await user.save();
            res.send({user: user._id});
        } catch (err) {
            res.status(400).send(err)
        }
    }
});

router.post('/login', async(req,res)=> {
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email});
    if(!user) return res.status(400).send('Email or Password wrong please check');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass)  {return res.status(400).send('Please check the password'); }
    else {
        const token = jwt.sign({ _id: user._id}, process.env.TOKEN_KEY);
        res.header('auth-token',token).send(token);
        res.send('logged in')

    }
    
})


module.exports = router;