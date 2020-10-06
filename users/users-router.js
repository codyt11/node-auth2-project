  
const router = require("express").Router();

const Users = require("./users-module");
const restricted = require("../data/auth/restricted-middleware");
const checkRole = require("../data/auth/check-role");

router.get("/", restricted, (req, res) => {
    Users.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => res.send(err));
});

router.post("/:id", restricted, checkRole(1), (req, res) => {
    res.status(501).json({message: "not implemented."});
});

router.put("/:id", restricted, checkRole(1), (req, res) => {
    res.status(501).json({message: "not implemented."});
});

router.delete("/:id", restricted, checkRole(1), (req, res) => {
    res.status(501).json({message: "not implemented."});
});

module.exports = router;