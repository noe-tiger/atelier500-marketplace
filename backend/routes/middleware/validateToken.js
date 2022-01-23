const jwt = require('jsonwebtoken');

function validateToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader.split(' ')[1];

    if (token == null) {
        res.sendStatus(400).send("No token provided");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.sendStatus(403).send("Invalid token");
        } else {
            req.user = user;
            next();
        }
    });
}

exports.validateToken = validateToken;