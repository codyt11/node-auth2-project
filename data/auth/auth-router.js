const router = require('express').Router();
const jwt = require('jsonwebtoken');

const users = require("../../users/users-module");
const { isValid } = require('./user-service');
const bcrypt = require("bcryptjs");

router.post('/register', async (req, res) => {
    let user = req.body;
    

    if(isValid(user)) {
        const rounds = process.env.BCRYPT_ROUNDS || 8;
        const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

        const saved = await users.add(user)
        .then(user => {
            res.status(201).json({data: user});
        })
        .catch(error => {
            res.status(500).json({message: error.message});
        })
        
    } else  {
        res.status(400).json({message: "please provide username and password and the the password should be alphanumeric"})
    }
});

router.post("/login", async( req, res) => {
    let { username, password } = req.body;


    try{
        const [user] = await users.findBy({username});

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user);

            req.session.user = user;
            res.status(200).json({message: `welcome ${user.username}!, have a token...`, token });
        } else {
            res.status(401).json({message: 'invalid credentials'});
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    };
});

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        role: user.role
    };
    const secrets = process.env.SECRET || "another secret here";

    const options = {
        expiresIn: '1d'
    }

    return jwt.sign(payload, secrets, options)
}

router.delete('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).json({ message: 'error logging out:', error: err });
            } else {
                res.json({ message: 'logged out' });
            }
        });
    } else {
        res.end();
    }
});
module.exports = router;