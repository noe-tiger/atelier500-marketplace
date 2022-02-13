const jwt = require('jsonwebtoken');

function validateToken(req, res, next) {
    try {
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
    catch (err) {
        res.sendStatus(403).send(err);
    }
}

async function isAuth(req) {
    try {
        const bearerHeader = req.headers["authorization"];

        const token = bearerHeader.split(' ')[1];

        if (token == null) {
            return false;
        }

        const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        return user != null;
    }
    catch (err) {
        return false;
    }
}

exports.validateToken = validateToken;
exports.isAuth = isAuth;