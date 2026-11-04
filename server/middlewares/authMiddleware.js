const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return res
        .status(401)
        .send({message: "Authorization header missing", success: false});
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if(err) {
            return res
            .status(401)
            .send({message: "Token is not valid", success:false});
        }

        req.userId = decoded.id;
        next();
    });
};