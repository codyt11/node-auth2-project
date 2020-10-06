module.exports = function (role) {
    return function (req, res, next) {
        if (
            req.decodedToken &&
            req.decodedToken.role &&
            req.decodedToken.role === role
        ) {
            next();
        } else {
            res.status(403).json({message: "not authorized access."})
        }
    };
};