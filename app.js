/* imports */
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

//Config JSON response
app.use(express.json())

//Models
const User = require('./models/User')

//Open Route - Public Route
app.get('/', (req, res) => {
    res.status(200).json({ msg: "Bem vindo a nossa API!" })
})

//Private Route
app.get("/user/:id", checkToken, async (req, res) => {
    const id = req.params.id

    const user = await User.findById(id, '-password')

    if(!user) {
        return res.status(404).json({msg: 'Usuário não encontrado!'})
    }

    try {
        const secret = process.env.JWT_SECRET

        jwt.verify(token, secret)
        next()
        
    } catch (error) {
        res.status(400).json({msg: "Token inválido!"})
    }

    res.status(200).json({ user })
})

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(!token) {
        res.status(401).json({msg: 'Acesso negado!'})
    }
}

//Register User
app.post('/auth/register', async (req, res) => {

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

    // create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // create User
    const user = new User({ name, email, password: passwordHash, })
    console.log(user)
    console.log(name)
    console.log(email)
    console.log(password)

    try {
        await user.save();
        console.log('Dps de salvar o user: ', user)
        res.status(201).json({ msg: 'Usuário criado com sucesso!' })
    } catch (error) {
        console.log(500)
        res.status(500).json({ msg: 'Aconteceu um erro no servidor. Tente novamente mais tarde.' })
    }
})

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        return res.status(422).json({ msg: "O email é obrigatório!" })
    }

    if (!password) {
        return res.status(422).json({ msg: "A password é obrigatório!" })
    }

    const user = await User.findOne({ email: email })

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" })
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.status(422).json({ msg: "Senha inválida!" })
    }

    try {
        const secret = process.env.JWT_SECRET

        const token = jwt.sign({
            id: user._id,
        },
            secret,
        )
        res.status(200).json({ msg: 'Autenticação realizada com sucesso!', token })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            msg: 'Aconteceu um erro no servidor. Tente novamente mais tarde!'
        })
    }

})

//Credentials
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.didtcdo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log('Conectou ao banco!')
        app.listen(3000)
    }).catch((err) => console.log(err))