require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const createUserToken = require('../helpers/create_user_token');
const getToken = require('../helpers/get_token');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name) {
        return res.status(422).json({ msg: "O nome é obrigatório!" })
    }

    if (!email) {
        return res.status(422).json({ msg: "O email é obrigatório!" })
    }

    if (!password) {
        return res.status(422).json({ msg: "A password é obrigatório!" })
    }

    const userExist = await User.findOne({ email: email })

    if (userExist) {
        return res.status(422).json({ msg: "Endereço de email já cadastrado no sistema" })
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)


    const user = new User({ name, email, password: passwordHash, })

    try {
        const newUser = await user.save()

        await createUserToken(newUser, req, res)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    

    if (!email) {
        return res.status(422).json({ msg: "O email é obrigatório!" });
    }

    if (!password) {
        return res.status(422).json({ msg: "A password é obrigatório!" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return res.status(422).json({ msg: "Senha inválida!" });
    }

    await createUserToken(user, req, res);
}

const checkUser = async (req, res) => {
    let currentUser;

    console.log(req.headers.authorization);

    if (req.headers.authorization) {
        const secret = process.env.JWT_SECRET;
        const token = getToken(req);
        const decoded = jwt.verify(token, secret);
        console.log('jwt: ',decoded);
        currentUser = await User.findById(decoded.id);
        console.log('current user: ',currentUser)
        currentUser.password = undefined;
    } else {
        currentUser = null;
    }

    res.status(200).send(currentUser)
}

const getUserById = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }
    res.status(200).json({ user });
}

module.exports = { register, login, getUserById, checkUser }