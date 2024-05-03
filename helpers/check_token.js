const jwt = require("jsonwebtoken");
require('dotenv').config()

// middleware to validate token
const checkToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) return res.status(401).json({ message: "Acesso negado!" });

    try {
        const secret = process.env.JWT_SECRET;
        const verified = jwt.verify(token, secret);
        req.user = verified;
        next(); 
    } catch (err) {
        res.status(400).json({ message: "O Token é inválido!" });
    }
};

module.exports = checkToken;