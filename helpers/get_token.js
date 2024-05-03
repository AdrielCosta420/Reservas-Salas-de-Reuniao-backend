// get token from headers
const getToken = (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) {
        res.status(401).json({msg: 'Acesso negado!'});
    }
    return token;
}

module.exports = getToken;