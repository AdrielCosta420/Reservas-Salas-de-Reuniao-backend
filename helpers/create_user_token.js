const jwt = require('jsonwebtoken')

const createUserToken = async (user, req, res) => {
    const secret = process.env.JWT_SECRET

    const token = jwt.sign({
        id: user._id,
    },
        secret,
    )
    res.status(200).json({ msg: 'Autenticação realizada com sucesso!', token })
}

module.exports = createUserToken